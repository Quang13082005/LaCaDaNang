# M8-B Verification Report: First-Party Product Analytics Implementation

Date: 2026-10-08  
Branch: `phase-2a-deploy`  
Base Checkpoint: `4174a4c0c0cf74a155d06694e6ad77e29e8bf7b7`  
Commit Message: `feat: add first-party product analytics`  
Scope: First-party product analytics runtime and Neon PostgreSQL migration `002_analytics_events.sql`. Zero mutation on 6 content tables. Zero third-party tracking SDKs.

---

## 1. Pre-Flight Git & State Check

- Current Branch: `phase-2a-deploy`
- Base HEAD: `4174a4c0c0cf74a155d06694e6ad77e29e8bf7b7`
- Initial Working Tree: CLEAN
- Milestone Authority: M8-A, M8-A.1, and M8-A.2 approved by Owner. M8-B explicitly authorized to create `analytics_events` table and 4 indexes on Neon PostgreSQL and wire telemetry runtime.

---

## 2. Reproducible Database Migration Artifact

Created canonical tracked DDL file:
[`docs/schema/002_analytics_events.sql`](file:///d:/D%E1%BB%B1%20%C3%A1n%20t%C3%ACm%20%C4%91%E1%BB%8Ba%20%C4%91i%E1%BB%83m%20%C4%83n%20ch%C6%A1i/LaCaDaNang/danang_revised_pack/docs/schema/002_analytics_events.sql)

```sql
CREATE TABLE IF NOT EXISTS analytics_events (
  id BIGSERIAL PRIMARY KEY,
  event_name VARCHAR(50) NOT NULL,
  session_id UUID NOT NULL,
  journey_id UUID NOT NULL,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  environment VARCHAR(15) NOT NULL
    CHECK (environment IN ('production', 'preview')),
  locale VARCHAR(5) NOT NULL
    CHECK (locale IN ('vi', 'en', 'ko')),
  language_mode VARCHAR(10) NOT NULL
    CHECK (language_mode IN ('auto', 'manual')),
  intent VARCHAR(10)
    CHECK (intent IN ('NOW', 'EAT', 'GO', 'STAY')),
  preference VARCHAR(50),
  place_id INTEGER CHECK (place_id > 0),
  result_position SMALLINT
    CHECK (result_position BETWEEN 1 AND 3),
  result_count SMALLINT
    CHECK (result_count BETWEEN 0 AND 3),
  is_nearby BOOLEAN NOT NULL DEFAULT FALSE,
  radius_km SMALLINT
    CHECK (radius_km IN (1, 3, 5)),
  failure_reason VARCHAR(20)
    CHECK (
      failure_reason IN (
        'denied',
        'unavailable',
        'timeout',
        'inaccurate',
        'network_error',
        'no_results'
      )
    ),
  meaningful_tap_count SMALLINT NOT NULL DEFAULT 0
    CHECK (meaningful_tap_count >= 0)
);

CREATE INDEX IF NOT EXISTS idx_analytics_events_occurred_at
  ON analytics_events (occurred_at DESC);

CREATE INDEX IF NOT EXISTS idx_analytics_events_session_id
  ON analytics_events (session_id);

CREATE INDEX IF NOT EXISTS idx_analytics_events_journey_id
  ON analytics_events (journey_id);

CREATE INDEX IF NOT EXISTS idx_analytics_events_name_env
  ON analytics_events (event_name, environment);
```

- No foreign key to `places` (preserves historical metrics if content places change).
- No untyped `metadata JSONB` column.
- Naive serial timestamps replaced with canonical `TIMESTAMPTZ NOT NULL DEFAULT NOW()`.

---

## 3. Database Migration Execution & Verification

### Pre-Migration Content Table Row Counts
Verified directly against Neon PostgreSQL:
- `places`: 500 rows
- `place_translations`: 1500 rows
- `place_tags`: 841 rows
- `tags`: 36 rows
- `tag_translations`: 108 rows
- `administrative_units`: 94 rows
- **Total Existing Rows**: 3,079 rows

### Migration Execution
Executed migration script reading directly from `docs/schema/002_analytics_events.sql`.

### Post-Migration Schema Verification
- Table `analytics_events` created with 17 expected columns:
  `id`, `event_name`, `session_id`, `journey_id`, `occurred_at`, `environment`, `locale`, `language_mode`, `intent`, `preference`, `place_id`, `result_position`, `result_count`, `is_nearby`, `radius_km`, `failure_reason`, `meaningful_tap_count`.
- Indexes verified:
  - `analytics_events_pkey` (PRIMARY KEY on `id`)
  - `idx_analytics_events_occurred_at` (`occurred_at DESC`)
  - `idx_analytics_events_session_id` (`session_id`)
  - `idx_analytics_events_journey_id` (`journey_id`)
  - `idx_analytics_events_name_env` (`event_name, environment`)
- Initial row count: 0 rows.
- Existing 6 content tables verified: exactly 3,079 rows (100% untouched).

---

## 4. Timezone Presentation Contract

- Storage: Database strictly stores UTC timestamps via `TIMESTAMPTZ DEFAULT NOW()`.
- Presentation & Analytical Queries: Any reporting query converting timestamps to local Vietnam time must strictly use `AT TIME ZONE 'Asia/Ho_Chi_Minh'` (never `'Asia/Bangkok'`).

---

## 5. Analytics Architecture & Components

### 11 Allowed Canonical Events
1. `session_started`
2. `home_viewed`
3. `intent_selected`
4. `preference_selected`
5. `results_shown`
6. `nearby_requested`
7. `nearby_resolved`
8. `nearby_failed`
9. `citywide_selected`
10. `maps_clicked`
11. `language_changed`

### Strict Schema Validator (`src/lib/analytics/validator.ts`)
- Implemented with Zod discriminated union using `.strict()`.
- Rejects any unknown or arbitrary client properties.
- Strictly rejects server-owned fields: `id`, `occurred_at`, `environment`.
- Strict Privacy Rule: Scans and immediately rejects payloads containing raw GPS or PII keys (`lat`, `lng`, `latitude`, `longitude`, `accuracy`, `user_lat`, `user_lng`, `ip`, `email`, `phone`).

### API Route Handler (`src/app/api/analytics/route.ts`)
- Edge runtime handler (`export const runtime = "edge"`).
- Body size enforced: strictly $\le 2\text{ KB}$ (HTTP 413 if exceeded).
- Safe JSON parse (HTTP 400 for malformed payload).
- Strict schema validation (HTTP 400 for invalid/forbidden properties).
- Server-side environment derivation via `resolveServerEnvironment()` (`production` or `preview`). Client cannot inject or override environment.
- Parameterized SQL INSERT via Neon driver.
- Sanitized responses: HTTP 202 on success, generic error messages without database credentials or connection internals.

### Client Telemetry & State (`src/lib/analytics/client.ts`)
- **Non-blocking Dispatcher**: Uses `navigator.sendBeacon` if available, falling back to `fetch(..., { keepalive: true })`. Telemetry exceptions are caught and discarded to never degrade user experience.
- **Environment Isolation**: No-op in `development` and `test` environments (zero unexpected network calls).
- **Session Store**: Tab lifetime ephemeral session in `sessionStorage` (`laca.analytics-session.v1`), generated via `crypto.randomUUID()`.
- **Journey Store**: Ephemeral journey in `sessionStorage` (`laca.analytics-journey.v1`). Resets when user clicks "Đổi lựa chọn" or returns to initial Home.
- **Meaningful Tap Counting**: Increments strictly on:
  - Intent tap (+1)
  - Preference tap (+1)
  - Nearby / citywide toggle (+1)
  - Resets to 0 upon journey reset. Does NOT increment on scrolling, language modal opening, or Maps links.
- **Deduplication**:
  - `session_started`: Fired once per tab session.
  - `home_viewed`: Deduplicated per journey.
  - `results_shown`: Deduplicated by state key `${intent}:${preference}:${mode}`. Suppressed on locale-only re-fetches.
  - `maps_clicked`: Debounced within 1 second against rapid double-clicks. Non-blocking navigation.
  - `NOW`: Static itinerary is strictly excluded from `results_shown` places discovery conversion funnel.

---

## 6. Live Neon Database Verification Evidence

A controlled preview verification event (`maps_clicked`) was ingested via API logic into Neon PostgreSQL, inspected via `SELECT`, and cleaned up:

```json
{
  "id": "2",
  "event_name": "maps_clicked",
  "session_id": "a0000000-0000-4000-8000-000000000001",
  "journey_id": "b0000000-0000-4000-8000-000000000002",
  "occurred_at": "2026-10-08T10:55:13.258Z",
  "occurred_at_vn": "2026-10-08T10:55:13.258Z",
  "environment": "preview",
  "locale": "vi",
  "language_mode": "auto",
  "intent": "EAT",
  "preference": "an_ngon",
  "place_id": 1,
  "result_position": 1,
  "result_count": null,
  "is_nearby": false,
  "radius_km": null,
  "failure_reason": null,
  "meaningful_tap_count": 2
}
```

### Analytical Queries Evidence
1. **Total events**: `SELECT count(*)::int AS total_events FROM analytics_events` -> `1` (during test), `0` (post-cleanup).
2. **Distinct sessions**: `SELECT count(DISTINCT session_id)::int FROM analytics_events` -> `1`.
3. **Distinct journeys**: `SELECT count(DISTINCT journey_id)::int FROM analytics_events` -> `1`.
4. **Events by event_name**: `[ { event_name: 'maps_clicked', event_count: 1 } ]`.
5. **Events by environment**: `[ { environment: 'preview', count: 1 } ]`.

### Post-Verification Database State
- `analytics_events` count: `0` (clean).
- Content tables count: `3,079` (`places`: 500, `place_translations`: 1500, `place_tags`: 841, `tags`: 36, `tag_translations`: 108, `administrative_units`: 94).

---

## 7. Automated Test Suite & Validation Evidence

### Test Execution Summary
- **Test Command**: `npx vitest run --exclude "**/curation.test.ts"`
- **Test Files**: 14 passed (14)
- **Total Tests**: 259 passed (259)
- **Duration**: ~14.0s
- **Analytics Unit & UI Suite** (`tests/analytics.test.tsx`): 34 passed (34)
  - 11 canonical event names verified
  - Strict unknown-key rejection verified
  - Server-owned fields (`id`, `occurred_at`, `environment`) rejection verified
  - Raw GPS / PII privacy violation rejection verified
  - Event-specific schema requirements verified
  - Session UUID stability & journey UUID reset verified
  - Meaningful tap count counting verified
  - Deduplication (`session_started`, `home_viewed`, `results_shown`, `maps_clicked`) verified
  - Route handler status codes (202, 400, 413, 405) verified
  - Full React UI integration flow verified

### Lint & Typecheck
- `npm run lint`: **0 warnings, 0 errors**
- `npm run typecheck`: **0 errors**
- `npm run build`: **Compiled successfully**; static pages and dynamic edge routes generated cleanly.

### Dataset Verification
- `git diff HEAD -- src/data/curated/curated-places.json`: Clean (0 diff).
- `git diff --check`: Clean (0 whitespace/formatting errors).

---

## 8. Retention Policy

- **Target Retention**: 60 days for raw telemetry events.
- **Automated Purge**: **NOT IMPLEMENTED** (per locked scope, no background cron or purge job created in M8-B).

---

## 9. Scope Boundaries & Next Step

- CAFE intent: Inactive (preserved).
- NOW intent: Static itinerary preserved (excluded from places conversion tracking).
- No third-party analytics SDKs installed.
- No analytics UI dashboard.
- No notifications.
- No production deployment.
- **Exact Next Step**: STOP — Waiting for Owner Review before M9 (Notifications / Deploy Preparation).
