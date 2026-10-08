import { neon } from "@neondatabase/serverless";
import { readDatabaseUrl } from "@/lib/db/neon";
import type { ClientAnalyticsPayload, AnalyticsEnvironment } from "./types";

/**
 * Resolves trusted deployment environment from server configuration.
 * Client telemetry is not permitted to determine or override this.
 */
export function resolveServerEnvironment(): AnalyticsEnvironment {
  // 1. Canonical trusted variable: APP_ENV (Cloudflare Workers / server config)
  const appEnv = process.env.APP_ENV?.trim().toLowerCase();
  if (appEnv) {
    if (appEnv === "production") return "production";
    if (appEnv === "preview") return "preview";
    // Invalid/unrecognized explicit APP_ENV value: fail safely to preview (never guess production)
    return "preview";
  }

  // 2. Secondary preview flag check (evaluated BEFORE any generic fallback)
  if (
    process.env.IS_PREVIEW === "true" ||
    process.env.NEXT_PUBLIC_IS_PREVIEW === "true"
  ) {
    return "preview";
  }

  // 3. Generic fallback
  const genericEnv = process.env.ENVIRONMENT?.trim().toLowerCase();
  if (genericEnv === "production") return "production";
  if (genericEnv === "preview") return "preview";

  // 4. Default fallback:
  // In development, test, or untagged environments, default to "preview" to protect production metrics.
  // Production requires explicit APP_ENV=production or confirmed production runtime.
  if (process.env.NODE_ENV === "production") {
    return "production";
  }

  return "preview";
}

let cachedNeonSql: ReturnType<typeof neon> | null = null;

function getNeonSql() {
  if (!cachedNeonSql) {
    const url = readDatabaseUrl();
    cachedNeonSql = neon(url);
  }
  return cachedNeonSql;
}

/** Test seam only */
export function resetAnalyticsDbForTests() {
  cachedNeonSql = null;
}

/**
 * Inserts a validated analytics event into Neon PostgreSQL via parameterized SQL.
 * Never exposes raw connection strings, passwords, or database internals.
 */
export async function insertAnalyticsEvent(
  event: ClientAnalyticsPayload,
  environment: AnalyticsEnvironment
): Promise<number> {
  const sql = getNeonSql();

  const intent = "intent" in event ? event.intent ?? null : null;
  const preference = "preference" in event ? event.preference ?? null : null;
  const placeId = "place_id" in event ? event.place_id ?? null : null;
  const resultPosition = "result_position" in event ? event.result_position ?? null : null;
  const resultCount = "result_count" in event ? event.result_count ?? null : null;
  const isNearby = "is_nearby" in event ? Boolean(event.is_nearby) : false;
  const radiusKm = "radius_km" in event ? event.radius_km ?? null : null;
  const failureReason = "failure_reason" in event ? event.failure_reason ?? null : null;
  const meaningfulTapCount = event.meaningful_tap_count ?? 0;

  const insertSql = `
    INSERT INTO analytics_events (
      event_name,
      session_id,
      journey_id,
      occurred_at,
      environment,
      locale,
      language_mode,
      intent,
      preference,
      place_id,
      result_position,
      result_count,
      is_nearby,
      radius_km,
      failure_reason,
      meaningful_tap_count
    ) VALUES (
      $1, $2, $3, NOW(), $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
    )
    RETURNING id;
  `;

  const params = [
    event.event_name,
    event.session_id,
    event.journey_id,
    environment,
    event.locale,
    event.language_mode,
    intent,
    preference,
    placeId,
    resultPosition,
    resultCount,
    isNearby,
    radiusKm,
    failureReason,
    meaningfulTapCount,
  ];

  try {
    const rows = (await sql.query(insertSql, params)) as unknown as Array<{ id?: string | number }>;
    const row = rows[0];
    return row?.id != null ? Number(row.id) : 0;
  } catch {
    // Sanitise error: never bubble DB credentials or host details
    throw new Error("Failed to persist analytics event");
  }
}
