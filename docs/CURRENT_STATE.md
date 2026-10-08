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
