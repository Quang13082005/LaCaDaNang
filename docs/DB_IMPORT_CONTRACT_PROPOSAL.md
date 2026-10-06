# Workbook → database import contract proposal
Status: DRAFT / DB_PROVIDER_DECISION_REQUIRED. No real provider/schema verified; this is a column-by-column logical proposal, NOT finalized SQL/schema or migration. No database or discovery-contract.ts created.

Source: LA_CA_DB_READY_500_NO_IMAGE_FINAL.xlsx; SHA256 874e7d6d9f5688af85de347051d4fc67a52f44bbd97a249d1f717056f6496bd3. Fresh audit reads all15 sheets; only six below are intended tables. README_QA/FINAL_QA_NO_IMAGE/FINAL_500_FLAT/SECTION_AUDIT/REPLACEMENT_8/COVERAGE_94/image sheets are support, not imports. No place_media.

## Fresh workbook QA
- administrative_units: 94
- places: 500
- tags: 36
- place_tags: 841
- tag_translations: 108
- place_translations: 1500

500 unique Google IDs,500 valid coordinates/Maps/admin FKs,500 active,500 tagged. Sections EAT134/CAFE145/GO94/STAY127. All PK/FK/locale/section/coordinate/Maps/null-Google-ID/duplicate checks below yielded0 violations. Locale coverage exactly vi/en/ko per place/tag; null sentinels absent. Recalculated from source rows, not QA PASS labels.

- administrative_units_duplicate_pk: 0
- places_duplicate_pk: 0
- tags_duplicate_pk: 0
- place_tags_duplicate_pk: 0
- tag_translations_duplicate_pk: 0
- place_translations_duplicate_pk: 0
- null_google_place_id: 0
- duplicate_google_place_id: 0
- invalid_section: 0
- invalid_locale: 0
- orphan_admin_fk: 0
- orphan_place_tag_fk: 0
- orphan_place_translation_fk: 0
- orphan_tag_translation_fk: 0
- invalid_coordinates: 0
- invalid_maps_url: 0
- missing_place_locale: 0
- missing_tag_locale: 0
- invalid_numeric: 0
- literal_null_sentinels: 0

## administrative_units

COLUMN | WORKBOOK TYPE | PROPOSED DB TYPE | NULLABLE | PK/FK/UNIQUE | NORMALIZATION RULE | NOTES
---|---|---|---|---|---|---
id | int:94 | INTEGER | NO | PK | Require exact positive integer <=2147483647; no text IDs/fractional truncation; preserve source identity. | Preserve imported IDs; sequence/default policy requires actual DB schema. BIGINT only if provider/owner requires wider range.
official_code | NoneType:94 | TEXT | YES | No UNIQUE assumed until populated | NULL for empty; preserve as text if supplied later (leading zeros). | All94 null; cannot infer official identifier from row id.
official_name | str:94 | TEXT | NO | — | Trim outer whitespace; preserve Unicode and meaning; nonblank required. | Proposed; not deployed.
unit_type | str:94 | TEXT | NO | — | Trim outer whitespace; preserve Unicode and meaning; nonblank required. | Proposed; not deployed.
active | bool:94 | BOOLEAN | NO | — | Accept actual bool only; no string True/False; no missing-to-false default. | Native BOOLEAN proposed (Postgres). D1 stores0/1: requires explicit user acceptance if chosen.
created_at | float:94 | TIMESTAMP WITHOUT TIME ZONE (source wall time; draft) | NO | — | Excel serial -> naive ISO datetime using workbook epoch; never attach Z/+07; retain raw serial in source manifest. | Metadata alternative: DB TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP for import time ONLY after approval; preserve source timestamp separately in immutable provenance.
updated_at | float:94 | TIMESTAMP WITHOUT TIME ZONE (source wall time; draft) | NO | — | Excel serial -> naive ISO datetime using workbook epoch; never attach Z/+07; retain raw serial in source manifest. | Metadata alternative: DB TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP for import time ONLY after approval; preserve source timestamp separately in immutable provenance.
Column1 | NoneType:94 | EXCLUDED | N/A | — | Do not import; entirely blank accidental column. | Not a production field.

## places

COLUMN | WORKBOOK TYPE | PROPOSED DB TYPE | NULLABLE | PK/FK/UNIQUE | NORMALIZATION RULE | NOTES
---|---|---|---|---|---|---
id | int:500 | INTEGER | NO | PK | Require exact positive integer <=2147483647; no text IDs/fractional truncation; preserve source identity. | Preserve imported IDs; sequence/default policy requires actual DB schema. BIGINT only if provider/owner requires wider range.
google_place_id | str:500 | TEXT | NO | UNIQUE NOT NULL | Trim, nonempty, exact case-sensitive identity; no fabricated replacement. | Proposed; not deployed.
name | str:500 | TEXT | NO | — | Trim outer whitespace; preserve Unicode and meaning; nonblank required. | Proposed; not deployed.
section | str:500 | TEXT | NO | CHECK EAT/CAFE/GO/STAY | Exact enum; reject unsupported values, no old EAT-only cafe conversion. | Proposed; not deployed.
primary_type | str:500 | TEXT | NO | — | Trim outer whitespace; preserve Unicode and meaning; nonblank required. | Proposed; not deployed.
phone | NoneType:481, str:19 | TEXT | YES | — | Nullable string; preserve +/leading zeros; no numeric conversion. | Proposed; not deployed.
website_url | str:255, NoneType:245 | TEXT | YES | — | Nullable absolute http(s) URL; invalid values quarantine/review, do not repair by guess. | Proposed; not deployed.
address | str:500 | TEXT | NO | — | Trim outer whitespace; preserve Unicode and meaning; nonblank required. | Proposed; not deployed.
administrative_unit_id | int:500 | INTEGER | NO | FK | Require exact positive integer <=2147483647; no text IDs/fractional truncation; preserve source identity. | References administrative_units.id.
latitude | float:500 | DOUBLE PRECISION | NO | CHECK range | Finite number, latitude[-90,90], longitude[-180,180]; preserve precision. | D1 alternative REAL; no spatial index is assumed installed.
longitude | float:500 | DOUBLE PRECISION | NO | CHECK range | Finite number, latitude[-90,90], longitude[-180,180]; preserve precision. | D1 alternative REAL; no spatial index is assumed installed.
google_maps_url | str:500 | TEXT | NO | — | Nonempty HTTPS Google Maps URL; allow exact known host/path; validate cid/query_place_id and reject credentials/scripts. | Syntax/identity-parameter check only; no live destination verification.
google_verified_at | float:500 | TIMESTAMP WITHOUT TIME ZONE (source wall time; draft) | YES | — | Excel serial -> naive ISO datetime using workbook epoch; never attach Z/+07; retain raw serial in source manifest. | See timestamp gate: no instant semantics inferred; final DB mapping pending owner.
rating | str:489, NoneType:10, float:1 | NUMERIC(3,2) | YES | CHECK0..5 | Decimal parse finite string/number; NULL stays NULL;0..5; reject unapproved precision loss. | 10 null;489 string;1 numeric. D1 REAL alternative requires tolerance tests.
review_count | str:489, NoneType:10, int:1 | INTEGER | YES | CHECK>=0 | Parse Decimal strings (e.g.6710.0) only if exact nonnegative integer; NULL stays NULL; check range. | Unknown review volume is not zero.
photo_count | str:496, NoneType:3, int:1 | INTEGER | YES | CHECK>=0 | Parse Decimal strings (e.g.6710.0) only if exact nonnegative integer; NULL stays NULL; check range. | photo_count optional source metadata only, never render/rank/release gate.
business_status | str:500 | TEXT | NO | — | Preserve supplied OPERATIONAL; future vocabulary requires source/provider agreement. | Source snapshot status is not live open-now evidence.
active | bool:500 | BOOLEAN | NO | — | Accept actual bool only; no string True/False; no missing-to-false default. | Native BOOLEAN proposed (Postgres). D1 stores0/1: requires explicit user acceptance if chosen.
featured | bool:500 | BOOLEAN | NO | — | Accept actual bool only; no string True/False; no missing-to-false default. | Native BOOLEAN proposed (Postgres). D1 stores0/1: requires explicit user acceptance if chosen.
source_updated_at | float:500 | TIMESTAMP WITHOUT TIME ZONE (source wall time; draft) | YES | — | Excel serial -> naive ISO datetime using workbook epoch; never attach Z/+07; retain raw serial in source manifest. | See timestamp gate: no instant semantics inferred; final DB mapping pending owner.
created_at | float:500 | TIMESTAMP WITHOUT TIME ZONE (source wall time; draft) | NO | — | Excel serial -> naive ISO datetime using workbook epoch; never attach Z/+07; retain raw serial in source manifest. | Metadata alternative: DB TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP for import time ONLY after approval; preserve source timestamp separately in immutable provenance.
updated_at | float:500 | TIMESTAMP WITHOUT TIME ZONE (source wall time; draft) | NO | — | Excel serial -> naive ISO datetime using workbook epoch; never attach Z/+07; retain raw serial in source manifest. | Metadata alternative: DB TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP for import time ONLY after approval; preserve source timestamp separately in immutable provenance.

## tags

COLUMN | WORKBOOK TYPE | PROPOSED DB TYPE | NULLABLE | PK/FK/UNIQUE | NORMALIZATION RULE | NOTES
---|---|---|---|---|---|---
id | int:36 | INTEGER | NO | PK | Require exact positive integer <=2147483647; no text IDs/fractional truncation; preserve source identity. | Preserve imported IDs; sequence/default policy requires actual DB schema. BIGINT only if provider/owner requires wider range.
code | str:36 | TEXT | NO | UNIQUE NOT NULL | Keep supplied uppercase tag code; reject duplicates, do not silently recode. | Proposed; not deployed.
display_name | str:36 | TEXT | NO | — | Trim outer whitespace; preserve Unicode and meaning; nonblank required. | Proposed; not deployed.
domain | str:36 | TEXT | NO | CHECK EAT/CAFE/GO/STAY/COMMON (proposal) | Use actual workbook domain codes; reject other values until contract revision. | Proposed; not deployed.
active | bool:36 | BOOLEAN | NO | — | Accept actual bool only; no string True/False; no missing-to-false default. | Native BOOLEAN proposed (Postgres). D1 stores0/1: requires explicit user acceptance if chosen.

## place_tags

COLUMN | WORKBOOK TYPE | PROPOSED DB TYPE | NULLABLE | PK/FK/UNIQUE | NORMALIZATION RULE | NOTES
---|---|---|---|---|---|---
place_id | int:841 | INTEGER | NO | FK; composite PK | Require exact positive integer <=2147483647; no text IDs/fractional truncation; preserve source identity. | References places.id, NOT google_place_id.
tag_id | int:841 | INTEGER | NO | FK; composite PK | Require exact positive integer <=2147483647; no text IDs/fractional truncation; preserve source identity. | References tags.id.

## tag_translations

COLUMN | WORKBOOK TYPE | PROPOSED DB TYPE | NULLABLE | PK/FK/UNIQUE | NORMALIZATION RULE | NOTES
---|---|---|---|---|---|---
tag_id | int:108 | INTEGER | NO | FK; composite PK | Require exact positive integer <=2147483647; no text IDs/fractional truncation; preserve source identity. | References tags.id.
locale | str:108 | TEXT | NO | PK with entity FK; CHECK vi/en/ko | Only vi/en/ko; preserve source IDs; no inferred locale. | Proposed; not deployed.
label | str:108 | TEXT | NO | — | Trim outer whitespace; preserve Unicode and meaning; nonblank required. | Proposed; not deployed.

## place_translations

COLUMN | WORKBOOK TYPE | PROPOSED DB TYPE | NULLABLE | PK/FK/UNIQUE | NORMALIZATION RULE | NOTES
---|---|---|---|---|---|---
place_id | int:1500 | INTEGER | NO | FK; composite PK | Require exact positive integer <=2147483647; no text IDs/fractional truncation; preserve source identity. | References places.id, NOT google_place_id.
locale | str:1500 | TEXT | NO | PK with entity FK; CHECK vi/en/ko | Only vi/en/ko; preserve source IDs; no inferred locale. | Proposed; not deployed.
display_name | str:1500 | TEXT | NO | — | Trim outer whitespace; preserve Unicode and meaning; nonblank required. | Proposed; not deployed.
primary_type_label | str:1500 | TEXT | NO | — | Trim outer whitespace; preserve Unicode and meaning; nonblank required. | Proposed; not deployed.
short_description | NoneType:1500 | TEXT | YES | — | Empty ->SQL NULL; do not synthesize descriptions. | All1500 null.
created_at | float:1500 | TIMESTAMP WITHOUT TIME ZONE (source wall time; draft) | NO | — | Excel serial -> naive ISO datetime using workbook epoch; never attach Z/+07; retain raw serial in source manifest. | Metadata alternative: DB TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP for import time ONLY after approval; preserve source timestamp separately in immutable provenance.
updated_at | float:1500 | TIMESTAMP WITHOUT TIME ZONE (source wall time; draft) | NO | — | Excel serial -> naive ISO datetime using workbook epoch; never attach Z/+07; retain raw serial in source manifest. | Metadata alternative: DB TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP for import time ONLY after approval; preserve source timestamp separately in immutable provenance.

## Key, index and change policy — proposal pending real schema
- administrative_units.id, places.id, tags.id primary keys; integer types must match all referencing FKs. places.google_place_id and tags.code unique. Do not make names unique. No forced uniqueness on currently empty official_code without provider/owner approval.
- place_tags PK(place_id,tag_id), both non-null FKs. tag_translations PK(tag_id,locale); place_translations PK(place_id,locale). Exactly three locale rows validated in import QA; composite keys alone do not enforce completeness.
- FKs: places.administrative_unit_id -> administrative_units.id; place_tags -> places/tags; translations -> their entity. Default proposal ON UPDATE RESTRICT, ON DELETE RESTRICT for all references. Prefer active=false over deletion; never cascade-delete provenance implicitly. Corrections/import replacements require explicit reconciliation. No deletion executed.
- Index proposal: places(active,section,administrative_unit_id), place_tags(tag_id,place_id) reverse lookup; PKs provide leading entity lookup for translations. Avoid duplicate indexes for existing PK/UNIQUE constraints. Verify query plan in selected DB.
- Nearby proposal: lat/lng bounding-box candidates then exact Haversine in Worker for500 rows, never cap3 before distance/filter/rank. No D1 spatial-extension assumption. If Neon/PostGIS approved, consider geography(point,4326) GiST with ST_DWithin; derived point/index not yet in six-sheet schema, must be explicitly reviewed. No image completeness ranking.
- All required text fields nonblank; exact section/locale checks; coordinate ranges, rating range and nonnegative integer counts. No production DDL until provider, schema ownership and unresolved policies are approved.

## Null normalization
True empty cells -> SQL NULL for nullable fields, validation failure for required fields. Never persist literal NULL/null/None strings. A future sentinel must be flagged and normalized explicitly, not treated as factual text. Empty string is not needed by any current core field. Preserve zero only when source explicitly supplies zero. Numeric conversion is strict Decimal parsing, no arbitrary coercion. Foreign/internal IDs remain numbers, Google IDs remain text.

## Timestamp policy and unresolved decision
Actual XLSX timestamp cells are numeric(n), format General, floats. Workbook epoch1899-12-30. They are not SQL timestamps or timezone-bearing strings. All core timestamps converted in memory successfully; original workbook untouched.
Observed meanings based on field names (source owner must confirm): google_verified_at=source verification wall time; source_updated_at=source observation/update wall time; created_at/updated_at=export/entity metadata. No evidence identifies their timezone; machine Asia/Saigon and workbook file metadata do not prove source timezone.
Chosen audit/normalization policy: preserve all original serials via immutable workbook hash and produce timezone-naive datetime only. Do not label UTC, +07, or an instant. Draft PostgreSQL representation is timestamp without time zone; D1 alternative is ISO text without suffix, subject to provider approval. Source timestamps must not become freshness/open-now guarantees.
Metadata alternative for user decision: if created_at/updated_at are confirmed disposable export metadata, use DB current timestamp as import-created/updated time and retain original workbook/manifest for provenance. This changes meaning, so NOT approved or executed here. google_verified_at/source_updated_at must not be replaced by import time. An actual timezone-aware source contract blocks until original timezone or explicit preservation policy is confirmed. updated_at requires a documented write policy/trigger later; CURRENT_TIMESTAMP default alone does not update on every write.
Conversion rounds to milliseconds in openpyxl; no source precision is discarded because raw serial/workbook retained. Import implementation must explicitly accept this precision or preserve more.

- administrative_units.created_at: 46300.34072760417 -> `2026-10-05T08:10:38.865000` (NO timezone), 94 converted.
- administrative_units.updated_at: 46300.34072760417 -> `2026-10-05T08:10:38.865000` (NO timezone), 94 converted.
- places.google_verified_at: 46279.16550827547 -> `2026-09-14T03:58:19.915000` (NO timezone), 500 converted.
- places.source_updated_at: 46279.16550827547 -> `2026-09-14T03:58:19.915000` (NO timezone), 500 converted.
- places.created_at: 46300.34072760417 -> `2026-10-05T08:10:38.865000` (NO timezone), 500 converted.
- places.updated_at: 46300.34072760417 -> `2026-10-05T08:10:38.865000` (NO timezone), 500 converted.
- place_translations.created_at: 46300.34072760417 -> `2026-10-05T08:10:38.865000` (NO timezone), 1500 converted.
- place_translations.updated_at: 46300.34072760417 -> `2026-10-05T08:10:38.865000` (NO timezone), 1500 converted.

## Import plan only — no import authorized
1. Confirm existing provider/project/schema/owner; do not create competing service. Approve column/nullability, timestamp and ID policies.
2. Validate workbook hash; read core tables only; reject stray Column1 and unexpected required headers. Keep immutable input and rejected-row report. Never use old86-row curation builder.
3. Dry-run strict normalization and referential/uniqueness checks; no DB writes. No image/media dependency.
4. In a separately authorized import phase, back up actual target and use provider-supported transaction/batch strategy. Load admins/tags, then places, then relationships/translations. Existing PK/Google-ID mismatches stop for review; no blind REPLACE or reset.
5. Explicit rerun policy: preserve stable IDs; compare existing identity before upsert; update only approved fields. Handle sequences only if actual schema uses them. On failure use transaction rollback or reviewed provider restore; no destructive fallback.
6. Query back counts/keys/FKs/active/tag/locale coverage and compare to workbook. Build/API tests are later; this QA alone does not prove DB or production works.

## Gate
No final DB_SCHEMA_CONTRACT or discovery-contract.ts until provider/schema facts and primary mapping/timestamp policy are settled. M1-A audit deliverable is reviewable; provider-specific completion is BLOCKED. M1-B first resolves these decisions, then inspects real schema before implementation. STOP now.
