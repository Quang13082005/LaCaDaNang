# M0.5 / M1-A active handoff

Latest user authorizes selective LOCAL checkpoint and M1-A provider/import planning only. M0 is complete. Initial41 untracked classified in GIT_SAFETY_CHECKPOINT.md;35 selected,6 local evidence excluded. Targeted command `node node_modules/vitest/vitest.mjs run tests/geo.test.ts tests/i18n.test.ts`:40/40 PASS,2 suites,18.63s; curation not run.53 protected non-doc hashes unchanged. Checkpoint commit about to be created; its hash will be recorded immediately after commit (cannot embed its own hash). No push/merge/deploy. M1-A next searches provider facts; no discovery-contract until provider/schema confirmed.

## Previous M0 handoff — historical snapshot

# Current agent handoff
CURRENT_AUTHORITY — follows all21 sections of the supplied AI_AGENT_HANDOFF_TEMPLATE.

## 1. Session identity
- Timestamp: 2026-10-06T22:39:04.469031+07:00
- Agent: current Codex session; M0 documentation/protection owner only.
- Repo: D:/Dự án tìm địa điểm ăn chơi/LaCaDaNang/danang_revised_pack
- Branch: phase-2a-deploy
- HEAD: a7494666e786f0b968484ea142cc221ddaf38050
- Milestone: M0 documentation/protection completed, READY_FOR_REVIEW. STOP. M1 NOT STARTED.
- Objective: preserve work, normalize authority, make safe cross-agent continuation possible; no Home/UI/DB implementation.

## 2. Git state
```text
git status --short -uall:
 M AGENTS.md
 M GEMINI.md
 M MANUAL_PREWORK.md
 M docs/DATA_CURATION_REPORT.md
 M docs/DATA_TAG_RULES.md
 M docs/GO_DATA_GAPS.md
 M docs/MANUAL_CURATION_QUEUE.md
 M docs/PHASES.md
 M docs/PROJECT_STATE.md
?? GEMINI_3_8_UX_HARDENING_IMPLEMENTATION.md
?? docs/AGENT_TASK_QUEUE.md
?? docs/ANALYTICS.md
?? docs/ANALYTICS_SPEC.md
?? docs/CURRENT_STATE.md
?? docs/DATA_CONTRACT_NO_IMAGE.md
?? docs/DB_INTEGRATION.md
?? docs/DECISIONS.md
?? docs/DOCUMENT_AUTHORITY.md
?? docs/HANDOFF_CURRENT.md
?? docs/I18N.md
?? docs/I18N_ARCHITECTURE.md
?? docs/NEARBY_DISCOVERY.md
?? docs/NEARBY_ENGINE_PREPARATION.md
?? docs/NOTIFICATIONS.md
?? docs/NOTIFICATION_SPEC.md
?? docs/ONE_THUMB_UX_AUDIT.md
?? docs/UX_ONE_THUMB.md
?? docs/UX_PRODUCT_CHECKPOINT_2026-10-04.md
?? docs/UX_PRODUCT_CHECKPOINT_2026-10-05.md
?? docs/archive/README.md
?? docs/archive/pre-M0-2026-10-06/AGENTS.md
?? docs/archive/pre-M0-2026-10-06/GEMINI.md
?? docs/archive/pre-M0-2026-10-06/GEMINI_3_8_UX_HARDENING_IMPLEMENTATION.md
?? docs/archive/pre-M0-2026-10-06/MANUAL_PREWORK.md
?? docs/archive/pre-M0-2026-10-06/docs/PHASES.md
?? docs/archive/pre-M0-2026-10-06/docs/PROJECT_STATE.md
?? docs/evidence/commands.md
?? docs/evidence/git-before.txt
?? docs/evidence/git-final.txt
?? docs/evidence/protection-manifest.json
?? docs/evidence/validation.json
?? docs/evidence/workbook-audit.json
?? docs/inputs/AI_AGENT_HANDOFF_TEMPLATE.md
?? docs/inputs/ASTRA6_MASTER_EXECUTION_PROMPT_NO_IMAGE_MVP.md
?? src/lib/geo/distance.ts
?? src/lib/geo/filter-nearby.ts
?? src/lib/i18n/locales.ts
?? src/lib/i18n/messages.ts
?? tests/geo.test.ts
?? tests/i18n.test.ts

git diff --stat (tracked only):
 AGENTS.md                     | 580 +++---------------------------------------
 GEMINI.md                     |  40 +--
 MANUAL_PREWORK.md             |   2 +
 docs/DATA_CURATION_REPORT.md  |   2 +
 docs/DATA_TAG_RULES.md        |   2 +
 docs/GO_DATA_GAPS.md          |   2 +
 docs/MANUAL_CURATION_QUEUE.md |   2 +
 docs/PHASES.md                |   2 +
 docs/PROJECT_STATE.md         |  81 +-----
 9 files changed, 60 insertions(+), 653 deletions(-)

Latest commits:
a749466 fix: finalize progressive mobile UX
b25bcbe fix: harden mobile UX for mentor review
194108c chore: fix Cloudflare OpenNext deployment config
d274588 checkpoint: phase 2a data curation
1658f4f feat(phase-1): visual prototype with hardcoded data

```
Staged files: none. Uncommitted changes: yes, docs plus pre-existing untracked work. No new runtime source changes. Local checkpoint commit: none created; HEAD above unchanged.
Safe to switch branch? NO authorization / not established. Backups verified, but switching still needs ownership/collision checks and preservation of new M0 docs. No destructive Git commands.
Initial14 untracked protected in sibling M0_HANDOFF_2026-10-06/originals; hashes in evidence/protection-manifest.json. git diff excludes untracked, so read those directly. evidence/git-final.txt captures full final list.

## 3. Source of truth
AGENTS rewritten for no-image/M0 scope; CURRENT_STATE is sole runtime authority; DECISIONS owns decisions. DOCUMENT_AUTHORITY lists every pre-existing root/docs Markdown and other plans.
Data: LA_CA_DB_READY_500_NO_IMAGE_FINAL.xlsx, SHA256874e7d6d9f5688af85de347051d4fc67a52f44bbd97a249d1f717056f6496bd3; original in Downloads and identical sibling backup inputs/. Master/template exact copies under docs/inputs/.
DB schema/migration version: unknown/not present locally. API contract version: none. Workbook structure is not proof of production SQL schema.

## 4. Completed this session
- [x] Read both supplied Markdown files in full and all cells in all15 workbook sheets before document modifications.
- [x] Fresh Git/runtime audit; runtime still demo, no DB client/query/API, no CAFE UI, image-required PlaceCard.
- [x] Hash-verified copies of14 initial untracked files, other original docs, all3 inputs;53 protected non-doc hashes unchanged.
- [x] Canonical authority/specs/queue/handoff created; stale instructions marked or archived without deleting originals/evidence.
- [x] Independent workbook core QA:500 unique internal/Google IDs, valid coords/Maps/admin references/active/tag coverage;841 unique place-tag pairs;1500 place and108 tag translations, valid FKs/locale uniqueness; flat/core mapping agrees.
- [x] Documentation-only validation and final Git diff/check; no runtime PASS asserted.

Files created in repo:
- docs/AGENT_TASK_QUEUE.md
- docs/ANALYTICS.md
- docs/CURRENT_STATE.md
- docs/DATA_CONTRACT_NO_IMAGE.md
- docs/DB_INTEGRATION.md
- docs/DECISIONS.md
- docs/DOCUMENT_AUTHORITY.md
- docs/HANDOFF_CURRENT.md
- docs/I18N.md
- docs/NEARBY_DISCOVERY.md
- docs/NOTIFICATIONS.md
- docs/UX_ONE_THUMB.md
- docs/archive/README.md
- docs/archive/pre-M0-2026-10-06/AGENTS.md
- docs/archive/pre-M0-2026-10-06/GEMINI.md
- docs/archive/pre-M0-2026-10-06/GEMINI_3_8_UX_HARDENING_IMPLEMENTATION.md
- docs/archive/pre-M0-2026-10-06/MANUAL_PREWORK.md
- docs/archive/pre-M0-2026-10-06/docs/PHASES.md
- docs/archive/pre-M0-2026-10-06/docs/PROJECT_STATE.md
- docs/evidence/commands.md
- docs/evidence/git-before.txt
- docs/evidence/git-final.txt
- docs/evidence/protection-manifest.json
- docs/evidence/validation.json
- docs/evidence/workbook-audit.json
- docs/inputs/AI_AGENT_HANDOFF_TEMPLATE.md
- docs/inputs/ASTRA6_MASTER_EXECUTION_PROMPT_NO_IMAGE_MVP.md

Tracked files modified:
- AGENTS.md
- GEMINI.md
- MANUAL_PREWORK.md
- docs/DATA_CURATION_REPORT.md
- docs/DATA_TAG_RULES.md
- docs/GO_DATA_GAPS.md
- docs/MANUAL_CURATION_QUEUE.md
- docs/PHASES.md
- docs/PROJECT_STATE.md

Existing untracked documents modified (all originals backed up):
- GEMINI_3_8_UX_HARDENING_IMPLEMENTATION.md
- docs/ANALYTICS_SPEC.md
- docs/I18N_ARCHITECTURE.md
- docs/NEARBY_ENGINE_PREPARATION.md
- docs/NOTIFICATION_SPEC.md
- docs/ONE_THUMB_UX_AUDIT.md
- docs/UX_PRODUCT_CHECKPOINT_2026-10-04.md
- docs/UX_PRODUCT_CHECKPOINT_2026-10-05.md

Outside repo created: M0_HANDOFF_2026-10-06 containing originals/, inputs/, backup-manifest.json, git-before.txt and three documentation/audit support scripts. These are not app implementation or dependencies.

## 5. In progress
No implementation left half-written. Last successful step: document/protection/workbook validation. M0 awaits user review only. M1 provider/schema/contract remains unstarted, not implicitly authorized.

## 6. Decisions made
See DECISIONS.md for numbered decisions/evidence. No-image is a user decision, not inferred. Workbook500 replaces old86 seed as intended source; old dataset is preserved. Cloudflare source/config supersedes stale Vercel docs. M0 validation is doc-only; broad master continuation instructions do not override user STOP. Archive/backup makes doc normalization reversible. Provider and timestamps are unresolved, not invented.

## 7. Commands executed
See evidence/commands.md for exact Git/support-script commands, read scope and the recovered console-encoding error. All product-changing commands (npm curation/import/migrate/deploy/Git commit etc.) NOT RUN. Support scripts and input originals retained outside repo for review.

## 8. Validation
- M0: backup/protected hashes, workbook structural constraints, local Markdown links, authority routing, Git diff/check. evidence/validation.json is the final machine-readable result.
- lint/typecheck/unit/integration/build: NOT RUN in M0 (documentation-only). Latest historical lint/typecheck PASS and67 tests5 suites on05/10 in UX_PRODUCT_2026-10-04/test-copy; Next build PASS in UX_PRODUCT_2026-10-05/build-copy. No fresh runtime claim.
- responsive/manual/API smoke/Cloudflare preview: NOT RUN in M0.
- DB row-count/FK checks: NOT RUN against DB; workbook-only checks in evidence/workbook-audit.json.
- Historical curation tests mutate dataset; preserve copy-only workflow.

## 9. Database state
Provider/project/environment: UNCONFIRMED; earlier DB agent may own an external project. Local migrations/schema/client/query absent. Tables touched:0; rows imported/changed:0; pending migrations: no files present, external state unknown. Rollback: no DB operation to roll back. Env variable NAMES used for DB: none; no root env file or source-required DB env found, no secret values recorded.
Blocker for M1: real provider/schema/connection/ownership handoff, including SQL type/nullability/keys and Excel date/timezone policy. Do not create a competing DB. No discovery-contract.ts created.

## 10. Runtime/API state
No discovery endpoint or request/response contract yet. Home synchronously filters demo by intent/tag and returns up to3, empty is supported. Current code has no actual network loading/error or credentials. Future validation/server-error/empty/success distinction is required; no auth/RLS design can be asserted before provider facts.

## 11. UX state
Stable positions: NOT DONE, selected intent reordered. One-thumb: NOT PASS. No-image PlaceCard: NOT DONE. Loading/error from real API: absent. Baseline360/390/430/768/1280 recorded in ONE_THUMB_UX_AUDIT; no new M0 browser run. Historical03/10 clipping screenshots do not establish physical-device or new one-thumb acceptance.

## 12. Geo/recommendation state
Browser GPS/permissions/nearby query: not implemented. Distance/filter/stable-sort helpers implemented, unconnected.1->3->5km proposed, not runtime. Demo exact-tag filter/slice max3, no padding; real ranking/mapping not implemented. New administrative coverage invalidates automatic use of old15km seed filter. Missing rating/null policy and incomplete nearby candidate sets need future tests.

## 13. i18n state
VI/EN/KO resolver/dictionaries27 keys and22 tests implemented. Auto/manual are pure function inputs only; browser resolution/persistence/provider/switch/html-lang updates not connected. html lang remains vi. DB translation fallback not implemented. KO native review pending. Workbook translations must be used without inventing place names.

## 14. Analytics state
Provider none, runtime events none. Canonical ANALYTICS supersedes old8-event vocabulary with master's20 events; privacy/dedup spec remains reference. Precise GPS must not leak. No consent/SDK configured.

## 15. Notifications state
Permission/reminder/delivery/deep-link restoration: not implemented. Current scope proposal is explicit reminder after value, never Home prompt. Background capability/provider unconfirmed; older five-use-case plan deferred.

## 16. DO NOT REDO
- Do not redo completed03/10 UX commit/deploy, restart Phase0, regenerate86 seed, scrape images, or treat workbook image queues as instructions.
- Do not rerun documentation normalization script over future agent edits. M0 is complete, runtime untouched.
- Do not mistake successful workbook QA for imported DB or live identity verification.

## 17. DO NOT TOUCH YET
During this M0 stop: Home/UI/src/tests, data/schema/pipeline, package/lockfile, Cloudflare/OpenNext config, fonts/global tokens/public assets, master branch, external DB and other agent-owned files. Original XLSX remains unchanged. No stage/commit/push/merge/deploy. New doc authority does not authorize M1 by itself.

## 18. Blockers
No unresolved M0 protection/documentation blocker. For M1: user authorization to start; actual DB provider/project/schema/ownership unknown. Numeric strings/nulls and serial timestamps require explicit import mapping. M3 before M6 image dependency ordering requires documented minimal compatibility decision when relevant, not fabricated image URLs. Local backup is not remote Git protection; untracked work must accompany handoff to another machine.

## 19. Exact next step
Only AFTER user authorizes M1, first read docs/DB_INTEGRATION.md following the startup chain, then:
```powershell
git -c safe.directory="D:/Dự án tìm địa điểm ăn chơi/LaCaDaNang/danang_revised_pack" status --short -uall
```
Inspect actual owner-supplied DB schema/connection metadata plus package.json and src/lib/data. Establish provider/project/schema/owner and six-table column mapping. If facts unavailable, stop at decision checkpoint and request them; do not invent credentials or new DB. Only after confirmation create src/lib/data/discovery-contract.ts. Expected first success is verified provider/schema/ownership, NOT a changed Home.

## 20. Recovery / rollback
No DB/runtime rollback needed. Review docs diff and copy an individual original from sibling originals/ or archive only after checking it has not received later work. Never mass restore/reset/clean. Preserve new docs and evidence before any future checkout. For missing backup, do not switch/delete; locate manifest/input copies. Backup originals are verified but M0 new files are still uncommitted.

## 21. New-agent startup checklist
- [ ] Read AGENTS -> CURRENT_STATE -> DECISIONS -> HANDOFF_CURRENT -> AGENT_TASK_QUEUE.
- [ ] Run Git status/diff/log, reconcile current source and ownership; do not assume this snapshot remains current.
- [ ] Preserve all untracked/new M0 docs and sibling backup if transferring machines.
- [ ] Confirm authorized milestone; M0 request ends here.
- [ ] On M1 authorization follow section19; no Phase0 restart.
- [ ] Update handoff before stopping, after milestones, on blocker or low context/credit.
