import { calculateDistanceKm, type Coordinates } from "./distance";
import type { DiscoveryPlace } from "@/lib/data/discovery-contract";

export interface EvaluatedPlace {
  readonly item: DiscoveryPlace;
  readonly distanceRawKm: number;
}

export interface NearbyDiscoveryResult {
  readonly places: DiscoveryPlace[];
  readonly radiusKm: 1 | 3 | 5;
}

/**
 * Pure Nearby evaluation engine adhering strictly to DECISIONS 1, 3, 6:
 *
 * 1. Calculate raw Haversine distance with full floating-point precision for all candidates.
 * 2. Radius escalation:
 *      evaluate <= 1 km (if >= 3 -> radius = 1)
 *      else evaluate <= 3 km (if >= 3 -> radius = 3)
 *      else evaluate <= 5 km (radius = 5)
 * 3. Sorting within chosen radius:
 *      distanceRawKm ASC
 *      featured DESC
 *      review_count DESC NULLS LAST
 *      rating DESC NULLS LAST
 *      id ASC
 * 4. Slice at most 3 places (truthful 0, 1, 2, or 3).
 * 5. Format distanceKm to 1 decimal place only for final presentation.
 */
export function evaluateNearbyDiscovery(
  candidates: readonly DiscoveryPlace[],
  origin: Coordinates,
): NearbyDiscoveryResult {
  const evaluated = evaluateCandidateDistances(candidates, origin);

  // Step 2: Radius expansion (Decision 1)
  const pool1 = evaluated.filter((e) => e.distanceRawKm <= 1.0);
  let radiusKm: 1 | 3 | 5;
  let selectedPool: EvaluatedPlace[];

  if (pool1.length >= 3) {
    radiusKm = 1;
    selectedPool = pool1;
  } else {
    const pool3 = evaluated.filter((e) => e.distanceRawKm <= 3.0);
    if (pool3.length >= 3) {
      radiusKm = 3;
      selectedPool = pool3;
    } else {
      const pool5 = evaluated.filter((e) => e.distanceRawKm <= 5.0);
      radiusKm = 5;
      selectedPool = pool5;
    }
  }

  // Step 3: Locked Nearby ranking (Decision 6)
  const ranked = [...selectedPool].sort((a, b) => {
    // 1. distanceRawKm ASC
    if (a.distanceRawKm !== b.distanceRawKm) {
      return a.distanceRawKm - b.distanceRawKm;
    }
    // 2. featured DESC
    const aFeat = a.item.featured ? 1 : 0;
    const bFeat = b.item.featured ? 1 : 0;
    if (aFeat !== bFeat) {
      return bFeat - aFeat;
    }
    // 3. review_count DESC NULLS LAST
    const aRev = a.item.reviewCount;
    const bRev = b.item.reviewCount;
    if (aRev !== bRev) {
      if (aRev === null) return 1;
      if (bRev === null) return -1;
      return bRev - aRev;
    }
    // 4. rating DESC NULLS LAST
    const aRat = a.item.rating;
    const bRat = b.item.rating;
    if (aRat !== bRat) {
      if (aRat === null) return 1;
      if (bRat === null) return -1;
      return bRat - aRat;
    }
    // 5. id ASC
    return a.item.id - b.item.id;
  });

  // Step 4: Slice max 3
  const topMatches = ranked.slice(0, 3);

  // Step 5: Format distanceKm (1 decimal place) for UI
  const places: DiscoveryPlace[] = topMatches.map((m) => ({
    ...m.item,
    distanceKm: Math.round(m.distanceRawKm * 10) / 10,
  }));

  return { places, radiusKm };
}

/** Shared full-precision, deduplicated geo pool; callers retain their own composition policy. */
export function evaluateCandidateDistances(candidates: readonly DiscoveryPlace[], origin: Coordinates): EvaluatedPlace[] {

  const seenIds = new Set<number>();
  const evaluated: EvaluatedPlace[] = [];
  for (const place of candidates) {
    if (seenIds.has(place.id)) {
      continue;
    }
    seenIds.add(place.id);
    const rawDist = calculateDistanceKm(origin, {
      latitude: place.location.lat,
      longitude: place.location.lng,
    });
    if (rawDist !== null && Number.isFinite(rawDist) && rawDist >= 0) {
      evaluated.push({ item: place, distanceRawKm: rawDist });
    }
  }

  return evaluated;
}
