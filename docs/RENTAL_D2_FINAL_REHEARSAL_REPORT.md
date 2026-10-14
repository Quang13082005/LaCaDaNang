# D2 final rehearsal — PASS / CLEANED / Production approval pending

Date: 2026-10-14. Latest Owner scope permitted one temporary Neon branch, its isolated SQL rehearsal and verified cleanup. No Production SQL writes were authorized or executed.

## Identity and source

- Project: `flat-lake-94547160`.
- Production parent: `br-shiny-band-b3mlezx7`, primary/default, `neondb`.
- Production endpoint: `ep-old-tooth-b3gz7nsn.c-4.ap-southeast-1.aws.neon.tech`.
- Source: `docs/RENTAL_IMPORT_PREVIEW.json`.
- Exact SHA256: `029eb6139e640668bad3ec07024c800dc10cba5fdc0a4563501dbf7849af3e14`.
- Newly created test branch: `br-patient-field-b3pzs2v7`, name `rental-d2-final-1791952956216`, parent Production, primary=false/default=false.
- Test endpoint: `ep-dark-credit-b342j8mn.c-4.ap-southeast-1.aws.neon.tech`. Connection hostname and database verified against control-plane endpoint/branch metadata before SQL.

## Same importer, real transaction evidence

Production importer `scripts/rental/d2-import.cjs` now exports `importTransaction`; both its Production execution mode and rehearsal harness call this exact function. There is no duplicate import implementation. Source and DDL hashes remain locked. Schema columns/constraints/index fingerprint matched the Production snapshot. Added checks reject unexpected user triggers and orphan vehicles hidden by joins.

1. Rollback trial: same function inserted 8 models and 10 vehicles, then the rehearsal query adapter injected PostgreSQL `SELECT 1/0` before vehicle 11. Error `22012` caused ROLLBACK on the same connection. Independent subsequent SELECT found 0 models, 0 vehicles, 0 contacts and 0 media. Core-table fingerprints were unchanged.
2. Success trial: separate transaction on the SAME new test branch, using the same function without injected failure. COMMIT completed; postcommit verification matched 8 models, 21 physical vehicles, 1 contact, 0 media. All models/vehicles/contact inactive. Source prices, deposits, engine precision, registration years, colors, categories, codes, FK mappings and 21 distinct generated UUIDs verified. Category distribution 10 scooter / 10 semi / 1 manual.
3. Public SQL projection with vehicle.active=true AND model.active=true returned 0 rows. This is a database-level active-filter test, not certification of a live Production 21-vehicle API or phone flow.
4. Schema and fingerprints of all seven inherited core tables were unchanged on the test branch.

The deliberate rollback naturally consumes sequence values on the test branch; no setval or sequence reset was used. Production sequences were not advanced by this rehearsal.

## Cleanup evidence

Created branch ID was persisted before test SQL. No credentials were written into app config or evidence; no app/service was pointed at the test branch. Observed other client sessions: 0. Before deletion, metadata again confirmed ownership/name/parent/nonprimary/nondefault and no child branches. The SQL connection was closed.

Deleted ONLY `br-patient-field-b3pzs2v7`. Subsequent API lists confirmed branch and endpoint absent, all preexisting branches retained, Production still primary/default. Cleanup verified at **2026-10-14T04:44:11.568Z**.

Production SELECT after cleanup: four rental tables remain empty; schema fingerprint unchanged. Counts AND content fingerprints of seven core tables match baseline: administrative_units94, tags36, tag_translations108, places6500, place_tags12516, place_translations19500, analytics_events998.

## Local validation and scope

`node --check` PASS for importer/harness; source offline validation PASS. `node --test scripts/rental/d2-import.test.cjs`: 3/3 PASS (nonempty abort before INSERT, one successful COMMIT, uncertain COMMIT does not retry or send rollback). The main CLI error reporting was corrected after rehearsal to explicitly require reconciliation on postcommit verification failures; the shared transaction body was unchanged. Final importer hash saved in evidence.

Application source did not change this turn. Prior 449 regression + 2 auth tests and Next/OpenNext builds were not unnecessarily rerun. No D0/D1 rerun, migrations, Production INSERT/UPDATE, activation, secret/role/config changes, Git commit/push or deployment.

Changed/added this turn: importer; `d2-final-rehearsal.cjs`; `d2-import.test.cjs`; this report; additive updates to preflight/handoff/checkpoint/current-state/decisions/queue. All earlier uncommitted work and evidence retained.

## Evidence

Directory: `D:/Dự án tìm địa điểm ăn chơi/LaCaDaNang/RENTAL_D2_FINAL_REHEARSAL_2026-10-14/`.

- before.json: source/schema/Production baseline/control-plane identity.
- creation-attempt.json, creation-response.json, created-branch.json: single-branch provenance.
- rollback.json: SQL statement trace (parameter counts, no credentials), injected error, zero-row postrollback results.
- success.json: SQL trace and full rental SELECT results/field assertions.
- dependency-check.json, pre-cleanup.json, cleanup.json: dependency and deletion verification, before/after Production fingerprints.
- offline-tests.log, final-hashes.json; docs-before-update preserves prior handoffs.

## Proposed Production SQL plan and remaining risks

After a separate Owner message only: refresh target/schema/source and core SELECT baseline; ensure four rental tables empty; BEGIN one stateful session; local timeouts and rental-table locks; parameterized INSERT 8 models + 21 vehicles + 1 contact, explicit active=false; zero media; assertions before COMMIT; postcommit SELECT audit. No conflict-skipping and no retry. Uncertain COMMIT requires SELECT reconciliation, never rerunning import.

Remaining risks: sequence gaps on failed transactions; brief rental-table locking; connectivity uncertainty; source XE011 color incomplete and XE017 physical specification unconfirmed; EN/KO human review pending. No automatic destructive postcommit rollback. Test success is not Owner Production authorization or real-data mobile acceptance.

## Exact approval gate

Request Owner authorization for ONE atomic Production D2 transaction against the exact source hash above: **8 models + 21 vehicles + 1 contact + 0 media, all active=false**, with precommit assertions and postcommit audit. No activation/deploy authorization included.

STOP before Production write. After approval/import: authenticated local Neon QA with temporary token, second Owner phone test, then separate deployment gates.
