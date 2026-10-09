# Current state
CURRENT M4-B OVERRIDE — 2026-10-07: M4-B GO & STAY Neon discovery completed and verified; selective local commit authorized. STOP before M5. Earlier milestone scope/status below is historical where superseded.
CURRENT_AUTHORITY — 2026-10-07. M4-B connects GO and STAY to live Neon discovery; DiscoveryResults generalized; STAY chips updated (Trung tâm, Hẹn hò); EAT regression preserved; CAFE disabled. Supersedes earlier M4-A audit-only status.

## Git
Branch phase-2a-deploy; parent38c237a2c3976f60452227f28a01f6270f6fbdb4. M3-B local checkpoint completed: e39c7de65fc413f6561e0069642ba58f6bb95f0e, message feat: connect EAT frontend to Neon discovery; exact13 paths verified.16 pre-existing staged renames and unrelated modified/untracked work retained. No push/merge/deploy or branch switch.

## EAT runtime
Home EAT -> existing preference -> GET /api/discovery -> Neon -> model -> ResultList/no-image PlaceCard. No EAT demo fallback. States idle/loading/success/empty/error, retry and15s timeout; selection reset/unmount abort and late-response guard.0–3 results, no padding. Only verified an_ngon/general,dac_san/SPECIALTY,hen_ho/DATE.
Cards render actual API name/typeLabel/area/address/tags, nullable rating/reviews/description, exact Maps href. No venue images/place_media dependency. Static hero/intent artwork remains. GO/STAY data still demo; NOW unchanged. No other section DB integration or runtime scope expansion.

## Validation
Fresh lint/typecheck PASS;133/133 tests PASS in isolated copy; build PASS23.773s. Live browser all3 EAT preferences passed (counts3/3/2), names/Maps match API, independently matched Neon SELECT. No DB writes or secret exposure;19 client files scanned. Responsive DOM320–1280 and representative visual screenshots; no text-clamp PASS shortcut. See M3B_VERIFICATION.md for precise coverage and limits.

## DB and boundaries
Neon neondb six tables3079rows verified previously; not re-imported/recounted this turn. Workbook SHA256874e7d6d9f5688af85de347051d4fc67a52f44bbd97a249d1f717056f6496bd3 unchanged. M3-A backend/package/schema unchanged. No full one-thumb/i18n/GPS/analytics/notifications/deploy. Dev stopped.

## Exact next
STOP for checkpoint review. Only after explicit M4 authorization: verify Git and inspect CAFE/GO/STAY real tag/preference coverage before proposing mappings or enabling sections. Preserve existing dirty/staged work.

## Checkpoint-only takeover — 2026-10-07T12:31:11+07:00
Real M3-B commit: `e39c7de65fc413f6561e0069642ba58f6bb95f0e`. Verified exact13 allowlisted paths;16 pre-existing staged renames unchanged. Source/tests match validated isolated copy (41 files excluding the deliberately regenerated curated copy), so no tests/build rerun and no fresh runtime PASS claim. Existing validation evidence retained:133/133 tests, lint/typecheck/build and documented live/responsive checks. No source edits, DB operations, push/merge/deploy or M4 work. Final Git intentionally retains16 staged renames,11 inherited unstaged modifications plus4 post-commit authority updates, and7 unrelated untracked files. STOP before M4; await explicit authorization.

## M4-A read-only audit completed
Report: [M4A_REAL_MAPPING_AUDIT](M4A_REAL_MAPPING_AUDIT.md). HEAD e39c7de65fc413f6561e0069642ba58f6bb95f0e unchanged. SELECT-only live audit: CAFE145/GO94/STAY127 active+OPERATIONAL; unique linked active tags2/20/16. All36 catalog tags with vi/en/ko labels, per-section counts/percentages, actual samples per linked tag, UI inventory, SQL mapping counts and semantics/ranking caveats documented. Five DIRECT candidates SAFE by count: GO PHOTO16,NATURE26,ENTERTAINMENT8; STAY NEAR_BEACH19,QUIET8. Ambiguous: GO BEACH/SCENIC (3/19/OR20); STAY CENTRAL16 and DATE10 need label/meaning decision. No current CAFE UI/chips; GENERAL145 is availability only, not a new preference. CAFE mood tags absent; BUDGET absent globally. Target anomaly: CAFE ID138 has primary_type=bar; extra EAT conflicts4,56,108,259,416 documented without edits. featured allfalse; rating/reviews null2/145,5/94,1/127. No application/DB/config/package edits, no commit/push/deploy/tests/build. Evidence/scripts/query outputs under sibling M4A_EVIDENCE_2026-10-07. Previous handoff bytes backed up there.16 staged renames and all unrelated hashes unchanged.15 existing modified tracked paths remain;7 old untracked files preserved plus1 new report. STOP: review report, resolve ambiguous mappings/CAFE UI and type conflict before explicit M4-B instruction. Do not implement M4-B automatically.

## M4-B GO & STAY Neon Discovery Integration Completed — 2026-10-07
Report: [M4B_VERIFICATION](M4B_VERIFICATION.md).
- GO mappings connected to Neon tags: `chup_anh_dep` -> `PHOTO`, `thien_nhien` -> `NATURE`, `vui_choi` -> `ENTERTAINMENT`, `bien_ngam_canh` -> `BEACH | SCENIC` (20 eligible places).
- STAY mappings connected to Neon tags: `gan_bien` -> `NEAR_BEACH`, `yen_tinh` -> `QUIET`, `gan_trung_tam` -> `CENTRAL` ("Trung tâm"), `cap_doi` -> `DATE` ("Hẹn hò").
- Discovery component generalized from `EatDiscoveryResults.tsx` to `DiscoveryResults.tsx` for EAT, GO, STAY with full lifecycle, 15s timeout, stale request protection, no demo fallback.
- EAT regression preserved; CAFE remains disabled (400 INTENT_NOT_AVAILABLE).
- Validation: lint PASS, typecheck PASS, 169/169 tests PASS (including 21 new GO/STAY frontend tests), build PASS (6.9s).
- Live smoke with Neon: 8 GO/STAY + 3 EAT flows HTTP 200 matching independent SQL; 0 secret leaks; 400 for CAFE/invalid.
- Responsive & visual: viewports 320–1280 inspected; long names wrap cleanly without clipping; >=44px CTAs; 0 venue images.
- Unrelated 16 staged renames, modified tracked, and untracked files preserved.
- Local selective checkpoint completed: `f319ae42825eea540281c499486a43d7131f7c8f` — `feat: connect GO and STAY to Neon discovery`.
- **Reconciliation summary**: M4-B DONE; commit `f319ae42825eea540281c499486a43d7131f7c8f`; EAT/GO/STAY use Neon; CAFE NOT_STARTED; next milestone requires explicit authorization. STOP.

## M5-A / M5-A.1 GPS / Nearby Readiness Audit & Contract Lock — 2026-10-08
Report: [M5A_NEARBY_READINESS_AUDIT](M5A_NEARBY_READINESS_AUDIT.md).
- Geo helpers: Pure TS Haversine in `src/lib/geo/` (18/18 vitest tests PASS).
- DB coordinates: 500/500 places in Neon valid, non-null, unique coordinates.
- Candidate retrieval contract: M5-B must bypass pre-geo LIMIT 3 in repository for Nearby mode to evaluate all candidates before distance filtering.
- Distance precision: Full floating-point precision for radius boundary filtering and sorting; 1 decimal only for final display.
- GPS accuracy: `accuracy <= 1000m` uses Nearby; `> 1000m` warns and falls back to all-city discovery.
- Radius escalation locked: Strictly `evaluate <= 1km (>=3 ? R=1) -> evaluate <= 3km (>=3 ? R=3) -> evaluate <= 5km (R=5)`; max 3 places, no fake padding.
- Nearby ranking locked: `distanceRawKm ASC, featured DESC, review_count DESC NULLS LAST, rating DESC NULLS LAST, id ASC`.
- Empty state: Truthful 0–2 results; 0 results shows `"Không tìm thấy địa điểm phù hợp trong 5 km."` + CTA `"Xem trên toàn Đà Nẵng"`.
- Privacy contract: No app logging, no analytics, no DB/storage persistence, no URL GPS leakage, no coordinate echo in API response.
- Status: Docs-only contract lock.

## M5-B Nearby Discovery Implementation Completed — 2026-10-08
Report: [M5B_VERIFICATION](M5B_VERIFICATION.md).
- Nearby Discovery implemented for EAT, GO, STAY intents connected to live Neon PostgreSQL data.
- API contract: `GET /api/discovery` with paired optional `lat`/`lng`; single/invalid returns 400 `INVALID_PARAMETER`; omitting both keeps original citywide discovery. Response includes `meta.radiusKm` (1 | 3 | 5) and `meta.nearby: true` without echoing user coordinates.
- Repository: `findNearbyCandidateRows()` fetches all active operational candidates matching section and tag filters without pre-geo `LIMIT 3`.
- Geo Engine (`src/lib/geo/nearby-engine.ts`): Strictly evaluates `<= 1 km` (if `>= 3` -> `R = 1`); else evaluates `<= 3 km` (if `>= 3` -> `R = 3`); else evaluates `<= 5 km` (`R = 5`). Full float precision for radius checks & sorting; tie-breaking by `distanceRawKm ASC, featured DESC, review_count DESC, rating DESC, id ASC`; distance formatted to 1 decimal place only for UI display; candidates deduplicated by ID.
- Geolocation UX: "Gần tôi" action button (`min-h-[44px]`, never auto-triggered on page load); 8s timeout; accuracy guard (`accuracy <= 1000m` -> Nearby, `> 1000m` -> warning message + citywide fallback + retry); error states (`denied`, `unavailable`, `timeout`, `inaccurate`) gracefully fall back to citywide; dedicated empty state within 5 km with CTA `"Xem trên toàn Đà Nẵng"`.
- PlaceCard: Renders distance badge (`0,8 km`) when `distanceKm` is present; omitted when citywide. Text-first layout, exact Maps URL, and no venue images preserved.
- Validation: Lint PASS (`0 warnings, 0 errors`), typecheck PASS (`tsc --noEmit` code 0), 183/183 non-mutating tests PASS across 10 suites, build PASS (Next.js 15.5.27 compiled in 21.5s), live Neon API smoke PASS (Hải Châu EAT an_ngon R=1, EAT dac_san R=5 1 result, GO thien_nhien R=5 0 results, STAY gan_trung_tam R=1, Mỹ Khê STAY gan_bien R=3; citywide regression 200; invalid 400), responsive checks across 320, 390, 430, 768px PASS.
- Reconciliation summary: M5-B DONE; selective local commit authorized; STOP for user review.

## M6-A Mentor Mobile UX / One-Hand Audit Completed — 2026-10-08
Report: [M6A_MENTOR_ONE_HAND_UX_AUDIT](M6A_MENTOR_ONE_HAND_UX_AUDIT.md).
- One-hand ergonomics verdict: FAIL.
- Audit across 320, 390, 393, 430, 768px: Primary action buttons ("Gần tôi", "Đổi lựa chọn") sit in the Hard Reach Zone at the top ($y \approx 24\text{px}$); reordering intents on tap causes disorienting ~180px jump; missing sticky/fixed bottom action zone forces scrolling back up.
- Touch targets $\ge 44\text{px}$, target spacing $\ge 8\text{px}$, and no-clipping text layout: PASS.
- M6-B proposal prepared: persistent bottom action bar + stable in-place intent expansion.
- Zero source/test modifications. STOP for user review before M6-B.

## M6-B One-Hand Mobile UX Implementation Completed — 2026-10-08
Report: [M6B_VERIFICATION](M6B_VERIFICATION.md).
- One-hand ergonomics verdict: **PASS**.
- Intent position stability: Intent cards (`NOW`, `EAT`, `GO`, `STAY`) permanently maintain DOM and visual order. No reordering on tap; tapping STAY keeps STAY at slot 4.
- In-place accordion: `PreferencePanel` expands directly below the selected intent card in-place (`#preference-panel-active`).
- Hero stability: `<Hero />` remains mounted throughout intent selection (`selectedPreference === null`), eliminating the 180px upward layout snap. Jumpy auto-scroll on intent tap eliminated.
- Persistent mobile action bar: Created `BottomActionBar.tsx` fixed at bottom (`fixed bottom-0`), safe-area aware (`env(safe-area-inset-bottom)`), $\ge 44\text{px}$ touch targets.
- State-aware actions: Citywide ("Gần tôi" + "Đổi lựa chọn"), Nearby active ("Toàn Đà Nẵng" + "Đổi lựa chọn"), GPS error/fallback ("Thử lại" + "Đổi lựa chọn"), Nearby empty ("Xem toàn Đà Nẵng" + "Đổi lựa chọn"), Requesting ("Đang định vị…" disabled).
- Zero duplicate controls: Removed duplicate top navigation buttons in `ResultList.tsx`.
- Content clearance: Added `pb-28 sm:pb-32 pb-[calc(7rem+env(safe-area-inset-bottom,0px))]` ensuring final card and Google Maps CTA are 100% visible and unobscured.
- Validation: Lint PASS (`0 warnings, 0 errors`), typecheck PASS (`tsc --noEmit` code 0), 196/196 tests PASS across 11 suites (including 13 new one-hand UX tests in `tests/one-hand-ux.test.tsx`), build PASS (Next.js 15.5.27 compiled in 4.4s), browser visual verification across 320, 390, 393, 430, 768px PASS. Scroll-back-to-control = 0.
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
- 12 Decisions Locked:
  1. Precedence: `explicit manual locale > navigator.languages > navigator.language > vi`.
  2. Persistence: `localStorage` key `laca.ui-locale.v1`; Auto removes key; try/catch wrapped; memory fallback.
  3. UX Placement: Replaced top header suggestion. Situates reachable secondary trigger on Home opening bottom sheet / compact selector; strictly kept out of discovery `BottomActionBar`; >=44px targets.
  4. Runtime State Preservation: Preserves selected intent, preference, nearby mode, user coordinates, and scroll position; re-fetches discovery data with new locale.
  5. Layout Stability: Realistic definition: no intent reordering, no state reset, no forced scroll jumps, BottomActionBar fixed, no horizontal overflow, no clipping. Natural vertical reflow permitted.
  6. Hydration: Server renders `vi`; client resolves post-hydration in `useEffect`; known short initial transition acknowledged (no fake zero-flash claim); no full-page blocking loaders.
  7. HTML lang: Synchronized dynamically to `activeLocale`.
  8. Translation Boundary: Neon DB for places/tags; frontend dictionary for UI chrome.
  9. DB Fallback: Deterministic `req -> vi -> raw/source`.
  10. Formatting: `Intl.NumberFormat(activeLocale)` for metrics; `km` universal.
  11. NOW Boundary: UI chrome translation permitted; timeline data remains sample only.
  12. Acceptance: Visual verification at 320, 390, 430px; truncation prohibited if meaning lost.
- Reconciliation summary: M7-A.1 DONE; selective local commit authorized; STOP for user review before M7-B.

## M7-B VI / EN / KO Runtime i18n Implementation Completed — 2026-10-08
Report: [M7B_VERIFICATION](M7B_VERIFICATION.md).
- Status: IMPLEMENTATION & VERIFICATION COMPLETE — ALL PASS.
- Runtime Locale Provider: Implemented in `src/components/i18n/LocaleProvider.tsx`. Server HTML renders `vi`; client resolves `localStorage (laca.ui-locale.v1) > navigator.languages > navigator.language > vi` in `useEffect` without hydration mismatch. Updates `document.documentElement.lang`. `formatNumber` provides locale-aware metric formatting.
- Language Selector UX: `src/components/i18n/LanguageSelector.tsx` secondary trigger on Home in reachable zone opening compact bottom sheet modal (`Tiếng Việt`, `English`, `한국어`, `Theo thiết bị / Auto`). All options $\ge 48\text{px}$ touch height, keyboard accessible (Escape closes). Kept out of discovery `BottomActionBar`.
- Dynamic API Locale: Discovery requests supply `locale=<activeLocale>`. Switching locale re-fetches Neon DB while preserving `selectedIntent`, `selectedPreference`, Nearby GPS coordinates, and scroll stability. Race-safety guard discards stale responses from previous locales.
- Neon DB Translations: Real DB returns translated `primary_type_label` and `tags` across `vi`, `en`, and `ko`. Proper venue names preserved untranslated.
- UI Localization: Complete typed dictionary in `src/lib/i18n/messages.ts` for all 45+ UI strings. Brand `LA CÀ ĐÀ NẴNG` and uppercase intent titles preserved.
- One-Hand & Nearby Guardrails: M6-B one-hand UX (`BottomActionBar`, in-place accordion, intent order `[NOW, EAT, GO, STAY]`) and M5-B Nearby (1 $\rightarrow$ 3 $\rightarrow$ 5 km, 0–3 truthful results, exact Maps URLs, no images) strictly preserved. CAFE remains disabled (400); NOW remains sample timeline.
- Validation: 12/12 test suites, 221/221 tests PASS (`vitest`). Lint PASS (`0 warnings, 0 errors`). Typecheck PASS (`tsc --noEmit`). Build PASS (Next.js production build). Live browser verification across 320px, 390px, 430px PASS.
- Curated dataset: Clean (`git diff HEAD -- src/data/curated/curated-places.json` empty).
- Reconciliation summary: M7-B DONE; selective local commit authorized; STOP for user review before M8.

## M7-C Intent Visuals & Language Placement Hotfix Completed — 2026-10-08
Report: [M7C_VERIFICATION](M7C_VERIFICATION.md).
- Status: HOTFIX IMPLEMENTATION & VERIFICATION COMPLETE — ALL PASS.
- Issue 1 (Broken Intent Visuals): Replaced `<Image>` calls in `IntentCard.tsx` with native inline vector icons (`lucide-react`: `Utensils`, `Compass`, `Bed`, `Zap`), tailored gradient containers, and emoji badges. Completely eliminated broken images, external image dependencies, and alt text leakage. No venue images reintroduced.
- Issue 2 (Footer Language Trigger Placement): Removed floating middle LanguageSelector on Home. Implemented horizontal footer utility row (`LA CÀ ĐÀ NẴNG` on the left, `[ 🌐 Tiếng Việt ]` / `[ 🌐 English ]` / `[ 🌐 한국어 ]` on the right) with $\ge 44\text{px}$ touch target, one-hand reachability, and responsive `flex-wrap` preventing horizontal overflow on 320px viewports.
- Next.js "N" Dev Indicator: Clarified as Next.js built-in development tools overlay (`nextjs-portal`), rendered only in `NODE_ENV === "development"` and omitted in production builds. Kept intact per instructions.
- Hard Regressions: EAT/GO/STAY live Neon discovery preserved; Nearby 1 $\rightarrow$ 3 $\rightarrow$ 5 km preserved; VI/EN/KO runtime i18n preserved; CAFE inactive (400); NOW sample timeline.
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
- Status: READ-ONLY AUDIT & CONTRACT LOCK ONLY — COMPLETED. Zero modifications to `src/` or `tests/`. Zero DB mutations (NO `CREATE TABLE`, NO `INSERT/UPDATE/DELETE`), zero migrations run, zero package installations.
- Live Neon Catalog Ground Truth: Queried Neon PostgreSQL directly via read-only catalog query. Verified exactly 6 tables and 3,079 total rows:
  - `places`: 500 rows
  - `place_translations`: 1,500 rows
  - `place_tags`: 841 rows
  - `tags`: 36 rows
  - `tag_translations`: 108 rows
  - `administrative_units`: 94 rows
  - Total: 3,079 rows.
- DOC/DB Drift Discovered & Resolved: Previous M8-A draft documentation mistakenly reported non-existent tables (`place_coordinates`, `place_operational` - these are columns on `places`), undercounted `place_tags` as 43 (real: 841), and omitted `tags` (36) and `administrative_units` (94). Corrected in M8-A.1.
- Canonical Property Naming Locked: Unified across client telemetry and DB schema (17 typed fields): `id`, `event_name`, `session_id`, `journey_id`, `occurred_at`, `environment`, `locale`, `language_mode`, `intent`, `preference`, `place_id`, `result_position`, `result_count`, `is_nearby`, `radius_km`, `failure_reason`, `meaningful_tap_count`.
- Metadata Policy: `metadata JSONB` completely removed for M8-B to eliminate arbitrary nested data and preserve strict privacy allowlist.
- Session & Journey Lifecycle Locked:
  - Session: One tab lifetime = one session stored in `sessionStorage` (ephemeral, zero cross-session persistence).
  - Journey: One distinct discovery flow within a session. Generated on Home; preserved across intent changes before preference, locale switches, and nearby toggles; reset to new UUID upon "Đổi lựa chọn" or returning to Home.
- Results Shown Deduplication: Re-fetching discovery on locale change (`language_changed`) emits `language_changed` but MUST NOT emit `results_shown`. Retry only emits if state previously had no successful render.
- NOW Intent Boundary: Tracked for `intent_selected` and `preference_selected` (if any); excluded from place conversion funnels.
- Place ID & FK Policy: Positive integer snapshot; no foreign key constraint to decouple analytics retention from venue catalog mutations.
- Public Endpoint Validation: Strict Zod validation, 2 KB payload limit, parameterized SQL, unknown keys rejected, indicative product telemetry disclaimer.
- GPS Privacy & Environment: Zero raw coordinates, IP, PII, or fingerprints persisted. Categorized radius (1, 3, 5 km) and boolean `is_nearby` only. Environment isolation (`development`/`test` no-op, `preview` tagged, `production` default dashboard filter).
- Retention & DB Strategy: 60-day target documented; automated purge NOT implemented in M8-B. Tracked reproducible SQL migration artifact `docs/schema/002_analytics_events.sql` specified for M8-B.
- Final Event Matrix & Funnel Semantics: 11 allowed events; conversion funnels calculated via `COUNT(DISTINCT journey_id)`.
- Reconciliation summary: M8-A.1 DONE; selective docs-only commit authorized; STOP for user review before M8-B.

## M8-A.2 Final Analytics Contract Patch Completed — 2026-10-08
Report: [M8A_ANALYTICS_READINESS_AUDIT](M8A_ANALYTICS_READINESS_AUDIT.md) & [DECISIONS](DECISIONS.md) (Decisions 106–112).
- Status: FINAL CONTRACT PATCH ONLY — COMPLETED. Zero modifications to `src/` or `tests/`. Zero DB mutations, zero table creation, zero migrations run, zero package installations.
- Event Count Ground Truth: Locked exactly 11 allowed events (`session_started`, `home_viewed`, `intent_selected`, `preference_selected`, `results_shown`, `nearby_requested`, `nearby_resolved`, `nearby_failed`, `citywide_selected`, `maps_clicked`, `language_changed`).
- Server-Generated Timestamp: `occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW()`. Server-generated in UTC; client payload does not send `occurred_at`.
- Server-Derived Environment: `environment VARCHAR(15) NOT NULL CHECK (environment IN ('production', 'preview'))`. Derived on server from deployment runtime; client cannot self-declare production; development/test client dispatcher is a no-op.
- Client Telemetry Payload Separation: 14 client-allowed fields strictly validated via Zod `.strict()`. Server-owned fields (`id`, `occurred_at`, `environment`) are rejected if sent by client.
- Canonical GPS Privacy & Cost Wording: Locked non-absolute GPS privacy wording and factual Neon infrastructure cost rationale.
- Final Canonical Schema: Locked DDL with TIMESTAMPTZ, boolean defaults, CHECK constraints, and 4 indexes.
- M8-B Readiness: YES — All contracts locked and reconciled. STOP for Owner review before M8-B implementation.

## M8-B First-Party Product Analytics Implementation Completed — 2026-10-08
Report: [M8B_VERIFICATION](M8B_VERIFICATION.md).
- Status: RUNTIME IMPLEMENTATION & LIMITED NEON MIGRATION — COMPLETED & VERIFIED.
- Database Migration: Created `docs/schema/002_analytics_events.sql` and applied to live Neon PostgreSQL.
  - Table `analytics_events` created with 17 typed columns and 4 indexes (`idx_analytics_events_occurred_at`, `idx_analytics_events_session_id`, `idx_analytics_events_journey_id`, `idx_analytics_events_name_env`).
  - Content table safety verified: exactly 6 content tables and 3,079 total rows remained 100% intact before and after migration.
  - Initial `analytics_events` count: 0 rows.
- Timezone Storage & Display: UTC storage via `TIMESTAMPTZ NOT NULL DEFAULT NOW()`. Display queries strictly use `'Asia/Ho_Chi_Minh'` (never `'Asia/Bangkok'`).
- Analytics Modules:
  - `src/lib/analytics/types.ts`: 11 canonical events, typed client/server models.
  - `src/lib/analytics/validator.ts`: Zod discriminated union with `.strict()`, rejecting unknown keys, server-owned keys, and raw GPS/PII.
  - `src/lib/analytics/db.ts`: Server-side environment derivation (`production` vs `preview`), parameterized SQL INSERT.
  - `src/app/api/analytics/route.ts`: Edge handler, $\le 2\text{ KB}$ body limit, status codes 202/400/413/500.
  - `src/lib/analytics/client.ts`: Non-blocking dispatcher (`sendBeacon` / `fetch keepalive`), dev/test no-op, ephemeral session (`laca.analytics-session.v1`), journey store (`laca.analytics-journey.v1`), meaningful tap counter (intent +1, preference +1, toggle +1).
- Telemetry Integration:
  - `src/app/page.tsx`: Session started, home viewed (deduped per journey), intent & preference selected, journey reset on "Đổi lựa chọn".
  - `src/components/results/DiscoveryResults.tsx`: Results shown (locale re-fetch deduped), nearby requested, nearby resolved, nearby failed, citywide selected.
  - `src/components/results/PlaceCard.tsx`: Maps clicked (debounced 1s, non-blocking navigation).
  - `src/components/i18n/LanguageSelector.tsx`: Language changed tracking.
- Automated Test Suite & Validation:
  - 14 test suites, 259 total tests ALL PASS (`tests/analytics.test.tsx`: 34/34 PASS).
  - `npm run lint`: 0 warnings, 0 errors.
  - `npm run typecheck`: 0 errors.
  - `npm run build`: Production build successful (Edge analytics route compiled cleanly).
  - Dataset `src/data/curated/curated-places.json`: 100% clean, 0 diff.
- Live Neon DB Verification: Tested preview event ingest via API handler, verified via SELECT, ran 5 analytical queries, cleanly deleted test row (returned to 0 rows), verified 6 content tables intact (3,079 rows).
- Retention Policy: 60-day target documented; automated purge NOT implemented in M8-B.
- Scope Boundaries: Zero UI regressions on M6 one-hand UX or M7 i18n; CAFE inactive; NOW static itinerary preserved (excluded from places conversion); no dashboard; no notifications; no deploy.
- Reconciliation Summary: M8-B DONE; selective local commit authorized; STOP for Owner review.

## M8-B.1 Cloudflare Analytics Environment Fix Completed — 2026-10-08
Report: [M8B1_CLOUDFLARE_ENV_VERIFICATION](M8B1_CLOUDFLARE_ENV_VERIFICATION.md).
- Status: VERIFIED & COMPLETED — ALL PASS.
- Root Cause Resolved: Cloudflare preview & production both execute in `NODE_ENV=production`. Fixed non-deterministic classification by locking `APP_ENV` (`preview` | `production`) as the canonical server variable.
- Resolver Hardening: `src/lib/analytics/db.ts` `resolveServerEnvironment()` prioritizes `APP_ENV`. If explicit `APP_ENV` is unrecognized/invalid, safely falls back to `"preview"` (never guesses production). Removed legacy Vercel references. Evaluates `IS_PREVIEW` before generic fallbacks. Safely defaults to `"preview"` in dev/test.
- Wrangler Configuration: Configured top-level `vars: { "APP_ENV": "production" }`, `env.preview: { "name": "la-ca-da-nang-preview", "vars": { "APP_ENV": "preview" } }`, and `env.production: { "vars": { "APP_ENV": "production" } }` in `wrangler.jsonc`.
- Deployment Scripts: Added `npm run deploy:preview` (`opennextjs-cloudflare build && opennextjs-cloudflare deploy --env preview`). Preserved `npm run deploy` for production.
- Environment Documentation: Added `APP_ENV=preview` (allowed: `preview | production`) to `.env.example`.
- Automated & Live Verification: Added test cases in `tests/analytics.test.tsx` (14 suites, 262/262 PASS). Verified live preview event ingest against Neon: stored as `environment = 'preview'`, deleted cleanly (0 rows remaining). All 6 content tables intact at 3,079 rows.
- Validation: Lint PASS (0 errors), Typecheck PASS, Vitest PASS (262/262), Build PASS.
- Milestone Status: M8-B Blocker Resolved. M8-B READY FOR FINAL VERIFICATION: YES.

## M9-A Notifications & Reminder Readiness Audit Completed — 2026-10-08
Report: [M9A_NOTIFICATIONS_READINESS_AUDIT](M9A_NOTIFICATIONS_READINESS_AUDIT.md).
- Status: READ-ONLY AUDIT & ARCHITECTURE CONTRACT COMPLETE.
- Existing Foundation: 0 notification API calls in `src/`, 0 service workers in `public/` or `src/`, 0 PWA manifests, 0 push packages in `package.json`, 0 reminder tables in Neon DB, 0 cron triggers in `wrangler.jsonc`.
- Core Product Use Case: "Nhắc tôi trước khi đi" (opt-in reminder, 30-minute lead time, zero cold prompt on load, zero marketing spam).
- Critical Data Gap Identified: Current discovery places possess zero schedule/operating time data. A minimal visit time selection UI (`scheduled_visit_at`) is strictly required before any reminder can be scheduled.
- Platform Constraints: Regular iOS Safari tabs DO NOT support Notification API / Web Push without installation as a Home Screen PWA (iOS 16.4+). Mobile background timers terminate when tabs are suspended.
- Recommended MVP Architecture for M9-B: RFC 5545 `.ics` Calendar Reminder Export with 30-minute advance `VALARM`. Delivers native calendar integration across iOS and Android while closed, requires zero Cloudflare cron infrastructure, zero Neon DB bloat, and preserves privacy.
- Analytics Safeguard: Verified 11-event M8 schema remains 100% intact; draft extension events proposed for separate future authorization.
- Scope Boundaries: Zero modifications to `src/` or `tests/`; zero DB mutations; CAFE inactive; NOW sample timeline decoupled; no deploy.
- Next Action: STOP for Owner review before any M9-B implementation.

## M9-A.1 Reminder MVP Contract Lock Completed — 2026-10-08
Report: [M9A_NOTIFICATIONS_READINESS_AUDIT](M9A_NOTIFICATIONS_READINESS_AUDIT.md) & [DECISIONS](DECISIONS.md) (Decisions 133–142).
- Status: CONTRACT LOCK ONLY — COMPLETED. Zero source modifications, zero DB mutations.
- Canonical Feature Identity: "Nhắc tôi" $\rightarrow$ Calendar Reminder Export (`.ics`). Never described as push/browser notification.
- Browser Permission Removed: M9-B does NOT invoke `Notification.requestPermission()`, `new Notification()`, or `PushManager`. Permission states (`granted`, `denied`, `default`) removed from M9-B scope and test suites.
- Delivery Guarantee Contract: RFC 5545 `.ics` with 30-minute `VALARM`. Prohibited claiming "100% reliable" or guaranteed delivery.
- Visit Time Semantics: `scheduled_visit_at`. UI asks: *"Bạn muốn đến đây lúc nào?"*. Alarm triggers 30m before visit (`TRIGGER:-PT30M`).
- Locked Presets: `1 giờ nữa (+1h)`, `2 giờ nữa (+2h)`, `4 giờ nữa (+4h)`, and `Chọn ngày & giờ`. Custom selection must be `> now + 30 minutes`.
- Timezone: `Asia/Ho_Chi_Minh` (GMT+7) communicated in UI; converted to UTC `Z` for ICS export.
- Storage Contract: `localStorage` key `laca.reminders.v1` as export metadata log; no `sent`/`delivered`/`dismissed` statuses.
- Cancellation Semantics: Prohibited "Huỷ thông báo" (web apps cannot delete imported calendar events). M9-B focuses purely on export.
- Technical & Data Boundaries: 100% client-side frontend code. Zero Neon tables, zero Cloudflare crons, zero service workers, zero VAPID keys. Verified 11-event M8 analytics schema and 262 existing tests 100% untouched.
- M9-B Readiness: YES — Architecture and contract locked. STOP for Owner review before M9-B implementation.

## M9-B Calendar Reminder MVP Implementation Completed — 2026-10-08
Report: [M9B_VERIFICATION](M9B_VERIFICATION.md).
- Status: COMPLETED & VERIFIED — ALL PASS.
- Hard Scope Implemented:
  - Client-side reminder module in `src/lib/reminders/` (`types.ts`, `time.ts`, `ics.ts`, `storage.ts`).
  - Mobile bottom sheet dialog in `src/components/reminders/ReminderSheet.tsx`.
  - Secondary `🔔 Nhắc tôi` button in `src/components/results/PlaceCard.tsx` (`min-h-[44px]`).
- Hard Scope Prohibitions Enforced:
  - 0 calls to `Notification.requestPermission()` or `new Notification()`.
  - 0 Service Workers, Push API, or VAPID keys.
  - 0 Neon database mutations (content tables remain at 3,079 rows).
  - 0 Cloudflare crons, queues, or durable objects.
  - 0 new analytics events (11 canonical events 100% locked).
  - Static NOW itinerary excluded from reminder CTAs.
- Ergonomics & Timezone:
  - Accessible dialog in lower thumb zone (`role="dialog" aria-modal="true"`, safe-area clearance).
  - Presets: `+1h`, `+2h`, `+4h`, and custom date/time.
  - Timezone: `Asia/Ho_Chi_Minh` (GMT+7); custom wall-clock input parsed deterministically to UTC independent of user device timezone.
  - Validation: rejects visit time $\le \text{now} + 30\text{m}$.
- RFC 5545 Conformance:
  - Strict CRLF `\r\n`, UTF-8, UTC Z timestamps (`YYYYMMDDTHHmmssZ`).
  - Unique UID: `${crypto.randomUUID()}@laca-danang`.
  - `VALARM`: `TRIGGER:-PT30M`, `ACTION:DISPLAY`.
  - Text escaping for `\`, `;`, `,`, `\n`.
  - Exact Google Maps link in `DESCRIPTION`; `LOCATION` emitted only if valid address is present.
- Storage & Download:
  - Saved to `localStorage` under `laca.reminders.v1` only upon actual export. Safe try/catch.
  - Generates `Blob` (`text/calendar;charset=utf-8`) as `la-ca-reminder-<place-id>.ics`, triggers download, revokes object URL.
- Quality Gates & Automated Tests:
  - 286/286 vitest tests PASS across 15 suites (24 new dedicated reminder tests, 262 existing tests pass).
  - `npm run lint`: PASS (0 warnings, 0 errors).
  - `npm run typecheck`: PASS (0 errors).
  - `npm run build`: PASS (production build succeeds).
  - `git diff --check`: PASS (clean).
  - `curated-places.json`: 0 diff.
- Responsive & Browser Verification:
  - Live browser verified at 320px, 390px, 393px, 430px: 0 horizontal overflow, >=44px touch targets.
  - Physical Calendar Import: NOT VERIFIED (requires physical mobile device).
- Exact Next Step: STOP — Waiting for Owner review.

## M9-B.1 Calendar Reminder Semantic Fix Completed — 2026-10-08
Report: [M9B_VERIFICATION](M9B_VERIFICATION.md) & [DECISIONS](DECISIONS.md) (Decisions 149–151).
- Status: COMPLETED & VERIFIED — ALL PASS.
- Semantic Corrections:
  1. Removed Fabricated Visit Duration: Canonical VEVENT in `src/lib/reminders/ics.ts` contains strictly `DTSTART:<scheduled visit instant UTC>` and completely omits `DTEND`. La Cà does not invent visit duration or assume 1 hour stay.
  2. Removed Misleading "Đã lên lịch" Badge: Removed persistent "Đã lên lịch" status badge from `src/components/results/PlaceCard.tsx`. `localStorage` (`laca.reminders.v1`) is retained solely for export configuration/repeat replacement metadata without implying calendar synchronization.
  3. Truthful Post-Export Copy: One-time toast/confirmation updated across all 3 locales:
     - `vi`: "Đã tạo file lịch nhắc. Hãy mở và lưu sự kiện trong ứng dụng Lịch của bạn."
     - `en`: "Calendar reminder created. Open and save the event in your Calendar app."
     - `ko`: "캘린더 알림 파일이 생성되었습니다. 캘린더 앱에서 일정을 열고 저장해 주세요."
     - Strictly eliminated misleading claims ("Reminder scheduled successfully", "La Cà will notify you", "Added to your calendar").
- Preserved Contracts:
  - 0 Notification API (`Notification.requestPermission`, `new Notification`).
  - 0 Service Workers, Push API, or background tasks.
  - 0 Neon DB mutations (content tables remain at 3,079 rows; analytics_events schema untouched).
  - Exactly 11 canonical analytics events intact (0 reminder events added).
  - RFC 5545 format intact: CRLF `\r\n`, UTF-8, UTC `Z` timestamp, `VALARM` (`TRIGGER:-PT30M`, `ACTION:DISPLAY`), Google Maps URL.
- Quality Gates & Automated Tests:
  - 289/289 vitest tests PASS across 15 suites (27 dedicated reminder tests in `tests/reminders.test.tsx`).
  - `npm run lint`: PASS (0 warnings, 0 errors).
  - `npm run typecheck`: PASS (0 errors).
  - `npm run build`: PASS (production build succeeds).
  - `git diff --check`: PASS (clean).
  - `curated-places.json`: 0 diff (untouched).
- Physical Calendar Import: NOT VERIFIED (requires physical mobile device).
- Exact Next Step: STOP — Waiting for Owner review.

## P1 / P1.2 Owner Physical One-Hand UX Fix Completed — 2026-10-09
Report: [P1_OWNER_ONE_HAND_UX_VERIFICATION](P1_OWNER_ONE_HAND_UX_VERIFICATION.md).
- Status: **BROWSER READY FOR OWNER PHYSICAL RETEST** (Physical acceptance strictly NOT VERIFIED until Owner tests on real phone).
- Problem Solved:
  - Initial M6-B layout failed physical reachability on real phone due to vertical stack forcing NOW and EAT above $y=400\text{px}$.
  - Initial P1 layout left large dead white space ($\approx 300\text{px}$) between 2x2 grid and footer because Hero was fixed to $125\text{px}$ while `main` stretched via `flex-1`.
- P1.2 Root Cause Fix & Implementation:
  - Dynamic Hero Expansion: `<Hero>` uses `flex-1 min-h-[190px] max-h-[460px] md:max-h-[360px] flex flex-col`. Spare vertical space on phones is absorbed by the Dragon Bridge / Da Nang hero image at the top rather than empty white space.
  - Ergonomic Card Sizing: `<IntentCard>` uses `min-h-[136px] sm:min-h-[148px] p-3 sm:p-4 rounded-[20px]`.
  - Bottom-Anchored 2x2 Grid: 2 columns $\times$ 2 rows (`grid grid-cols-2 gap-2.5 sm:gap-3.5`) in strict DOM order `[NOW, EAT, GO, STAY]`. Grid is pushed down into the lower thumb zone ($y \approx 280\text{px}-608\text{px}$).
  - Immediate Footer Attachment: `<footer>` sits directly below 2x2 grid with natural spacing (`mt-2 sm:mt-2.5`). The gap between grid bottom and footer top is **exactly 12px** across all phones (zero dead white space).
  - Mobile Preference Bottom Sheet (`PreferenceBottomSheet.tsx`): modal dialog with `role="dialog"`, `aria-modal="true"`, `id="preference-panel-active"`, $\ge 44\text{px}$ close, Escape key, $\ge 44\text{px}$ chips.
- Preserved Contracts:
  - 0 Neon DB mutations, 0 schema changes.
  - Discovery API and 0–3 truthful results preserved.
  - Nearby 1 km $\to$ 3 km $\to$ 5 km Haversine logic preserved.
  - Analytics 11-event contract intact (`intent_selected`, `preference_selected` fire accurately).
  - Calendar Reminder intact (P2 scope untouched).
  - NOW flow preserves static sample itinerary ("Lịch trình mẫu nhanh").
  - CAFE remains disabled.
- Quality Gates & Validation:
  - 298/298 vitest tests PASS across 15 suites.
  - `npm run lint`: PASS (0 warnings, 0 errors).
  - `npm run typecheck`: PASS (0 errors).
  - `npm run build`: PASS (production build succeeds in 5.4s).
  - `git diff --check`: PASS (clean).
  - `src/data/curated/curated-places.json`: 0 diff.
- Multi-Viewport Browser Measurements (P1.2 Full Matrix):
  - 320x800: Hero 200px, Grid 280-564px, Footer 576-620px, Gap 12px, Visible: YES, Reachable: YES
  - 360x800: Hero 200px, Grid 280-564px, Footer 576-620px, Gap 12px, Visible: YES, Reachable: YES
  - 375x812: Hero 204px, Grid 284-568px, Footer 580-624px, Gap 12px, Visible: YES, Reachable: YES
  - 390x844: Hero 216px, Grid 296-580px, Footer 592-636px, Gap 12px, Visible: YES, Reachable: YES
  - 393x852: Hero 220px, Grid 300-584px, Footer 596-640px, Gap 12px, Visible: YES, Reachable: YES
  - 412x915: Hero 236px, Grid 316-600px, Footer 612-656px, Gap 12px, Visible: YES, Reachable: YES
  - 430x932: Hero 244px, Grid 324-608px, Footer 620-664px, Gap 12px, Visible: YES, Reachable: YES
- Exact Next Step: STOP — Waiting for Owner review and physical device testing.



## Hero / NOW / CAFE continuation — 2026-10-09
Latest user scope: sequential A Hero, B real NOW time slots, C CAFE, D regression; no push/deploy/DB mutations. Initial branch phase-2a-deploy, HEAD 8dde44ed4a4f99b87f76002575711b73b24719cd, working tree CLEAN. Historical status above is superseded for this scope.
Phase A implementation + focused verification complete: local text-free derivative of owner Dragon Bridge artwork, existing VI/EN/KO UI overlay, P1.2 composition unchanged. User corrected earlier accidental choice: multilingual Hero REQUIRED. See HERO_ARTWORK_VERIFICATION.md. Phase B NOT_STARTED; next audit real tags, then implement deterministic Asia/Ho_Chi_Minh NOW with existing repository/adapter. No fake open-now claims. CAFE NOT_STARTED. Analytics enum currently excludes CAFE; resolve the explicit CAFE contract stop gate before Phase C implementation.
Calendar physical delivery: KNOWN FAILED PHYSICAL ACCEPTANCE — DEFERRED per user. Nearby sparsity: deferred, radius 1→3→5 unchanged. Physical one-hand acceptance remains owner retest, not browser certification. Evidence/backups: sibling CONTINUATION_2026-10-09.


## Continuation checkpoint — Hero + real NOW, 2026-10-09
This is the latest status for the owner master task; historical Phase B NOT_STARTED entries above are superseded.
- Branch `phase-2a-deploy`; initial HEAD `8dde44ed4a4f99b87f76002575711b73b24719cd`, initial tree CLEAN.
- Phase A READY_FOR_REVIEW, local commit `bc6702a824ea245a5d11f94eb086059f286ee8f1`. Owner corrected accidental fixed-Vietnamese choice: Hero has a text-free local Dragon Bridge derivative + VI/EN/KO overlay. P1.2 four-card composition preserved. See HERO_ARTWORK_VERIFICATION.md; image is an AI-edited derivative, not unchanged original pixels.
- Phase B READY_FOR_REVIEW. NOW is real Neon through existing repository/adapter and `/api/now`, five Asia/Ho_Chi_Minh slots, deterministic two-leg policy, 0/1/2 truthful places, no demo fallback, no GPS request or opening-hours claim. One-tap NOW replaces sample companion selection; bottom reset returns Home. Null-safe existing no-image card and exact Maps links reused. All three locales; timeout/retry/abort/locale stale protection. Source commit hash follows after successful commit.
- Phase B validation: lint0, typecheck retry0,18 suites340/340 non-curation tests, Next build0, OpenNext build0 and worker.js exists. One transient typecheck process exit -1073740791 had empty log; cause unproven. New API-test cleanup issue fixed; all final tests pass. See NOW_REAL_V1_VERIFICATION.md for honest scope/limitations.
- Five real fixed-time cases independently verified by SELECT: 08:00 IDs214/218;12:00 IDs33/218;15:30 IDs218/214;19:00 IDs33/218;23:00 IDs33/218. Repeated Bà Nà Hills is a relevance limitation from current tags/ranking, not proof of late-night availability or proximity.
- Phase C BLOCKED: CAFE ANALYTICS CONTRACT BLOCKER, explicit owner Phase C10 stop gate. Refreshed CAFE145; tags CAFE145/POPULAR4; rated143/reviewed143/coordinates145; translation rows145 each VI/EN/KO. Current analytics enum and schema CHECK excludeCAFE. No CAFE discovery UI/API enabled. NOW may select CAFE as an internal leg under NOW, which does not activate CAFE intent telemetry. See CAFE_ACTIVATION_VERIFICATION.md.
- Phase D full cross-product/CAFE acceptance BLOCKED; existing-flow automated regression passes but is not full live/physical acceptance. Browser screenshot evidence and corrected DOM clipping checks cover documented NOW sizes/locales, not all combinations.
- DB mutations0; curated JSON0diff; no schema/config/package/lockfile/Nearby/analytics/reminder implementation changes. Original owner artwork and legacy demo file retained. No push/merge/deploy. Owned dev3109 stopped before builds; no blanket process termination.
- Calendar physical delivery: KNOWN FAILED PHYSICAL ACCEPTANCE — DEFERRED. Nearby sparsity deferred, radius1→3→5 unchanged. Korean human review and physical one-hand acceptance remain owner checks.
- Evidence/backups/scripts/logs/hashes: `D:/Dự án tìm địa điểm ăn chơi/CONTINUATION_2026-10-09`. Do not use faulty full-page stitched image now_ko_320.png; use *_top/*_bottom captures.
- EXACT NEXT STEP: owner chooses (1) explicit documented CAFE-specific telemetry exclusion, retaining11-event schema, or (2) separately authorized analytics enum + DB constraint extension. Recommendation under no-DB-mutation scope is option1 only after accepting the coverage gap. Then verify Git/handoff and continue Phase C; do not restart A/B, re-import Neon, touch Calendar/Nearby sparsity, push or deploy. STOP — WAITING FOR OWNER REVIEW.

Checkpoint commit verified: `8f550786ced1bed235da593d751b2c37e64dcaa9` — `feat: connect NOW to Neon time slots`, exact18-path selective local commit. Git status immediately after source commit CLEAN. No push/deploy. Final consolidated report: [CONTINUATION_FINAL_REPORT.md](CONTINUATION_FINAL_REPORT.md). Phase C remains BLOCKED at owner analytics decision; this follow-up edits docs only.


## Master continuation 2026-10-09 — Phase 1 verified, Phase 2 next
Latest owner request supersedes prior CAFE blocker/deferred repair scope: NOW3 real stops; GO+cafe routes DB CAFE while analytics staysGO/cafe; intermediate regression; Google Calendar+ICS delivery; explicit Nearby general recovery; final regression. No DB mutations, push or deploy. Initial branch phase-2a-deploy, HEAD3f7aeaddbda233c35e71c3ed4d3dd6d5bf78bccf, CLEAN. Backups/hash verification and evidence in sibling MASTER_CONTINUATION_2026-10-09.
Phase1 implementation+focused tests5files80/80 and live five-slot independent SELECT PASS. Complete EAT/CAFE/GO candidate pools through existing repository; valid Maps+unique IDs;3 real stops whenever eligible pool has3; otherwise explicit exhaustion metadata. Slot-specific top-three deterministic window prevents same top place every slot; no randomness. NIGHT verifiedBAR pool precedes daytime-category fallbacks. Product UI metadata extracted from demo module to discovery-ui.ts; production Home imports no demo venue module. Existing Hero untouched. Full build/UI acceptance pending Phase3/6.
Next: Phase2 GO preference cafe -> DB CAFE; then Phase3 gates before Calendar/Nearby repair. Do not redo Hero/NOW infrastructure/analytics/geo engine. Calendar physical and owner home-location acceptance remain NOT VERIFIED.

Phase2 focused/live complete: GO+cafe -> separateDBCAFE, responseintentGO, analyticsGO/cafe without changing11events/4intentenum/schema. Tests3files47PASS; live15APIcases withindependentSELECTPASS. See GO_CAFE_PRODUCT_VERIFICATION.md. Phase3 fullintermediatevalidation IN_PROGRESS; Calendar/Nearbyrecovery NOT_STARTED. Phase1commit452b18b.


## Interrupted-session resume — Calendar checkpoint, 2026-10-09
Actual resume HEAD 96e3792458c7fe07a29ffa14a2a6b92320120766, branch phase-2a-deploy, CLEAN index/tree. No partial Calendar edits found. Existing source commits452b18b NOW3 and96e3792 GO+cafe retained. Intermediate gate completed before Calendar edits: lint/typecheck PASS,20files360tests PASS excluding curation, Next/OpenNext PASS, worker.js exists; evidence intermediate-*.log in MASTER_CONTINUATION_2026-10-09.
Calendar implementation focused PASS: two explicit localized actions; Google draft via standard template URL, exact UTC visit instant + Asia/Ho_Chi_Minh, exact Maps, address only when present. Equal dates endpoints introduce no invented duration; user must review Google draft time/duration/notifications. No OAuth/account/token access or saved/delivered claim. Google path writes no local export record. Original ICS generator unchanged;30-minute VALARM and noDTEND retained. Removed generic fake Maps fallback in sheet. Scrollable90dvh sheet,48px actions. Focused2files33tests PASS; typecheck PASS. Browser/final gates pending. Physical Calendar NOT VERIFIED.
NEXT: implement explicit Nearby zero-result recovery, then browser/full final regression. No DB mutation/push/deploy. Do not redo NOW/GO+cafe/Hero or alter geo algorithm.


## Nearby recovery checkpoint — 2026-10-09
Calendar commit2b624b2 retained. Nearby recovery CODE VERIFIED: explicit citywide restores original preference and removes location; explicit general retains coordinates, omits narrow preference for EAT/GO/STAY; GO+cafe retains cafe so database category staysCAFE. Existing null-preference API contract reused; no repository/geo/ranking/API changes. Result heading and telemetry use general rather than pretending narrow preference still matched. No automatic preference_selected. Existing abort/stale/retry paths retained. Two lower recovery actions>=44px, text wraps, result footer clears bar.
Focused3files26tests PASS. Current full suite22files370tests PASS, lintPASS. Browser empty fixture/dev/nearby-recovery uses real ResultList, zero fixture places/noGPS/noAPI; production returns404. Screenshot/DOM VI widths320/360/375/390/393/412/430/440/480/768/1280, EN360 andKO320, callbacks verified. This is visual fixture verification, not a physical geolocation test. Calendar VI matrix samewidths,EN393,KO320; exactactions48px. Google newtab opened but unsigned IAB redirected toGoogle product landing; authenticated draft fields and device import NOT VERIFIED.
NEXT: final typecheck/Next/OpenNext, refreshed SELECT liveNOW/finalAPI smoke, final evidence/report and selective commits. No DB mutations/push/deploy. PhysicalCalendar/Nearby ownerhome NOT VERIFIED.


## Final master continuation — NOW V2 in progress, 2026-10-09
LATEST OWNER SCOPE supersedes prior no-push/no-preview stop: finish Calendar/Nearby; location-aware NOW; full gates; normal push phase-2a-deploy; canonical Cloudflare PREVIEW only; read-only live smoke; STOP before production. Owner explicitly answered preview smoke MUST NOT write analytics; do not execute preview Home JavaScript (automatic analytics INSERT). Use GET HTML/API/assets only, browser local dev analytics-disabled; report live browser coverage unverified.
TakeoverHEAD bebdc5176306b1c8564894bba8b70c1f0901a387, branchphase-2a-deploy. Only initial dirtyfile tests/calendar-mobile.test.tsx was own valid unfinished fixture typing fix; now typeLabel/area strings; no unrelated work. Calendar2b624b2, Nearbybebdc51 already committed. Previous final Next/OpenNext PASS but typecheck had new test-fixture error; fixed now. Do not treat previous370 as latest V2 test count.
NOWV2 implementation uncommitted: reuse shared fullprecision geo candidate evaluator (existing Nearby semantics unchanged), shared opt-in GPS callback+cancel/8s/1000mguard, APIlat/lng validated viaexistingdiscoveryparser, strictduplicate/unknown keys. No page-loadGPS; NOWmount showsallowlocation/citywidechoice. Denied/timeout/inaccurate explicitretry/citywide; no silent modechange. Nearby composition evaluates1/3/5, requires3distinctsections before early1/3stop; at5returns0–3truthful bestavailable (diversity metadata), exactMaps/nohoursclaim. Suitability tier thenrawdistance thenquality/id. No rawGPSstorage/analytics/echo. Citywidev1.1 preserved.
Focused7files94testsPASS; full firstV2run390/391 with obsolete one-hand NOWloading assertion (updatedtoGPSchoice); lintprefer-const repaired. Finalrerun pending. PublicoriginSELECTverified:1km originplace136 ->119/135/136;3km origin5 ->22/4/5;5km origin35 ->22/37/35. Dev-only /dev/now-location fixture simulatesGPS atthese publicvenues but calls realNeonAPI;production404. BrowserEN320 cases1/3/5/empty/denied/inaccurate verified; remainingmatrix/locales andfullgatespending. Evidence MASTER_CONTINUATION_2026-10-09/now-v2-*.
NEXT EXACT: finishlocalbrowsermatrix/locales; runlint,typecheck,allnoncurationtests,Next/OpenNext; SELECT-onlyfinalAPI; reviewdiff/selectivecommit; pushnormalandverifyremote; npm run deploy:preview only; GET-onlylive smoke noanalytics; finalreport/owner10testchecklist. No production/DBmutation/dataset/package/configchanges. Owneddev3110 session25091 running; stop beforebuild.


## NOW V2 release gate — 2026-10-09
NOW V2 READY_FOR_REVIEW locally: lint0/typecheck0/23files392noncurationtestsPASS/Nextbuild0/OpenNext0/worker.js exists. Diffcheckclean, curatedJSON0diff vsbebdc517, ICSgenerator/package/lockfile/configunchanged. Sharedgeometry andGPSreuse preserveordinaryNearby tests. Fullverifiedpolicy/evidence in NOW_LOCATION_AWARE_V2_VERIFICATION.md. Calendar2b624b2 andNearbybebdc51 preserved; Calendarfixturetyping corrected. Local28APIcases+independentSELECTPASS; browserGPSmock/publicorigins, noownerGPS. OwnerexplicitlychoseNOanalyticswrites onpreview: onlyGETHTML/API/assetslive; livebrowserJSnotexecuted. Analytics11events/4intents/schemaunchanged.
Next authorized step: selectiveNOWV2commit, normalpushphase-2a-deploy, npm run deploy:preview, GET-onlysmoke, finaldocs/checklist. ProductionNOTAUTHORIZED. PhysicalallchecksNOTVERIFIED. Dev3110stoppedbeforebuild. NoDBmutations.


## Final release checkpoint — 2026-10-09 (latest authority)
Supersedes earlier in-progress/pending-push/pending-preview entries above; history retained. NOW V2 source 4a0a1704b02c97ad908fe777d3fa43da9732e203; deployed HEAD 0cae0db7b94ce018941ef0f8d9623becf74d95bf. Normal push phase-2a-deploy succeeded. Canonical npm.cmd run deploy:preview succeeded; worker la-ca-da-nang-preview, version 9ba8635f-c3b3-4d78-acfb-69f4d2f851be, https://la-ca-da-nang-preview.quang24101977.workers.dev.
Local lint/typecheck/23 files392 non-curation tests/Next/OpenNext PASS. Preview28 GET cases + independent SELECT PASS; Home200/four cards/Hero asset200/localized bundles verified. Owner requires NO analytics writes: no preview client JS or analytics POST; live interactive/analytics ingestion NOT VERIFIED. No DB mutation/dataset/package/config change. Final docs-only checkpoint does not change deployed application bytes.
STATUS READY_FOR_REVIEW: release candidate ready for owner acceptance within documented scope. Production NOT READY, physical acceptance pending. No owned dev server running. Final local/remote commit+clean status recorded after final docs commit in sibling MASTER_CONTINUATION_2026-10-09/FINAL_GIT_RESULT.json and final chat. Full report FINAL_RELEASE_CANDIDATE_VERIFICATION.md; exact ten tests OWNER_PHYSICAL_ACCEPTANCE_CHECKLIST.md.
EXACT NEXT STEP: STOP; owner reviews physical checklist and returns PASS/FAIL. No further implementation, DB writes or production deploy. Respect no-analytics-write restriction before any interactive preview session. Do not redo NOW/Calendar/Nearby/GO+cafe.


## Post-import SEO / GA4 milestone — 2026-10-09 (latest authority)
Owner authorizes read-only1500 baseline/backup, forward migration artifact only, place detail/SEO/sitemap/robots/GSC support/optionalGA4, gates, push phase-2a-deploy and Preview only. Takeover450530dcba2bb41f8d332315a2ca920a732a4cf8; source clean, owner JSON untracked preserved. Calendar/ICS removal committed in450530d, no restart. Live SELECT confirms1500 activeOPERATIONAL: EAT384/CAFE425/GO414/STAY277; translations4500; place_tags3076; admins94/tags36/tagtranslations108; all integrity checks0; Google IDs1500unique. Sequence places_id_seq/default verified last2500; IDs1501–2500 valid gaps. Old500 fingerprint matches reported subset. No DB writes.
Pre-import JSON/SQL preserved and post-import content snapshot exported outside Git under LaCaDaNang/backups. See POST_IMPORT_SEO_GA4_VERIFICATION.md for SHA256 paths, exact scope, action inventory and Owner setup. Source002 migration added for future fresh DB, NOT run live;001 immutable. Detail route /places/id, EN/KO query canonical/hreflang, sitemap1500+Home, conservativePlaceJSON-LD, optional GA4 allowlist;11 first-party events intact. NoGA/GSC config supplied; Owner action needed. No notifications/dashboard/production.
IN_PROGRESS: lint/typecheck/406tests passed; localSEO GET/browser passed within report scope. Finish final Next/OpenNext gates, read-only smoke, selectivecommit/push/Preview, final handoff. Do not stage owner data/backups/env; no reimport/sequence reset/content mutation. Historical500/Calendar claims superseded, reports retained.


Final local gate: lint/typecheck/24files406tests/Next/OpenNext PASS; worker.js exists. Preview baseline28GET+independentSELECT PASS on1500 data. Source diff reviewed; protected dataset/schema001/packages/config unchanged. Ready for selective source commit, normal branch push and Preview deployment; final live SEO smoke pending. Owner untracked JSON must remain untracked.
