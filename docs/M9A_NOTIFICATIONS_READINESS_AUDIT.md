# M9-A / M9-A.1 Audit & Contract: Calendar Reminder MVP

Date: 2026-10-08
Branch: `phase-2a-deploy`
Base Checkpoint (HEAD): `d2180a75b60e6d1af43643d001698e04d3d31428`
Milestone: **M9-A.1 — REMINDER MVP CONTRACT LOCK**
Scope: Architecture & Contract Lock only. Zero modifications to `src/` or `tests/`. Zero database mutations or package installations.

---

## 1. Executive Summary & Canonical Feature Identity

Following the verification of **M8-B** and **M8-B.1** (First-Party Product Analytics on Neon PostgreSQL and Cloudflare Workers), this milestone locks the product, technical, and testing specifications for the reminder capability.

### 1.1 Canonical Feature Name & Philosophy
- **Feature Name**: **"Nhắc tôi" $\rightarrow$ Calendar Reminder Export** (Xuất lịch nhắc).
- **Not a Web Push Platform**: M9 MVP is **NOT** a Web Push notification system, **NOT** an in-browser notification service, and does **NOT** run background daemon schedulers.
- **Anti-Marketing Principle**: *La Cà Đà Nẵng* reminders are strictly utility-driven tools for user travel convenience. No promotional blasts, marketing messages, or unrequested alerts are permitted.
- **Strict Opt-In**: The feature triggers **only** upon explicit user request on a specific discovered place.
- **Zero Permission Prompts on Load**: The app never prompts for permissions or interrupts browsing on Home or during search.

### 1.2 Truthful Delivery Contract (No False Guarantees)
- **Canonical Delivery Statement**:
  > *"La Cà generates an RFC 5545-compatible calendar event containing a 30-minute VALARM. Alarm delivery is ultimately controlled by the user's calendar application and operating system."*
- The application **must never promise** "100% guaranteed delivery" or "system notification delivered" because once an event file (`.ics`) is handed off, local alarm triggering is governed entirely by the user's OS and calendar client (Apple Calendar, Google Calendar, Outlook, etc.).

---

## 2. Audit of Existing Repository Foundation

An exhaustive audit confirms that the codebase currently contains **zero notification, push, or PWA runtime code**:

| Dimension | Inspection Target | Audit Result | Evidence / Reality |
|---|---|---|---|
| **Notification API** | `src/` | **NOT IMPLEMENTED** | 0 calls to `Notification`, `Notification.requestPermission`, or `new Notification()`. |
| **Service Worker** | `src/`, `public/` | **NOT IMPLEMENTED** | No `sw.js` in `public/`, no registration in client. |
| **PWA Manifest** | `public/`, `src/app/` | **NOT IMPLEMENTED** | No `manifest.json` or `manifest.webmanifest`. `public/` contains only static images. |
| **Push API Code** | `src/` | **NOT IMPLEMENTED** | 0 references to `PushManager`, `PushSubscription`, or VAPID keys. |
| **Notification Packages** | `package.json` | **NOT IMPLEMENTED** | Dependencies are strictly: `@neondatabase/serverless`, `@opennextjs/cloudflare`, `lucide-react`, `next`, `react`, `react-dom`, `zod`. Zero notification libraries. |
| **Database Tables** | Neon PostgreSQL | **NOT IMPLEMENTED** | Exactly 7 tables exist: 6 content tables (`places`, `place_translations`, `place_tags`, `tags`, `tag_translations`, `administrative_units`) + `analytics_events`. Zero reminder or subscription tables. |
| **Cloudflare Crons** | `wrangler.jsonc` | **NOT IMPLEMENTED** | Configuration contains `vars` and `assets`, but 0 `triggers.crons`, 0 Queues, and 0 Durable Objects. |

---

## 3. Removal of Browser Notification Permission from M9-B

Because M9-B adopts the **RFC 5545 Calendar Reminder Export** architecture:
1. M9-B **does NOT invoke** `Notification.requestPermission()`.
2. M9-B **does NOT instantiate** `new Notification()`.
3. M9-B **does NOT register** a Service Worker or call `PushManager.subscribe()`.
4. Browser notification permission states (`granted`, `denied`, `default`) are **explicitly removed from M9-B acceptance criteria and test suites**. They are retained in documentation strictly as reference context for a potential future PWA phase.

---

## 4. Mobile Browser Constraints & Platform Realities

The decision to adopt Calendar Reminder Export is dictated by hard mobile web constraints:

```
Platform Reality for Background Web Reminders (Closed Tab):

[Android Chrome] ──► Requires Service Worker + Web Push Backend ────────► [High Overhead]
[iOS Safari Tab] ──► Window.Notification is UNDEFINED on mobile tabs ───► [PHYSICALLY BLOCKED]
[iOS PWA (Home)] ──► Web Push enabled ONLY if added to Home Screen ─────► [Requires PWA install]
[All Devices]    ──► RFC 5545 .ics Calendar Export with VALARM ─────────► [UNIVERSAL & WORKING]
```

### Detailed Platform Facts:
1. **iOS Safari on iPhone**:
   - Standard browser tabs on mobile Safari **do not support** the `Notification` constructor.
   - Apple enabled Web Push in iOS 16.4 **exclusively for web apps added to the Home Screen** (`display: standalone`). For regular website visitors, background web push is completely blocked by the operating system.
2. **Android Chrome**:
   - Client-side timers (`setTimeout`) die when the user switches apps or locks their phone because Android aggressively freezes inactive background tabs.
3. **The Calendar Solution**:
   - Standard RFC 5545 `.ics` files are universally supported across iOS (Apple Calendar), Android (Google Calendar / Samsung Calendar), and desktop operating systems.
   - Once added to the user's native calendar, alarms ring natively with lock-screen alerts, sound, and banner notifications according to user OS preferences, **even when the browser is closed or the device is offline**.

---

## 5. Core Delivery Format: RFC 5545 `.ics` Specification

M9-B standardizes on a **downloadable / openable `.ics` calendar file** (`text/calendar;charset=utf-8`).

### 5.1 Why Not Google Calendar URL as Primary?
- A direct Google Calendar web link (`https://calendar.google.com/calendar/render?...`) does not reliably enforce a 30-minute advance alert across native mobile calendar apps without user account friction.
- RFC 5545 `.ics` contains an explicit `VALARM` component that is honored by both Apple Calendar and Google Calendar.
- It requires no Google account, no third-party OAuth, and no internet access to import.

### 5.2 Canonical RFC 5545 Event Contract
```ics
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//La Ca Da Nang//Calendar Reminder v1.0//VI
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:{reminder_id}@lacadanang.com
DTSTAMP:{created_at_utc}
DTSTART:{scheduled_visit_at_utc}
DTEND:{scheduled_visit_end_utc}
SUMMARY:{localized_summary}
DESCRIPTION:{localized_description_with_maps_url}
LOCATION:{place_address}
BEGIN:VALARM
ACTION:DISPLAY
TRIGGER:-PT30M
DESCRIPTION:{localized_alarm_description}
END:VALARM
END:VEVENT
END:VCALENDAR
```

### 5.3 Formatting & Conformance Requirements
- **Line Endings**: Strict CRLF (`\r\n`).
- **Character Escaping**: Commas (`,`), semicolons (`;`), and backslashes (`\`) must be escaped with a backslash (`\,`, `\;`, `\\`). Newlines within fields must be encoded as `\n`.
- **Timestamps**: All calendar timestamps (`DTSTAMP`, `DTSTART`, `DTEND`) must be ISO UTC strings formatted as `YYYYMMDDTHHmmssZ`.
- **Duration**: `DTEND` defaults to 1 hour after `DTSTART` (`scheduled_visit_at + 1h`).
- **UID**: Must be a cryptographically random UUID v4 with domain suffix (e.g. `c1a2b3c4-d5e6-7890-abcd-ef1234567890@lacadanang.com`).
- **Location**: Use `place.address` if present; if empty/null, omit the `LOCATION` line. Never invent addresses.
- **MIME & Download**: Served/generated client-side via a UTF-8 `Blob` with MIME type `text/calendar;charset=utf-8`.

---

## 6. Exact Time Semantics & Quick Presets

### 6.1 Semantic Definition: `scheduled_visit_at`
- **Concept Name**: **`scheduled_visit_at`** (NOT `scheduled_departure_at`).
- **Rationale**: The application does not track user starting location, route duration, or transit mode, so it cannot calculate an actual departure time. Asking for visit time is truthful and unambiguous.
- **User-Facing Question**: **"Bạn muốn đến đây lúc nào?"** (*"When do you plan to visit?"*).
- **Alarm Rule**: Trigger alarm **30 minutes before `scheduled_visit_at`** (`TRIGGER:-PT30M`).

### 6.2 Quick Presets (Elimination of Ambiguity)
The invalid `+30m` preset is removed because an alarm set 30 minutes before an event 30 minutes away would trigger immediately.

Locked Presets:
1. **"1 giờ nữa" (+1h)**: `now + 60 minutes`. (Alarm fires in ~30 minutes).
2. **"2 giờ nữa" (+2h)**: `now + 120 minutes`. (Alarm fires in ~90 minutes).
3. **"4 giờ nữa" (+4h)**: `now + 240 minutes`. (Alarm fires in ~210 minutes).
4. **"Chọn ngày & giờ" (Custom date & time)**: Native `<input type="datetime-local">` or `<input type="time">`.

### 6.3 Validation Rules
- All presets and custom selections are computed using **`Asia/Ho_Chi_Minh`** wall time.
- Custom selections must satisfy: **`scheduled_visit_at > now + 30 minutes`**.
- If a user selects a time $\le 30$ minutes in the future (or in the past), the UI must display a clear validation message (*"Vui lòng chọn thời gian cách hiện tại ít nhất 30 phút để đặt lời nhắc"*), disabling export.

---

## 7. Timezone Contract

1. **Target Territory**: Da Nang, Vietnam.
2. **Canonical Timezone**: **`Asia/Ho_Chi_Minh`** (UTC+07:00, no Daylight Saving Time).
   - Strictly prohibit `Asia/Bangkok` across all user-facing copy and code.
3. **User Communication**: In the reminder bottom sheet, clearly state:
   > *"Giờ Đà Nẵng (GMT+7)"*
   This ensures foreign tourists whose device clock may be set to another timezone understand the exact local visit schedule.
4. **Storage & ICS Export**:
   - The selected local time is converted to an absolute UTC timestamp ending in `Z` (`YYYYMMDDTHHmmssZ`).
   - The event instant is unambiguous regardless of the user's home timezone.

---

## 8. Client-Side Storage & Cancellation Semantics

### 8.1 Consistent Storage Contract
- **Storage Mechanism**: **`localStorage`** (wrapped in safe `try/catch`).
- **Key**: **`laca.reminders.v1`**.
- **Semantics**: The local record represents strictly:
  > *"La Cà reminder configuration & export log"*
- It does **NOT** represent external calendar synchronization, active device alarm status, or notification delivery.

### 8.2 Local Record Schema
```typescript
export interface LocalReminderRecord {
  reminder_id: string; // UUID v4
  place_id: number;
  place_name: string;
  scheduled_visit_at_utc: string; // ISO 8601 UTC
  lead_time_minutes: 30; // locked to 30
  locale: "vi" | "en" | "ko";
  created_at_utc: string; // ISO 8601 UTC
  calendar_exported_at_utc: string; // ISO 8601 UTC
}
```
*Prohibited status fields*: Do **NOT** use `sent`, `delivered`, or `dismissed`.

### 8.3 Cancellation Policy
- **Platform Reality**: Web applications **cannot programmatically delete** an event from Apple Calendar or Google Calendar once imported by the user.
- **Prohibited UI**: Do **NOT** render a button labeled "Huỷ thông báo" (Cancel notification) that falsely implies the device calendar alarm is revoked.
- **MVP Simplification for M9-B**:
  - M9-B focuses strictly on **creation and export**.
  - No complex local reminder deletion or synchronization state machine.
  - If a user exports a reminder again for the same venue, the local record for that `place_id` is updated with the new timestamp.

---

## 9. Mobile One-Hand UX Integration (M6-B Compliance)

### 9.1 `PlaceCard` Action Row
- Google Maps CTA remains the primary action (`min-h-[44px]`).
- A secondary action button is added:
  - Label: **`🔔 Nhắc tôi`**
  - Minimum touch target: $\ge 44\text{px} \times 44\text{px}$.
  - Styling: Visually secondary to the prominent sky-blue Maps CTA (e.g., subtle outline / neutral slate style).
  - Clearance: Zero layout shift, no text clipping, zero horizontal overflow, and zero overlap with [`BottomActionBar.tsx`](file:///d:/D%E1%BB%B1%20%C3%A1n%20t%C3%ACm%20%C4%91%E1%BB%8Ba%20%C4%91i%E1%BB%83m%20%C4%83n%20ch%C6%A1i/LaCaDaNang/danang_revised_pack/src/components/results/BottomActionBar.tsx).

### 9.2 Reminder Bottom Sheet Flow
When the user taps `🔔 Nhắc tôi`, an accessible dialog opens in the lower one-thumb reach zone:
```
┌──────────────────────────────────────────────┐
│  🔔 Nhắc tôi ghé thăm                        │
│  Bánh mì Bà Lan                              │
│                                              │
│  Bạn muốn đến đây lúc nào?                   │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐  │
│  │ 1 giờ nữa │ │ 2 giờ nữa │ │ 4 giờ nữa │  │
│  └───────────┘ └───────────┘ └───────────┘  │
│  ┌────────────────────────────────────────┐  │
│  │  Chọn ngày & giờ                       │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  ⏱ Nhắc trước: 30 phút (Giờ Đà Nẵng, GMT+7)   │
│                                              │
│  [  📅 Thêm vào lịch  ]                      │
│  [        Đóng        ]                      │
└──────────────────────────────────────────────┘
```
- Tapping **`Thêm vào lịch`** triggers immediate `.ics` download / calendar intent, stores the export metadata in `localStorage`, and displays a brief confirmation feedback toast.
- Does **NOT** display browser notification permission popups.

---

## 10. Localization (i18n) Policy

All reminder UI strings and calendar descriptions must support **`vi`**, **`en`**, and **`ko`**:

### UI Dictionary Keys:
| Key | Vietnamese (`vi`) | English (`en`) | Korean (`ko`) |
|---|---|---|---|
| `action.remind` | Nhắc tôi | Remind me | 알림 받기 |
| `sheet.title` | Nhắc tôi ghé thăm | Remind my visit | 방문 알림 설정 |
| `sheet.prompt` | Bạn muốn đến đây lúc nào? | When do you plan to visit? | 언제 방문하시겠어요? |
| `sheet.preset1h` | 1 giờ nữa | In 1 hour | 1시간 후 |
| `sheet.preset2h` | 2 giờ nữa | In 2 hours | 2시간 후 |
| `sheet.preset4h` | 4 giờ nữa | In 4 hours | 4시간 후 |
| `sheet.customTime` | Chọn ngày & giờ | Choose date & time | 날짜 및 시간 선택 |
| `sheet.leadNotice` | Nhắc trước 30 phút (Giờ Đà Nẵng, GMT+7) | Remind 30m before (Da Nang time, GMT+7) | 30분 전 알림 (다낭 시간, GMT+7) |
| `sheet.addToCalendar` | Thêm vào lịch | Add to calendar | 캘린더에 추가 |
| `sheet.close` | Đóng | Close | 닫기 |
| `sheet.minTimeWarning` | Vui lòng chọn thời gian cách hiện tại ít nhất 30 phút | Please choose a time at least 30 minutes from now | 현재 시간보다 최소 30분 이후의 시간을 선택해주세요 |

### ICS Text Generation:
- **SUMMARY**:
  - `vi`: `Ghé thăm {placeName} (La Cà Đà Nẵng)`
  - `en`: `Visit {placeName} (La Ca Da Nang)`
  - `ko`: `{placeName} 방문 (라카 다낭)`
- **DESCRIPTION**: Includes the localized tip and verified Google Maps URL:
  - `vi`: `Nhắc nhở ghé thăm {placeName}.\nĐịa chỉ: {address}\nXem đường đi trên Google Maps: {mapsUrl}`
  - `en`: `Reminder to visit {placeName}.\nAddress: {address}\nOpen in Google Maps: {mapsUrl}`
  - `ko`: `{placeName} 방문 알림.\n주소: {address}\nGoogle Maps에서 길찾기: {mapsUrl}`
- **Venue Names**: Sourced strictly from existing verified database translations (`place.name`). Never invent or machine-translate proper names.

---

## 11. Architectural Boundaries

1. **Zero Database Mutations**:
   - Zero tables added to Neon PostgreSQL.
   - Zero migrations executed.
   - Existing 6 content tables (3,079 rows) and `analytics_events` remain 100% untouched.
2. **Zero Cloudflare Infrastructure**:
   - Zero cron triggers, Queues, or Durable Objects added to `wrangler.jsonc`.
3. **NOW Boundary Decoupling**:
   - "BÂY GIỜ LÀM GÌ?" (NOW) remains a static sample itinerary.
   - Reminders attach strictly to individual verified places from EAT, GO, and STAY.
4. **Analytics Safeguard**:
   - The verified 11-event M8 schema remains strictly locked. Zero new analytics events are added in M9-B.

---

## 12. Test Plan for M9-B Implementation

M9-B verification must satisfy:

1. **Zero Permission Invocations**:
   - Verifies `Notification.requestPermission` and `new Notification` are never called.
2. **UI & Ergonomics**:
   - `🔔 Nhắc tôi` button touch target is $\ge 44\text{px}$.
   - Bottom sheet renders with proper dialog semantics, safe-area clearance, and one-hand reachability.
3. **Time Calculations & Timezone**:
   - Presets `+1h`, `+2h`, `+4h` calculate accurate future timestamps based on `Asia/Ho_Chi_Minh`.
   - Custom selections $\le 30$ minutes in the future trigger validation warning and block export.
4. **RFC 5545 Conformance**:
   - Valid `BEGIN:VCALENDAR` and `BEGIN:VEVENT`.
   - Valid `BEGIN:VALARM` with `TRIGGER:-PT30M` and `ACTION:DISPLAY`.
   - CRLF (`\r\n`) line endings throughout.
   - Timestamps formatted as `YYYYMMDDTHHmmssZ`.
   - Escaping of commas, semicolons, and newlines.
   - Unique UID generation.
   - Google Maps URL present in `DESCRIPTION`.
5. **Storage Resilience**:
   - `localStorage` export log handled within safe `try/catch` (falls back gracefully if storage is disabled/quota full).
6. **Localization**:
   - All UI elements and exported `.ics` text render correctly in `vi`, `en`, and `ko`.
7. **Full Regressions**:
   - All 262 existing tests pass.
   - Lint, typecheck, and production build pass with 0 errors.

---

## 13. M9-B Readiness Verdict

- **M9-B Status**: **READY FOR IMPLEMENTATION**
- **Architecture Contradictions**: **RESOLVED** (Web Push / Browser Notification ambiguity eliminated in favor of deterministic RFC 5545 Calendar Reminder Export).
- **Exact Next Step**: STOP — Waiting for Owner review and authorization before M9-B implementation.
