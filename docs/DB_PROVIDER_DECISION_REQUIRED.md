# DB_PROVIDER_DECISION_REQUIRED

Status: decision required, M1-A. No provider/project/schema verified for this project. No account/database created. This is not a claim that no external database exists.

## Facts checked

- package.json and lockfile: no Supabase/PostgreSQL/Neon/D1/Turso/SQLite/MySQL application client/configuration dependency match. Presence of Wrangler is deployment tooling, not a selected DB.
- wrangler.jsonc: ASSETS binding only; no d1_databases or Hyperdrive/database binding. open-next.config.ts: defineCloudflareConfig({}). Neither establishes a database connection.
- Source: no DB client, query/repository or database API. Local PlaceSchema is Zod/offline data validation, not SQL DDL.
- Current project tree: no migrations, .sql/.prisma schema or database file outside generated runtime artifacts. Git path history for migration/SQL/provider/schema finds old curation schema, not a DB integration commit.
- Root/project tree and direct project parent: no .env*/.dev.vars* file found. Relevant current process DB env variable NAMES: none. No secret values disclosed; no global credential store read.
- .wrangler/state/v3/d1/miniflare-D1DatabaseObject/metadata.sqlite exists. Opened read-only; sqlite_master contains only internal _cf_ALARM table. This is Miniflare metadata, NOT six-table app data or evidence of provisioned D1. Other sqlite files are Miniflare cache/KV/R2/observability metadata.
- External accounts/dashboard and prior DB agent's project were not inspected: no verified target identifier/connection/ownership supplied. Migration owner, schema version, actual connection mechanism and API access pattern remain UNKNOWN.

## At most two options — neither selected

### 1. Neon PostgreSQL — recommended if no existing project is handed over

Moderate setup: an additional provider account/project and server-only connection, but native BOOLEAN and strong relational types align with the requested contract. PostgreSQL supports the six related tables; Neon supports PostGIS for radius/spatial indexes if later approved. Cloudflare documents Hyperdrive or Neon's serverless driver integration; no driver/config installed here. This recommendation is an architectural judgement, not a claim of benchmarked performance. [Cloudflare integration](https://developers.cloudflare.com/workers/databases/third-party-integrations/neon/), [Neon PostGIS support](https://neon.com/blog/ten-most-popular-postgres-extensions).

Free-tier practicality: official October2,2026 announcement gives1GB storage and100 CU-hours/month per project.500 no-image records and relationships are a small storage workload, but query traffic/compute still matter. Initial service charge can be zero within limits; operational cost is account/secret/connection setup and monitoring. Verify current account quotas before provisioning. [Neon free-tier announcement](https://neon.com/blog/neon-free-plan-1-gb-per-project).

### 2. Cloudflare D1 — simpler provider operations, with type tradeoffs

Low setup overhead because deployment already uses Cloudflare. D1 Worker binding and relational SQL/FKs fit the six tables. Nearby can use candidate bounding-box filtering and exact Haversine in the Worker at this scale; that is a proposed design, not a deployed query or PostGIS capability. [D1 binding/types](https://developers.cloudflare.com/d1/worker-api/), [foreign keys](https://developers.cloudflare.com/d1/sql-api/foreign-keys/).

Important mismatch with the user's native-boolean requirement: D1/SQLite maps booleans to INTEGER0/1, not a native BOOLEAN storage type. It also needs explicit timestamp/text and numeric policies. Do not select it silently while claiming native boolean/timestamp semantics; it requires acceptance of these physical storage differences. Never store "True"/"False" strings.

Free tier currently lists5million rows read/day,100,000 written/day and5GB total storage; scans count, not merely returned rows. Initial D1 cost can be zero within these limits, with Worker limits also applying. Setup requires a real DB and binding in a later authorized phase; neither exists in this checkout. [D1 pricing](https://developers.cloudflare.com/d1/platform/pricing/).

## Decision and stop condition

First preference is to receive the existing DB provider/project/schema and owner if another agent has it. If none exists, user chooses one option; Neon is the proposal for native booleans and future PostGIS. No default Supabase assumption, no new signup, no migration/import or discovery-contract.ts. Final provider-specific schema and timestamp policy are pending. Review DB_IMPORT_CONTRACT_PROPOSAL.md before M1-B.
