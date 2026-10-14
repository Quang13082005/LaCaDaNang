# Rental D2 Production Write Approval Gate — 2026-10-14

Status: READY FOR OWNER REVIEW; NOT EXECUTED. This document is not write authorization.

## Verified target and source

- Neon project `flat-lake-94547160`, production branch `br-shiny-band-b3mlezx7` (primary/default), database `neondb`, public schema.
- Endpoint `ep-old-tooth-b3gz7nsn.c-4.ap-southeast-1.aws.neon.tech`.
- Source `docs/RENTAL_IMPORT_PREVIEW.json`, SHA256 `029eb6139e640668bad3ec07024c800dc10cba5fdc0a4563501dbf7849af3e14`.
- D1 migration SHA256 `bac9cc7555f607d4f4420698986679574c1390f977b58e691751327c9506dac6`; D1 was NOT rerun.
- Fresh SELECT preflight: four rental tables exist and are empty. Captured columns, constraints and indexes; verified dark defaults, identity keys, unique keys and FKs. Evidence: `../RENTAL_D2_2026-10-14/preflight.json` (UTC timestamp inside).
- Offline checks: 8 unique models, 21 distinct physical vehicle codes, categories 10 scooter / 10 semi / 1 manual; 1 contact, 0 media. Price ×1000 initial conversion, per-vehicle deposit, decimal capacity, XE011 incomplete color and XE017 113cc preserved.

## Exact proposed transaction

Script: `scripts/rental/d2-import.cjs`. Default is offline validation; `--preflight` is SELECT-only. `--execute` also requires an explicit approval environment flag, which must only be supplied after a separate Owner authorization message.

1. Reverify control-plane project/branch/endpoint, source/DDL hashes, empty targets and schema fingerprint against a preflight less than 24 hours old.
2. Open ONE stateful PostgreSQL connection and BEGIN. Set local lock/statement timeouts.
3. Lock only four rental tables and recheck they are empty, preventing concurrent imports.
4. Parameterized INSERT of 8 models with generated IDs returned; parameterized INSERT of 21 vehicles referencing those IDs; INSERT one contact. All explicitly active=false. No media INSERT.
5. SELECT assertions compare all source vehicle fields, model associations, UUID uniqueness, counts, category/deposit/price data, contact policies and dark states.
6. COMMIT only after assertions; SELECT verification after commit. No retry and no conflict-skipping.

No venue/analytics SQL writes, migrations, role changes, activation, deployment or Git operations are in this plan.

## Rollback and uncertainty

Any precommit exception triggers ROLLBACK and STOP. PostgreSQL sequences may advance despite rollback; do not reset sequences. If COMMIT has been sent and connection/postverification fails, use SELECT reconciliation before any further decision; never rerun the importer automatically. After a successful commit there is no automatic destructive rollback: deletion would need separate approval and dependency checks.

## Risks and limits

- The new importer transaction has not been executed/rehearsed by this task. Offline validation and live SELECT preflight PASS do not certify a completed import.
- Rental locks may briefly block future rental traffic; lock timeout is 5s and statement timeout is 30s. Current targets are empty.
- No claim that core data is unchanged by all other sessions; this script only writes the named rental tables. Independent before/after core read-only counts should accompany execution.
- EN/KO color columns are not invented; API falls back to source color. Human translation/physical XE017 verification remain pending.
- Dataset and schema must be revalidated if approval arrives after preflight expiry.

## Approval requested

Authorize ONE atomic D2 dark import: 8 models + 21 vehicles + 1 contact, zero media, all active=false, against the exact source SHA above. This approval does not authorize activation, DDL, deployment, commit or push.

## 2026-10-14 — FINAL D2 REHEARSAL PASS / CLEANED (latest checkpoint)
Owner authorized one isolated test branch only; no Production import approval yet. Report: RENTAL_D2_FINAL_REHEARSAL_REPORT.md supersedes earlier 'importer not rehearsed' status.
Test branch br-patient-field-b3pzs2v7 created from Production br-shiny-band-b3mlezx7, verified nonprimary/nondefault and endpoint before SQL. SAME exported importTransaction used by Production and harness. Forced PostgreSQL22012 after8models+10vehicles -> ROLLBACK -> all4tables0. Separate success transaction ->8models/21vehicles/1contact/0media, allinactive, allsourcefield assertions PASS, activepublicprojection0. Schema and7corefingerprints unchanged.
CLEANED at2026-10-14T04:44:11.568Z: exactcreatedbranch andendpoint absentfromAPI; nochildbranch/otherclients orappconfigdependencies; Production retained. Production rental still0/0/0/0; schema and7corecounts+fingerprints unchanged (94/36/108/6500/12516/19500/998). No Production SQL writes or activation.
Offline importer tests3/3PASS, syntax/sourcevalidationPASS; appsourceunchanged thisturn so449+2tests/Next/OpenNext notrerun. MainCLI postcommiterrorreporting hardened afterrehearsal; sharedtransactionbodyunchanged. Evidence ../RENTAL_D2_FINAL_REHEARSAL_2026-10-14/ preserves metadata, before/after, SQLtraces, rollback/success, cleanup, hashes, tests and prior docs.
D2 status READY_FOR_REVIEW, Production import NOT_EXECUTED. D3 realdataAPI/mobileQA PENDING approvedimport. HEAD f7e5f9ba2ba877304c52b4679d6f02123ac5aef7 branchphase-2a-deploy unchanged. No commit/push/deploy; no D0/D1 redo, secrets/config/role changes or existingbranchdeletion.
EXACT NEXT: separateOwnerapproval for ONE atomicD2 transaction8models+21vehicles+1contact+0media allactivefalse, sourceSHA029eb6139e640668bad3ec07024c800dc10cba5fdc0a4563501dbf7849af3e14. Then refreshpreflight/corebaseline, import+postcommitSELECT, temporaryauthenticatedlocalQA andsecondphoneacceptance. STOP beforeProductionwrite andactivation.
