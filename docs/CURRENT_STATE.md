# Current state
CURRENT_AUTHORITY — 2026-10-06T22:57:16.711450+07:00. Latest authorized scope M0.5 + M1-A only, STOP before M1-B.
Repo: D:/Dự án tìm địa điểm ăn chơi/LaCaDaNang/danang_revised_pack
Branch phase-2a-deploy; HEAD dd7275446e7e85cc695e52a700f3cbdd52fef5a3. Local checkpoint `chore: checkpoint no-image MVP handoff and foundations` created; no push/merge/deploy/branch switch. M0.5 DONE. M1-A audit/plan ready for review, provider/schema finalization BLOCKED.

## Runtime unchanged
Next15.5.27/React19.3.0 App Router; OpenNext1.20.7/Wrangler4.145.0. Home uses11 demo places, exact tag filter/slice3, hardcoded NOW itinerary. No CAFE UI, real DB query/API or real ranking. PlaceCard still requires venue image. Progressive disclosure/reset/zero results exist; one-thumb NOT PASS. Four geo/i18n pure modules and two tests are now tracked, not rewritten/wired. VI/EN/KO libraries exist; UI switch/provider absent. Analytics/notifications spec-only.

## Provider and workbook
DB_PROVIDER_DECISION_REQUIRED: no real provider/project/schema established. Package/lockfile/source/env/config/history audited; no app DB integration. Only ASSETS binding. Miniflare D1 metadata has only internal _cf_ALARM. External DB unknown; no provider signup/create/query/import. DB env variable names found: none.
Source workbook LA_CA_DB_READY_500_NO_IMAGE_FINAL.xlsx SHA256874e7d6d9f5688af85de347051d4fc67a52f44bbd97a249d1f717056f6496bd3 unchanged. Fresh counts: administrative_units94,places500,tags36,place_tags841,tag_translations108,place_translations1500.500 unique Google IDs, coordinates/Maps/active/admin FK/tagged rows; zero checked key/FK/locale/section/Maps violations. EAT134/CAFE145/GO94/STAY127. Workbook-only QA, no DB/live identity claim.
DB_IMPORT_CONTRACT_PROPOSAL covers47 columns including blank excluded Column1; no final SQL contract. Timestamp eight fields are numeric serials converted to naive datetimes; timezone unknown. NULL/numeric policy explicit; metadata replacement with DB current time pending approval. No discovery-contract.ts.
Old300 candidate/86 curated files unchanged and not import authority. Do not run old curation builder on new workbook.

## Git safety and validation
Initial41 untracked classified individually:4 SOURCE_REQUIRED,2 TEST_REQUIRED,29 DOC_REQUIRED selected,6 EVIDENCE_ONLY excluded. Together with9 modified tracked docs and new inventory, local commit contains45 files. Referenced historical Markdown archives intentionally preserved; no test-copy/build-copy/log/cache/backup staged.
Fresh command: `node node_modules/vitest/vitest.mjs run tests/geo.test.ts tests/i18n.test.ts`:40/40 PASS,2 suites. No curation suite.53 protected source/data/config hashes unchanged. Git diff checks passed. Lint/typecheck/build/responsive not rerun for documentation/planning and unchanged source; historical67 tests/build05Oct are not new results.
Post-commit docs changes/new proposals uncommitted for review; staged empty. Full status in HANDOFF_CURRENT and sibling M05_M1A_HANDOFF/git-final.txt. Six M0 docs/evidence files remain local untracked. Backups/evidence outside repo retained.

## Deployment history only
Last local evidence03Oct: a749466 Worker version35fcd8e7-965c-416b-9fd5-79856d5bb165, https://la-ca-da-nang.quang24101977.workers.dev. No production check/release in this scope.

## Exact next step
User reviews provider options/timestamp policy. M1-B, only when authorized, first confirms existing DB project/schema/owner or chosen provider, then reconciles actual schema before final contract/code. Do not start Home/UI or import. See DB_INTEGRATION and HANDOFF_CURRENT.
