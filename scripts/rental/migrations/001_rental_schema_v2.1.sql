-- Migration: 001_rental_schema_v2.1.sql
-- Proposal: RENTAL_DATABASE_PROPOSAL.md V2.1
-- Status: PROPOSED / REHEARSAL VERIFIED
-- Tables: rental_vehicle_models, rental_vehicles, rental_vehicle_media, rental_contact_settings

CREATE TABLE rental_vehicle_models (
 id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 brand text NOT NULL CHECK (btrim(brand) <> ''),
 model_name text NOT NULL CHECK (btrim(model_name) <> ''),
 category text NOT NULL CHECK (category IN ('scooter','semi','manual')),
 active boolean NOT NULL DEFAULT false,
 created_at timestamptz NOT NULL DEFAULT current_timestamp,
 UNIQUE (brand, model_name)
);

CREATE TABLE rental_vehicles (
 id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 public_id uuid NOT NULL DEFAULT gen_random_uuid() UNIQUE,
 vehicle_code text NOT NULL UNIQUE CHECK (btrim(vehicle_code) <> ''),
 model_id bigint NOT NULL REFERENCES rental_vehicle_models(id) ON DELETE RESTRICT,
 engine_cc numeric(6,3) NOT NULL CHECK (engine_cc > 0),
 registration_year integer NOT NULL CHECK (registration_year BETWEEN 1900 AND 2100),
 color_source text NOT NULL CHECK (btrim(color_source) <> ''),
 color_complete boolean NOT NULL DEFAULT true,
 color_en text,
 color_ko text,
 raw_daily_price integer NOT NULL CHECK (raw_daily_price > 0),
 daily_price_vnd integer NOT NULL CHECK (daily_price_vnd > 0),
 raw_asset_deposit text NOT NULL,
 one_cccd_deposit_vnd integer NOT NULL CHECK (one_cccd_deposit_vnd >= 0),
 active boolean NOT NULL DEFAULT false,
 created_at timestamptz NOT NULL DEFAULT current_timestamp,
 updated_at timestamptz NOT NULL DEFAULT current_timestamp
);

CREATE INDEX rental_vehicles_model_idx ON rental_vehicles(model_id);

CREATE TABLE rental_vehicle_media (
 id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 vehicle_id bigint NOT NULL REFERENCES rental_vehicles(id) ON DELETE RESTRICT,
 image_url text NOT NULL CHECK (image_url ~ '^https://[^[:space:]]+$'),
 is_primary boolean NOT NULL DEFAULT false,
 sort_order integer NOT NULL DEFAULT 0 CHECK (sort_order >= 0),
 alt_text text NOT NULL CHECK (btrim(alt_text) <> ''),
 created_at timestamptz NOT NULL DEFAULT current_timestamp,
 UNIQUE (vehicle_id, image_url)
);

CREATE UNIQUE INDEX rental_media_primary_idx
 ON rental_vehicle_media(vehicle_id) WHERE is_primary;

CREATE INDEX rental_media_order_idx
 ON rental_vehicle_media(vehicle_id, sort_order, id);

CREATE TABLE rental_contact_settings (
 id smallint PRIMARY KEY CHECK (id = 1),
 phone_e164 text NOT NULL CHECK (phone_e164 ~ '^\+[1-9][0-9]{7,14}$'),
 zalo_url text NOT NULL CHECK (zalo_url ~ '^https://zalo[.]me/[0-9]+$'),
 active boolean NOT NULL DEFAULT false,
 helmets_included boolean NOT NULL DEFAULT true,
 two_cccd_cash_deposit_vnd integer NOT NULL DEFAULT 0
   CHECK (two_cccd_cash_deposit_vnd = 0),
 policy_vi text NOT NULL CHECK (btrim(policy_vi) <> ''),
 policy_en text NOT NULL CHECK (btrim(policy_en) <> ''),
 policy_ko text NOT NULL CHECK (btrim(policy_ko) <> ''),
 updated_at timestamptz NOT NULL DEFAULT current_timestamp
);
