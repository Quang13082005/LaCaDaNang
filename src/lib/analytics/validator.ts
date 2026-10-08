import { z } from "zod";
import {
  ANALYTICS_EVENT_NAMES,
  ANALYTICS_FAILURE_REASONS,
  ANALYTICS_INTENTS,
  ANALYTICS_LANGUAGE_MODES,
  ANALYTICS_LOCALES,
  type ClientAnalyticsPayload,
} from "./types";

export const FORBIDDEN_SERVER_KEYS = ["id", "occurred_at", "environment"] as const;

export const FORBIDDEN_GPS_KEYS = [
  "lat",
  "lng",
  "latitude",
  "longitude",
  "accuracy",
  "user_lat",
  "user_lng",
  "ip",
  "email",
  "phone",
] as const;

const uuidSchema = z.string().uuid("Invalid UUID format");
const localeSchema = z.enum(ANALYTICS_LOCALES);
const languageModeSchema = z.enum(ANALYTICS_LANGUAGE_MODES);
const intentSchema = z.enum(ANALYTICS_INTENTS);
const preferenceSchema = z.string().min(1).max(50);
const tapCountSchema = z.number().int().min(0);
const radiusSchema = z.union([z.literal(1), z.literal(3), z.literal(5)]);
const failureReasonSchema = z.enum(ANALYTICS_FAILURE_REASONS);

// 1. session_started
export const SessionStartedSchema = z
  .object({
    event_name: z.literal("session_started"),
    session_id: uuidSchema,
    journey_id: uuidSchema,
    locale: localeSchema,
    language_mode: languageModeSchema,
    meaningful_tap_count: tapCountSchema.optional(),
  })
  .strict();

// 2. home_viewed
export const HomeViewedSchema = z
  .object({
    event_name: z.literal("home_viewed"),
    session_id: uuidSchema,
    journey_id: uuidSchema,
    locale: localeSchema,
    language_mode: languageModeSchema,
    meaningful_tap_count: tapCountSchema.optional(),
  })
  .strict();

// 3. intent_selected
export const IntentSelectedSchema = z
  .object({
    event_name: z.literal("intent_selected"),
    session_id: uuidSchema,
    journey_id: uuidSchema,
    locale: localeSchema,
    language_mode: languageModeSchema,
    intent: intentSchema,
    meaningful_tap_count: tapCountSchema,
  })
  .strict();

// 4. preference_selected
export const PreferenceSelectedSchema = z
  .object({
    event_name: z.literal("preference_selected"),
    session_id: uuidSchema,
    journey_id: uuidSchema,
    locale: localeSchema,
    language_mode: languageModeSchema,
    intent: intentSchema,
    preference: preferenceSchema,
    meaningful_tap_count: tapCountSchema,
  })
  .strict();

// 5. results_shown
export const ResultsShownSchema = z
  .object({
    event_name: z.literal("results_shown"),
    session_id: uuidSchema,
    journey_id: uuidSchema,
    locale: localeSchema,
    language_mode: languageModeSchema,
    intent: intentSchema,
    preference: preferenceSchema,
    result_count: z.number().int().min(0).max(3),
    is_nearby: z.boolean(),
    radius_km: radiusSchema.optional(),
    meaningful_tap_count: tapCountSchema,
  })
  .strict();

// 6. nearby_requested
export const NearbyRequestedSchema = z
  .object({
    event_name: z.literal("nearby_requested"),
    session_id: uuidSchema,
    journey_id: uuidSchema,
    locale: localeSchema,
    language_mode: languageModeSchema,
    intent: intentSchema,
    preference: preferenceSchema,
    meaningful_tap_count: tapCountSchema,
  })
  .strict();

// 7. nearby_resolved
export const NearbyResolvedSchema = z
  .object({
    event_name: z.literal("nearby_resolved"),
    session_id: uuidSchema,
    journey_id: uuidSchema,
    locale: localeSchema,
    language_mode: languageModeSchema,
    intent: intentSchema,
    preference: preferenceSchema,
    result_count: z.number().int().min(0).max(3),
    is_nearby: z.literal(true),
    radius_km: radiusSchema,
    meaningful_tap_count: tapCountSchema.optional(),
  })
  .strict();

// 8. nearby_failed
export const NearbyFailedSchema = z
  .object({
    event_name: z.literal("nearby_failed"),
    session_id: uuidSchema,
    journey_id: uuidSchema,
    locale: localeSchema,
    language_mode: languageModeSchema,
    intent: intentSchema,
    preference: preferenceSchema,
    failure_reason: failureReasonSchema,
    meaningful_tap_count: tapCountSchema.optional(),
  })
  .strict();

// 9. citywide_selected
export const CitywideSelectedSchema = z
  .object({
    event_name: z.literal("citywide_selected"),
    session_id: uuidSchema,
    journey_id: uuidSchema,
    locale: localeSchema,
    language_mode: languageModeSchema,
    intent: intentSchema,
    preference: preferenceSchema,
    meaningful_tap_count: tapCountSchema,
  })
  .strict();

// 10. maps_clicked
export const MapsClickedSchema = z
  .object({
    event_name: z.literal("maps_clicked"),
    session_id: uuidSchema,
    journey_id: uuidSchema,
    locale: localeSchema,
    language_mode: languageModeSchema,
    intent: intentSchema,
    preference: preferenceSchema,
    place_id: z.number().int().positive(),
    result_position: z.union([z.literal(1), z.literal(2), z.literal(3)]),
    is_nearby: z.boolean().optional(),
    radius_km: radiusSchema.optional(),
    meaningful_tap_count: tapCountSchema,
  })
  .strict();

// 11. language_changed
export const LanguageChangedSchema = z
  .object({
    event_name: z.literal("language_changed"),
    session_id: uuidSchema,
    journey_id: uuidSchema,
    locale: localeSchema,
    language_mode: languageModeSchema,
    intent: intentSchema.optional(),
    preference: preferenceSchema.optional(),
    meaningful_tap_count: tapCountSchema.optional(),
  })
  .strict();

export const AnalyticsPayloadSchema = z.discriminatedUnion("event_name", [
  SessionStartedSchema,
  HomeViewedSchema,
  IntentSelectedSchema,
  PreferenceSelectedSchema,
  ResultsShownSchema,
  NearbyRequestedSchema,
  NearbyResolvedSchema,
  NearbyFailedSchema,
  CitywideSelectedSchema,
  MapsClickedSchema,
  LanguageChangedSchema,
]);

export type ValidationResult =
  | { ok: true; data: ClientAnalyticsPayload }
  | { ok: false; error: string; field?: string };

export function validateClientAnalyticsPayload(raw: unknown): ValidationResult {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    return { ok: false, error: "Payload must be a non-null JSON object" };
  }

  const record = raw as Record<string, unknown>;

  // Check for forbidden server-owned keys
  for (const key of FORBIDDEN_SERVER_KEYS) {
    if (key in record) {
      return {
        ok: false,
        error: `Server-owned field '${key}' is forbidden in client analytics payload`,
        field: key,
      };
    }
  }

  // Check for forbidden raw GPS or PII keys
  for (const key of FORBIDDEN_GPS_KEYS) {
    if (key in record) {
      return {
        ok: false,
        error: `Privacy violation: field '${key}' is forbidden in analytics payload`,
        field: key,
      };
    }
  }

  // Check event_name
  if (typeof record.event_name !== "string" || !(ANALYTICS_EVENT_NAMES as readonly string[]).includes(record.event_name)) {
    return {
      ok: false,
      error: `Invalid or missing event_name: '${String(record.event_name)}'`,
      field: "event_name",
    };
  }

  const parsed = AnalyticsPayloadSchema.safeParse(record);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const field = issue.path.join(".");
    return {
      ok: false,
      error: `Validation error${field ? ` at '${field}'` : ""}: ${issue.message}`,
      field,
    };
  }

  return { ok: true, data: parsed.data as ClientAnalyticsPayload };
}
