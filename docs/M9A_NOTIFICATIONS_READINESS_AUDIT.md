# M9-A Audit Report: Notifications & Reminder Runtime Readiness

Date: 2026-10-08  
Branch: `phase-2a-deploy`  
Base Checkpoint (HEAD): `235944b9342f96e13150ccd020764632d817f32d`  
Milestone: **M9-A — NOTIFICATIONS READINESS AUDIT ONLY**  
Scope: Product & Technical Architecture Audit only. Zero modifications to `src/` or `tests/`. Zero database mutations or package installations.

---

## 1. Executive Summary & Audit Context

Following the verification of **M8-B** and **M8-B.1** (First-Party Product Analytics on Neon PostgreSQL and Cloudflare Workers), this milestone conducts the readiness audit for the **Notification & Reminder** capability.

The goal of notifications in *La Cà Đà Nẵng* is strictly **utility-driven user convenience**, specifically:
> **"Nhắc tôi trước khi đi" ("Remind me before departure/visit")**

This audit establishes:
1. The **current foundation** in the repository (confirming zero existing notification/PWA assets).
2. The fundamental differences and browser support realities between **In-App Notifications**, **Browser Local Notifications**, and **Web Push Notifications**.
3. The **critical product gap**: current discovery provides venues and Google Maps links, but possesses **no departure time or planned schedule**, making an explicit user time-selection step mandatory before any reminder can be scheduled.
4. Hard platform constraints on mobile, particularly **iOS Safari's prohibition of background web notifications** unless installed as a PWA.
5. Architectural evaluation across Cloudflare Workers, Neon PostgreSQL, and Service Workers, concluding with a concrete recommendation for **M9-B MVP Scope**.

---

## 2. Audit of Current Repository Foundation

An exhaustive audit of the codebase was conducted across configuration, source code, public assets, and database catalogs:

| Dimension | Inspection Target | Audit Result | Evidence / Notes |
|---|---|---|---|
| **Notification API** | `src/` | **NOT IMPLEMENTED** | 0 calls to `Notification`, `Notification.requestPermission`, or `new Notification()`. |
| **Service Worker** | `src/`, `public/` | **NOT IMPLEMENTED** | No `sw.js`, `service-worker.js`, or `navigator.serviceWorker.register` calls. |
| **PWA Manifest** | `public/`, `src/app/` | **NOT IMPLEMENTED** | No `manifest.json` or `manifest.webmanifest`. `public/` contains only `images/`. |
| **Push API Code** | `src/` | **NOT IMPLEMENTED** | 0 references to `PushManager`, `PushSubscription`, or VAPID keys. |
| **Notification Packages** | `package.json` | **NOT IMPLEMENTED** | Dependencies are strictly: `@neondatabase/serverless`, `@opennextjs/cloudflare`, `lucide-react`, `next`, `react`, `react-dom`, `zod`. Zero notification libraries installed. |
| **Database Tables** | Neon PostgreSQL | **NOT IMPLEMENTED** | Exactly 7 tables exist: 6 content tables (`places`, `place_translations`, `place_tags`, `tags`, `tag_translations`, `administrative_units`) + `analytics_events`. Zero reminder or subscription tables. |
| **Cloudflare Crons** | `wrangler.jsonc` | **NOT IMPLEMENTED** | Configuration contains `vars` and `assets`, but 0 `triggers.crons`, 0 Queues, and 0 Durable Objects. |

**Conclusion**: The repository currently has **zero notification runtime infrastructure**. Everything must be designed from a clean architectural baseline.

---

## 3. Product Purpose & The "Nhắc tôi trước khi đi" Use Case

### 3.1 Product Philosophy
- **Anti-Marketing Principle**: *La Cà Đà Nẵng* notifications are **never** used for unsolicited marketing, promotional blasts, or re-engagement spam.
- **Strict Opt-In**: Notifications are triggered **only** by an explicit, deliberate user request on a specific place or plan.
- **Zero Prompt on Initial Load**: The application must **never** request notification permission when the user first lands on Home or browses discovery.
- **Default Offset**: 30 minutes prior to intended departure/visit time.

### 3.2 The Critical Product Gap: Absence of Time Data
In the current application:
1. Venue discovery flows: `Intent (EAT / GO / STAY) -> Preference -> Results (0..3 PlaceCards) -> Maps Navigation`.
2. Places in Neon PostgreSQL store coordinates, localized names, addresses, ratings, and tag mappings, but **do not store operating hours, visit durations, or schedules**.
3. The "BÂY GIỜ LÀM GÌ?" (NOW) feature renders a sample timeline (`ItineraryTimeline.tsx`), but its timestamps (e.g., `"07:30 - 08:30"`) are static mockup strings and are not places from the database.

> [!IMPORTANT]
> **Key Finding**: The product currently has **no departure time or planned visit time**.
> To implement "Nhắc tôi trước khi đi", the application **cannot invent or infer a timestamp**. It must provide a lightweight UI allowing the user to select or confirm their intended time when tapping "Nhắc tôi".

---

## 4. Architectural Comparison: 3 Types of Notifications

To avoid architectural confusion, three distinct technical mechanisms must be differentiated:

| Capability / Dimension | A. In-App Notification (Toast / Banner) | B. Browser Local Notification (`new Notification`) | C. Web Push Notification (Service Worker + VAPID) |
|---|---|---|---|
| **Works when tab is active (foreground)?** | **YES** | **YES** | **YES** |
| **Works when tab is in background (open but minimized)?** | **YES** (sound/visual badge on return) | **YES** (if browser process is active) | **YES** |
| **Works when browser/tab is closed?** | **NO** | **NO** (Timers die with tab process) | **YES** (Woken up by OS push service) |
| **Requires Service Worker?** | **NO** | **NO** | **YES** |
| **Requires Push Subscription & VAPID?** | **NO** | **NO** | **YES** |
| **Requires Backend Scheduler / DB?** | **NO** | **NO** | **YES** (Cron/Queue + Neon DB) |
| **Mobile Android Support** | 100% | Works while Chrome tab alive; dies when tab closed | Full support |
| **Mobile iOS Safari Support** | 100% | **UNSUPPORTED** (Safari tabs reject `Notification`) | **UNSUPPORTED** unless added to Home Screen as PWA |
| **Implementation Complexity** | Minimal (1 day) | Low to Moderate (1–2 days) | Very High (requires SW, VAPID, Crons, DB) |
| **MVP Suitability** | Supplementary only | Fragile on mobile | Overkill for initial MVP; platform blockers on iOS |

---

## 5. Mobile & Browser Support Matrix

Because *La Cà Đà Nẵng* is a **mobile-first web application designed for on-the-go travelers in Da Nang**, real-world browser constraints are paramount:

```
Platform Support Matrix for "Tab Closed" Reminders:

[Android Chrome] ──► Full Web Push (via SW) ─────────► [PASS]
[Desktop Chrome] ──► Full Web Push (via SW) ─────────► [PASS]
[iOS Safari Tab] ──► Web Push / Local Notification ──► [BLOCKED: Apple requires installed PWA]
[iOS PWA (Home)] ──► Web Push (iOS 16.4+) ───────────► [PASS: Requires Add to Home Screen]
```

### Specific Platform Findings:
1. **Android Chrome / Edge**:
   - `Notification` constructor works while tab is in foreground/background.
   - However, Android aggressively suspends background web tabs after minutes of inactivity to save battery, terminating client-side JavaScript timers (`setTimeout`).
   - Closed-tab reminders require real Web Push via Service Worker.
2. **iPhone / iOS Safari (Crucial Constraint)**:
   - On standard Safari browser tabs, `window.Notification` is **undefined** or throwing.
   - Apple only enabled Web Push notifications starting in **iOS 16.4**, and **strictly limited it to Web Apps installed to the Home Screen** (`display: standalone` via Web App Manifest).
   - If an iOS user visits `lacadanang.com` in mobile Safari without adding it to their Home Screen, **no browser-level notification can ever be shown while the tab is closed**.
3. **Desktop (macOS / Windows / Linux)**:
   - Chrome, Edge, Firefox, and Safari (macOS 13+) fully support Notification API and Web Push.

---

## 6. Permission UX Contract

Any implementation must strictly enforce this state machine:

```
[User browsing PlaceCard]
         │
         ▼ (Taps "Nhắc tôi trước khi đi")
[Pre-Prompt Explanatory Sheet] ──(Dismisses / Cancels)──► [Returns to Card with No Prompt]
         │ (Taps "Tiếp tục / Bật thông báo")
         ▼
[Browser Permission Prompt]
    ├── 'granted'     ──► Save Reminder ──► Show Success Toast & Confirmation State
    ├── 'denied'      ──► Respect Choice ──► Fallback: Offer Calendar Export / In-App Note
    ├── 'default'     ──► Dismissed without decision ──► Do not re-prompt automatically
    └── 'unsupported' ──► Device cannot receive push ──► Offer Calendar (.ics) Download
```

### Non-Negotiable Permission Rules:
1. **No Cold Prompts**: Never call `Notification.requestPermission()` on page load, home view, or intent selection.
2. **Pre-Prompt Context**: Always explain *why* and *when* notifications will arrive before triggering the browser modal.
3. **Graceful Denied State**: If permission is `denied`, the app must never repeatedly nag the user. It should quietly disable the notification toggle and optionally provide a link/guide on how to re-enable in browser settings if the user taps it again.
4. **Unsupported Fallback**: For browsers that do not support Notification API (e.g. mobile Safari tabs), offer a 1-tap **"Thêm vào Lịch" (Add to Calendar / .ics export)** fallback.

---

## 7. Time & Timezone Contract

1. **Target Territory**: Da Nang, Vietnam.
2. **Canonical Timezone**: **`Asia/Ho_Chi_Minh`** (UTC+07:00).
   - Strictly ban `Asia/Bangkok` in code, configuration, and documentation semantics.
   - Note: Vietnam does not observe Daylight Saving Time (DST); offset is fixed UTC+07:00 year-round.
3. **Storage Format**: UTC timestamp stored as `TIMESTAMPTZ` in PostgreSQL (or ISO 8601 UTC string `YYYY-MM-DDTHH:mm:ss.sssZ` in client storage).
4. **Presentation**: All reminder times displayed to the user must be formatted in local Da Nang time (`Asia/Ho_Chi_Minh`).

---

## 8. UX Solution for the "Missing Departure Time" Gap

Because places do not have inherent visit times, tapping **"Nhắc tôi"** on a `PlaceCard` must open a compact, one-thumb friendly **Reminder Sheet**:

```
┌──────────────────────────────────────────────┐
│  🔔 Nhắc tôi trước khi đi                    │
│  Bánh mì Bà Lan                              │
│                                              │
│  Bạn dự định ghé thăm khi nào?               │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐  │
│  │ +30 phút  │ │  +1 giờ   │ │  +2 giờ   │  │
│  └───────────┘ └───────────┘ └───────────┘  │
│  ┌───────────────────────┐ ┌─────────────┐  │
│  │  Tối nay (18:30)      │ │  Chọn giờ   │  │
│  └───────────────────────┘ └─────────────┘  │
│                                              │
│  Thời gian nhắc: Trước 30 phút xuất phát     │
│                                              │
│  [  Đặt lời nhắc  ]   [ Hủy ]                │
└──────────────────────────────────────────────┘
```

- **Quick Presets**: Provide rapid, single-tap options (`+30m`, `+1h`, `+2h`, evening preset) so the user does not have to fiddle with complex native time pickers.
- **Custom Time**: An optional native `<input type="time">` for specific plans.
- **Calculated Trigger**: `reminder_trigger_time = departure_time - 30_minutes`.

---

## 9. NOW Boundary Protection

- The "BÂY GIỜ LÀM GÌ?" (NOW) feature remains an **illustrative sample itinerary**.
- Reminders must **NOT** attempt to turn NOW into a live multi-stop GPS navigation scheduler.
- Reminders attach strictly to individual verified places (`places.id`) from **EAT**, **GO**, or **STAY**, maintaining total separation from NOW.

---

## 10. Provider & Architecture Options for MVP

### Option 1: Full Web Push Infrastructure (Cloudflare Cron + Push API + Service Worker)
- **Mechanism**: Register Service Worker $\rightarrow$ subscribe via `pushManager` $\rightarrow$ save subscription & scheduled time to Neon $\rightarrow$ Cloudflare cron worker checks DB every minute $\rightarrow$ sends Web Push via VAPID.
- **Pros**: Can notify when tab is closed (on Android and Desktop).
- **Cons**: 
  - Fails on mobile iOS Safari unless user installs PWA to Home Screen.
  - Substantial backend complexity: requires cron workers, subscription management, encryption keys, and continuous serverless DB querying.
  - High maintenance risk for an MVP.

### Option 2: Browser Local Notification + Session Reminder (Client-Only)
- **Mechanism**: Request browser `Notification` permission $\rightarrow$ schedule `setTimeout` in the client tab $\rightarrow$ trigger `new Notification()` when due.
- **Pros**: Zero backend infrastructure, zero DB schema changes.
- **Cons**: Completely unreliable on mobile. When the user locks their phone or switches apps, the browser suspends the tab, and the timer never fires. Unsupported on regular iOS Safari tabs.

### Option 3: Pragmatic Native Calendar (.ics / Google Calendar) + In-App Schedule Card (RECOMMENDED FOR MVP)
- **Mechanism**:
  1. User selects "Nhắc tôi trước khi đi" on a place.
  2. The app stores the active reminder in `localStorage` (`laca.reminders.v1`) for in-app badge/countdown.
  3. The app offers a 1-tap **"Thêm vào Lịch" (Add to Calendar)** action:
     - Generates a standard RFC 5545 `.ics` file or direct Google Calendar link with venue name, address, Google Maps link, and alarm set to `-PT30M` (30 minutes before).
  4. In addition, if on a supported desktop or foreground session, triggers a browser Notification.
- **Pros**:
  - **100% Reliable**: Native mobile calendar notifications ring reliably on both **iOS (Apple Calendar)** and **Android (Google Calendar)** even when the browser is completely closed or device is locked.
  - Zero server cron infrastructure needed on Cloudflare.
  - Zero database bloat in Neon.
  - Perfect privacy: no personal device push tokens stored on our servers.
  - Works universally regardless of browser brand or PWA installation status.

---

## 11. Cloudflare & Service Worker Considerations

If the project eventually transitions to true Web Push in a later phase:
1. **Cloudflare Cron**: Requires configuring `triggers.crons = ["*/5 * * * *"]` in `wrangler.jsonc` and handling `scheduled(event, env, ctx)` in worker code.
2. **Neon Connection Pool**: A 5-minute cron querying Neon will continuously consume serverless compute hours.
3. **PWA Prerequisite**: Web Push should only be built **after** a complete PWA manifest and service worker lifecycle are officially implemented. Attempting Web Push without a PWA setup leaves iOS users completely unsupported.

---

## 12. Proposed Reminder Data Contract (Draft Specification)

If stored in client storage (`localStorage`):
```typescript
export interface PlaceReminder {
  id: string; // UUID
  placeId: number;
  placeName: string;
  departureTime: string; // ISO 8601 UTC
  reminderTime: string; // ISO 8601 UTC (departureTime - 30m)
  leadTimeMinutes: number; // default: 30
  locale: "vi" | "en" | "ko";
  createdAt: string; // ISO 8601 UTC
  status: "scheduled" | "dismissed" | "completed";
}
```

If eventually migrated to Neon PostgreSQL:
```sql
-- DRAFT ONLY - DO NOT RUN IN M9-A
CREATE TABLE IF NOT EXISTS place_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  place_id INTEGER NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  scheduled_departure_at TIMESTAMPTZ NOT NULL,
  remind_at TIMESTAMPTZ NOT NULL,
  locale VARCHAR(5) NOT NULL CHECK (locale IN ('vi', 'en', 'ko')),
  status VARCHAR(15) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## 13. Notification Content & Localization (i18n)

### Notification Copy Templates:
| Locale | Title | Body Template |
|---|---|---|
| **`vi`** | 🔔 Sắp đến giờ đi rồi! | Đã đến giờ chuẩn bị ghé thăm {placeName}. Xem đường đi trên Google Maps. |
| **`en`** | 🔔 Time to head out! | It's almost time for your visit to {placeName}. View directions on Google Maps. |
| **`ko`** | 🔔 출발할 시간입니다! | {placeName} 방문 예정 시간입니다. Google Maps에서 길찾기를 확인하세요. |

- **Place Name Handling**: Always use `place.name` from existing verified translations. Never fabricate machine translations for venue names.
- **Language Policy**: Reminders default to the active locale at the time of creation.

---

## 14. Analytics Interaction & Protection

1. **Preserve M8 Canonical Vocabulary**:
   - The verified 11-event M8 schema (`session_started`, `home_viewed`, `intent_selected`, `preference_selected`, `results_shown`, `nearby_requested`, `nearby_resolved`, `nearby_failed`, `citywide_selected`, `maps_clicked`, `language_changed`) must remain **100% untouched and intact**.
2. **Draft Future Extension Events** (for future authorization, NOT added in M9-A):
   - `reminder_prompt_shown`: User tapped reminder trigger.
   - `reminder_created`: User successfully confirmed a reminder (payload: `place_id`, `lead_time_minutes`, `method: 'calendar' | 'browser'`).
   - `reminder_permission_result`: `granted | denied | unsupported`.
   - `reminder_cancelled`: User deleted an active reminder.

---

## 15. Mobile One-Hand UX Integration (M6-B Compliance)

1. **Trigger Placement**:
   - Must be placed on [`PlaceCard.tsx`](file:///d:/D%E1%BB%B1%20%C3%A1n%20t%C3%ACm%20%C4%91%E1%BB%8Ba%20%C4%91i%E1%BB%83m%20%C4%83n%20ch%C6%A1i/LaCaDaNang/danang_revised_pack/src/components/results/PlaceCard.tsx).
   - Google Maps CTA is the primary action (`min-h-[44px]`, full width or primary slot).
   - "Nhắc tôi" CTA should be a secondary button (e.g. icon button `🔔 Nhắc tôi` with $\ge 44\text{px}$ touch target) placed in an action row alongside or above the Maps button.
2. **Bottom Sheet Ergonomics**:
   - The reminder selection sheet must open from the bottom of the viewport in the natural one-thumb reach zone, following the design system established by `LanguageSelector`.
   - Safe-area insets (`env(safe-area-inset-bottom)`) must be respected.

---

## 16. Test Plan for Implementation

When the reminder feature is authorized for implementation, the following test matrix must be satisfied:

1. **Permission State Tests**:
   - `default` state displays explanatory pre-prompt.
   - `granted` state executes scheduling flow cleanly.
   - `denied` state hides/disables notification prompt and offers calendar fallback without throwing.
   - `unsupported` browser environments cleanly fall back to calendar file export.
2. **Lifecycle & Timing Tests**:
   - Presets (`+30m`, `+1h`, `+2h`) calculate exact timestamps in `Asia/Ho_Chi_Minh`.
   - Past timestamps are rejected.
   - Cancellation removes active reminder cleanly.
3. **i18n Tests**:
   - Sheet labels and notification copy render accurately in `vi`, `en`, and `ko`.
4. **Regression Safeguards**:
   - All 262 existing tests (Discovery, Nearby, One-Hand UX, i18n, Analytics) continue to pass.
   - No venue images reintroduced.

---

## 17. Recommended MVP Scope for M9-B

Based on technical facts and mobile browser realities, **Option 3 (Hybrid Calendar Integration + In-App Reminder Sheet)** is the strongly recommended MVP path for **M9-B**:

1. **UI Component**:
   - Add a subtle, accessible `🔔 Nhắc tôi` CTA on `PlaceCard.tsx` ($\ge 44\text{px}$).
   - Bottom sheet for departure time selection (`+30m`, `+1h`, `+2h`, or custom time).
2. **Delivery Mechanism**:
   - **Primary (100% Reliable)**: One-tap **"Thêm vào Lịch" (Add to Calendar)** generating a localized `.ics` event with a 30-minute alarm and Google Maps link. Guarantees actual lock-screen ringing on iOS and Android devices even when the browser is closed.
   - **Secondary (In-App)**: Local storage persistence (`laca.reminders.v1`) to display an active reminder chip on the card during the user's trip.
3. **Infrastructure**:
   - **Zero Cloudflare Cron changes** (keeps deployment lightweight and low-cost).
   - **Zero Neon DB mutations** (avoids unnecessary database writes and connection churn).
   - Defer full Web Push to a post-PWA milestone where Service Workers and App Manifest are properly integrated.

---

## 18. Audit Sign-Off & Status

- **M9-A Audit Status**: **COMPLETE & VERIFIED**
- **Blockers Found**: None in the codebase. Clear browser constraints identified and documented.
- **Action**: STOP — Awaiting Owner review and scope authorization before any implementation.
