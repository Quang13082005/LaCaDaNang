import { neon } from "@neondatabase/serverless";
import { readDatabaseUrl } from "@/lib/db/neon";
import type { ClientAnalyticsPayload, AnalyticsEnvironment } from "./types";

/**
 * Resolves trusted deployment environment from server configuration.
 * Client telemetry is not permitted to determine or override this.
 */
export function resolveServerEnvironment(): AnalyticsEnvironment {
  const env =
    process.env.APP_ENV?.trim().toLowerCase() ||
    process.env.VERCEL_ENV?.trim().toLowerCase() ||
    process.env.ENVIRONMENT?.trim().toLowerCase();

  if (env === "production") return "production";
  if (env === "preview") return "preview";

  if (process.env.NODE_ENV === "production") {
    if (
      process.env.IS_PREVIEW === "true" ||
      process.env.NEXT_PUBLIC_IS_PREVIEW === "true"
    ) {
      return "preview";
    }
    return "production";
  }

  // Development/test fallbacks if an event reaches server:
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
