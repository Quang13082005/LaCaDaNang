-- =============================================================================
-- LA CÀ ĐÀ NẴNG — Analytics Events Schema Migration
-- Migration: 002_analytics_events.sql
-- Description: First-party analytics event store with strict typed schema
-- =============================================================================

CREATE TABLE IF NOT EXISTS analytics_events (
  id BIGSERIAL PRIMARY KEY,
  event_name VARCHAR(50) NOT NULL,
  session_id UUID NOT NULL,
  journey_id UUID NOT NULL,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  environment VARCHAR(15) NOT NULL
    CHECK (environment IN ('production', 'preview')),
  locale VARCHAR(5) NOT NULL
    CHECK (locale IN ('vi', 'en', 'ko')),
  language_mode VARCHAR(10) NOT NULL
    CHECK (language_mode IN ('auto', 'manual')),
  intent VARCHAR(10)
    CHECK (intent IN ('NOW', 'EAT', 'GO', 'STAY')),
  preference VARCHAR(50),
  place_id INTEGER CHECK (place_id > 0),
  result_position SMALLINT
    CHECK (result_position BETWEEN 1 AND 3),
  result_count SMALLINT
    CHECK (result_count BETWEEN 0 AND 3),
  is_nearby BOOLEAN NOT NULL DEFAULT FALSE,
  radius_km SMALLINT
    CHECK (radius_km IN (1, 3, 5)),
  failure_reason VARCHAR(20)
    CHECK (
      failure_reason IN (
        'denied',
        'unavailable',
        'timeout',
        'inaccurate',
        'network_error',
        'no_results'
      )
    ),
  meaningful_tap_count SMALLINT NOT NULL DEFAULT 0
    CHECK (meaningful_tap_count >= 0)
);

CREATE INDEX IF NOT EXISTS
  idx_analytics_events_occurred_at
  ON analytics_events (occurred_at DESC);

CREATE INDEX IF NOT EXISTS
  idx_analytics_events_session_id
  ON analytics_events (session_id);

CREATE INDEX IF NOT EXISTS
  idx_analytics_events_journey_id
  ON analytics_events (journey_id);

CREATE INDEX IF NOT EXISTS
  idx_analytics_events_name_env
  ON analytics_events (event_name, environment);
