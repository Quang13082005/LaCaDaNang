/**
 * GET /api/discovery
 *
 * Query parameters:
 *   intent      required  EAT | CAFE | GO | STAY
 *   locale      optional  vi | en | ko  (default: vi)
 *   preference  optional  preference identifier (section-specific)
 *
 * Status codes:
 *   200  Success (ok: true, data: DiscoveryResponseData)
 *   400  Invalid parameter (ok: false, error: { code: "INVALID_PARAMETER" | "INTENT_NOT_AVAILABLE" })
 *   500  Database unavailable / unexpected (ok: false, error: { code: "DATABASE_UNAVAILABLE" | "INTERNAL_ERROR" })
 *
 * Architecture: URL params → parseDiscoveryQuery → resolvePreference
 *             → PlaceRepository (read-only SQL) → adaptRows (safe types)
 *             → DiscoveryResponseData
 * Constraints:
 *  - DATABASE_URL is read server-side only; never exposed to the client.
 *  - EAT / GO / STAY enabled; CAFE answers 400 INTENT_NOT_AVAILABLE.
 *  - At most DISCOVERY_MAX_RESULTS (3) rows, never padded.
 *  - No images, no travel time, no live hours.
 */
import { NextResponse, type NextRequest } from "next/server";
import {
  DISCOVERY_MAX_RESULTS,
  DISCOVERY_NEARBY_RANKING_RULE,
  DISCOVERY_RANKING_RULE,
  ENABLED_DISCOVERY_SECTIONS,
  parseDiscoveryQuery,
  type DiscoveryApiBody,
  type DiscoveryErrorCode,
  type DiscoveryMeta,
} from "@/lib/data/discovery-contract";
import { DatabaseConfigError, DatabaseQueryError, getNeonExecutor } from "@/lib/db/neon";
import { adaptRows } from "@/lib/data/place-adapter";
import { clampLimit, createPlaceRepository } from "@/lib/data/place-repository";
import { resolvePreference, discoverySectionFor } from "@/lib/data/preference-map";
import { evaluateNearbyDiscovery } from "@/lib/geo/nearby-engine";

// Disable Next.js body parsing (GET has none); opt out of data cache to ensure fresh reads.
export const dynamic = "force-dynamic";
export const revalidate = 0;

function err(status: number, code: DiscoveryErrorCode, message: string, field?: string): NextResponse<DiscoveryApiBody> {
  const body: DiscoveryApiBody = {
    ok: false,
    error: field ? { code, message, field } : { code, message },
  };
  return NextResponse.json(body, { status });
}

export async function GET(request: NextRequest): Promise<NextResponse<DiscoveryApiBody>> {
  // 1. Parse + validate query parameters
  const params = request.nextUrl.searchParams;
  const parseResult = parseDiscoveryQuery(params);
  if (!parseResult.ok) {
    return err(400, "INVALID_PARAMETER", parseResult.message, parseResult.field);
  }
  const { intent, locale, preference, location } = parseResult.query;

  // 2. Check if this intent is currently enabled
  if (!(ENABLED_DISCOVERY_SECTIONS as readonly string[]).includes(intent)) {
    return err(400, "INTENT_NOT_AVAILABLE", `Section "${intent}" is not yet available. Currently enabled: ${ENABLED_DISCOVERY_SECTIONS.join(", ")}.`);
  }

  // 3. Resolve preference → tag codes
  const resolved = resolvePreference(intent, preference);
  if (!resolved.ok) {
    return err(400, "INVALID_PARAMETER", `Preference "${preference}" is not recognised for section "${intent}".`, "preference");
  }

  // 4. Fetch from Neon & process results
  let places;
  let meta: DiscoveryMeta;

  try {
    const executor = getNeonExecutor();
    const repo = createPlaceRepository(executor);

    if (location !== null) {
      // Nearby mode: Retrieve all eligible candidates without pre-geo LIMIT 3
      const candidateRows = await repo.findNearbyCandidateRows({
        section: discoverySectionFor(intent, preference),
        locale,
        tagCodes: resolved.tagCodes ?? null,
      });
      const candidates = adaptRows(candidateRows, locale);
      const nearbyResult = evaluateNearbyDiscovery(candidates, {
        latitude: location.lat,
        longitude: location.lng,
      });
      places = nearbyResult.places;
      meta = {
        limit: DISCOVERY_MAX_RESULTS,
        ranking: DISCOVERY_NEARBY_RANKING_RULE,
        source: "neon-postgres",
        radiusKm: nearbyResult.radiusKm,
        nearby: true,
      };
    } else {
      // Standard non-location discovery: Keep existing query and LIMIT 3
      const limit = clampLimit(DISCOVERY_MAX_RESULTS);
      const rows = await repo.findDiscoveryRows({
        section: discoverySectionFor(intent, preference),
        locale,
        tagCodes: resolved.tagCodes ?? null,
        limit,
      });
      places = adaptRows(rows, locale);
      meta = {
        limit: DISCOVERY_MAX_RESULTS,
        ranking: DISCOVERY_RANKING_RULE,
        source: "neon-postgres",
      };
    }
  } catch (e) {
    if (e instanceof DatabaseConfigError) {
      console.error("[discovery] DatabaseConfigError:", e.message);
      return err(500, "DATABASE_UNAVAILABLE", "Database is not configured.");
    }
    if (e instanceof DatabaseQueryError) {
      console.error("[discovery] DatabaseQueryError");
      return err(500, "DATABASE_UNAVAILABLE", "Database query failed.");
    }
    console.error("[discovery] Unexpected error:", e instanceof Error ? e.message : String(e));
    return err(500, "INTERNAL_ERROR", "An unexpected error occurred.");
  }

  // 5. Build response
  const body: DiscoveryApiBody = {
    ok: true,
    data: {
      intent,
      locale,
      preference,
      preferenceMapping: resolved.kind,
      count: places.length,
      places,
      meta,
    },
  };
  return NextResponse.json(body, {
    status: 200,
    headers: {
      // No public caching — contains real venue data, not user-specific.
      "Cache-Control": "no-store",
    },
  });
}
