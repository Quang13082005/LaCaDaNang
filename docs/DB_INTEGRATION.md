# Database integration
CURRENT_REFERENCE — canonical M1–M4 preparation. No database code/import implemented in M0.
Provider/project/schema/connection ownership: UNCONFIRMED. This checkout has no Supabase package/client, migration, SQL schema, place query, API route or env file at root. External DB may exist. Never conclude it does not exist from local absence.

## Exact first action of M1 (only after user authorizes M1)
Read HANDOFF_CURRENT and this file; run Git status/diff/log and inspect package.json, src/lib/data and any owner-supplied schema/migrations/connection description without disclosing secret values. Reconcile the prior DB agent's file ownership. Ask for provider/project/schema handoff only if unavailable; do not create a new DB as fallback.
Success: actual provider/project/schema and owner identified, six-table workbook headers mapped to actual SQL types/keys/nullability, timestamp policy confirmed. Then create src/lib/data/discovery-contract.ts. That file does not exist yet.

## Milestones
M1 provider/schema + no-image contract; M2 six-table import and query-back QA; M3 adapter/repository/API and EAT slice; M4 CAFE/GO/STAY mapping/ranking. Broad master order governs; DB-0..DB-5 headings are detailed work descriptions, not permission to jump milestones.
Adapter must handle null rating/reviews, missing locale/Maps, unsupported sections and duplicate tags. Repository hides credentials; same-origin discovery route is a proposal, not an endpoint currently present. Distinguish validation failure, DB failure, empty success and nonempty success; never mask error as zero results.
Import only six core tables from DATA_CONTRACT_NO_IMAGE; idempotency/transaction/rollback/sequence handling require real provider facts. Do not reuse the old curation script. Query-back checks: 500 IDs/coordinates/admin FKs/active/tagged places, 1500 translations and no media dependency.
EAT acceptance: real DB/API -> 0–3 truthful cards -> valid Maps, reset and race handling. Existing card is image-required; see DECISIONS item 15 before M3. No production deployment approval is implied.
