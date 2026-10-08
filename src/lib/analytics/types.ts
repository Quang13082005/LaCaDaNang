/**
 * LA CÀ ĐÀ NẴNG — First-Party Analytics Types
 *
 * Locked 11-Event Vocabulary and Schema definitions.
 * Server-generated fields: id, occurred_at, environment.
 * Client telemetry fields: 14 allowed fields.
 */

export const ANALYTICS_EVENT_NAMES = [
  "session_started",
  "home_viewed",
  "intent_selected",
  "preference_selected",
  "results_shown",
  "nearby_requested",
  "nearby_resolved",
  "nearby_failed",
  "citywide_selected",
  "maps_clicked",
  "language_changed",
] as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENT_NAMES)[number];

export const ANALYTICS_ENVIRONMENTS = ["production", "preview"] as const;
export type AnalyticsEnvironment = (typeof ANALYTICS_ENVIRONMENTS)[number];

export const ANALYTICS_LOCALES = ["vi", "en", "ko"] as const;
export type AnalyticsLocale = (typeof ANALYTICS_LOCALES)[number];

export const ANALYTICS_LANGUAGE_MODES = ["auto", "manual"] as const;
export type AnalyticsLanguageMode = (typeof ANALYTICS_LANGUAGE_MODES)[number];

export const ANALYTICS_INTENTS = ["NOW", "EAT", "GO", "STAY"] as const;
export type AnalyticsIntent = (typeof ANALYTICS_INTENTS)[number];

export const ANALYTICS_FAILURE_REASONS = [
  "denied",
  "unavailable",
  "timeout",
  "inaccurate",
  "network_error",
  "no_results",
] as const;
export type AnalyticsFailureReason = (typeof ANALYTICS_FAILURE_REASONS)[number];

export const ANALYTICS_RADIUS_VALUES = [1, 3, 5] as const;
export type AnalyticsRadiusValue = (typeof ANALYTICS_RADIUS_VALUES)[number];

/** Server-owned database fields (client is strictly forbidden from providing these) */
export interface ServerGeneratedFields {
  id: number;
  occurred_at: string;
  environment: AnalyticsEnvironment;
}

/** Base properties common to all client telemetry events */
export interface BaseClientPayload {
  session_id: string;
  journey_id: string;
  locale: AnalyticsLocale;
  language_mode: AnalyticsLanguageMode;
  meaningful_tap_count?: number;
}

/** 1. session_started */
export interface SessionStartedPayload extends BaseClientPayload {
  event_name: "session_started";
}

/** 2. home_viewed */
export interface HomeViewedPayload extends BaseClientPayload {
  event_name: "home_viewed";
}

/** 3. intent_selected */
export interface IntentSelectedPayload extends BaseClientPayload {
  event_name: "intent_selected";
  intent: AnalyticsIntent;
  meaningful_tap_count: number;
}

/** 4. preference_selected */
export interface PreferenceSelectedPayload extends BaseClientPayload {
  event_name: "preference_selected";
  intent: AnalyticsIntent;
  preference: string;
  meaningful_tap_count: number;
}

/** 5. results_shown */
export interface ResultsShownPayload extends BaseClientPayload {
  event_name: "results_shown";
  intent: AnalyticsIntent;
  preference: string;
  result_count: number;
  is_nearby: boolean;
  radius_km?: AnalyticsRadiusValue;
  meaningful_tap_count: number;
}

/** 6. nearby_requested */
export interface NearbyRequestedPayload extends BaseClientPayload {
  event_name: "nearby_requested";
  intent: AnalyticsIntent;
  preference: string;
  meaningful_tap_count: number;
}

/** 7. nearby_resolved */
export interface NearbyResolvedPayload extends BaseClientPayload {
  event_name: "nearby_resolved";
  intent: AnalyticsIntent;
  preference: string;
  result_count: number;
  is_nearby: true;
  radius_km: AnalyticsRadiusValue;
}

/** 8. nearby_failed */
export interface NearbyFailedPayload extends BaseClientPayload {
  event_name: "nearby_failed";
  intent: AnalyticsIntent;
  preference: string;
  failure_reason: AnalyticsFailureReason;
}

/** 9. citywide_selected */
export interface CitywideSelectedPayload extends BaseClientPayload {
  event_name: "citywide_selected";
  intent: AnalyticsIntent;
  preference: string;
  meaningful_tap_count: number;
}

/** 10. maps_clicked */
export interface MapsClickedPayload extends BaseClientPayload {
  event_name: "maps_clicked";
  intent: AnalyticsIntent;
  preference: string;
  place_id: number;
  result_position: 1 | 2 | 3;
  is_nearby?: boolean;
  radius_km?: AnalyticsRadiusValue;
  meaningful_tap_count: number;
}

/** 11. language_changed */
export interface LanguageChangedPayload extends BaseClientPayload {
  event_name: "language_changed";
  intent?: AnalyticsIntent;
  preference?: string;
}

/** Union of all valid client telemetry payloads */
export type ClientAnalyticsPayload =
  | SessionStartedPayload
  | HomeViewedPayload
  | IntentSelectedPayload
  | PreferenceSelectedPayload
  | ResultsShownPayload
  | NearbyRequestedPayload
  | NearbyResolvedPayload
  | NearbyFailedPayload
  | CitywideSelectedPayload
  | MapsClickedPayload
  | LanguageChangedPayload;

/** Canonical database row for analytics_events */
export interface AnalyticsEventRow {
  id: number;
  event_name: AnalyticsEventName;
  session_id: string;
  journey_id: string;
  occurred_at: string;
  environment: AnalyticsEnvironment;
  locale: AnalyticsLocale;
  language_mode: AnalyticsLanguageMode;
  intent: AnalyticsIntent | null;
  preference: string | null;
  place_id: number | null;
  result_position: number | null;
  result_count: number | null;
  is_nearby: boolean;
  radius_km: number | null;
  failure_reason: string | null;
  meaningful_tap_count: number;
}
