# M8-A.2 Final Analytics Readiness Audit & Contract Lock

Date: 2026-10-08
Branch: `phase-2a-deploy`
Base Checkpoint: `559b17b5207fa77d1ac4fd1c415ebdc26c52f472`
Scope: Final Contract Patch & Lock ONLY. Zero runtime implementation, zero application source/test modifications, zero database mutations, zero package installations.

---

## 1. Actual Neon Database Catalog & DOC/DB Drift Reconciliation

An independent, read-only inspection was executed directly against Neon PostgreSQL via `information_schema`:

### Actual Public Tables & Row Counts (Direct SQL Verification)
| Table Name | Actual Row Count | Key Columns & Characteristics |
|---|---|---|
| `places` | **500** | Primary table (22 cols: `id`, `name`, `section`, `primary_type`, `latitude`, `longitude`, `google_maps_url`, `business_status`, `active`, `featured`...) |
| `place_translations` | **1,500** | Multilingual place text (7 cols: `place_id`, `locale`, `display_name`, `primary_type_label`, `short_description` across `vi`, `en`, `ko`) |
| `place_tags` | **841** | Many-to-many junction table (2 cols: `place_id`, `tag_id`) linking places to catalog tags |
| `tags` | **36** | Master catalog of curated tags (5 cols: `id`, `code`, `display_name`, `domain`, `active`) across `EAT`, `CAFE`, `GO`, `STAY`, `COMMON` |
| `tag_translations` | **108** | Multilingual tag labels (3 cols: `tag_id`, `locale`, `label` across `vi`, `en`, `ko` for 36 tags) |
| `administrative_units` | **94** | Da Nang administrative geography (7 cols: `id`, `official_name`, `unit_type`, `active`...) |
| **TOTAL** | **3,079** | **Exactly 3,079 total rows across all 6 core tables** |

### DOC/DB Drift Findings
- **Drift Detected**: Early draft documents and initial M8-A notes described the database as having:
  `places (500), place_translations (1500), place_coordinates (500), place_operational (500), place_tags (43), tag_translations (108)`.
- **Root Cause & Correction**:
  1. `place_coordinates` and `place_operational` were draft conceptual categories during the workbook import planning phase, but in PostgreSQL they exist as columns directly on `places` (`latitude`, `longitude`, `business_status`, `active`, `featured`), NOT separate tables.
  2. `place_tags` contains **841** junction rows, not 43.
  3. `tags` (**36** rows) and `administrative_units` (**94** rows) are the true 5th and 6th tables.
  4. $500 + 1500 + 841 + 36 + 108 + 94 = \mathbf{3,079}$ rows.
- **Resolution**: All authoritative documentation is updated to reflect the true schema defined in `docs/schema/001_initial_schema.sql`.

---

## 2. Canonical Analytics Property & Payload Contract

All analytics database columns and client payload properties are strictly partitioned into **Server-Generated Database Fields** and **Client-Allowed Telemetry Fields**.

### A. Server-Generated Database Fields (Forbidden in Client Payload)
These fields are populated exclusively by the server during ingestion; public clients **MUST NOT** send them:
| Field Name | DB Data Type | Constraints / Default | Generation Authority |
|---|---|---|---|
| `id` | `BIGSERIAL` | Primary Key, positive auto-increment | Database generated |
| `occurred_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | Server generated in UTC; eliminates client clock skew and timestamp spoofing |
| `environment` | `VARCHAR(15)` | `CHECK (environment IN ('production', 'preview'))` | Server derived from trusted deployment configuration (`NODE_ENV` / deployment env); client cannot spoof |

### B. Client-Allowed Telemetry Fields (14 Fields)
Validated on the server via strict Zod parser (`.strict()`). If a client sends any unknown field (including `id`, `occurred_at`, or `environment`), the request is rejected:
| Property Name | Data Type | Permitted Values / Constraints | Description |
|---|---|---|---|
| `event_name` | `VARCHAR(50)` | Exact 11-event vocabulary enum | Canonical event identifier |
| `session_id` | `UUID` | RFC-4122 v4 UUID string | Browser session identifier (one tab lifetime) |
| `journey_id` | `UUID` | RFC-4122 v4 UUID string | Specific discovery journey identifier |
| `locale` | `VARCHAR(5)` | `'vi'` \| `'en'` \| `'ko'` | Active language at time of event |
| `language_mode`| `VARCHAR(10)` | `'auto'` \| `'manual'` | Whether language was auto-detected or manually selected |
| `intent` | `VARCHAR(10)` | `'EAT'` \| `'GO'` \| `'STAY'` \| `'NOW'` (or null) | Primary section |
| `preference` | `VARCHAR(50)` | Stable string enum (e.g. `'an_ngon'`, `'dac_san'`) | Selected filter preference |
| `place_id` | `INTEGER` | Positive integer $> 0$ (or null) | Snapshot database ID of venue |
| `result_position`| `SMALLINT` | $1 \mid 2 \mid 3$ (or null) | 1-based display position on screen |
| `result_count` | `SMALLINT` | $0 \le n \le 3$ (or null) | Number of venues returned |
| `is_nearby` | `BOOLEAN` | `true` \| `false` | Whether nearby mode was active |
| `radius_km` | `SMALLINT` | $1 \mid 3 \mid 5$ (or null) | Resolved escalation radius bucket |
| `failure_reason`| `VARCHAR(20)` | `'denied'` \| `'timeout'` \| `'unavailable'` \| `'inaccurate'` \| `'network_error'` \| `'no_results'` | Geolocation or API failure code |
| `meaningful_tap_count`| `SMALLINT`| Integer $\ge 0$ (default 0) | Cumulative intentional taps in journey |

---

## 3. Session & Journey Policy

### Session Policy (`session_id`)
- **Lifecycle**: **One Tab Lifetime = One Session**.
- **Storage**: `sessionStorage` strictly. Automatically destroyed when the user closes the browser tab or browser.
- **Determinism**: Zero timer or background heartbeat complexity. Zero persistent cross-day tracking.
- **No User Identity**: No user login, no email, no device fingerprinting.

### Discovery Journey Policy (`journey_id`)
- **Definition**: Represents a single continuous goal-oriented search cycle within a session.
- **Journey Initiation**: A new `journey_id` (`crypto.randomUUID()`) is generated on initial Home load.
- **Journey Continuation (Preserved)**:
  - Tapping between intents before selecting a preference maintains the **SAME** `journey_id`.
  - Switching languages (VI $\leftrightarrow$ EN $\leftrightarrow$ KO) maintains the **SAME** `journey_id`.
  - Toggling "Gần tôi" (Nearby) or retrying a failed query maintains the **SAME** `journey_id`.
  - Clicking external Google Maps links is part of the **SAME** `journey_id`.
- **Journey Reset Rules**:
  - Tapping "Đổi lựa chọn" (Change selection) or returning to Home explicitly **ENDS** the current journey and starts a **NEW** `journey_id`.
- **Value**: Enables exact journey-level funnels (`COUNT(DISTINCT journey_id)`) and accurate tap-to-result tracking without timestamp guesswork.

---

## 4. Event Semantics & Deduplication Contract

1. **`results_shown` Strict Semantics**:
   - Emitted **ONLY ONCE** when a fresh discovery outcome is successfully rendered for the active `journey_id`.
   - **Locale Re-fetch Guard**: When switching languages in the results view, the discovery data is re-fetched to update translated text. This re-fetch **MUST NOT** emit `results_shown`. It only emits `language_changed`.
   - **Retry Guard**: Clicking "Thử lại" only emits `results_shown` if the journey was previously in an error state.
2. **NOW Intent Analytics Boundary**:
   - NOW is currently a static sample timeline (`ItineraryTimeline`).
   - M8-B tracks `intent_selected` (`intent = 'NOW'`) and `preference_selected` (if timeline period chosen).
   - **NOW is EXCLUDED from the places discovery conversion funnel**.
   - No fake `0..3` result counts or `results_shown` place events are emitted for NOW.
3. **`place_id` Validation & Snapshot Policy**:
   - `place_id` is validated as a positive integer ($> 0$), never hardcoded to $1..500$.
   - Treated as an independent snapshot identifier without a strict `FOREIGN KEY ... ON DELETE CASCADE` constraint, ensuring historical analytics data remains intact if a venue record is archived or removed.
4. **Metadata Policy**:
   - **JSONB metadata is completely REMOVED from the M8-B schema**.
   - All permitted properties are first-class, strictly typed SQL columns. This prevents clients from passing arbitrary JSON or evading the privacy allowlist.

---

## 5. Security & Public Endpoint Abuse Contract

Endpoint `POST /api/analytics` is a public HTTP route:
1. **Strict Zod Validation**: Payload validated against a strict Zod schema with `.strict()`, instantly rejecting unexpected or unknown keys. Any attempt by clients to submit server-generated fields (`id`, `occurred_at`, `environment`) is rejected.
2. **Payload Size Limit**: Maximum request body size capped at **2 KB**.
3. **Value & Length Range Checks**: All strings capped (e.g. `event_name` $\le 50$ chars, enums strictly verified).
4. **100% Parameterized SQL**: Zero dynamic SQL string concatenation.
5. **Telemetry Nature**:
   > *"Analytics telemetry represents indicative product signals for optimization, not trusted financial or security audit records."*
   Client events are assumed to be best-effort telemetry, not unforgeable cryptographically signed attestations.

---

## 6. GPS Privacy & Environment Policy

### GPS Privacy Language
> *"Product analytics payloads and `analytics_events` intentionally contain no raw latitude, longitude, IP address, PII, or device fingerprint. Nearby functional requests still transmit ephemeral lat/lng for distance calculation. Application code must not intentionally persist or emit raw GPS into product analytics. Infrastructure/provider access logging is a separate operational concern and must not be represented as product analytics storage."*

- **Clear Separation of Data Domains**:
  1. *Product Analytics*: Only records `is_nearby = true` and categorical `radius_km = 1 | 3 | 5`.
  2. *Functional Discovery API*: Receives coordinates in ephemeral RAM via `GET /api/discovery` to calculate distances, immediately discarded.
  3. *Infrastructure Logs*: Cloudflare/edge operational access logging is a separate operational concern and must not be represented as product analytics storage.

### Environment Isolation Policy
- `development` (localhost): Client dispatcher no-op (zero network traffic).
- `test` (vitest): Client dispatcher no-op (zero network traffic).
- `preview`: Server derives `environment = 'preview'` from deployment runtime configuration.
- `production`: Server derives `environment = 'production'` from deployment runtime configuration.
- Product SQL queries and dashboards filter by default: `WHERE environment = 'production'`.

---

## 7. Retention & Dashboard Scope Boundary

- **Retention Target**: 60 days for raw event records.
- **Scope Clarification**:
  > *"Retention target is documented as 60 days; automated scheduled purge jobs and aggregate summary tables are NOT IMPLEMENTED in M8-B."* (Tracked for future maintenance).
- **Dashboard Scope**: M8-B is strictly limited to event ingestion, validation, and SQL queryability on Neon. Zero dashboard UI components will be built in M8-B.

---

## 8. Provider Decision & Database Migration Strategy

### Provider Decision
- **Architecture**: First-party analytics using Neon PostgreSQL + Next.js route `POST /api/analytics`.
- **Engineering Rationale**:
  1. Reuses existing Neon infrastructure; no additional third-party analytics SDK/provider required; cost depends on existing Neon usage/plan.
  2. Zero third-party SDK dependencies added to client bundle.
  3. 100% data sovereignty and strict privacy compliance.
  4. Highly expressive, instant SQL funnel queries.
  5. Minimal implementation surface area.

### Database Migration Strategy for M8-B
Following repository conventions (ref: `docs/schema/001_initial_schema.sql`):
- Migration script will be created at: `docs/schema/002_analytics_events.sql`.
- Fully idempotent: `CREATE TABLE IF NOT EXISTS`, `CREATE INDEX IF NOT EXISTS`.
- M8-A.2 executes **ZERO** database changes.

---

## 9. Final Canonical Event Table (PostgreSQL Schema for M8-B)

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

CREATE INDEX IF NOT EXISTS idx_analytics_events_occurred_at ON analytics_events (occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session_id ON analytics_events (session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_journey_id ON analytics_events (journey_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_name_env ON analytics_events (event_name, environment);
```

---

## 10. Final 11-Event Specification Matrix (11 Allowed Events)

| Event Name | Precise Trigger | Required Client Properties | Optional Client Properties | Forbidden Client Properties | Deduplication & Journey Behavior |
|---|---|---|---|---|---|
| `session_started` | Client initializes session post-hydration | `session_id`, `journey_id`, `locale`, `language_mode` | — | `id`, `occurred_at`, `environment`, `place_id`, `result_position` | Fires once per tab load; initializes `journey_id` |
| `home_viewed` | Home screen renders and becomes interactive | `session_id`, `journey_id`, `locale`, `language_mode` | — | `id`, `occurred_at`, `environment`, `place_id`, `preference` | Fires on Home mount; suppressed on simple re-renders |
| `intent_selected` | User taps intent card (`EAT`, `GO`, `STAY`, `NOW`) | `session_id`, `journey_id`, `intent`, `meaningful_tap_count` | — | `id`, `occurred_at`, `environment`, `place_id`, `radius_km` | Fires once per intent switch; preserves current `journey_id` |
| `preference_selected` | User taps preference chip | `session_id`, `journey_id`, `intent`, `preference`, `meaningful_tap_count` | — | `id`, `occurred_at`, `environment`, `place_id` | In-flight duplicate taps ignored; preserves current `journey_id` |
| `results_shown` | API returns 200 and places render | `session_id`, `journey_id`, `intent`, `preference`, `result_count`, `is_nearby`, `meaningful_tap_count` | `radius_km` | `id`, `occurred_at`, `environment`, `place_id` | Fires once per unique result set; locale re-fetch is suppressed |
| `nearby_requested` | User taps "Gần tôi" button | `session_id`, `journey_id`, `intent`, `preference`, `meaningful_tap_count` | — | `id`, `occurred_at`, `environment`, `place_id` | Fires once per tap; coordinates strictly excluded |
| `nearby_resolved` | Nearby results successfully resolve | `session_id`, `journey_id`, `intent`, `preference`, `result_count`, `is_nearby`, `radius_km` | — | `id`, `occurred_at`, `environment`, `place_id` | Fires once per successful GPS resolution |
| `nearby_failed` | GPS error or accuracy $> 1000\text{m}$ | `session_id`, `journey_id`, `intent`, `preference`, `failure_reason` | — | `id`, `occurred_at`, `environment`, `place_id` | Fires on GPS rejection/timeout |
| `citywide_selected` | User taps fallback or toggles all-city | `session_id`, `journey_id`, `intent`, `preference`, `meaningful_tap_count` | — | `id`, `occurred_at`, `environment`, `place_id` | Fires on citywide fallback |
| `maps_clicked` | User taps "Mở Google Maps" | `session_id`, `journey_id`, `place_id`, `intent`, `preference`, `result_position`, `meaningful_tap_count` | `is_nearby`, `radius_km` | `id`, `occurred_at`, `environment` | Fires on navigation click; captures 1-based position |
| `language_changed` | User changes language in modal | `session_id`, `journey_id`, `locale`, `language_mode` | `intent`, `preference` | `id`, `occurred_at`, `environment`, `place_id` | Preserves `journey_id`; does NOT trigger discovery events |

---

## 11. Funnel Semantics & Formulas

All funnel queries are strictly anchored to `COUNT(DISTINCT journey_id)`:

1. **Discovery Completion Rate**:
   ```sql
   SELECT
     COUNT(DISTINCT journey_id) FILTER (WHERE event_name = 'results_shown' AND result_count > 0)::float /
     NULLIF(COUNT(DISTINCT journey_id) FILTER (WHERE event_name = 'intent_selected'), 0) AS discovery_completion_rate
   FROM analytics_events
   WHERE environment = 'production';
   ```
2. **Outbound Maps Navigation CTR**:
   ```sql
   SELECT
     COUNT(DISTINCT journey_id) FILTER (WHERE event_name = 'maps_clicked')::float /
     NULLIF(COUNT(DISTINCT journey_id) FILTER (WHERE event_name = 'results_shown' AND result_count > 0), 0) AS maps_ctr
   FROM analytics_events
   WHERE environment = 'production';
   ```
3. **Nearby Adoption Rate**:
   ```sql
   SELECT
     COUNT(DISTINCT journey_id) FILTER (WHERE event_name = 'nearby_requested')::float /
     NULLIF(COUNT(DISTINCT journey_id) FILTER (WHERE event_name = 'results_shown'), 0) AS nearby_adoption_rate
   FROM analytics_events
   WHERE environment = 'production';
   ```
4. **Tap Efficiency Goal Verification ($\le 3$ Taps)**:
   ```sql
   SELECT
     ROUND(AVG(meaningful_tap_count), 2) AS avg_taps_to_result,
     COUNT(*) FILTER (WHERE meaningful_tap_count <= 3)::float / COUNT(*) AS pct_under_3_taps
   FROM analytics_events
   WHERE event_name = 'results_shown' AND environment = 'production';
   ```
