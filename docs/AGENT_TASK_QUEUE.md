# Agent task queue
CURRENT M4-B OVERRIDE — 2026-10-07: M4-B GO & STAY Neon discovery completed and verified; selective local commit authorized. STOP before M5. Earlier milestone entries are historical.
CURRENT_AUTHORITY — 2026-10-07. M4-B verified complete; selective checkpoint authorized. STOP before M5.

ID | milestone | status | owner/current agent | dependencies | exact next action | verification
---|---|---|---|---|---|---
M0 | Protect work + docs + handoff | DONE | Completed | — | — | M0 evidence/validation.json + Git diff check
M0.5 | Selective local checkpoint | DONE | Completed | M0 | — | 40/40 tests; 45-file allowlist; hashes
M1-A | Provider + schema/import planning | DONE | Completed | M0.5 | — | Workbook QA passed; audit complete
M1-C | Neon connection verify + dry-run | DONE | Completed 2026-10-07 | M1-A; user Neon credentials | — | Connection PASS; 3079/3079 dry-run PASS; neondb empty confirmed
M1-D | Schema creation + real import | DONE | Completed 2026-10-07 10:24 | M1-C; valid DATABASE_URL | — | Importer ALL PASS + independent verifier ALL PASS: 6 tables, 3079 rows, 5 FK, 12 indexes, 22 CHECK, 500 unique place IDs, vi/en/ko, all places tagged
M2 | Import/query-back six-table 500 data | DONE (covered by M1-D) | Completed 2026-10-07 | M1-D | — | See M1-D evidence; do not re-import
M3 | Adapter/repository/API + EAT backend | DONE | Takeover verified2026-10-07 | User build-recovery scope | Backend complete; M3-B tracked separately | lint/typecheck115 tests/build/live EAT smoke PASS; see M3A_BUILD_RECOVERY.md
M3-B | EAT frontend + no-image card | DONE | Completed 2026-10-07 | M3-A + user authorization | — | lint/typecheck133tests/build/live3preferences PASS; M3B_VERIFICATION.md
M4-A | Real data mapping audit | DONE | Completed 2026-10-07 | Explicit user authorization | — | SELECT-only live audit; M4A_REAL_MAPPING_AUDIT.md
M4-B | GO & STAY Neon discovery | DONE | Current agent | M4-A + user authorization | STOP for review | lint/typecheck/169 tests/build/live smoke PASS; M4B_VERIFICATION.md
M4-C | CAFE UI & mapping | NOT_STARTED | Unassigned | Explicit user authorization | Product decision on CAFE UI & mapping | Await scope authorization
M5-A | GPS / Nearby readiness audit | DONE | Current agent | User authorization; M4-B | STOP for review; audit report created | docs/M5A_NEARBY_READINESS_AUDIT.md
M5-B | GPS + nearby/server ranking runtime | DONE | Current agent | User authorization; M5-A | STOP for review | lint/typecheck/183 tests/build/live smoke PASS; M5B_VERIFICATION.md
M6-A | Mentor Mobile UX / One-Hand Audit | DONE | Current agent | M5-B | STOP for review | Audit report created; M6A_MENTOR_ONE_HAND_UX_AUDIT.md
M6-B | One-Hand Ergonomics & Bottom Action Bar | DONE | Current agent | User authorization; M6-A | STOP for review | lint/typecheck/196 tests/build/live visual smoke PASS; M6B_VERIFICATION.md
M7-A | i18n Runtime Readiness Audit | DONE | Current agent | User authorization; M6-B | STOP for review; audit report created | docs/M7A_I18N_RUNTIME_READINESS_AUDIT.md
M7-A.1 | i18n UX / Runtime Contract Lock | DONE | Current agent | User authorization; M7-A | STOP for review; contract locked | docs/DECISIONS.md (68–79)
M7-B | VI/EN/KO runtime + Auto & Switcher | DONE | Current agent | User authorization; M7-A.1 | STOP for review | lint/typecheck/221 tests/build/live browser smoke PASS; M7B_VERIFICATION.md
M7-C | Intent Visuals & Language Placement Hotfix | DONE | Current agent | Owner feedback; M7-B | STOP for review | lint/typecheck/225 tests/build/live smoke PASS; M7C_VERIFICATION.md
M8-A | Analytics Readiness Audit & Contract | DONE | Current agent | User authorization; M7-C | STOP for review; audit report created | docs/M8A_ANALYTICS_READINESS_AUDIT.md
M8-A.1 | Analytics Contract Correction & Lock | DONE | Current agent | User authorization; M8-A | STOP for review; contracts locked | docs/M8A_ANALYTICS_READINESS_AUDIT.md & DECISIONS.md (96–105)
M8-A.2 | Final Analytics Contract Patch | DONE | Current agent | User authorization; M8-A.1 | STOP for review; contracts locked | docs/M8A_ANALYTICS_READINESS_AUDIT.md & DECISIONS.md (106–112)
M8-B | Analytics Runtime Implementation | DONE | Current agent | User authorization; M8-A.2 | STOP for review; verification report created | docs/M8B_VERIFICATION.md (34/34 tests PASS; 259 total PASS; live DB verified)
M8-B.1 | Cloudflare Analytics Environment Fix | DONE | Current agent | Owner feedback; M8-B | STOP for review; verification report created | docs/M8B1_CLOUDFLARE_ENV_VERIFICATION.md (APP_ENV lock, wrangler envs, 262/262 tests PASS, live DB verified)
M9-A | Notifications Readiness Audit | DONE | Current agent | User authorization; M8-B.1 | STOP for review; audit report created | docs/M9A_NOTIFICATIONS_READINESS_AUDIT.md
M9-A.1 | Reminder MVP Contract Lock | DONE | Current agent | User authorization; M9-A | STOP for review; contract locked | docs/M9A_NOTIFICATIONS_READINESS_AUDIT.md & DECISIONS.md (133–142)
M9-B | Calendar Reminder MVP | NOT_STARTED | Unassigned | User authorization; M9-A.1 | Follow master and canonical spec; no early execution | Layer tests + applicable lint/typecheck/build; no invented PASS
M11 | Time/location-aware NOW if supported | NOT_STARTED | Unassigned | User authorization; M10 | Follow master and canonical spec; no early execution | Layer tests + applicable lint/typecheck/build; no invented PASS
M12 | Full regression + responsive/preview | NOT_STARTED | Unassigned | User authorization; M11 | Follow master and canonical spec; no early execution | Layer tests + applicable lint/typecheck/build; no invented PASS
M13 | Release report; approval before release | NOT_STARTED | Unassigned | User authorization; M12 | Follow master and canonical spec; no early execution | Layer tests + applicable lint/typecheck/build; no invented PASS

Checkpoint completed: `38c237a2c3976f60452227f28a01f6270f6fbdb4` — `feat: add Neon-backed discovery API`,14 exact paths.16 unrelated staged renames retained. Historical M3-A checkpoint; current M3-B scope supersedes that stopping point.

M3-B checkpoint DONE: `e39c7de65fc413f6561e0069642ba58f6bb95f0e` — `feat: connect EAT frontend to Neon discovery`;13 paths only. M4 is not authorized.

## Checkpoint-only takeover — 2026-10-07T12:31:11+07:00
Real M3-B commit: `e39c7de65fc413f6561e0069642ba58f6bb95f0e`. Verified exact13 allowlisted paths;16 pre-existing staged renames unchanged. Source/tests match validated isolated copy (41 files excluding the deliberately regenerated curated copy), so no tests/build rerun and no fresh runtime PASS claim. Existing validation evidence retained:133/133 tests, lint/typecheck/build and documented live/responsive checks. No source edits, DB operations, push/merge/deploy or M4 work. Final Git intentionally retains16 staged renames,11 inherited unstaged modifications plus4 post-commit authority updates, and7 unrelated untracked files. STOP before M4; await explicit authorization.

## M4-A read-only audit completed
Report: [M4A_REAL_MAPPING_AUDIT](M4A_REAL_MAPPING_AUDIT.md). HEAD e39c7de65fc413f6561e0069642ba58f6bb95f0e unchanged. SELECT-only live audit: CAFE145/GO94/STAY127 active+OPERATIONAL; unique linked active tags2/20/16. All36 catalog tags with vi/en/ko labels, per-section counts/percentages, actual samples per linked tag, UI inventory, SQL mapping counts and semantics/ranking caveats documented. Five DIRECT candidates SAFE by count: GO PHOTO16,NATURE26,ENTERTAINMENT8; STAY NEAR_BEACH19,QUIET8. Ambiguous: GO BEACH/SCENIC (3/19/OR20); STAY CENTRAL16 and DATE10 need label/meaning decision. No current CAFE UI/chips; GENERAL145 is availability only, not a new preference. CAFE mood tags absent; BUDGET absent globally. Target anomaly: CAFE ID138 has primary_type=bar; extra EAT conflicts4,56,108,259,416 documented without edits. featured allfalse; rating/reviews null2/145,5/94,1/127. No application/DB/config/package edits, no commit/push/deploy/tests/build. Evidence/scripts/query outputs under sibling M4A_EVIDENCE_2026-10-07. Previous handoff bytes backed up there.16 staged renames and all unrelated hashes unchanged.15 existing modified tracked paths remain;7 old untracked files preserved plus1 new report. STOP: review report, resolve ambiguous mappings/CAFE UI and type conflict before explicit M4-B instruction. Do not implement M4-B automatically.

## M4-B GO & STAY Neon discovery completed — 2026-10-07
Report: [M4B_VERIFICATION](M4B_VERIFICATION.md).
M4-B connected GO and STAY to live Neon discovery with verified tag mappings; DiscoveryResults generalized; STAY chips updated; EAT preserved; CAFE disabled. All validation (lint, typecheck, 169/169 tests, build, 8 GO/STAY + 3 EAT live smoke, responsive 320–1280px) ALL PASS. Selective checkpoint completed: `f319ae42825eea540281c499486a43d7131f7c8f` — `feat: connect GO and STAY to Neon discovery`.
- **Reconciliation summary**: M4-B DONE; commit `f319ae42825eea540281c499486a43d7131f7c8f`; EAT/GO/STAY use Neon; CAFE NOT_STARTED; next milestone requires explicit authorization. STOP before M5.

## M5-A / M5-A.1 GPS / Nearby readiness audit & contract lock — 2026-10-08
Report: [M5A_NEARBY_READINESS_AUDIT](M5A_NEARBY_READINESS_AUDIT.md).
- Geo helpers: Pure TS Haversine in `src/lib/geo/`; 18/18 vitest tests PASS; 0 runtime dependencies.
- DB coordinates: 500/500 places valid, non-null, unique coordinates; zero nulls/invalid.
- Candidate retrieval contract: M5-B repository must bypass pre-geo LIMIT 3 for nearby mode to retrieve all candidates.
- Distance precision: Full floating-point precision for radius boundary filtering and sorting; 1 decimal only for final display.
- GPS accuracy: `accuracy <= 1000m` uses Nearby; `> 1000m` warns and falls back to all-city discovery.
- Radius escalation locked: Strictly `evaluate <= 1km (>=3 ? R=1) -> evaluate <= 3km (>=3 ? R=3) -> evaluate <= 5km (R=5)`; max 3 places, no fake padding.
- Nearby ranking locked: `distanceRawKm ASC, featured DESC, review_count DESC NULLS LAST, rating DESC NULLS LAST, id ASC`.
- Empty state: Truthful 0–2 results; 0 results shows `"Không tìm thấy địa điểm phù hợp trong 5 km."` + CTA `"Xem trên toàn Đà Nẵng"`.
- Privacy contract: No app logging, no analytics, no DB/storage persistence, no URL GPS leakage, no coordinate echo in API response.
- Audit & contract lock complete.

## M5-B Nearby Discovery Completed — 2026-10-08
Report: [M5B_VERIFICATION](M5B_VERIFICATION.md).
M5-B implemented Nearby Discovery for EAT, GO, and STAY intents connected to live Neon PostgreSQL data; dual-path API routing with coupled lat/lng validation; candidate retrieval bypassing pre-geo LIMIT 3; pure TS geo engine with strict 1 -> 3 -> 5 km radius expansion, full float precision, tie-breaking, 1-decimal display formatting; user-driven Geolocation UX with >=44px "Gần tôi" action, 8s timeout, accuracy <= 1000m guard, fallback messages, retry action, empty 5 km state with CTA "Xem trên toàn Đà Nẵng"; PlaceCard distance badge; citywide discovery regression 100% preserved. All validation (lint PASS, typecheck PASS, 183/183 non-mutating tests PASS, build PASS, live Neon API smoke PASS across all test scenarios, responsive checks 320–768px PASS) ALL PASS.
- **Reconciliation summary**: M5-B DONE; selective local commit authorized; STOP before M6.

## M6-A Mentor Mobile UX / One-Hand Audit Completed — 2026-10-08
Report: [M6A_MENTOR_ONE_HAND_UX_AUDIT](M6A_MENTOR_ONE_HAND_UX_AUDIT.md).
- One-hand ergonomics verdict: FAIL.
- Issues documented: Primary controls ("Gần tôi", "Đổi lựa chọn") anchored at the very top of the mobile viewport ($y \approx 24\text{px}$) in the Hard Reach Zone; reordering intent cards on tap causes severe layout shift; lack of a fixed/sticky bottom action bar forces users to scroll all the way back up to the top.
- Proposed M6-B repairs: Sticky bottom action bar for primary actions, intent position stabilization, safe-area padding. Zero source modifications in M6-A.
- STOP for user review before M6-B.

## M6-B One-Hand Mobile UX Implementation Completed — 2026-10-08
Report: [M6B_VERIFICATION](M6B_VERIFICATION.md).
- Intent position stability: Intent cards (`NOW`, `EAT`, `GO`, `STAY`) permanently maintain DOM order. No reordering on tap; tapping STAY keeps STAY at slot 4.
- In-place accordion: `PreferencePanel` expands directly beneath the selected intent card in-place (`#preference-panel-active`).
- Hero stability: `<Hero />` remains mounted throughout intent selection (`selectedPreference === null`), eliminating the 180px upward layout snap. Jumpy auto-scroll on intent tap eliminated.
- Persistent mobile action bar: Created `BottomActionBar.tsx` fixed at bottom (`fixed bottom-0`), safe-area aware (`env(safe-area-inset-bottom)`), $\ge 44\text{px}$ touch targets.
- State-aware actions: Citywide ("Gần tôi" + "Đổi lựa chọn"), Nearby active ("Toàn Đà Nẵng" + "Đổi lựa chọn"), GPS error/fallback ("Thử lại" + "Đổi lựa chọn"), Nearby empty ("Xem toàn Đà Nẵng" + "Đổi lựa chọn"), Requesting ("Đang định vị…" disabled).
- Zero duplicate controls: Removed duplicate top navigation buttons in `ResultList.tsx`.
- Content clearance: Added `pb-28 sm:pb-32 pb-[calc(7rem+env(safe-area-inset-bottom,0px))]` ensuring final card and Google Maps CTA are 100% visible and unobscured.
- All validation (lint PASS, typecheck PASS, 196/196 tests PASS across 11 suites including 13 new one-hand UX tests, build PASS in 4.4s, browser visual verification 320–768px PASS) ALL PASS. Scroll-back-to-control = 0.
- Reconciliation summary: M6-B DONE; selective local commit authorized; STOP for user review.
## M7-A i18n Runtime Readiness Audit Completed — 2026-10-08
Report: [M7A_I18N_RUNTIME_READINESS_AUDIT](M7A_I18N_RUNTIME_READINESS_AUDIT.md).
- Status: AUDIT ONLY — COMPLETED. Zero modifications to `src/` or `tests/`. Database READ-ONLY verification only.
- Existing i18n foundation: Pure BCP-47 resolver in `src/lib/i18n/locales.ts` and 27 typed keys in `src/lib/i18n/messages.ts` with 22 vitest tests passing in `tests/i18n.test.ts`. Zero active runtime usage in frontend components.
- Database translations (Neon): 500/500 places (100%) have `vi`, `en`, and `ko` rows in `place_translations` (1,500 total rows); venue proper names are identical across languages for Da Nang authenticity, while `primary_type_label` is fully localized. 36/36 tags (100%) have `vi`, `en`, and `ko` rows in `tag_translations` (108 total rows).
- Discovery API: `GET /api/discovery` accepts `locale` (`vi`, `en`, `ko`, default: `vi`); invalid returns 400. Repository joins requested locale with Vietnamese fallback.
- Frontend audit: 45+ user-facing strings hardcoded in Vietnamese identified; `DiscoveryResults.tsx` hardcodes `locale: "vi"`; `<html lang="vi">` in `layout.tsx` is static.
- Architecture locked:
  - Precedence: Manual user choice (persisted in `localStorage` under `laca.ui-locale.v1`) > browser `navigator.languages` > default `vi`.
  - Hydration safety: Server renders `vi`, client resolves browser/stored choice in `useEffect` to prevent SSR mismatch.
  - Switcher placement: Top utility bar / header (not in bottom thumb zone) to protect M6-B `BottomActionBar` ergonomics.
  - Text expansion risks: Mitigation planned for 320px viewport in `BottomActionBar`.
- Reconciliation summary: M7-A DONE; selective local commit authorized; STOP for user review before M7-B.
## M7-A.1 i18n UX / Runtime Contract Lock Completed — 2026-10-08
Report: [M7A_I18N_RUNTIME_READINESS_AUDIT](M7A_I18N_RUNTIME_READINESS_AUDIT.md) & [DECISIONS](DECISIONS.md) (Decisions 68–79).
- Status: CONTRACT LOCK ONLY — COMPLETED. Zero modifications to `src/` or `tests/`. Zero DB mutations.
- 12 Decisions Locked: Precedence, persistence, reachable lower Home switcher opening bottom sheet / compact selector (never in BottomActionBar, not in top header), state preservation, realistic layout stability, hydration safety, HTML lang, translation boundaries, DB fallback, number formatting, NOW boundaries, visual acceptance on 320/390/430px.
- Reconciliation summary: M7-A.1 DONE; selective local commit authorized; STOP for user review before M7-B.

## M7-B VI / EN / KO Runtime i18n Implementation Completed — 2026-10-08
Report: [M7B_VERIFICATION](M7B_VERIFICATION.md).
- Status: IMPLEMENTATION & VERIFICATION COMPLETE — ALL PASS.
- Deliverables: Runtime `LocaleProvider` with auto-detection and `laca.ui-locale.v1` persistence, `LanguageSelector` bottom sheet in reachable zone, dynamic API locale (`locale=<activeLocale>`) with Neon DB translations, 45+ localized UI strings in `messages.ts`, dynamic `document.documentElement.lang`, presentation `Intl.NumberFormat`.
- Preserved Contracts: M6-B one-hand UX (`BottomActionBar`, in-place accordion, intent order `[NOW, EAT, GO, STAY]`), M5-B Nearby (1 $\rightarrow$ 3 $\rightarrow$ 5 km escalation, accuracy $\le 1000\text{m}$, 0–3 truthful results, exact Maps URLs, no images), CAFE disabled (400), NOW sample timeline, DB unchanged.
- Validation: 12/12 test suites, 221/221 tests PASS (`vitest`). Lint PASS (`0 warnings, 0 errors`). Typecheck PASS (`tsc --noEmit`). Build PASS. Live browser verification across 320px, 390px, 430px PASS.
- Reconciliation summary: M7-B DONE; selective local commit authorized; STOP for user review before M8.

## M7-C Intent Visuals & Language Placement Hotfix Completed — 2026-10-08
Report: [M7C_VERIFICATION](M7C_VERIFICATION.md).
- Status: HOTFIX IMPLEMENTATION & VERIFICATION COMPLETE — ALL PASS.
- Issue 1 (Broken Intent Visuals): Replaced fragile `<Image>` calls with inline vector icons (`lucide-react`: `Utensils`, `Compass`, `Bed`, `Zap`), tailored gradient containers, and emoji badges for all 4 intents. Eliminated broken image states and alt text leakage. No venue images reintroduced.
- Issue 2 (Footer Language Trigger Placement): Moved `LanguageSelector` from floating middle Home to horizontal footer utility row (`LA CÀ ĐÀ NẴNG` on the left, `[ 🌐 Tiếng Việt ]` / `[ 🌐 English ]` / `[ 🌐 한국어 ]` on the right). Preserved $\ge 44\text{px}$ touch targets, one-hand reachability, and zero horizontal clipping across 320–430px.
- Next.js "N" Dev Indicator: Clarified as Next.js built-in development tools overlay (`nextjs-portal`), rendered only in `NODE_ENV === "development"` and automatically omitted in production builds. Preserved per non-negotiable instruction.
- Validation: 13/13 test suites, 225/225 tests PASS (`vitest`). Lint PASS (`0 warnings, 0 errors`). Typecheck PASS (`tsc --noEmit`). Build PASS (production build 4.9s). Dataset clean.
- Reconciliation summary: M7-C DONE; selective local commit authorized; STOP for user review.

## M8-A Analytics Readiness Audit Completed — 2026-10-08
Report: [M8A_ANALYTICS_READINESS_AUDIT](M8A_ANALYTICS_READINESS_AUDIT.md).
- Status: AUDIT & CONTRACT DESIGN ONLY — COMPLETED. Zero runtime modifications, zero database mutations, zero package installations.
- Existing Foundation: 0 lines of analytics runtime in `src/`, 0 tracking dependencies in `package.json`, 0 analytics tables in Neon PostgreSQL.
- Product Questions: Defined 12 core product metrics (intent popularity, preference demand, completion rate, tap efficiency $\le 3$ taps, Nearby adoption/radius/zero-result rate, fallback adoption, top Maps places, position CTR, language distribution, auto vs manual mode).
- Event Vocabulary: 11 minimal high-signal events (`session_started`, `home_viewed`, `intent_selected`, `preference_selected`, `results_shown`, `nearby_requested`, `nearby_resolved`, `nearby_failed`, `citywide_selected`, `maps_clicked`, `language_changed`).
- Strict Privacy & GPS Contract: Strict prohibition against raw latitude, longitude, raw accuracy in meters, IP addresses, PII, fingerprinting, and URL coordinate leakage. Only categorized radius (1, 3, 5 km) and boolean `is_nearby` permitted.
- Session Identity: Ephemeral session ID in `sessionStorage` (auto-cleared on tab close). Zero persistent device fingerprinting.
- Recommended Provider: Option A (Internal Neon Analytics via Next.js `/api/analytics` route) recommended for MVP ($0 cost, 100% first-party sovereign, ad-blocker immune, custom SQL funnel queries).
- Reconciliation summary: M8-A DONE; selective docs-only commit authorized; STOP for user review before M8-B.

## M8-A.1 Analytics Contract Correction & Lock Completed — 2026-10-08
Report: [M8A_ANALYTICS_READINESS_AUDIT](M8A_ANALYTICS_READINESS_AUDIT.md) & [DECISIONS](DECISIONS.md) (Decisions 96–105).
- Status: READ-ONLY AUDIT & CONTRACT LOCK ONLY — COMPLETED. Zero runtime modifications, zero database mutations (`NO CREATE TABLE`, `NO INSERT/UPDATE/DELETE`), zero migrations run, zero package installations.
- Verified Neon live catalog: 6 tables, 3,079 rows (`places`: 500, `place_translations`: 1,500, `place_tags`: 841, `tags`: 36, `tag_translations`: 108, `administrative_units`: 94). DOC/DB drift resolved.
- Canonical naming locked (17 columns, no `metadata JSONB`).
- Journey lifecycle locked (`journey_id` per search flow, resets on "Đổi lựa chọn" / Home return).
- Ephemeral tab lifetime session locked (`sessionStorage`).
- Deduplication locked: locale switch emits `language_changed` only, never `results_shown`.
- NOW excluded from place discovery conversion funnels.
- Place ID is positive integer snapshot (no FK constraint).
- Public endpoint security: Zod allowlist, 2 KB limit, parameterized SQL, indicative product telemetry disclaimer.
- Database change strategy: tracked migration `docs/schema/002_analytics_events.sql` for M8-B.
- Zero source code modifications, zero DB mutations.
- Next action: STOP for Owner review.

## M8-A.2 Final Analytics Contract Patch Completed — 2026-10-08
Report: [M8A_ANALYTICS_READINESS_AUDIT](M8A_ANALYTICS_READINESS_AUDIT.md) & [DECISIONS](DECISIONS.md) (Decisions 106–112).
- Status: FINAL CONTRACT PATCH ONLY — COMPLETED.
- Event count: Exactly 11 allowed events locked.
- Timestamp: `occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW()`, server-generated in UTC; client payload does not send timestamp.
- Environment: Server-derived (`preview` | `production`) from runtime config; client does not send.
- Payload validation: 14 client-allowed fields; Zod `.strict()` rejects server-owned fields (`id`, `occurred_at`, `environment`).
- GPS privacy & cost wording: Reconciled with non-absolute, realistic language.
- Final canonical DDL locked with TIMESTAMPTZ, defaults, and 4 indexes.
- M8-B readiness: YES.
- Next action: STOP for Owner review.

## M8-B First-Party Product Analytics Implementation Completed — 2026-10-08
Report: [M8B_VERIFICATION](M8B_VERIFICATION.md).
- Status: RUNTIME IMPLEMENTATION & LIMITED NEON MIGRATION — COMPLETED & VERIFIED.
- Migration applied: `docs/schema/002_analytics_events.sql` created table `analytics_events` and 4 indexes (`occurred_at`, `session_id`, `journey_id`, `name_env`).
- Database safety: 6 existing content tables verified at 3,079 total rows before and after migration. Initial `analytics_events` count = 0.
- Timezone contract: UTC storage with `TIMESTAMPTZ NOT NULL DEFAULT NOW()`; presentation queries use `AT TIME ZONE 'Asia/Ho_Chi_Minh'`.
- Telemetry modules: `types.ts`, `validator.ts` (Zod `.strict()`, rejecting unknown/server-owned/raw GPS keys), `db.ts` (server environment derivation, parameterized SQL), `route.ts` (Edge handler, 2 KB limit, HTTP 202/400/413), `client.ts` (non-blocking `sendBeacon`/`fetch`, dev/test no-op, session & journey stores, meaningful tap counter).
- Telemetry wired: `page.tsx` (`session_started`, `home_viewed`, `intent_selected`, `preference_selected`, journey reset), `DiscoveryResults.tsx` (`results_shown` locale-deduped, `nearby_requested`, `nearby_resolved`, `nearby_failed`, `citywide_selected`), `PlaceCard.tsx` (`maps_clicked`), `LanguageSelector.tsx` (`language_changed`).
- Automated tests: 14 test suites, 259 total tests ALL PASS (`tests/analytics.test.tsx`: 34/34 PASS).
- Lint, typecheck, build: `npm run lint` (0 warnings, 0 errors), `npm run typecheck` (0 errors), `npm run build` (success). Dataset clean (0 diff).
- Live Neon DB verification: API ingest tested, SELECT inspected, 5 analytical queries executed, test row deleted (0 rows), 6 content tables intact (3,079 rows).
- Scope boundaries: Zero regressions on M6 one-hand UX or M7 i18n; CAFE inactive; NOW static itinerary preserved; no dashboard, no notifications, no deploy.
- Next action: STOP for Owner review.

## M8-B.1 Cloudflare Analytics Environment Fix Completed — 2026-10-08
Report: [M8B1_CLOUDFLARE_ENV_VERIFICATION](M8B1_CLOUDFLARE_ENV_VERIFICATION.md).
- Status: BLOCKED ISSUE RESOLVED — VERIFIED & COMPLETED.
- Root Cause: Cloudflare preview & production both run in `NODE_ENV=production`. Fixed non-deterministic classification by locking canonical `APP_ENV` (`preview` | `production`).
- Server Environment Resolver: `resolveServerEnvironment()` in `src/lib/analytics/db.ts` prioritizes `APP_ENV`. Invalid/unrecognized values fail safely to `"preview"` (never guesses production). Removed legacy `VERCEL_ENV`. Evaluates `IS_PREVIEW` before fallbacks. Dev/test safely defaults to `"preview"`.
- Wrangler Config: Configured top-level `vars: { "APP_ENV": "production" }`, `env.preview: { "name": "la-ca-da-nang-preview", "vars": { "APP_ENV": "preview" } }`, and `env.production: { "vars": { "APP_ENV": "production" } }` in `wrangler.jsonc`.
- Deployment Scripts: Added `npm run deploy:preview` (`opennextjs-cloudflare build && opennextjs-cloudflare deploy --env preview`). Preserved `npm run deploy` for production.
- Environment Documentation: Added `APP_ENV=preview` (allowed: `preview | production`) to `.env.example`.
- Automated & Live Verification: Added unit tests in `tests/analytics.test.tsx` (14 suites, 262/262 PASS). Verified live preview event ingest against Neon: stored as `environment = 'preview'`, deleted cleanly (0 rows remaining). Content tables untouched at 3,079 rows.
- Validation: Lint PASS (0 errors), Typecheck PASS, Vitest PASS (262/262), Build PASS.
- M8-B Ready for Final Verification: YES.
- Next action: STOP for Owner review.

## M9-A Notifications Readiness Audit Completed — 2026-10-08
Report: [M9A_NOTIFICATIONS_READINESS_AUDIT](M9A_NOTIFICATIONS_READINESS_AUDIT.md).
- Status: READ-ONLY AUDIT & ARCHITECTURE CONTRACT COMPLETE.
- Existing Foundation: 0 notification API calls in `src/`, 0 service workers, 0 PWA manifests, 0 push packages in `package.json`, 0 reminder tables in Neon DB, 0 cron triggers in `wrangler.jsonc`.
- Core Use Case: "Nhắc tôi trước khi đi" (opt-in reminder, 30-minute lead time, zero cold prompt on load, zero marketing spam).
- Missing Time Gap: Places in DB store no schedule/operating times. Explicit visit time selector (`scheduled_visit_at`) is strictly required.
- Mobile Platform Constraints: Regular iOS Safari tabs DO NOT support Notification API / Web Push without Home Screen PWA installation (iOS 16.4+). Inactive mobile browser tabs terminate client timers when suspended.
- Recommended Architecture: RFC 5545 `.ics` Calendar Reminder Export with 30-minute advance `VALARM`. Requires zero Cloudflare crons, zero Neon DB bloat, and preserves privacy.
- Analytics Safeguard: Verified 11-event M8 schema remains 100% intact; draft extension events proposed for separate future authorization.
- Scope Boundaries: Zero modifications to `src/` or `tests/`; zero DB mutations; CAFE inactive; NOW sample timeline decoupled; no deploy.
- Next action: STOP for Owner review.

## M9-A.1 Reminder MVP Contract Lock Completed — 2026-10-08
Report: [M9A_NOTIFICATIONS_READINESS_AUDIT](M9A_NOTIFICATIONS_READINESS_AUDIT.md) & [DECISIONS](DECISIONS.md) (Decisions 133–142).
- Status: CONTRACT LOCK ONLY — COMPLETED. Zero source modifications, zero DB mutations.
- Canonical Feature Identity: "Nhắc tôi" $\rightarrow$ Calendar Reminder Export (`.ics`). Prohibited describing as push or browser notification.
- Permission Removed: M9-B does NOT invoke `Notification.requestPermission()`, `new Notification()`, or `PushManager`. Permission states removed from M9-B scope and test suites.
- Delivery Guarantee Contract: RFC 5545 `.ics` with 30-minute `VALARM`. Prohibited claiming "100% reliable" or guaranteed delivery.
- Visit Time Semantics: `scheduled_visit_at`. UI asks: *"Bạn muốn đến đây lúc nào?"*. Alarm triggers 30m before visit (`TRIGGER:-PT30M`).
- Locked Presets: `1 giờ nữa (+1h)`, `2 giờ nữa (+2h)`, `4 giờ nữa (+4h)`, and `Chọn ngày & giờ`. Custom selection must be `> now + 30 minutes`.
- Timezone: `Asia/Ho_Chi_Minh` (GMT+7) communicated in UI; converted to UTC `Z` for ICS export.
- Storage Contract: `localStorage` key `laca.reminders.v1` as export metadata log; no `sent`/`delivered`/`dismissed` statuses.
- Cancellation Semantics: Prohibited "Huỷ thông báo". M9-B focuses purely on creation/export.
- Technical & Data Boundaries: 100% client-side frontend code. Zero Neon tables, zero Cloudflare crons, zero service workers, zero VAPID keys. Verified 11-event M8 analytics schema and 262 existing tests 100% untouched.
- M9-B Readiness: YES — Architecture and contract locked. STOP for Owner review before M9-B implementation.

