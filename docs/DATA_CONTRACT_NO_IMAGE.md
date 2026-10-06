# No-image data contract preparation
CURRENT_REFERENCE — canonical M1 input specification, NOT an implemented TS/API/SQL contract.

Source workbook: C:/Users/THINKPAD789/Downloads/LA_CA_DB_READY_500_NO_IMAGE_FINAL.xlsx. Exact protected copy: D:/Dự án tìm địa điểm ăn chơi/M0_HANDOFF_2026-10-06/inputs/LA_CA_DB_READY_500_NO_IMAGE_FINAL.xlsx. SHA256 874e7d6d9f5688af85de347051d4fc67a52f44bbd97a249d1f717056f6496bd3.
All cells in all 15 sheets read; independent structural checks used the six core sheets, not cached PASS labels. See evidence/workbook-audit.json for headers, row counts and validation.

## Verified workbook structure (not DB import evidence)
- administrative_units: 94, unique id; fields id, official_code, official_name, unit_type, active, created_at, updated_at, Column1. Column1 entirely blank: exclude from future import mapping after schema review.
- places: 500 unique id and google_place_id; EAT134/CAFE145/GO94/STAY127. All active=true and business_status=OPERATIONAL. 500 finite in-range coordinates, Maps URLs and valid administrative_unit_id references.
- tags: 36, unique id; code/display_name/domain/active.
- place_tags: 841 distinct (place_id,tag_id), all FKs valid, all 500 places tagged.
- tag_translations: 108 unique (tag_id,locale), vi/en/ko36 each, valid FKs.
- place_translations: 1500 unique (place_id,locale), vi/en/ko500 each, valid FKs. Proper names may legitimately remain identical between locales; this is not proof of human translation quality.
- Eight REPLACEMENT_8 identities marked RESOLVED; Trà Vân: Caffe SuKa, Cây Quế Cổ Thụ, Cầu Đăk Buôn. Coverage exceptions preserved.

## Conversion issues M1 must decide explicitly
rating and review_count: 489 strings, 10 nulls, 1 numeric value each. Parse numeric strings strictly; preserve null, never default to zero/fake rating. Timestamps are Excel serial floats; confirm epoch/timezone/precision with DB owner, do not append an invented UTC offset. Column names are workbook headers, not proof of SQL schema/nullability.
places.id is the internal key used by joins; google_place_id is external identity. FINAL_500_FLAT.place_id uses Google identity: do not confuse it with the internal FK.
No opening-hours/duration fields. NIGHT/tag labels alone do not establish current opening. Workbook tags are supplied authoritative assignments, not permission to infer extra tags.
Old three Place shapes cannot handle CAFE/null numeric fields consistently. Create src/lib/data/discovery-contract.ts only in M1 after provider/schema confirmation: stable ID, EAT/CAFE/GO/STAY, name/type/address/area, coordinates, Maps, approved tags, optional localized values/distance/reasons. No image requirement or media join.

## Authority within workbook
Six core tables + final no-image decision govern intended import. FINAL_QA_NO_IMAGE/FINAL_500_FLAT are cross-checks, not alternate import tables. README_QA retains old image-scraper instructions and old section totals; final core values supersede these. SECTION_AUDIT, REPLACEMENT_8 and COVERAGE_94 are provenance/support. Image queue/media/hero audit sheets are historical/deferred; do not execute their next_action text or import them.
M0 does not verify remote Google entities, imagery, live business status or translation semantics; it verifies supplied workbook consistency. SQL/provider compatibility and post-import query-back counts remain NOT VERIFIED.

## M1-A follow-up
Fresh audit and all-column mapping: [DB_IMPORT_CONTRACT_PROPOSAL.md](DB_IMPORT_CONTRACT_PROPOSAL.md). Provider decision: [DB_PROVIDER_DECISION_REQUIRED.md](DB_PROVIDER_DECISION_REQUIRED.md). Source hash unchanged; timestamp conversion is naive only. No DB/provider/schema finalized.
