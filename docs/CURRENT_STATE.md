# Current state
CURRENT_AUTHORITY — M0.5 checkpoint; M1-A audit next, 2026-10-06.
Repo: D:/Dự án tìm địa điểm ăn chơi/LaCaDaNang/danang_revised_pack
Branch phase-2a-deploy; HEAD a7494666e786f0b968484ea142cc221ddaf38050. M0 complete. User now authorizes selective M0.5 LOCAL checkpoint plus M1-A planning. No push/merge/deploy or runtime changes. Checkpoint hash recorded after creation in HANDOFF_CURRENT.

## Actual runtime
Next15.5.27/React19.3.0/App Router; Cloudflare OpenNext1.20.7/Wrangler4.145.0. Home is a client page with selectedIntent/selectedPreference state. It imports demo-places.ts (11 demo places), exact tag filter then slice(0,3); no real ranking/DB/API. Three Place shapes coexist. CAFE is not a current UI intent. NOW is hardcoded sample itinerary, not time/location aware. PlaceCard requires imageUrl and Next/Image. Hero/Intent illustrations are static.
Progressive disclosure/reset/empty/reduced-motion scroll exist. Selected intent moves to top; one-thumb gate not passed. No async loading/error discovery layer. Geo utilities (18 tests) and VI/EN/KO libraries (22 tests) exist but are not wired. Analytics/notifications are specifications only.

## Data and DB
Latest intended import source is user workbook LA_CA_DB_READY_500_NO_IMAGE_FINAL.xlsx, SHA256 874e7d6d9f5688af85de347051d4fc67a52f44bbd97a249d1f717056f6496bd3. M0 structural checks: 500 places, sections EAT134/CAFE145/GO94/STAY127, 94 admins,36 tags,841 place-tags,108 tag translations,1500 place translations; key/FK/coordinate/active/tag coverage checks passed. This is NOT imported-DB evidence or live identity verification. Numeric/date conversion details in DATA_CONTRACT_NO_IMAGE.
Old curated86 JSON and candidate300 remain byte-unchanged historical source, not new import authority; Home does not read either. Curated SHA256 CDBC44AA0CF9EBB19B07BC3FB8DBFD11A625E1C31E082EE6B3434F5E155457BD.
DATABASE INTEGRATION = NOT STARTED in this checkout. External DB/provider/schema/owner unconfirmed; no client/migrations/query/API implementation found. No credentials read or created. Do not create a competing DB.

## Git protection
Initial tracked diff empty, 14 untracked files (13 independent-work files + old Gemini prompt). All copied and hash-verified before doc edits. Backup D:/Dự án tìm địa điểm ăn chơi/M0_HANDOFF_2026-10-06/originals with backup-manifest.json; all three input originals also protected in inputs/. Non-document tracked files plus untracked geo/i18n source/tests have 53 hash baselines. New/current files remain uncommitted; see HANDOFF_CURRENT and evidence/git-final.txt.
Historical screenshots/logs/test-copy/build-copy remain outside repo in UX_VERIFICATION_2026-10-03 and UX_PRODUCT_2026-10-04/05. No deletion/move of those artifacts. A future Git clone alone will not include untracked work or sibling backups.

## Validation and deployment
M0: documentation/link/authority review, backup/protected hashes, workbook structural checks, Git diff/check. Runtime lint/typecheck/tests/build/responsive NOT RUN; no runtime changes. Latest historical verification 05/10: lint/typecheck PASS,67 tests/5 suites in UX_PRODUCT_2026-10-04/test-copy, Next build PASS in UX_PRODUCT_2026-10-05/build-copy. Curation tests mutate copied dataset. Do not repeat them in real repo.
Latest local deploy evidence 03/10: commit a749466, Worker https://la-ca-da-nang.quang24101977.workers.dev, version35fcd8e7-965c-416b-9fd5-79856d5bb165. Combined deploy had Windows native rebuild failure; separate deploy of successful build worked. No current production or dashboard/auto-deploy verification in M0. Historical clipping evidence is not current one-thumb/DB/i18n PASS.

## Next
M1 first confirms actual DB provider/project/schema and owner, reconciles workbook import types/keys, then creates no-image discovery-contract.ts. M1-A now authorized for provider/import planning only; stop before M1-B. See DB_INTEGRATION and HANDOFF_CURRENT.

## M0.5 current validation
Focused geo/i18n40 tests passed (2 suites);53 protected non-doc hashes unchanged. Initial41 untracked classified;35 durable files selected,6 local evidence excluded. No full curation suite or build run.
