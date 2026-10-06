# Database integration — M1-A decision checkpoint
CURRENT_REFERENCE. DB_PROVIDER_DECISION_REQUIRED. Provider/schema not verified; no migration/import/client/API/contract implementation.

## Current facts
M0.5 local checkpoint dd7275446e7e85cc695e52a700f3cbdd52fef5a3 created selectively; not pushed. Source still demo. No provider SDK/config/env/migration/query evidence in project. ASSETS is the only Wrangler binding. Miniflare D1 metadata sqlite contains only internal _cf_ALARM, not places. External DB may exist; do not create a competing project.
See [provider decision](DB_PROVIDER_DECISION_REQUIRED.md) for audited scope and at most two options (Neon PostgreSQL recommended for native types/PostGIS if no DB exists; D1 conditional alternative). Provider choice is NOT made.

## Workbook/import deliverable
[DB_IMPORT_CONTRACT_PROPOSAL.md](DB_IMPORT_CONTRACT_PROPOSAL.md) covers all47 workbook columns (one blank excluded), actual cell types, proposed types/nullability/constraints/normalization, indexes, deletion/update policy and transaction/import plan. DRAFT, not final provider-specific DB_SCHEMA_CONTRACT. Fresh counts94/500/36/841/108/1500; constraint violations0. Core sheets only; no media.
Timestamp numeric cells converted using workbook1899-12-30 epoch to naive datetimes, without UTC/+07 inference. Source verification timestamps retain provenance. Whether export created_at/updated_at can become DB default CURRENT_TIMESTAMP remains a user/owner decision, not silent replacement. NULL remains SQL NULL; no fake zero ratings/counts.

## M1-A result and exact M1-B first action
Audit/planning deliverables complete for review. Provider-specific completion BLOCKED by actual provider/schema/owner and timestamp policy; discovery-contract.ts NOT CREATED. Stop; M1-B not authorized.
When user authorizes M1-B: read HANDOFF_CURRENT and provider/import proposals, check Git, obtain existing DB project/schema/connection/ownership OR recorded provider choice. Inspect real column types/keys/nullability and reconcile timestamp policy. Only after these facts are confirmed finalize DB_SCHEMA_CONTRACT and create src/lib/data/discovery-contract.ts. No database rows/import or Home changes implied by this decision checkpoint.

## Later gates retained
No DB rows directly into UI. Adapter null/locale/Maps/section/duplicate-tag tests; API success/empty/validation/server failure distinct. Import only six tables, query back500 places and1500 translations; use safe idempotency/transaction/rollback strategy for actual provider. EAT slice first, then CAFE/GO/STAY. Existing image-required PlaceCard remains a later compatibility gate, not license to fabricate image URLs or widen scope.
