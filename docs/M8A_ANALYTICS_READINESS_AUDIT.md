# M8-A Analytics Readiness Audit & Contract

Date: 2026-10-08
Branch: `phase-2a-deploy`
Base Checkpoint: `dc57c15102e82b0a9124facd4e0ebc90898ffbe7`
Scope: Audit & Contract Design ONLY. Zero runtime implementation, zero application source/test modifications, zero database mutations, zero package installations.

---

## 1. Existing Analytics Foundation Audit

An exhaustive audit across the entire repository revealed:
- **Runtime Analytics in `src/`**: Completely absent (0 lines of tracking code).
- **Existing Helpers / Wrappers**: None. No tracking hooks, no telemetry dispatchers.
- **Dependencies in `package.json`**: 0 analytics packages installed (no `@posthog/js`, no `gtag`, no `@vercel/analytics`, no telemetry libraries).
- **Database Tables in Neon**: 0 analytics tables. Neon PostgreSQL currently hosts exactly 6 core content tables (3,079 total rows): `places` (500), `place_translations` (1500), `place_coordinates` (500), `place_operational` (500), `place_tags` (43), `tag_translations` (108).
- **Existing Specifications**:
  - `docs/ANALYTICS.md`: Canonical reference outlining milestone M9 vocabulary and provider abstraction.
  - `docs/reference/ANALYTICS_SPEC.md`: Provider-neutral baseline defining a common envelope, forbidden properties, and legacy event draft.

---

## 2. Core Product Questions Answered

Analytics for La Cà Đà Nẵng must strictly serve product understanding for the Owner without vanity metrics:
1. **Intent Popularity**: Which intent do users engage with most? (`NOW` vs `EAT` vs `GO` vs `STAY`).
2. **Preference Demand**: Which specific preference chips are most requested? (`an_ngon`, `dac_san`, `chup_anh_dep`, `gan_bien`...).
3. **Funnel Conversion Rate**: What percentage of visitors complete the journey from Home view to Results displayed?
4. **Tap Efficiency Goal**: Do users successfully reach useful results within $\le 2\text{--}3$ meaningful taps?
5. **Nearby Adoption**: What percentage of sessions activate the "Gần tôi" action?
6. **Nearby Radius Resolution**: In which radius bucket does Nearby resolve most frequently? (1 km vs 3 km vs 5 km).
7. **Nearby Zero-Result Rate**: How often does Nearby fail to find matching venues within 5 km?
8. **Fallback Behavior**: How many users utilize the "Xem trên toàn Đà Nẵng" fallback CTA when Nearby yields 0 results?
9. **Venue Engagement**: Which specific venues receive the most Google Maps navigation clicks?
10. **Result Position CTR**: Does position #1 receive the vast majority of clicks, or do positions #2 and #3 perform well?
11. **Language Distribution**: What is the traffic split among Vietnamese (`vi`), English (`en`), and Korean (`ko`)?
12. **Language Selection Mode**: What percentage of users rely on automatic device detection vs manual selection?

---

## 3. Proposed MVP Events

We propose a minimal, high-signal event vocabulary consisting of 11 distinct events:

| Event Name | Precise Trigger | Key Properties | Product Value | Privacy Impact |
|---|---|---|---|---|
| `session_started` | Client initializes session post-hydration | `session_id`, `locale`, `is_manual`, `entry_source` | Session denominator, initial locale baseline | Safe, anonymous |
| `home_viewed` | Home screen becomes visible and interactive | `session_id`, `locale` | Discovery funnel top of funnel | Safe |
| `intent_selected` | User deliberately taps an intent card (`NOW`, `EAT`, `GO`, `STAY`) | `session_id`, `intent`, `tap_index` | Measures intent interest; first decision | Safe |
| `preference_selected` | User taps a preference chip in the accordion | `session_id`, `intent`, `preference`, `tap_index` | Measures demand; second decision | Safe |
| `results_shown` | Discovery API succeeds and places/itinerary render | `session_id`, `intent`, `preference`, `result_count`, `is_nearby`, `radius_km`, `tap_count_total` | Funnel completion; proves $\le 3$-tap goal; empty rate | Safe |
| `nearby_requested` | User taps "Gần tôi" in `BottomActionBar` | `session_id`, `intent`, `preference` | Measures GPS discovery demand | Safe (no GPS data) |
| `nearby_resolved` | GPS resolves $\le 1000\text{m}$ and nearby results render | `session_id`, `intent`, `preference`, `radius_km` (1\|3\|5), `result_count` (0..3) | Radius efficiency; proves escalation logic | Safe (only radius/count) |
| `nearby_failed` | Geolocation error or accuracy $> 1000\text{m}$ | `session_id`, `intent`, `preference`, `failure_reason` (`denied`\|`timeout`\|`unavailable`\|`inaccurate`) | Diagnoses GPS drop-off | Safe |
| `citywide_selected` | User switches to citywide from Nearby or empty CTA | `session_id`, `intent`, `preference`, `source` (`empty_cta`\|`action_bar`) | Measures recovery from localized zero-results | Safe |
| `maps_clicked` | User activates external Google Maps link | `session_id`, `place_id`, `intent`, `preference`, `result_position` (1\|2\|3), `is_nearby`, `radius_km` | Ultimate conversion; venue popularity; position CTR | Safe (internal place ID only) |
| `language_changed` | User changes language in `LanguageSelector` | `session_id`, `selected_locale`, `resolved_locale`, `is_manual` | Language preference & auto vs manual adoption | Safe |

---

## 4. Property Contract & Strict Privacy Boundary

### Allowlisted Properties
- `session_id`: UUID string (ephemeral session token)
- `intent`: `"NOW"` | `"EAT"` | `"GO"` | `"STAY"`
- `preference`: string (stable enum, e.g. `"an_ngon"`, `"dac_san"`, `"chup_anh_dep"`)
- `result_count`: integer ($0 \le n \le 3$)
- `is_nearby`: boolean
- `radius_km`: integer ($1 \mid 3 \mid 5$) or null
- `result_position`: integer ($1 \mid 2 \mid 3$)
- `place_id`: integer (internal Neon place ID, e.g. 1..500)
- `locale`: `"vi"` | `"en"` | `"ko"`
- `is_manual`: boolean
- `failure_reason`: `"denied"` | `"timeout"` | `"unavailable"` | `"inaccurate"`
- `tap_count_total`: integer ($1, 2, 3, \dots$)
- `timestamp`: ISO-8601 UTC string

### Strictly Forbidden Properties (Zero Tolerance)
- ❌ **NO Raw Latitude or Longitude**: Never transmitted or logged under any circumstances.
- ❌ **NO Raw GPS Accuracy in Meters**: Only categorized as valid ($\le 1000\text{m}$) or `inaccurate`.
- ❌ **NO PII**: Zero personal names, email addresses, phone numbers, home addresses.
- ❌ **NO IP Storage**: IP addresses must not be written to analytics records or used for geolocation enrichment.
- ❌ **NO Fingerprinting**: No canvas fingerprinting, WebGL hashes, or device fingerprinting.
- ❌ **NO URL GPS Leakage**: No Maps URLs containing user coordinates.
- ❌ **NO Secrets**: Never log `DATABASE_URL` or configuration tokens.

---

## 5. User & Session Identity Policy

- **No User Account Requirement**: La Cà Đà Nẵng is an open discovery utility; login/account creation does not exist and is not needed.
- **Session Identity**:
  - Generated via `crypto.randomUUID()` upon first client load.
  - Stored strictly in `sessionStorage` (ephemeral; destroyed upon closing the browser tab).
  - Never stored in `localStorage` to prevent cross-day tracking.
  - Reset Policy: Closing the tab ends the session. Inactivity $> 30$ minutes starts a new session token.
  - Zero cross-device or persistent profiling.

---

## 6. Provider Evaluation & Architectural Recommendation

| Criteria | Option A: Neon Internal Events | Option B: PostHog Cloud | Option C: Google Analytics 4 | Option D: Plausible Hosted |
|---|---|---|---|---|
| **Setup Complexity** | Very Low (1 table, 1 Next.js API route) | Medium (SDK, project setup) | Low (gtag script) | Low (script snippet) |
| **Cost** | **$0** (included in existing Neon DB) | Free tier (1M events/mo) | Free | $9+/month |
| **Privacy & Compliance** | **100% First-Party & Sovereign** | Third-party cloud | Third-party / ad-profiling | First-party friendly |
| **Ad-Blocker Resistance** | **High** (First-party origin) | Medium (blocked by default) | Very Poor (30-40% blocked) | Good |
| **Custom Funnel & SQL Power** | **Unlimited SQL capabilities** | Pre-built UI funnels | Clunky reporting / 24h delay | Basic stats only |
| **Cloudflare / Next.js Stack** | **100% Native compatibility** | Good | Standard | Standard |

### Recommendation for MVP: Option A (Internal Neon Analytics via Next.js Route)
- **Rationale**:
  1. Zero additional cost and zero external vendor lock-in.
  2. Immune to ad-blockers because endpoints reside on the same first-party domain (`/api/analytics`).
  3. Strict privacy guarantees: data never leaves the project's own database.
  4. Instant, real-time reporting via simple SQL queries answering all 12 product questions with 100% accuracy.

---

## 7. Proposed Neon Schema (Design Specification Only — No Migrations in M8-A)

```sql
-- DESIGN SPECIFICATION ONLY: DO NOT EXECUTE IN M8-A
CREATE TABLE IF NOT EXISTS analytics_events (
  id BIGSERIAL PRIMARY KEY,
  event_name VARCHAR(50) NOT NULL,
  session_id UUID NOT NULL,
  occurred_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC'),
  locale VARCHAR(5) NOT NULL,
  intent VARCHAR(10),
  preference VARCHAR(50),
  place_id INTEGER,
  result_position SMALLINT,
  result_count SMALLINT,
  is_nearby BOOLEAN DEFAULT FALSE,
  radius_km SMALLINT,
  tap_count SMALLINT,
  metadata JSONB
);

-- Targeted indexes for query performance
CREATE INDEX IF NOT EXISTS idx_analytics_events_name_time ON analytics_events (event_name, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session ON analytics_events (session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_intent_pref ON analytics_events (intent, preference);
CREATE INDEX IF NOT EXISTS idx_analytics_events_place ON analytics_events (place_id);
```

---

## 8. Event Semantics & Deduplication Rules

1. `intent_selected`: Emitted **only** when a user clicks a new intent button. Tapping the already active intent or closing an intent does NOT re-emit.
2. `preference_selected`: Emitted **only** on deliberate chip tap. Repeated taps while a request is in flight are dropped.
3. `results_shown`: Emitted **only** when API request resolves 200 and UI renders. Loading states and failed API calls do not emit `results_shown`.
4. `maps_clicked`: Emitted on click of the external Maps CTA before navigation opens.
5. **i18n Safety**: Changing language re-renders the UI but **must never** re-emit `intent_selected` or `preference_selected`.
6. **Retry Safety**: Clicking "Thử lại" after an API failure is a recovery event, not a fresh preference selection.

---

## 9. Funnel Contracts & Metrics

### Funnel 1: Core Discovery Funnel
$$\text{Home Viewed} \xrightarrow{\text{Step 1}} \text{Intent Selected} \xrightarrow{\text{Step 2}} \text{Preference Selected} \xrightarrow{\text{Step 3}} \text{Results Shown} \xrightarrow{\text{Step 4}} \text{Maps Clicked}$$
- **Discovery Completion Rate**: $\frac{\text{Sessions with Results Shown}}{\text{Sessions with Home Viewed}}$
- **Outbound Maps CTR**: $\frac{\text{Sessions with Maps Clicked}}{\text{Sessions with Results Shown}}$

### Funnel 2: Nearby Discovery Funnel
$$\text{Results Shown} \xrightarrow{\text{Step 1}} \text{Nearby Requested} \xrightarrow{\text{Step 2}} \text{Nearby Resolved} \xrightarrow{\text{Step 3}} \text{Maps Clicked}$$
- **Nearby Adoption Rate**: $\frac{\text{Nearby Requested}}{\text{Results Shown}}$
- **Nearby Success Rate**: $\frac{\text{Nearby Resolved}}{\text{Nearby Requested}}$
- **Zero-Result Escalation Rate**: Count of `nearby_resolved` with `radius_km = 5` and `result_count = 0`.

---

## 10. Tap Goal Measurement Strategy

- Product Target: $\le 2\text{--}3$ meaningful taps to reach useful recommendations.
- Measurement Mechanism: A lightweight in-memory `tapCounter` tracking deliberate discovery decisions:
  - Selecting an intent = tap 1.
  - Selecting a preference = tap 2.
  - If a user switches intents twice before selecting a preference = tap 3.
  - When `results_shown` fires, it reports `tap_count_total`.
  - Excludes scrolling, view toggles, and language switching.

---

## 11. Internationalization Interaction

- All analytics identifiers must remain strictly language-invariant:
  - Intents: `"EAT"`, `"GO"`, `"STAY"`, `"NOW"`.
  - Preferences: `"an_ngon"`, `"dac_san"`, `"chup_anh_dep"`, `"gan_bien"`...
  - Locales: recorded as separate property `locale: "vi" | "en" | "ko"`.
- Never transmit translated labels (e.g. never log `"맛있는 음식"` or `"Where to eat"` as the preference identifier).

---

## 12. Non-Blocking UX & Failure Policy

- **Non-Blocking Transport**: Dispatch analytics events via `navigator.sendBeacon` or asynchronous `fetch(..., { keepalive: true })`.
- **Zero UI Interruption**: Analytics dispatch must never cause layout shift, trigger loading states, or delay button click responses.
- **Graceful Failure**: If the analytics endpoint returns an error, times out, or fails due to network offline:
  - Silently drop/catch the error.
  - Never retry infinitely.
  - Never display any technical error messages or banners to the user.
  - Discovery, Google Maps links, GPS nearby, and language switching must function with 100% normality.

---

## 13. Bot / Dev / Test Traffic Isolation Policy

- `development` (localhost): Analytics tracking disabled (no-op dispatcher).
- `test` (vitest): Analytics tracking disabled (no-op dispatcher).
- `preview` deployments: Enabled with `environment = "preview"` to test dispatch without polluting production datasets.
- `production`: Enabled with `environment = "production"`.

---

## 14. Retention & Privacy Separation

- **Data Retention**: Maximum 30–60 days for granular event rows. Aggregated daily summaries can be retained for 90 days.
- **Three Strict Data Tiers**:
  1. *Product Analytics*: Aggregated behavioral signals with zero PII.
  2. *Application Logs*: Next.js server operational logs rotated and purged after 7 days.
  3. *Personal Data*: Zero storage. None collected, none stored.

---

## 15. M8-B Regression Contract

Implementation in M8-B must strictly preserve:
- ✅ Live Neon discovery for EAT, GO, and STAY.
- ✅ Nearby GPS 1 $\rightarrow$ 3 $\rightarrow$ 5 km escalation and GPS privacy.
- ✅ M6-B One-Hand mobile ergonomics and `BottomActionBar`.
- ✅ M7-B runtime VI / EN / KO localization and dynamic API locale.
- ✅ M7-C intent vector visuals and footer utility row.
- ✅ Truthful 0–3 results, exact Google Maps URLs, zero fake padding, zero venue images.
- ✅ NOW sample timeline; CAFE inactive (400).
- ✅ Clean database state (no schema corruption or unintended mutations).

---

## 16. Comprehensive Test Plan for M8-B

1. **Dispatcher Unit Tests**:
   - Verify `session_id` generation and `sessionStorage` lifecycle.
   - Verify non-blocking `sendBeacon` / `fetch` dispatch.
   - Verify silent failure handling when endpoint returns 500 or network drops.
2. **Event Integrity Tests**:
   - Verify stable IDs (`EAT`, `an_ngon`) regardless of active locale (`vi`, `en`, `ko`).
   - Verify `intent_selected` fires exactly once per selection.
   - Verify `results_shown` fires with correct `result_count` and `tap_count_total`.
   - Verify `maps_clicked` captures exact `place_id` and 1-based `result_position`.
   - Verify `nearby_resolved` records `radius_km` and `result_count` without raw GPS coordinates.
3. **Environment Isolation Tests**:
   - Verify `NODE_ENV === "test"` and `NODE_ENV === "development"` emit zero network calls.
4. **Full Regression Suite**:
   - Run 225/225 tests to ensure 100% pass rate.
   - Run linter, typecheck, and Next.js production build.
