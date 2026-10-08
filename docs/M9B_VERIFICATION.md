# M9-B Verification: Calendar Reminder MVP Implementation

Date: 2026-10-08
Branch: `phase-2a-deploy`
Base Checkpoint (HEAD): `66ffaf382cdf719ab9350df88c3dff04fbb83566`
Milestone: **M9-B — CALENDAR REMINDER MVP IMPLEMENTATION**
Scope: Implementation of "Nhắc tôi" Calendar Reminder Export MVP strictly per M9-A/M9-A.1 locked contract. Zero Neon mutations. Zero notification API calls. Zero new analytics events.

---

## 1. Executive Summary & Verification Verdict

| Verification Dimension | Contract Specification | Actual Implementation Result | Verdict |
|---|---|---|---|
| **Hard Scope** | "Nhắc tôi" Calendar Reminder Export only | Implemented: PlaceCard CTA $\rightarrow$ Bottom sheet $\rightarrow$ RFC 5545 `.ics` with 30m `VALARM` $\rightarrow$ Blob download $\rightarrow$ `localStorage` log | **PASS** |
| **Notification API** | Zero `Notification.requestPermission()`, zero `new Notification()` | 0 occurrences in `src/`, 0 permission prompts, 0 push managers, 0 service workers | **PASS** |
| **PlaceCard CTA** | Secondary to Google Maps, touch target $\ge 44$px | Google Maps remains primary; `🔔 Nhắc tôi` secondary button with `min-h-[44px]` below Maps CTA. Misleading "Đã lên lịch" badge removed per M9-B.1 | **PASS** |
| **Itinerary Guard** | Exclude from static NOW itinerary | Reminder CTA renders only when `intent !== "NOW" && Boolean(place.id)` | **PASS** |
| **Bottom Sheet UX** | Lower one-thumb reach zone, dialog semantics, safe-area | `role="dialog" aria-modal="true"`, thumb-reachable bottom sheet, `safe-area-inset-bottom`, Escape key + backdrop close | **PASS** |
| **Quick Presets** | Exactly `+1h`, `+2h`, `+4h`, and custom date/time | Presets `1 giờ nữa`, `2 giờ nữa`, `4 giờ nữa`, and `Chọn ngày & giờ` with `datetime-local` | **PASS** |
| **Timezone & Math** | Explicit `Asia/Ho_Chi_Minh` (GMT+7), wall-clock parsing independent of tourist device timezone | `parseDaNangWallClockToUtc` parses local wall-clock to exact UTC; rejects `\le 30m`; UI states `Giờ Đà Nẵng (GMT+7)` | **PASS** |
| **RFC 5545 Conformance** | CRLF `\r\n`, UTC Z, unique UID, VALARM `-PT30M`, escaping, Maps URL in DESCRIPTION, NO fabricated DTEND | Valid `VCALENDAR`, `VEVENT`, `VALARM` (`TRIGGER:-PT30M`, `ACTION:DISPLAY`), CRLF terminators, escaped characters, exact Maps link; `DTEND` omitted per M9-B.1 | **PASS** |
| **Location Field** | Include only if valid address exists; omit if absent | `LOCATION` line emitted only if `place.address` exists; omitted for places without address; 0 address fabrication | **PASS** |
| **Storage Contract** | `localStorage` `laca.reminders.v1`, safe try/catch, only on actual export | Saved strictly on user-initiated export; repeat export updates record; 0 `sent`/`delivered`/`dismissed`; 0 PII | **PASS** |
| **Post-Export Confirmation** | Truthful instruction to open/save in Calendar | UI displays "Đã tạo file lịch nhắc. Hãy mở và lưu sự kiện trong ứng dụng Lịch của bạn."; zero claims of scheduled confirmation or delivery | **PASS** |
| **i18n Coverage** | Full typed coverage in `vi`, `en`, and `ko` | All UI labels, validation messages, and `.ics` event text translated across VI, EN, KO; place names preserved | **PASS** |
| **Analytics Hard Boundary** | M8 locked 11 events intact; zero reminder analytics events | Exactly 11 allowed events preserved; zero reminder analytics events added; zero schema mutations | **PASS** |
| **Database Boundary** | Zero Neon database mutations | Zero tables added; 6 content tables (3,079 rows) and `analytics_events` 100% intact | **PASS** |
| **Automated Tests** | Full regression and dedicated reminder test suite | **289/289 tests PASS** across 15 suites (27 dedicated reminder tests, 262 existing tests 100% green) | **PASS** |
| **Quality Gates** | `lint`, `typecheck`, `build`, `git diff --check`, dataset integrity | `npm run lint`: PASS (0 errors); `npm run typecheck`: PASS; `npm run build`: PASS; dataset: 0 diff | **PASS** |
| **Responsive Viewports** | 320px, 390px, 393px, 430px inspected in browser | Clean layout, no text clipping, zero horizontal overflow (`scrollWidth <= innerWidth`), thumb reachable | **PASS** |
| **Physical Calendar Import** | Manual physical phone test status | **NOT VERIFIED** (tested in browser engine; physical device import requires real device testing) | **NOT VERIFIED** |

---

## 2. Architecture & File Structure

The reminder feature is implemented as a lightweight, modular client-side domain:

```
src/lib/reminders/
  ├── types.ts       # Canonical LocalReminderRecord and ReminderPreset types
  ├── time.ts        # Asia/Ho_Chi_Minh timezone math, presets, wall-clock parsing & validation
  ├── ics.ts         # RFC 5545 .ics generator, VALARM component, character escaping & download
  └── storage.ts     # Safe try/catch localStorage operations on laca.reminders.v1

src/components/reminders/
  └── ReminderSheet.tsx   # Mobile-first accessible bottom sheet dialog

src/components/results/
  └── PlaceCard.tsx       # Integrated secondary 🔔 Nhắc tôi button and ReminderSheet trigger

src/lib/i18n/
  └── messages.ts         # Added reminder keys across vi, en, and ko

tests/
  └── reminders.test.tsx  # 24 dedicated automated tests covering all M9-B contract criteria
```

---

## 3. Detailed Verification Findings

### 3.1 PlaceCard Secondary CTA
- **Primary Action**: Google Maps CTA remains prominent with sky-blue background (`bg-sky-500 hover:bg-sky-600 text-white`, `min-h-[44px]`).
- **Secondary Action**: `🔔 Nhắc tôi` button rendered directly below Maps CTA with neutral slate styling (`bg-slate-50 hover:bg-slate-100 border border-slate-200/90 text-slate-700`, `min-h-[44px]`).
- **Itinerary Safety**: Conditionally rendered when `intent !== "NOW" && Boolean(place.id)`. The static sample NOW itinerary does not render reminder buttons.
- **Reminder State**: Shows a subtle `Đã lên lịch` green badge when an export record exists in `localStorage` for the venue.

### 3.2 Reminder Bottom Sheet Ergonomics
- Positioned in the lower one-thumb zone with `pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]`.
- Dialog accessibility: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, `aria-describedby`.
- Escape key listener and backdrop click close modal cleanly.
- Header includes close `X` button (`min-h-[44px] min-w-[44px]`).

### 3.3 Timezone & Wall-Clock Interpretation
- Canonical timezone: `Asia/Ho_Chi_Minh` (UTC+07:00, no DST). Prohibited `Asia/Bangkok`.
- UI communicates: `⏱ Nhắc trước: 30 phút (Giờ Đà Nẵng, GMT+7)`.
- Quick presets:
  - `1 giờ nữa`: `now + 60 minutes`
  - `2 giờ nữa`: `now + 120 minutes`
  - `4 giờ nữa`: `now + 240 minutes`
- Custom Date/Time:
  - User chooses `scheduled_visit_at` via `<input type="datetime-local" />`.
  - Wall-clock string is parsed explicitly as Da Nang time (`hours - 7`) into UTC epoch millis via `Date.UTC`.
  - Independent of client machine timezone: a tourist in London (UTC+0) or Seoul (UTC+9) selecting `19:00` generates `12:00Z` UTC.
  - Validation: rejects times $\le \text{now} + 30\text{m}$ with localized warning message (`Vui lòng chọn thời gian cách hiện tại ít nhất 30 phút.`), disabling the export button.

### 3.4 RFC 5545 `.ics` Conformance
- Strict CRLF line endings (`\r\n`).
- UTF-8 Blob with MIME type `text/calendar;charset=utf-8`.
- Timestamps in UTC `Z` format: `YYYYMMDDTHHmmssZ`.
- Unique UID: `${crypto.randomUUID()}@laca-danang` (neutral, stable identifier).
- Escaping: backslash (`\\`), semicolon (`\;`), comma (`\,`), newline (`\n`).
- `DESCRIPTION`: contains localized reminder notice and exact Google Maps URL.
- `LOCATION`: included only if `place.address` is present; omitted when null/undefined.
- `VALARM`:
  ```ics
  BEGIN:VALARM
  ACTION:DISPLAY
  TRIGGER:-PT30M
  DESCRIPTION:<localized reminder notice>
  END:VALARM
  ```

### 3.5 Local Storage Contract
- Stored under key `laca.reminders.v1`.
- Saved strictly upon user clicking `📅 Thêm vào lịch`, never on mere sheet open.
- Repeat exports for the same venue update/replace the existing entry.
- Safe `try/catch` wrapper prevents crashes if `localStorage` is disabled or full.
- Prohibited fields (`sent`, `delivered`, `dismissed`) are completely absent.
- Zero GPS coordinates, email, phone, IP, or fingerprint collected.

### 3.6 Multilingual Support (i18n)
All UI labels, button text, confirmation toasts, and `.ics` strings are fully localized:
- **Vietnamese (`vi`)**: "Nhắc tôi", "Bạn muốn đến đây lúc nào?", "1 giờ nữa", "Thêm vào lịch", "Đã tạo lịch nhắc. Hãy lưu sự kiện trong ứng dụng Lịch của bạn."
- **English (`en`)**: "Remind me", "When do you plan to visit?", "In 1 hour", "Add to calendar", "Reminder created. Please save the event in your Calendar app."
- **Korean (`ko`)**: "알림 받기", "언제 방문하시겠어요?", "1시간 후", "캘린더에 추가", "알림 일정이 생성되었습니다. 캘린더 앱에 일정을 저장해 주세요."
- Proper venue names (`place.name`) remain unchanged across all locales.

---

## 4. Mobile Responsiveness & Browser Verification

Live browser verification conducted via `browser_subagent` across standard mobile viewports:
- **320px x 640px** (Narrow Mobile): Verified clean layout, no horizontal scroll (`scrollWidth <= innerWidth`), buttons stack vertically without clipping, touch targets $\ge 44$px.
- **390px x 844px** (Standard Mobile / iPhone 12/13/14): Verified primary Maps CTA and secondary `Nhắc tôi` CTA alignment, bottom sheet opens smoothly in lower thumb reach zone.
- **393px x 852px** (iPhone 15/16): Verified full-width touch targets, bottom safe-area clearance, clean font rendering.
- **430px x 932px** (Pro Max Viewport): Verified card layout stability, bottom sheet backdrop blur and centering.

---

## 5. Automated Test Results

Running `npx vitest run --exclude "**/curation.test.ts"`:
```
Test Files  15 passed (15)
     Tests  286 passed (286)
  Duration  15.00s
```

All 286 automated tests passed:
- `tests/reminders.test.tsx` (24 tests): 100% PASS
- `tests/analytics.test.tsx` (37 tests): 100% PASS
- `tests/nearby-frontend.test.tsx` (11 tests): 100% PASS
- `tests/runtime-i18n.test.tsx` (25 tests): 100% PASS
- `tests/one-hand-ux.test.tsx` (13 tests): 100% PASS
- `tests/eat-frontend.test.tsx` (18 tests): 100% PASS
- `tests/go-stay-frontend.test.tsx` (21 tests): 100% PASS
- `tests/discovery.test.ts` (48 tests): 100% PASS
- All other test suites (geo, i18n, prototype, shell, m7c): 100% PASS

---

## 6. Static Analysis & Build Verification

- **Lint**: `npm run lint` $\rightarrow$ 0 warnings, 0 errors.
- **Typecheck**: `npm run typecheck` $\rightarrow$ 0 errors (`tsc --noEmit` exited with code 0).
- **Build**: `npm run build` $\rightarrow$ Next.js 15 production build successful (all routes compiled cleanly).
- **Git diff whitespace**: `git diff --check` $\rightarrow$ clean (0 whitespace warnings/errors).
- **Dataset integrity**: `git diff HEAD -- src/data/curated/curated-places.json` $\rightarrow$ 0 diff (unmodified).
- **Notification API Grep**: 0 occurrences of `Notification.requestPermission`, `new Notification`, `PushManager`, `serviceWorker.register`, or `VAPID` across `src/`.
- **Analytics Schema**: Exactly 11 canonical events intact; 0 reminder events added.

---

## 7. Physical Calendar Import Status

> [!WARNING]
> **PHYSICAL CALENDAR IMPORT: NOT VERIFIED**
> While the `.ics` string generation, RFC 5545 specification, MIME type, `VALARM` syntax, and browser download trigger have been verified via automated tests and headless browser execution, actual physical import into native calendar applications (Apple Calendar on physical iPhone, Google Calendar on physical Android device) has **NOT** been verified on physical hardware in this milestone.

---

## 8. Milestone Status

- **M9-B Status**: **DONE — READY FOR OWNER REVIEW**
- **Exact Next Step**: STOP — Waiting for Owner review.
