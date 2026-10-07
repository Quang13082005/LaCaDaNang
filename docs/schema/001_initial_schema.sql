-- =============================================================================
-- LA CÀ ĐÀ NẴNG — PostgreSQL Initial Schema
-- =============================================================================
-- Source:  DB_IMPORT_CONTRACT_PROPOSAL.md (M1-A audit)
-- Target:  Neon PostgreSQL (native BOOLEAN, TIMESTAMP WITHOUT TIME ZONE)
-- Tables:  6 core tables from LA_CA_DB_READY_500_NO_IMAGE_FINAL.xlsx
-- Status:  DRAFT for user review — no real DB created
-- Hash:    Workbook SHA256 874e7d6d9f5688af85de347051d4fc67a52f44bbd97a249d1f717056f6496bd3
-- =============================================================================

BEGIN;

-- ---------------------------------------------------------------------------
-- 1. administrative_units
-- ---------------------------------------------------------------------------
CREATE TABLE administrative_units (
    id              INTEGER         NOT NULL PRIMARY KEY,
    official_code   TEXT            DEFAULT NULL,
    official_name   TEXT            NOT NULL
                    CONSTRAINT ck_admin_official_name_nonempty CHECK (btrim(official_name) <> ''),
    unit_type       TEXT            NOT NULL
                    CONSTRAINT ck_admin_unit_type_nonempty CHECK (btrim(unit_type) <> ''),
    active          BOOLEAN         NOT NULL,
    created_at      TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    updated_at      TIMESTAMP WITHOUT TIME ZONE NOT NULL
);

COMMENT ON TABLE  administrative_units IS 'Administrative geography units (quận/huyện/phường/xã). IDs preserved from workbook.';
COMMENT ON COLUMN administrative_units.official_code IS 'Government code — all 94 rows currently NULL; kept for future population.';
COMMENT ON COLUMN administrative_units.created_at IS 'Workbook export timestamp (naive wall time, no timezone inferred).';
COMMENT ON COLUMN administrative_units.updated_at IS 'Workbook export timestamp (naive wall time, no timezone inferred).';

-- ---------------------------------------------------------------------------
-- 2. tags
-- ---------------------------------------------------------------------------
CREATE TABLE tags (
    id              INTEGER         NOT NULL PRIMARY KEY,
    code            TEXT            NOT NULL UNIQUE
                    CONSTRAINT ck_tag_code_nonempty CHECK (btrim(code) <> ''),
    display_name    TEXT            NOT NULL
                    CONSTRAINT ck_tag_display_name_nonempty CHECK (btrim(display_name) <> ''),
    domain          TEXT            NOT NULL
                    CONSTRAINT ck_tag_domain CHECK (domain IN ('EAT', 'CAFE', 'GO', 'STAY', 'COMMON')),
    active          BOOLEAN         NOT NULL
);

COMMENT ON TABLE  tags IS 'Curated tags with domain scope. 36 tags across EAT/CAFE/GO/STAY/COMMON.';
COMMENT ON COLUMN tags.code IS 'Uppercase tag code, e.g. STREET_FOOD, BEACH. Unique identifier.';
COMMENT ON COLUMN tags.domain IS 'Which section(s) this tag belongs to. COMMON tags span multiple sections.';

-- ---------------------------------------------------------------------------
-- 3. places
-- ---------------------------------------------------------------------------
CREATE TABLE places (
    id                      INTEGER                     NOT NULL PRIMARY KEY,
    google_place_id         TEXT                        NOT NULL UNIQUE
                            CONSTRAINT ck_place_google_id_nonempty CHECK (btrim(google_place_id) <> ''),
    name                    TEXT                        NOT NULL
                            CONSTRAINT ck_place_name_nonempty CHECK (btrim(name) <> ''),
    section                 TEXT                        NOT NULL
                            CONSTRAINT ck_place_section CHECK (section IN ('EAT', 'CAFE', 'GO', 'STAY')),
    primary_type            TEXT                        NOT NULL
                            CONSTRAINT ck_place_primary_type_nonempty CHECK (btrim(primary_type) <> ''),
    phone                   TEXT                        DEFAULT NULL,
    website_url             TEXT                        DEFAULT NULL,
    address                 TEXT                        NOT NULL
                            CONSTRAINT ck_place_address_nonempty CHECK (btrim(address) <> ''),
    administrative_unit_id  INTEGER                     NOT NULL
                            REFERENCES administrative_units (id)
                            ON UPDATE RESTRICT ON DELETE RESTRICT,
    latitude                DOUBLE PRECISION            NOT NULL
                            CONSTRAINT ck_place_latitude CHECK (latitude BETWEEN -90 AND 90),
    longitude               DOUBLE PRECISION            NOT NULL
                            CONSTRAINT ck_place_longitude CHECK (longitude BETWEEN -180 AND 180),
    google_maps_url         TEXT                        NOT NULL
                            CONSTRAINT ck_place_maps_url_nonempty CHECK (btrim(google_maps_url) <> ''),
    google_verified_at      TIMESTAMP WITHOUT TIME ZONE DEFAULT NULL,
    rating                  NUMERIC(3,2)                DEFAULT NULL
                            CONSTRAINT ck_place_rating CHECK (rating IS NULL OR (rating >= 0 AND rating <= 5)),
    review_count            INTEGER                     DEFAULT NULL
                            CONSTRAINT ck_place_review_count CHECK (review_count IS NULL OR review_count >= 0),
    photo_count             INTEGER                     DEFAULT NULL
                            CONSTRAINT ck_place_photo_count CHECK (photo_count IS NULL OR photo_count >= 0),
    business_status         TEXT                        NOT NULL
                            CONSTRAINT ck_place_business_status_nonempty CHECK (btrim(business_status) <> ''),
    active                  BOOLEAN                     NOT NULL,
    featured                BOOLEAN                     NOT NULL,
    source_updated_at       TIMESTAMP WITHOUT TIME ZONE DEFAULT NULL,
    created_at              TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    updated_at              TIMESTAMP WITHOUT TIME ZONE NOT NULL
);

COMMENT ON TABLE  places IS '500 curated places (EAT 134, CAFE 145, GO 94, STAY 127). IDs preserved from workbook.';
COMMENT ON COLUMN places.google_place_id IS 'Google Maps Place ID. Unique, case-sensitive.';
COMMENT ON COLUMN places.section IS 'Business category: EAT, CAFE, GO, STAY.';
COMMENT ON COLUMN places.rating IS 'Google rating 0.00-5.00. NULL = unknown (not zero).';
COMMENT ON COLUMN places.review_count IS 'Google review count. NULL = unknown (not zero).';
COMMENT ON COLUMN places.photo_count IS 'Google photo count. Optional metadata only, never a render/rank gate.';
COMMENT ON COLUMN places.google_verified_at IS 'Source verification wall time (naive, no timezone inferred). NOT open-now evidence.';
COMMENT ON COLUMN places.source_updated_at IS 'Source observation wall time (naive, no timezone inferred). NOT freshness evidence.';
COMMENT ON COLUMN places.created_at IS 'Workbook export timestamp (naive wall time, no timezone inferred).';
COMMENT ON COLUMN places.updated_at IS 'Workbook export timestamp (naive wall time, no timezone inferred).';

-- ---------------------------------------------------------------------------
-- 4. place_tags (junction)
-- ---------------------------------------------------------------------------
CREATE TABLE place_tags (
    place_id    INTEGER     NOT NULL
                REFERENCES places (id)
                ON UPDATE RESTRICT ON DELETE RESTRICT,
    tag_id      INTEGER     NOT NULL
                REFERENCES tags (id)
                ON UPDATE RESTRICT ON DELETE RESTRICT,
    PRIMARY KEY (place_id, tag_id)
);

COMMENT ON TABLE place_tags IS 'Many-to-many: 841 place-tag associations.';

-- ---------------------------------------------------------------------------
-- 5. tag_translations
-- ---------------------------------------------------------------------------
CREATE TABLE tag_translations (
    tag_id      INTEGER     NOT NULL
                REFERENCES tags (id)
                ON UPDATE RESTRICT ON DELETE RESTRICT,
    locale      TEXT        NOT NULL
                CONSTRAINT ck_tag_tr_locale CHECK (locale IN ('vi', 'en', 'ko')),
    label       TEXT        NOT NULL
                CONSTRAINT ck_tag_tr_label_nonempty CHECK (btrim(label) <> ''),
    PRIMARY KEY (tag_id, locale)
);

COMMENT ON TABLE tag_translations IS 'Tag labels in vi/en/ko. 108 rows (36 tags x 3 locales).';

-- ---------------------------------------------------------------------------
-- 6. place_translations
-- ---------------------------------------------------------------------------
CREATE TABLE place_translations (
    place_id            INTEGER     NOT NULL
                        REFERENCES places (id)
                        ON UPDATE RESTRICT ON DELETE RESTRICT,
    locale              TEXT        NOT NULL
                        CONSTRAINT ck_place_tr_locale CHECK (locale IN ('vi', 'en', 'ko')),
    display_name        TEXT        NOT NULL
                        CONSTRAINT ck_place_tr_display_name_nonempty CHECK (btrim(display_name) <> ''),
    primary_type_label  TEXT        NOT NULL
                        CONSTRAINT ck_place_tr_primary_type_label_nonempty CHECK (btrim(primary_type_label) <> ''),
    short_description   TEXT        DEFAULT NULL,
    created_at          TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    updated_at          TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    PRIMARY KEY (place_id, locale)
);

COMMENT ON TABLE  place_translations IS 'Place display names and type labels in vi/en/ko. 1500 rows (500 places x 3 locales).';
COMMENT ON COLUMN place_translations.short_description IS 'All 1500 currently NULL. Do not synthesize descriptions.';

-- ---------------------------------------------------------------------------
-- Indexes (beyond PK/UNIQUE)
-- ---------------------------------------------------------------------------

-- Place lookup by section + active status + admin unit
CREATE INDEX idx_places_section_active_admin
    ON places (active, section, administrative_unit_id);

-- Reverse lookup: find all places for a given tag
CREATE INDEX idx_place_tags_tag_place
    ON place_tags (tag_id, place_id);

-- Place translations by locale (for locale-filtered queries)
CREATE INDEX idx_place_translations_locale
    ON place_translations (locale, place_id);

-- Tag translations by locale
CREATE INDEX idx_tag_translations_locale
    ON tag_translations (locale, tag_id);

COMMIT;

-- =============================================================================
-- Notes:
-- 1. All IDs preserve workbook source values. No SERIAL/GENERATED sequences.
--    If you later need auto-increment for new rows, ALTER the column or add
--    a sequence separately after import.
-- 2. All timestamps are TIMESTAMP WITHOUT TIME ZONE (naive wall time).
--    Source timezone is UNKNOWN. Never attach Z/+07/UTC.
-- 3. No place_media table — MVP does not depend on venue images.
-- 4. ON DELETE RESTRICT everywhere: prefer active=false over deletion.
-- 5. Column1 from workbook excluded (entirely blank).
-- 6. All required text CHECK constraints use btrim() to reject whitespace-only.
-- =============================================================================
