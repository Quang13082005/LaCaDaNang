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
