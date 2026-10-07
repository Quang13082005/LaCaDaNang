# La Cà Đà Nẵng

Mobile-first web application that helps people in Đà Nẵng quickly decide what to **eat, explore, or stay at** in $\le 3$ deliberate taps (preferably 2). Designed for fast, one-thumb mobile interaction with truthful recommendations, zero fluff, and no artificial data padding.

---

## Current Status (Post M4-B & G1 Checkpoint)

- **Milestone reached**: **M4-B Complete** (`f319ae4`) + **G1 Repository Hygiene & Governance** (`e745d35`, `5918152`).
- **Live discovery sections**: **EAT**, **GO**, and **STAY** query real data directly from Neon PostgreSQL via `/api/discovery`.
- **CAFE section**: **Not yet active in frontend** (backend validates and responds HTTP 400 `INTENT_NOT_AVAILABLE`; awaits product decisions on UI chips and tag mapping).
- **NOW section**: Curated sample itinerary (`Lịch trình mẫu`), not time-aware.
- **Card design**: Text-first `PlaceCard`. Current MVP strictly **does not depend on venue images** (0 image requests, no scrims, no placeholders, no scraping).
- **Recommendation contract**: Exactly **0–3 truthful results** (0, 1, 2, or 3 places allowed; never padded with fake items).
- **Navigation**: Exact stored Google Maps URLs (`google_maps_url`) only; never guessed or fabricated.

---

## Architecture

```
Neon PostgreSQL (neondb)
       │
       ▼ (serverless HTTP driver)
Repository (src/lib/data/place-repository.ts)
       │
       ▼ (domain normalization)
Adapter (src/lib/data/place-adapter.ts)
       │
       ▼ (Edge Runtime REST API)
Route Handler (src/app/api/discovery/route.ts)
       │
       ▼ (safe UI view model)
PlaceCardModel (src/lib/data/place-card-model.ts)
       │
       ▼ (presentation layer)
DiscoveryResults → ResultList → PlaceCard
```

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4.
- **Backend / API**: Next.js Route Handlers on Edge Runtime (`export const runtime = "edge"`).
- **Database**: Neon PostgreSQL serverless (`@neondatabase/serverless`). `DATABASE_URL` is strictly server-side; zero credential exposure to client bundles.
- **Deployment target**: Cloudflare Workers via OpenNext (`@opennextjs/cloudflare` + Wrangler). Deployment architecture is Cloudflare, **not Vercel**.

---

## Discovery Flow & Runtime Lifecycle

1. **User interaction**: User taps an Intent (`ĂN GÌ?`, `ĐI ĐÂU?`, `Ở ĐÂU?`) → taps a Preference chip.
2. **Mounting**: `<HomePage />` mounts `<DiscoveryResults />` with a stable unique key: `key={`${intent}:${preference}`}`. Keyed mounting guarantees previous results are wiped immediately on new selection.
3. **Fetching**: Calls `GET /api/discovery?intent={INTENT}&locale=vi&preference={ID}` with `cache: "no-store"` and an `AbortController` timeout of 15 seconds.
4. **Lifecycle states**:
   - `idle`: Awaiting user preference selection.
   - `loading`: Reserves 320px vertical space; header and reset button remain accessible.
   - `success`: Renders 1–3 truthful text-first place cards.
   - `empty`: Displays "Chưa có gợi ý phù hợp tiêu chí này" when 0 records match.
   - `error`: Displays generic retryable error ("Chưa tải được địa điểm") with "Thử lại" action.
5. **No fake fallback**: On network failure, database error, or empty response, the system **never falls back to demo data**.

---

## Database & Data Provenance

- **Provider**: **Neon PostgreSQL** (AWS `ap-southeast-1` Singapore, database `neondb`).
- **Data scale**: **500 places**, **3,079 total rows** across 6 core tables:
  - `administrative_units`: 94 wards/communes.
  - `tags`: 36 catalog tags (with vi/en/ko translation pairs).
  - `places`: 500 operational places (145 CAFE, 134 EAT, 94 GO, 127 STAY).
  - `place_tags`: 841 place-to-tag mappings.
  - `tag_translations`: 108 localized tag labels.
  - `place_translations`: 1,500 localized place details (vi, en, ko).
- **Source workbook**: `LA_CA_DB_READY_500_NO_IMAGE_FINAL.xlsx` (SHA-256 `874e7d6d9f5688af85de347051d4fc67a52f44bbd97a249d1f717056f6496bd3`, preserved outside the repository).
- **Database tooling in repo**:
  - DDL Schema: `docs/schema/001_initial_schema.sql` (constraints, indexes, foreign keys, `TIMESTAMP WITHOUT TIME ZONE`).
  - Importer: `scripts/neon-import.py` (reads `DATABASE_URL` dynamically from environment).
  - Offline dry-run validator: `scripts/dry-run-import.py` (validated 3,079/3,079 rows before import).
  - Live audit: `docs/M4A_REAL_MAPPING_AUDIT.md` (SELECT-only audit of tag distributions).

---

## Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Configure your Neon database connection string in `.env.local`:

```env
DATABASE_URL=postgresql://neondb_owner:YOUR_PASSWORD@YOUR_ENDPOINT.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
```

**Security rules**:
- `.env.local` is git-ignored and must **never** be committed.
- `.env.example` contains only placeholder comments and variable names.
- Database credentials must never use a `NEXT_PUBLIC_` prefix.

---

## Local Setup & Development

### Requirements
- Node.js ≥ 20 (developed on Node 24)
- npm

### Installation
```bash
npm install
```

### Running locally
```bash
npm run dev          # http://localhost:3000
npm run lint         # ESLint check
npm run typecheck    # TypeScript compiler check (tsc --noEmit)
```

---

## Validation & Testing

```bash
npm test                                                                        # Run full Vitest suite (169/169 tests PASS)
node node_modules/vitest/vitest.mjs run tests/go-stay-discovery.test.ts          # Focused backend discovery tests
node node_modules/vitest/vitest.mjs run tests/go-stay-frontend.test.tsx         # Focused frontend lifecycle tests
```

### Production Build
```bash
npm run build         # Next.js optimized production build
npm run build:worker  # OpenNext Cloudflare worker bundle (.open-next/)
```

> **Note on curation test**: `tests/curation.test.ts` touches the timestamp of `src/data/curated/curated-places.json` (legacy 86-row seed). To keep the repository clean after running all tests, run:
> ```bash
> git restore --source=HEAD --worktree -- src/data/curated/curated-places.json
> ```

---

## Product Boundaries & Non-Negotiables

See [docs/NON_NEGOTIABLES.md](docs/NON_NEGOTIABLES.md) for complete authoritative guardrails. Key rules:

- **Mobile-first**: Touch targets $\ge 44\text{px}$, responsive layout verified from 320px to 1280px without text clipping or ellipsis of meaningful names.
- **No venue images**: Text-first cards only; no scraping, no photoCount requirements.
- **No fake data / padding**: Truthful 0–3 results; no padding to hit 3 places.
- **Nullable data**: Null ratings, review counts, or descriptions remain null; never converted to 0.
- **Strict safety**: No unapproved package upgrades, no `git add .`, no destructive Git operations (`clean`, `reset`).
- **Out of scope by design**: No user authentication, booking, payments, social feeds, public user reviews, chat bots, or runtime LLM calls.

---

## Documentation Map

- [AGENTS.md](AGENTS.md) — Single instruction authority for all AI agents.
- [docs/NON_NEGOTIABLES.md](docs/NON_NEGOTIABLES.md) — Inviolable product and engineering guardrails.
- [docs/CURRENT_STATE.md](docs/CURRENT_STATE.md) — Current verified operational and Git state.
- [docs/DECISIONS.md](docs/DECISIONS.md) — Master architectural decisions log (Decisions 1–50).
- [docs/HANDOFF_CURRENT.md](docs/HANDOFF_CURRENT.md) — Active handoff specification and boundaries.
- [docs/AGENT_TASK_QUEUE.md](docs/AGENT_TASK_QUEUE.md) — Milestone tracking and status queue.
- [docs/DOCUMENT_AUTHORITY.md](docs/DOCUMENT_AUTHORITY.md) — Document hierarchy and authority mapping.
- [docs/M4B_VERIFICATION.md](docs/M4B_VERIFICATION.md) — Verification report for GO & STAY Neon integration.
- [docs/reference/](docs/reference/) — Detailed architectural specs (Analytics, I18N, Nearby, Notifications, One-Thumb UX).
- [docs/archive/](docs/archive/) — Historical evidence and pre-M0 documentation.

---

## Deployment Status

- OpenNext Cloudflare Worker bundle configured via `@opennextjs/cloudflare` and `wrangler.jsonc`.
- **Production release has NOT been performed**; requires explicit Owner approval and end-to-end smoke verification.

---

## Next Milestones

1. **M4-C (CAFE Product & UI Decision)**: Design UI preference chips and map active Neon tags for CAFE section.
2. **M5 (GPS & Nearby Discovery)**: Wire existing Haversine geo engine (`src/lib/geo`) to user location coordinates with permission prompts and progressive ranking.
