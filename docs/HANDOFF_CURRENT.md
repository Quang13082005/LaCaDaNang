# Current handoff — M4-B GO & STAY real Neon discovery
CURRENT_AUTHORITY — 2026-10-07. M4-B verified complete; selective local checkpoint authorized. STOP before M5; no push/merge/deploy.

## 1. Objective
Connect existing EAT flow to live API and no-image cards; no M3-A restart or full UI redesign.
## 2. Git
Repo D:/Dự án tìm địa điểm ăn chơi/LaCaDaNang/danang_revised_pack, branch phase-2a-deploy. Parent38c237a2c3976f60452227f28a01f6270f6fbdb4. Selective13-file local checkpoint completed: e39c7de65fc413f6561e0069642ba58f6bb95f0e, message feat: connect EAT frontend to Neon discovery.16 old staged renames intentionally excluded; unrelated work protected.
## 3. Authority
Read AGENTS,CURRENT_STATE,DECISIONS,this handoff,AGENT_TASK_QUEUE,M3A_BUILD_RECOVERY. Latest user scope wins. Backups/hashes under sibling M3B_EVIDENCE_2026-10-07/before.
## 4. Completed
Audited source; EAT API-only flow; no-image model/card; idle/loading/success/empty/error, retry15s timeout and stale protection. All3 preference browser flows verified against API and independent Neon SELECT. Validation and screenshots complete; no untested source changes after validation.
## 5. In progress
Checkpoint and hash recording completed. No partial implementation or unfinished checkpoint task. M4 not started.
## 6. Decisions
Only an_ngon/general,dac_san/SPECIALTY,hen_ho/DATE. Fixed vi call, no i18n runtime. Nullable data blocks omitted. No arbitrary tags/reasons/URLs, no EAT demo fallback. Shared card removes images for existing GO/STAY demo too; no new data integration there.
## 7. Commands/evidence
Repo npm.cmd run lint; npm.cmd run typecheck; npm.cmd run build. npm.cmd test in sibling test-copy (curation writes confined). npm.cmd run dev -- --hostname 127.0.0.1 --port 3103; browser UI via Codex IAB. Scripts/logs/JSON/screenshots under D:/Dự án tìm địa điểm ăn chơi/M3B_EVIDENCE_2026-10-07. Detailed report docs/M3B_VERIFICATION.md.
## 8. Validation
Lint/typecheck exit0;7suites133/133 tests exit0,18 new frontend cases. Build exit0 after23.773s. Browser EAT counts3/3/2 with correct Maps/name fields, no image/duplicate/secret, empty console error inventory.19 client output files credential scan0matches.0/1/error/null/race/timeout tested offline. Text inspection and screenshots beyond no-overflow, representative320/390/768/1280 and metrics additional widths. No physical-device certification.
## 9. Database
Neon unchanged; SELECT-only checks. Existing six tables3079rows from earlier import. No schema/import writes. Credentials server-only, .env.local ignored. No DB rollback needed.
## 10. API/frontend contract
Existing M3-A DiscoveryPlace -> discoveryToCard -> PlaceCardModel. No image field. EAT GET with intent/locale/preference. Exact0–3 results; no data padding. Abort on selection removal and active response guard; keyed component prevents stale render. API source unchanged.
## 11. UX
No full redesign; selected intent ordering unchanged. Cards text-first, responsive,>=44px CTAs. Loading reserves320px; reset remains available. Home static art stays. Full one-thumb remains later scope.
## 12. Geo
No GPS/nearby work.
## 13. I18n
API vi fixed; pure existing helpers only; no runtime/KO review work.
## 14. Analytics
Unchanged spec-only.
## 15. Notifications
Unchanged spec-only.
## 16. DO NOT REDO
Do not restart M3-A, re-import Neon, regenerate curated dataset, scrape images, treat demo GO/STAY as live, or infer tags for M4. No git clean/reset/stage-all. Run curation in isolated copy.
## 17. Files/ownership
Owned13 paths in sibling commit-allowlist.json:5source,3tests,5docs. Unrelated initial files hash-checked;16 staged renames preserve index. M3-A backend, packages/config/data/env/Home intent components untouched. Existing 7 untracked DB/docs files not committed. Logs/screenshots outside repo.
## 18. Blockers/limits
No blocking M3-B failures. Live data currently supports2/3 for allowed filters; other cardinalities/states tested via fixtures. No full one-thumb, other-section, physical-device or Cloudflare deployment certification. Shared card visual change applies existing demo GO/STAY by design.
## 19. EXACT M4 NEXT STEP
STOP for user review. After explicit M4 authorization: read canonical docs, verify Git and preserved staged work; audit real CAFE/GO/STAY tag/preference coverage before designing mappings/enabling sections. No GPS/analytics/notifications/i18n/deploy implied.
## 20. Recovery
Source/docs before-state backups retained. Dev stopped and viewport reset. No source isolation to restore. Preserve all dirty/staged/untracked work. Local commit protects exactly the13 M3-B paths; post-commit hash updates in four authority documents remain unstaged.
## 21. Startup
Verify actual Git/source versus this snapshot, current authorization, and handoff before proceeding. Stop/update handoff near context limit.

## Checkpoint-only takeover — 2026-10-07T12:31:11+07:00
Real M3-B commit: `e39c7de65fc413f6561e0069642ba58f6bb95f0e`. Verified exact13 allowlisted paths;16 pre-existing staged renames unchanged. Source/tests match validated isolated copy (41 files excluding the deliberately regenerated curated copy), so no tests/build rerun and no fresh runtime PASS claim. Existing validation evidence retained:133/133 tests, lint/typecheck/build and documented live/responsive checks. No source edits, DB operations, push/merge/deploy or M4 work. Final Git intentionally retains16 staged renames,11 inherited unstaged modifications plus4 post-commit authority updates, and7 unrelated untracked files. STOP before M4; await explicit authorization.

## M4-A read-only audit completed
Report: [M4A_REAL_MAPPING_AUDIT](M4A_REAL_MAPPING_AUDIT.md). HEAD e39c7de65fc413f6561e0069642ba58f6bb95f0e unchanged. SELECT-only live audit: CAFE145/GO94/STAY127 active+OPERATIONAL; unique linked active tags2/20/16. All36 catalog tags with vi/en/ko labels, per-section counts/percentages, actual samples per linked tag, UI inventory, SQL mapping counts and semantics/ranking caveats documented. Five DIRECT candidates SAFE by count: GO PHOTO16,NATURE26,ENTERTAINMENT8; STAY NEAR_BEACH19,QUIET8. Ambiguous: GO BEACH/SCENIC (3/19/OR20); STAY CENTRAL16 and DATE10 need label/meaning decision. No current CAFE UI/chips; GENERAL145 is availability only, not a new preference. CAFE mood tags absent; BUDGET absent globally. Target anomaly: CAFE ID138 has primary_type=bar; extra EAT conflicts4,56,108,259,416 documented without edits. featured allfalse; rating/reviews null2/145,5/94,1/127. No application/DB/config/package edits, no commit/push/deploy/tests/build. Evidence/scripts/query outputs under sibling M4A_EVIDENCE_2026-10-07. Previous handoff bytes backed up there.16 staged renames and all unrelated hashes unchanged.15 existing modified tracked paths remain;7 old untracked files preserved plus1 new report. STOP: review report, resolve ambiguous mappings/CAFE UI and type conflict before explicit M4-B instruction. Do not implement M4-B automatically.

## M4-B GO & STAY Real Discovery Handoff — 2026-10-07
1. **Objective**: Connect GO and STAY sections to Neon discovery API; generalize frontend component; preserve EAT Neon discovery; keep CAFE disabled.
2. **Git**: Branch `phase-2a-deploy`. Selective local checkpoint: `f319ae42825eea540281c499486a43d7131f7c8f` — `feat: connect GO and STAY to Neon discovery`. 16 pre-existing staged renames and unrelated modified/untracked files preserved.
3. **Completed**:
   - GO mappings: `chup_anh_dep` -> `PHOTO`, `thien_nhien` -> `NATURE`, `vui_choi` -> `ENTERTAINMENT`, `bien_ngam_canh` -> `BEACH | SCENIC` (20 eligible).
   - STAY mappings: `gan_bien` -> `NEAR_BEACH`, `yen_tinh` -> `QUIET`, `gan_trung_tam` -> `CENTRAL` ("Trung tâm"), `cap_doi` -> `DATE` ("Hẹn hò").
   - Component: `EatDiscoveryResults.tsx` replaced by `DiscoveryResults.tsx` supporting EAT, GO, STAY with complete lifecycle, 15s timeout, stale request protection, no demo fallback.
   - Demo fallback `getPlacesForSelection` removed for GO/STAY.
   - EAT regression verified: Neon-backed discovery intact.
   - CAFE remains disabled: returns 400 `INTENT_NOT_AVAILABLE`.
   - NOW remains sample itinerary.
4. **Validation Evidence**:
   - Lint: PASS (0 errors/warnings).
   - Typecheck: PASS (`tsc --noEmit` exit 0).
   - Tests: 169/169 PASS across 9 test suites.
   - Build: PASS (Compiled in 6.9s, route `/` 14.8 kB).
   - Live smoke: 8 GO/STAY + 3 EAT flows HTTP 200, matching independent Neon query; 0 secret exposures; 400 for CAFE/invalid.
   - Responsive & visual: viewports 320, 360, 390, 393, 430, 768, 1280px inspected; long names wrap cleanly without clipping; >=44px touch targets; 0 venue images.
5. **DO NOT REDO**:
   - Do not rewrite GO/STAY implementation.
   - Do not touch database or re-import.
   - Do not regenerate curated places seed.
   - Do not stage unrelated files or 16 pre-existing staged renames.
6. **EXACT NEXT STEP**:
   - STOP for user review. Await explicit instructions on CAFE UI/mapping or next authorized milestone.
7. **Reconciliation status**:
   - M4-B DONE; commit `f319ae42825eea540281c499486a43d7131f7c8f`; EAT/GO/STAY use Neon; CAFE NOT_STARTED.

## M5-A / M5-A.1 GPS / Nearby Readiness Audit & Contract Lock — 2026-10-08
- Audit & Contract Lock report: [M5A_NEARBY_READINESS_AUDIT.md](M5A_NEARBY_READINESS_AUDIT.md).
- Status: AUDIT & CONTRACT LOCK — VERIFIED. Zero changes to `src/` or `tests/`. Zero DB mutations.
- Candidate retrieval: M5-B repository must bypass pre-geo LIMIT 3 for nearby mode to retrieve all candidates.
- Precision: Haversine full float precision for radius checks (`<= 1.0`, `<= 3.0`, `<= 5.0`) & sorting; 1 decimal only for final display.
- Accuracy: `accuracy <= 1000m` uses Nearby; `> 1000m` warns and falls back to all-city discovery.
- Expansion rule: Strictly `evaluate <= 1km (>=3 ? R=1) -> evaluate <= 3km (>=3 ? R=3) -> evaluate <= 5km (R=5)`; max 3 places, no fake padding.
- Ranking: Locked to `distanceRawKm ASC, featured DESC, review_count DESC NULLS LAST, rating DESC NULLS LAST, id ASC`.
- Empty state: Truthful 0–2 results; 0 results shows `"Không tìm thấy địa điểm phù hợp trong 5 km."` + CTA `"Xem trên toàn Đà Nẵng"`.
- Privacy: No app logging, no analytics, no DB/storage persistence, no URL GPS leakage, no coordinate echo in API response.
- Audit & contract lock complete.

## M5-B Nearby Discovery Implementation Handoff — 2026-10-08
1. **Objective**: Implement Nearby Discovery for EAT, GO, and STAY intents connected to live Neon PostgreSQL data; dual-path API routing; candidate retrieval bypassing pre-geo LIMIT 3; pure TS geo engine; user-driven Geolocation UX; PlaceCard distance badges; citywide regression 100% preserved.
2. **Git**: Branch `phase-2a-deploy`. Selective local commit authorized: `feat: add nearby discovery with GPS`. No push to remote.
3. **Completed**:
   - `src/lib/data/discovery-contract.ts`: paired `lat`/`lng` validation, `nearby-provisional-v1` ranking rule, `meta.radiusKm` (1 | 3 | 5) & `meta.nearby` (true), `distanceKm` optional place field.
   - `src/lib/geo/nearby-engine.ts`: pure TS evaluator with strict 1 -> 3 -> 5 km radius expansion, full float precision for boundary checks and sorting, locked tie-breaking (`distanceRawKm ASC, featured DESC, review_count DESC, rating DESC, id ASC`), candidate deduplication by ID, 1-decimal display formatting.
   - `src/lib/data/place-repository.ts`: added `NEARBY_CANDIDATES_SQL` and `findNearbyCandidateRows()` retrieving all operational candidates for section + tags without pre-geo `LIMIT 3`.
   - `src/app/api/discovery/route.ts`: dual-path routing (nearby vs citywide).
   - `src/components/results/DiscoveryResults.tsx`: Geolocation state machine (`idle`, `requesting`, `granted`, `denied`, `unavailable`, `timeout`, `inaccurate`), 8s timeout, accuracy <= 1000m guard, fallback handling, retry, toggling, reset.
   - `src/components/results/ResultList.tsx`: "Gần tôi" action button (>=44px), loading spinner, fallback warning banners with "Thử lại", dedicated Nearby empty state within 5 km with CTA "Xem trên toàn Đà Nẵng".
   - `src/components/results/PlaceCard.tsx`: distance badge (`0,8 km`) when `distanceKm` present; omitted when citywide.
   - `tests/nearby.test.ts` (18 unit tests) and `tests/nearby-frontend.test.tsx` (11 integration tests).
4. **Validation Evidence**:
   - Lint: PASS (`✔ No ESLint warnings or errors`).
   - Typecheck: PASS (`tsc --noEmit` exit 0).
   - Tests: 183/183 non-mutating tests PASS across 10 test files.
   - Build: PASS (Next.js 15.5.27 compiled in 21.5s, 0 errors).
   - Live API smoke with Neon: Hải Châu EAT an_ngon (R=1, 3 results), EAT dac_san (R=5, 1 result), GO thien_nhien (R=5, 0 results), STAY gan_trung_tam (R=1, 3 results), Mỹ Khê STAY gan_bien (R=3, 3 results), Citywide EAT an_ngon (200, no distance, citywide ranking), invalid missing lng (400 INVALID_PARAMETER), CAFE inactive (400 INTENT_NOT_AVAILABLE).
   - Browser responsive smoke: 320, 390, 430, 768px viewports inspected; no clipping, touch targets >=44px.
5. **DO NOT REDO**:
   - Do not touch database or re-import.
   - Do not regenerate curated places seed.
   - Do not stage unrelated files or pre-existing staged renames.
   - Do not push to remote.
6. **EXACT NEXT STEP**:
   - STOP for user review. Await explicit instructions on next authorized milestone.
7. **Reconciliation status**:
   - M5-B DONE; selective local commit completed and pushed to remote; M6-A audit completed.

## M6-A Mentor Mobile UX / One-Hand Audit Handoff — 2026-10-08
1. **Objective**: Conduct comprehensive one-hand reachability and mobile ergonomics audit across entire user journey and viewports (320, 390, 393, 430, 768px).
2. **Status**: AUDIT ONLY — COMPLETED. Zero modifications to `src/` or `tests/`. Report at `docs/M6A_MENTOR_ONE_HAND_UX_AUDIT.md`.
3. **Verdict**: FAIL (one-hand ergonomics not met).
   - Primary actions ("Gần tôi", "Đổi lựa chọn") anchored at the very top of the screen ($y \approx 24\text{px}$), outside natural thumb reach.
   - Dynamic reordering of intent cards on tap and Hero unmount causes jarring position jumps.
   - Absence of fixed/sticky bottom action zone forces user to backtrack and scroll all the way back up to the top.
4. **DO NOT REDO**:
   - Do not re-audit M6-A.
   - Do not modify application source or tests until M6-B is explicitly authorized.
5. **EXACT NEXT STEP**:
   - STOP for user review. Await explicit authorization to implement M6-B (One-Hand Ergonomics & Bottom Action Bar).

## M6-B Mobile One-Hand UX Implementation Handoff — 2026-10-08
1. **Objective**: Implement one-hand mobile UX, stable intent positioning, in-place accordion expansion, persistent fixed BottomActionBar, zero duplicate top controls, and adequate content clearance.
2. **Git**: Branch `phase-2a-deploy`. Selective local commit authorized: `feat: improve one-hand mobile discovery UX`. No push to remote.
3. **Completed**:
   - `src/components/results/BottomActionBar.tsx`: Fixed bottom action bar, safe area padding, primary state-aware actions ("Gần tôi", "Toàn Đà Nẵng", "Thử lại", "Xem toàn Đà Nẵng", "Đang định vị…"), secondary action "Đổi lựa chọn", min-h-[44px].
   - `src/components/results/ResultList.tsx`: Removed duplicate top header buttons; integrated `BottomActionBar`; removed top duplicate inline retry/CTA buttons; added bottom content clearance `pb-28 sm:pb-32 pb-[calc(7rem+env(safe-area-inset-bottom,0px))]`.
   - `src/components/home/IntentGrid.tsx`: Completely removed intent card reordering; DOM order strictly preserved as `[NOW, EAT, GO, STAY]`; in-place accordion expands directly below the selected intent card (`#preference-panel-active`).
   - `src/app/page.tsx`: Hero remains mounted during intent selection state (`{selectedPreference === null && <Hero />}`); jumpy auto-scroll on intent click suppressed.
   - `tests/one-hand-ux.test.tsx`: 13 new unit/integration tests for position stability, in-place accordion, BottomActionBar state machine, zero top controls.
4. **Validation Evidence**:
   - Lint: PASS (`✔ No ESLint warnings or errors`).
   - Typecheck: PASS (`tsc --noEmit` code 0).
   - Tests: 196/196 tests PASS across 11 suites.
   - Build: PASS (Next.js 15.5.27 compiled in 4.4s, 0 errors).
   - Live visual browser verification: Tested viewports 320x640, 390x844, 393x852, 430x932, 768x1024.
   - Rendered bounds at 390x844: Hero at $y=44\text{px}$; STAY card at $y=570\text{px}$ before and after tap; preference chips at $y=645\text{px}-745\text{px}$; BottomActionBar at $y=776\text{px}-844\text{px}$; Maps CTA at $y=980\text{px}-1030\text{px}$ fully visible with $112\text{px}$ clearance.
   - Scroll-back-to-control = 0.
5. **DO NOT REDO**:
   - Do not reorder intent cards.
   - Do not duplicate bottom controls back to header.
   - Do not modify database or re-import.
   - Do not push to remote.
6. **EXACT NEXT STEP**:
   - STOP for user review. Await explicit authorization before proceeding to any subsequent milestone.
7. **Reconciliation status**:
   - M6-B DONE; selective local commit authorized; STOP.
## M7-A i18n Runtime Readiness Audit Handoff — 2026-10-08
1. **Objective**: Conduct exhaustive technical audit of i18n readiness across source, database, API, and frontend UI for Vietnamese (`vi`), English (`en`), and Korean (`ko`).
2. **Status**: AUDIT ONLY — COMPLETED. Zero modifications to `src/` or `tests/`. Report at `docs/M7A_I18N_RUNTIME_READINESS_AUDIT.md`.
3. **Findings Summary**:
   - Source: `src/lib/i18n/locales.ts` and `messages.ts` provide pure BCP-47 resolver and 27 typed keys (22 tests PASS). Zero current runtime usage in UI.
   - Database: 500 places in Neon have 1,500 translation rows (`vi`, `en`, `ko`, 100% coverage). Venue names are kept authentic (identical to Vietnamese proper name); primary type labels are fully translated. 36 tags have 108 translation rows (`vi`, `en`, `ko`, 100% coverage).
   - API: `GET /api/discovery` accepts `locale` (`vi`, `en`, `ko`, default: `vi`); repository joins requested locale with Vietnamese fallback.
   - Frontend: `DiscoveryResults.tsx` hardcodes `locale: "vi"`. 45+ UI strings hardcoded in Vietnamese identified. `<html lang="vi">` is static.
   - UX & Ergonomics: Language switcher must reside in top utility bar / header (touch target >= 44px) to avoid compromising the M6-B bottom thumb zone (`BottomActionBar`).
   - SSR Safety: Server renders default `vi`, client resolves browser/stored locale post-hydration to eliminate React hydration mismatch risk.
4. **DO NOT REDO**:
   - Do not re-audit M7-A.
   - Do not modify application source or tests until M7-B is explicitly authorized.
   - Do not modify database or mutate translations.
5. **EXACT NEXT STEP**:
   - STOP for user review. Await explicit authorization before implementing M7-B (Runtime i18n with VI/EN/KO and language switcher).
## M7-A.1 i18n UX / Runtime Contract Lock Handoff — 2026-10-08
1. **Objective**: Lock the architectural, UX, ergonomics, and runtime contract for i18n across Vietnamese (`vi`), English (`en`), and Korean (`ko`) before M7-B implementation.
2. **Status**: CONTRACT LOCK ONLY — COMPLETED. Zero modifications to `src/` or `tests/`. Zero DB mutations.
3. **Locked Decisions (1–12)**:
   - Precedence: `manual > navigator.languages > navigator.language > vi`.
   - Storage: `localStorage` key `laca.ui-locale.v1`; Auto clears key; try/catch resilience; in-memory fallback.
   - Switcher UX: Home secondary trigger button situated in reachable lower zone opening bottom sheet / compact selector (`VI / EN / 한국어 / Theo thiết bị`). Never placed in `BottomActionBar`. Touch targets >= 44px.
   - Dynamic Switch: Preserves intent, preference, nearby state, coordinates, scroll; re-fetches API; no mock fallback.
   - Layout Stability: Replaced unrealistic 0px claim with rigorous boundary: no intent reorder, no state reset, no scroll jump, BottomActionBar fixed, no horizontal overflow/clipping.
   - Hydration: Server base `vi`; client resolves in `useEffect`; brief first-load transition acknowledged; no blocking spinner.
   - HTML lang: Synchronizes `document.documentElement.lang` on resolution and manual switch.
   - Translation Boundary: Neon owns venues/tags; frontend owns UI chrome.
   - DB Fallback: `req -> vi -> source`.
   - Formatting: `Intl.NumberFormat(activeLocale)` for numbers; `km` unchanged.
   - NOW Scope: Chrome strings only; logic/data remains sample.
   - Acceptance: 320, 390, 430px responsive checks; no truncating action verbs.
4. **DO NOT REDO**:
   - Do not re-audit M7-A or re-lock M7-A.1 contracts.
   - Do not modify application source or tests until M7-B is explicitly authorized.
   - Do not push language switcher to the top header or into discovery BottomActionBar.
5. **EXACT NEXT STEP**:
   - STOP for user review. Await explicit authorization before implementing M7-B.

## M7-B VI / EN / KO Runtime i18n Implementation Handoff — 2026-10-08
1. **Objective**: Implement genuine multilingual runtime capabilities across Vietnamese (`vi`), English (`en`), and Korean (`ko`) with auto-detection, manual selection, localStorage persistence (`laca.ui-locale.v1`), dynamic Discovery API locale, full UI string localization, and dynamic HTML lang synchronization, strictly preserving M6-B mobile one-hand ergonomics and M5-B Nearby discovery contracts.
2. **Status**: IMPLEMENTATION & VERIFICATION COMPLETE — ALL PASS.
3. **Verified Achievements**:
   - Runtime Locale Provider: `src/components/i18n/LocaleProvider.tsx` with zero hydration warnings, `try/catch` storage handling, and `Intl.NumberFormat` formatting.
   - Language Selector UX: `src/components/i18n/LanguageSelector.tsx` located in reachable lower zone, opening bottom sheet modal with 4 options ($\ge 48\text{px}$). Kept out of `BottomActionBar`.
   - Dynamic API: `/api/discovery?intent=...&locale=<activeLocale>&preference=...` with stale request cancellation.
   - Live Neon DB translations verified: returns translated `primary_type_label` and `tags` across all 3 locales. Authentic venue names preserved.
   - Full UI Dictionary: 45+ keys in `src/lib/i18n/messages.ts`. Brand `LA CÀ ĐÀ NẴNG` and uppercase intent labels intact.
   - Tests: 12/12 test suites, 221/221 tests PASS (`vitest`). Lint PASS (0 warnings, 0 errors). Typecheck PASS. Next.js production build PASS.
   - Live browser verification: 390x844, 320x800, 430x932 verified. WebP session video recorded.
   - Curated dataset: Clean (`src/data/curated/curated-places.json` untouched).
4. **DO NOT REDO / DO NOT TOUCH**:
   - Do not reinstall external i18n libraries.
   - Do not alter `messages.ts` without running `tests/i18n.test.ts` and `tests/runtime-i18n.test.tsx`.
   - Do not move LanguageSelector to the top header or into discovery `BottomActionBar`.
   - Do not mutate Neon PostgreSQL database.
   - Do not reorder intent cards `[NOW, EAT, GO, STAY]`.
5. **EXACT NEXT STEP**:
   - STOP for user review. Await explicit authorization before proceeding to next milestone (e.g. M8 Analytics/Notifications or further scope).

## M7-C Intent Visuals & Language Placement Hotfix Handoff — 2026-10-08
1. **Objective**: Resolve owner-reported issues on intent visuals (broken image / alt text leakage on EAT, GO, STAY) and reposition LanguageSelector into a clean horizontal footer utility row (`LA CÀ ĐÀ NẴNG` on left, `[ 🌐 Tiếng Việt ]` / `[ 🌐 English ]` / `[ 🌐 한국어 ]` on right). Clarify Next.js dev "N" indicator without code alteration.
2. **Status**: IMPLEMENTATION & VERIFICATION COMPLETE — ALL PASS.
3. **Changes**:
   - `src/components/home/IntentCard.tsx`: Replaced fragile `<Image>` calls with native inline vector icons (`lucide-react`: `Utensils`, `Compass`, `Bed`, `Zap`), tailored gradient containers, and emoji badges.
   - `src/components/i18n/LanguageSelector.tsx`: Render clean native language names on trigger (`Tiếng Việt` / `English` / `한국어`).
   - `src/app/page.tsx`: Removed floating middle language button. Formatted footer into horizontal utility row with brand on left and LanguageSelector on right.
   - `tests/m7c-visual-hotfix.test.tsx`: Added dedicated automated test suite (4 tests) verifying vector visuals, footer layout, label transitions, and touch target ergonomics.
   - Next.js "N" indicator: Confirmed dev-only indicator, automatically omitted from production builds (`next build`). Preserved in dev.
4. **Validation**:
   - `npm run lint`: PASS (0 warnings, 0 errors).
   - `npm run typecheck`: PASS (`tsc --noEmit` code 0).
   - `npx vitest run --exclude "**/curation.test.ts"`: 13 suites, 225/225 tests PASS (100%).
   - `npm run build`: PASS (compiled in 4.9s, static pages 5/5 generated).
   - Curated dataset: Clean (`git diff HEAD -- src/data/curated/curated-places.json` empty).
5. **DO NOT REDO / DO NOT TOUCH**:
   - Do not reintroduce venue images or unoptimized SVG image calls in intent cards.
   - Do not move LanguageSelector to the top header or inside discovery `BottomActionBar`.
   - Do not hack/hide the Next.js dev indicator in app source code.
   - Do not push to remote.
6. **EXACT NEXT STEP**:
   - STOP for Owner review. Await explicit instructions.

## M8-A Analytics Readiness Audit Handoff — 2026-10-08
1. **Objective**: Conduct comprehensive analytics readiness audit, design high-signal 11-event vocabulary, define strict privacy/GPS/session contracts, evaluate storage options, and formulate test plan for M8-B without modifying runtime code or database.
2. **Status**: AUDIT & CONTRACT DESIGN COMPLETE — ALL PASS.
3. **Core Deliverables**:
   - `docs/M8A_ANALYTICS_READINESS_AUDIT.md`: Complete audit and specification report.
   - `docs/DECISIONS.md`: Decisions 88–95 locked.
   - 11-event minimal vocabulary (`session_started`, `home_viewed`, `intent_selected`, `preference_selected`, `results_shown`, `nearby_requested`, `nearby_resolved`, `nearby_failed`, `citywide_selected`, `maps_clicked`, `language_changed`).
   - Strict zero-raw-GPS, zero-PII, ephemeral `sessionStorage` identity contract.
   - Recommended Option A (First-Party Neon Analytics via `/api/analytics` route).
4. **DO NOT REDO / DO NOT TOUCH**:
   - Do not implement runtime analytics code until M8-B is explicitly authorized.
   - Do not install third-party tracking packages.
   - Do not mutate Neon database schema in M8-A.
   - Do not collect raw GPS coordinates, IP addresses, or personal data.
5. **EXACT NEXT STEP**:
   - STOP for Owner review. Await explicit authorization before implementing M8-B.

## M8-A.1 Analytics Contract Correction & Lock Handoff — 2026-10-08
1. **Objective**: Reconcile Neon catalog ground truth vs documentation drift, unify analytics property naming across client and schema, lock discovery journey lifecycle (`journey_id`), define session timeout policy, eliminate `metadata JSONB` for privacy allowlisting, secure public `/api/analytics` endpoint, lock GPS privacy and retention contracts, specify SQL migration artifact convention, and define canonical 11-event matrix and funnel semantics before M8-B is permitted to mutate the database.
2. **Status**: READ-ONLY AUDIT & CONTRACT LOCK COMPLETE — ALL PASS.
3. **Core Deliverables**:
   - `docs/M8A_ANALYTICS_READINESS_AUDIT.md`: Fully revised audit and canonical contract document.
   - `docs/DECISIONS.md`: Decisions 96–105 appended and locked.
   - Live Neon Catalog Ground Truth: SELECT query verified exactly 6 tables and 3,079 total rows (`places`: 500, `place_translations`: 1,500, `place_tags`: 841, `tags`: 36, `tag_translations`: 108, `administrative_units`: 94). DOC/DB drift resolved.
   - Canonical 17-column DB Schema & Property Table (typed columns only, zero JSONB).
   - Ephemeral session (`sessionStorage`, tab lifetime) & Journey lifecycle (`journey_id`, resets on "Đổi lựa chọn" / Home return).
   - Deduplication rules: locale changes emit `language_changed` but never `results_shown`.
   - Security specs: Zod validation, 2 KB limit, parameterized queries, indicative telemetry disclaimer.
   - Database Change Convention: `docs/schema/002_analytics_events.sql` tracked migration for M8-B.
4. **DO NOT REDO / DO NOT TOUCH**:
   - Do not re-audit Neon database row counts or tables.
   - Do not re-open property names or schema columns.
   - Do not reintroduce `metadata JSONB` or arbitrary client properties.
   - Do not mutate the database or run migrations in M8-A.1.
   - Do not modify application source code in `src/` or tests in `tests/`.
   - Do not push to remote.
5. **EXACT NEXT STEP**:
   - STOP for Owner review. Await explicit authorization before proceeding to M8-B (Analytics Runtime Implementation).

## M8-A.2 Final Analytics Contract Patch Handoff — 2026-10-08
1. **Objective**: Patch final 4 contract inconsistencies and lock runtime telemetry requirements before M8-B database mutation: lock event count to 11, mandate server-generated `occurred_at TIMESTAMPTZ`, require server-derived `environment`, separate client telemetry fields from server fields with Zod `.strict()`, update GPS privacy and cost wording, and lock canonical schema.
2. **Status**: FINAL CONTRACT PATCH COMPLETE — ALL PASS.
3. **Core Deliverables & Specifications**:
   - `docs/M8A_ANALYTICS_READINESS_AUDIT.md`: Fully reconciled contract specification.
   - `docs/DECISIONS.md`: Decisions 106–112 locked.
   - Event Count: Exactly 11 allowed events (`session_started`, `home_viewed`, `intent_selected`, `preference_selected`, `results_shown`, `nearby_requested`, `nearby_resolved`, `nearby_failed`, `citywide_selected`, `maps_clicked`, `language_changed`).
   - Server-Generated Timestamp: `occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW()`. Client does not transmit timestamp.
   - Server-Derived Environment: `environment VARCHAR(15) NOT NULL CHECK (environment IN ('production', 'preview'))`. Derived on server from runtime config; client cannot supply or self-declare.
   - Client Telemetry Payload Contract: 14 allowed fields; server-owned fields (`id`, `occurred_at`, `environment`) are rejected via Zod `.strict()`.
   - GPS Privacy & Infrastructure: Canonical non-absolute wording locked.
   - Infrastructure Cost Rationale: Based on reusing Neon, no extra vendor SDKs; actual cost depends on plan.
   - Final Canonical Schema: DDL locked with `TIMESTAMPTZ`, boolean defaults, CHECK constraints, and 4 indexes.
   - Database Migration Convention: `docs/schema/002_analytics_events.sql` designated for M8-B.
4. **DO NOT REDO / DO NOT TOUCH**:
   - Do not mutate Neon database schema in M8-A.2.
   - Do not re-open event count (11 events locked).
   - Do not accept client timestamps or environments.
   - Do not modify application source code in `src/` or tests in `tests/`.
   - Do not push to remote.
5. **M8-B Readiness**: YES.
6. **EXACT NEXT STEP**:
   - STOP for Owner review. Await explicit authorization before proceeding to M8-B (Analytics Runtime Implementation).

## M8-B First-Party Product Analytics Implementation Handoff — 2026-10-08
1. **Objective**: Implement first-party analytics runtime and execute limited Neon database migration creating strictly `analytics_events` and its 4 indexes. Preserve existing 6 content tables intact. Preserve M6 one-hand UX, M7 i18n, Nearby discovery, and EAT/GO/STAY results.
2. **Status**: COMPLETED & VERIFIED.
3. **Database Migration Artifact & Live Database Verification**:
   - Tracked migration artifact: `docs/schema/002_analytics_events.sql`.
   - Migration applied to live Neon PostgreSQL: created table `analytics_events` (17 columns) and 4 indexes (`idx_analytics_events_occurred_at`, `idx_analytics_events_session_id`, `idx_analytics_events_journey_id`, `idx_analytics_events_name_env`).
   - Existing content table safety: verified 500 places, 1500 place_translations, 841 place_tags, 36 tags, 108 tag_translations, 94 administrative_units = 3,079 total rows before and after migration (100% untouched).
   - Live DB verification: ingested preview test event via API logic, inspected row via SELECT, ran 5 analytical queries, cleanly deleted test row (initial and final row count = 0).
4. **Runtime Implementation**:
   - `src/lib/analytics/types.ts`: 11 event vocabulary, allowed client fields vs server-owned fields.
   - `src/lib/analytics/validator.ts`: Zod `.strict()` validation, rejection of server-owned fields (`id`, `occurred_at`, `environment`), and privacy scanner rejecting raw GPS/PII (`lat`, `lng`, `accuracy`, `ip`, etc.).
   - `src/lib/analytics/db.ts`: Server-side environment derivation (`production` | `preview`), parameterized SQL INSERT via Neon driver.
   - `src/app/api/analytics/route.ts`: Edge handler, $\le 2\text{ KB}$ body limit, status codes 202, 400, 413, 500.
   - `src/lib/analytics/client.ts`: Non-blocking dispatcher (`sendBeacon` / `fetch keepalive`), dev/test no-op, ephemeral session (`laca.analytics-session.v1`), journey store (`laca.analytics-journey.v1`), meaningful tap counter (+1 on intent, +1 on preference, +1 on nearby toggle).
   - Component telemetry wired in `page.tsx`, `DiscoveryResults.tsx`, `PlaceCard.tsx`, and `LanguageSelector.tsx`.
5. **Validation Evidence**:
   - `npx vitest run --exclude "**/curation.test.ts"`: 14 test suites, 259 total tests ALL PASS (`tests/analytics.test.tsx`: 34/34 PASS).
   - `npm run lint`: 0 warnings, 0 errors.
   - `npm run typecheck`: 0 errors.
   - `npm run build`: Production build succeeded.
   - Dataset `src/data/curated/curated-places.json`: 100% clean, 0 diff.
6. **Retention Policy**:
   - 60-day target documented; automated purge NOT implemented in M8-B (no background cron jobs).
7. **DO NOT REDO / DO NOT TOUCH**:
   - Do not re-run migration `002_analytics_events.sql` (already applied).
   - Do not mutate the 6 content tables.
   - Do not install third-party analytics SDKs.
   - Do not build an analytics dashboard in M8-B.
   - Do not modify NOW static sample behavior.
   - Do not activate CAFE.
   - Do not push to remote.
8. **EXACT NEXT STEP**:
   - STOP — WAITING FOR OWNER REVIEW.

## M8-B.1 Cloudflare Analytics Environment Fix Handoff — 2026-10-08
1. **Objective**: Fix the non-deterministic Cloudflare/OpenNext preview environment classification blocker identified in M8-B independent verification without changing analytics schema, content tables, or event contracts.
2. **Status**: COMPLETED & VERIFIED.
3. **Core Deliverables**:
   - `APP_ENV` locked as canonical server environment variable (`preview` | `production`).
   - `src/lib/analytics/db.ts`: `resolveServerEnvironment()` deterministic priority; invalid/unrecognized `APP_ENV` safely defaults to `"preview"`; `IS_PREVIEW` checked before fallbacks; removed legacy `VERCEL_ENV`.
   - `wrangler.jsonc`: Added top-level `vars: { "APP_ENV": "production" }`, `env.preview: { "name": "la-ca-da-nang-preview", "vars": { "APP_ENV": "preview" } }`, and `env.production: { "vars": { "APP_ENV": "production" } }`.
   - `package.json`: Added `npm run deploy:preview` (`opennextjs-cloudflare build && opennextjs-cloudflare deploy --env preview`).
   - `.env.example`: Documented `APP_ENV=preview` (allowed: `preview | production`).
   - `tests/analytics.test.tsx`: Added comprehensive resolver unit tests (14 suites, 262/262 PASS).
4. **Validation Evidence**:
   - `npx vitest run --exclude "**/curation.test.ts"`: 14 test suites, 262 passed (262).
   - `npm run lint`: 0 warnings, 0 errors.
   - `npm run typecheck`: 0 errors.
   - `npm run build`: Success.
   - Dataset `src/data/curated/curated-places.json`: 100% clean (0 diff).
   - Live Neon DB Verification: Tested preview event ingest with `APP_ENV=preview` and `NODE_ENV=production`; verified row stored as `environment = 'preview'`; cleaned up test event (0 rows remaining); 6 content tables intact at 3,079 rows.
5. **DO NOT REDO / DO NOT TOUCH**:
   - Do not mutate the 6 content tables or `analytics_events` schema.
   - Do not re-run migrations.
   - Do not alter 11 canonical event contracts.
   - Do not push to remote.
6. **M8-B Ready for Final Verification**: YES.
7. **EXACT NEXT STEP**:
   - STOP — WAITING FOR OWNER REVIEW.

## M9-A Notifications Readiness Audit Handoff — 2026-10-08
1. **Objective**: Conduct comprehensive product and technical readiness audit for "Nhắc tôi trước khi đi" (visit reminder) without modifying runtime code, database schemas, or package dependencies.
2. **Status**: COMPLETED & VERIFIED.
3. **Core Findings & Contracts**:
   - `docs/M9A_NOTIFICATIONS_READINESS_AUDIT.md`: Complete audit document created.
   - Current Foundation: Zero notification API code, zero service workers, zero PWA manifests, zero push packages, zero reminder DB tables, zero Cloudflare crons.
   - Product Gap Solved: Venue database stores zero schedule/operating time data. Explicit visit time selection UI (`scheduled_visit_at`) is strictly required.
   - Browser Realities: Mobile Safari on iOS does not support background Web Push or Notification API without Home Screen PWA installation (iOS 16.4+). Mobile browsers kill background tab timers when suspended.
   - Recommended Architecture: RFC 5545 `.ics` Calendar Reminder Export with 30-minute advance `VALARM`. Requires zero Cloudflare crons and zero Neon DB bloat.
   - Timezone: `Asia/Ho_Chi_Minh` (UTC+07:00, no DST) for user calculations, UTC ISO strings for storage.
   - Analytics: Preserves verified 11-event M8 schema intact; extension telemetry proposed for future review.
4. **DO NOT REDO / DO NOT TOUCH**:
   - Do not implement M9-B notification runtime without explicit authorization.
   - Do not alter `src/` or `tests/`.
   - Do not mutate the 6 content tables or `analytics_events`.
   - Do not alter the 11 canonical M8 analytics events.
   - Do not push to remote.
5. **EXACT NEXT STEP**:
   - STOP — WAITING FOR OWNER REVIEW.

## M9-A.1 Reminder MVP Contract Lock Handoff — 2026-10-08
1. **Objective**: Eliminate remaining architectural contradictions and lock the definitive product, technical, and testing specification for the "Nhắc tôi" Calendar Reminder Export MVP.
2. **Status**: CONTRACT LOCK COMPLETE — ALL VERIFIED.
3. **Locked Architectural Specifications**:
   - Canonical Feature Identity: "Nhắc tôi" $\rightarrow$ Calendar Reminder Export (`.ics`). Never described as push/browser notification.
   - Browser Permission Removal: M9-B does NOT invoke `Notification.requestPermission()`, `new Notification()`, or `PushManager`. Permission states (`granted`, `denied`, `default`) removed from M9-B scope and test suites.
   - Delivery Guarantee Contract: Generates RFC 5545 `.ics` with 30-minute `VALARM`. Prohibited claiming "100% reliable" or guaranteed delivery.
   - Visit Time Semantics: `scheduled_visit_at`. UI asks: *"Bạn muốn đến đây lúc nào?"*. Alarm triggers 30m before visit (`TRIGGER:-PT30M`).
   - Locked Quick Presets: `1 giờ nữa (+1h)`, `2 giờ nữa (+2h)`, `4 giờ nữa (+4h)`, and `Chọn ngày & giờ`. Custom selection must be `> now + 30 minutes`.
   - Timezone Contract: Display prominently notes *"Giờ Đà Nẵng (GMT+7)"* in `Asia/Ho_Chi_Minh`. Converted to UTC `Z` for ICS event export.
   - Storage Contract: `localStorage` key `laca.reminders.v1` as export metadata log; no `sent`/`delivered`/`dismissed` statuses.
   - Cancellation Policy: Prohibited "Huỷ thông báo". M9-B focuses purely on creation/export.
   - Technical & Data Boundaries: 100% client-side frontend code. Zero Neon tables, zero Cloudflare crons, zero service workers, zero VAPID keys. Verified 11-event M8 analytics schema and 262 existing tests 100% untouched.
4. **DO NOT REDO / DO NOT TOUCH**:
   - Do not implement M9-B runtime before Owner review.
   - Do not modify `src/` or `tests/`.
   - Do not add tables or migrations to Neon.
   - Do not touch the 11 M8 analytics events.
   - Do not push to remote.
5. **M9-B Readiness**: YES.
6. **EXACT NEXT STEP**:
   - STOP — WAITING FOR OWNER REVIEW.

## M9-B Calendar Reminder MVP Implementation Handoff — 2026-10-08
1. **Objective**: Implement the "Nhắc tôi" Calendar Reminder Export MVP strictly per M9-A/M9-A.1 contract:
   - Secondary `🔔 Nhắc tôi` button on PlaceCard ($\ge 44$px).
   - Accessible bottom sheet dialog in lower one-thumb reach zone.
   - Quick presets (`+1h`, `+2h`, `+4h`) and custom date/time picker.
   - Deterministic `Asia/Ho_Chi_Minh` (GMT+7) wall-clock interpretation $\rightarrow$ UTC `Z`.
   - RFC 5545 `.ics` generator with 30-minute advance `VALARM` (`TRIGGER:-PT30M`, `ACTION:DISPLAY`).
   - UTF-8 Blob calendar download (`la-ca-reminder-<place-id>.ics`).
   - Safe `localStorage` log (`laca.reminders.v1`).
2. **Status**: COMPLETED & VERIFIED — ALL PASS.
3. **Files Created / Modified**:
   - `src/lib/reminders/types.ts`: Local reminder record & preset interfaces.
   - `src/lib/reminders/time.ts`: Asia/Ho_Chi_Minh timezone math, presets, wall-clock parsing & validation.
   - `src/lib/reminders/ics.ts`: RFC 5545 `.ics` generator, VALARM, escaping, download & URL revoke.
   - `src/lib/reminders/storage.ts`: Safe `try/catch` `localStorage` operations on `laca.reminders.v1`.
   - `src/components/reminders/ReminderSheet.tsx`: Accessible bottom sheet dialog with safe-area clearance.
   - `src/components/results/PlaceCard.tsx`: Secondary `🔔 Nhắc tôi` CTA and `ReminderSheet` integration.
   - `src/lib/i18n/messages.ts`: Reminder strings in `vi`, `en`, and `ko`.
   - `tests/reminders.test.tsx`: 24 dedicated automated unit and integration tests.
   - `docs/M9B_VERIFICATION.md`: Verification report.
   - Authority documents updated: `CURRENT_STATE.md`, `DECISIONS.md`, `AGENT_TASK_QUEUE.md`, `HANDOFF_CURRENT.md`.
4. **Validation Evidence**:
   - `npx vitest run --exclude "**/curation.test.ts"`: 15 suites, **286 passed (286)**.
   - `npm run lint`: 0 warnings, 0 errors.
   - `npm run typecheck`: 0 errors.
   - `npm run build`: Production build succeeded in 16.0s.
   - `git diff --check`: Clean (0 whitespace errors).
   - Dataset `src/data/curated/curated-places.json`: 100% clean (0 diff).
   - Grep verification: 0 occurrences of `Notification.requestPermission`, `new Notification`, `PushManager`, `serviceWorker.register`, or `VAPID`.
   - Analytics verification: Exactly 11 canonical events intact; 0 reminder events added.
   - Live browser verification: Inspected at 320px, 390px, 393px, 430px; 0 horizontal overflow; $\ge 44$px touch targets.
   - Physical Calendar Import: NOT VERIFIED (requires physical mobile phone).
5. **DO NOT REDO / DO NOT TOUCH**:
   - Do not mutate Neon DB tables or schemas.
   - Do not alter the 11 M8 analytics events.
   - Do not add Web Push, Service Worker, or Notification API calls.
   - Do not push to remote repository (`origin`).
6. **M9-B Readiness**: DONE — READY FOR OWNER REVIEW.
7. **EXACT NEXT STEP**:
   - STOP — WAITING FOR OWNER REVIEW.

## M9-B.1 Calendar Reminder Semantic Fix Handoff — 2026-10-08
1. **Objective**: Apply three semantic corrections to the Calendar Reminder MVP export feature:
   - Remove fabricated visit duration: VEVENT must strictly contain `DTSTART` and no invented `DTEND`.
   - Remove misleading "Đã lên lịch" persistent badge from `PlaceCard.tsx`.
   - Update post-export confirmation copy across `vi`, `en`, and `ko` to truthfully instruct opening/saving in Calendar app, without false claims of scheduling/delivery.
   - Retain `localStorage` (`laca.reminders.v1`) strictly for local export initiation/configuration metadata (no `delivered`, `sent`, `calendar_synced`, `imported`).
2. **Status**: COMPLETED & VERIFIED — ALL PASS.
3. **Files Modified**:
   - `src/lib/reminders/ics.ts`: Removed `visitEndUtc` option and `DTEND` generation from VEVENT.
   - `src/components/results/PlaceCard.tsx`: Removed `hasReminder` state, `getReminderForPlace` query on mount, and persistent "Đã lên lịch" badge.
   - `src/lib/i18n/messages.ts`: Updated `reminder.exportSuccess` in `vi`, `en`, and `ko`.
   - `tests/reminders.test.tsx`: Expanded to 27 tests covering DTSTART-only RFC 5545, badge removal, truthful copy, and strict storage schema.
   - Documentation: `docs/M9B_VERIFICATION.md`, `docs/DECISIONS.md` (Decisions 149–151), `docs/CURRENT_STATE.md`, `docs/HANDOFF_CURRENT.md`, `docs/AGENT_TASK_QUEUE.md`.
4. **Validation Evidence**:
   - `npx vitest run --exclude "**/curation.test.ts"`: 15 suites, **289 passed (289)**.
   - `npm run lint`: 0 warnings, 0 errors.
   - `npm run typecheck`: 0 errors.
   - `npm run build`: Production build succeeded.
   - `git diff --check`: Clean (0 whitespace errors).
   - Dataset `src/data/curated/curated-places.json`: 100% clean (0 diff).
   - Physical Calendar Import: NOT VERIFIED (requires physical mobile phone).
5. **DO NOT REDO / DO NOT TOUCH**:
   - Do not re-add `DTEND` or invent visit duration.
   - Do not restore "Đã lên lịch" or claim calendar import status.
   - Do not mutate Neon DB tables or schemas.
   - Do not alter the 11 canonical M8 analytics events.
   - Do not add Web Push, Service Worker, or Notification API calls.
   - Do not push to remote repository (`origin`).
6. **M9-B.1 Readiness**: DONE — READY FOR FINAL VERIFICATION.
7. **EXACT NEXT STEP**:
   - STOP — WAITING FOR OWNER REVIEW.

## P1 / P1.2 Owner Physical One-Hand UX Fix Handoff — 2026-10-09
1. **Objective**: Resolve Owner physical mobile one-thumb reachability failure and eliminate dead white space between 2x2 grid and footer by expanding the Dragon Bridge / Da Nang hero vertically to absorb unused space and anchoring the 2x2 intent grid low in the thumb zone with the footer directly attached.
2. **Status**: **BROWSER READY FOR OWNER PHYSICAL RETEST** (Physical acceptance strictly NOT VERIFIED until Owner tests on real phone).
3. **Completed**:
   - Hero: `<Hero>` dynamically expands via `flex-1 min-h-[190px] max-h-[460px] md:max-h-[360px]` to fill spare vertical screen space with vibrant Da Nang branding.
   - Completely flat page structure; zero raised panels, zero draggable sheets, zero inline accordions.
   - Flat "Chọn nhanh" header with localized subtitle (`vi`, `en`, `ko`).
   - 2x2 Intent Grid (`grid-cols-2`) with DOM order `[NOW, EAT, GO, STAY]`.
   - Whole-card clickable buttons (`min-h-[136px] sm:min-h-[148px]`, decorative vector wave accents, pastel color themes).
   - Modal mobile bottom sheet (`PreferenceBottomSheet.tsx`, `role="dialog"`, `aria-modal="true"`, $\ge 44\text{px}$ close button, Escape key, backdrop dismiss, $\ge 44\text{px}$ mood chips).
   - Immediate Footer Attachment: `<footer>` sits directly below 2x2 grid with natural spacing (`mt-2 sm:mt-2.5`). The gap between grid bottom and footer top is **exactly 12px** across all 7 mobile viewports (zero dead white space).
   - Preserved all business logic, Neon queries, Discovery API, 11-event analytics, Nearby 1-3-5km engine, and Calendar Reminder export.
4. **Validation Evidence**:
   - `npx vitest run --exclude "**/curation.test.ts"`: 15 suites, **298 passed (298)**.
   - `npm run lint`: 0 warnings, 0 errors.
   - `npm run typecheck`: 0 errors.
   - `npm run build`: Production build succeeded in 5.4s.
   - `git diff --check`: Clean.
   - `curated-places.json`: 0 diff (unmodified).
   - Multi-viewport browser measurements: all 4 intents visible without scroll across 320x800, 360x800, 375x812, 390x844, 393x852, 412x915, 430x932. Entire grid sits in lower thumb zone ($y \approx 280\text{px}-608\text{px}$); gap to footer is exactly 12px.
5. **DO NOT REDO / DO NOT TOUCH**:
   - Do not mutate Neon DB tables or schema.
   - Do not push to remote (`origin`).
   - Do not deploy production (`npm run deploy`).
   - Do not alter Calendar Reminder implementation (P2 scope).
   - Do not alter Nearby engine or insert places (P3 scope).
   - Do not claim physical phone acceptance without Owner physical confirmation.
6. **P1.2 Readiness**: BROWSER READY FOR OWNER PHYSICAL RETEST.
7. **EXACT NEXT STEP**:
   - STOP — WAITING FOR OWNER REVIEW.



