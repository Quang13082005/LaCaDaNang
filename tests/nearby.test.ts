import { describe, expect, it } from "vitest";
import { parseDiscoveryQuery, type DiscoveryPlace } from "@/lib/data/discovery-contract";
import { evaluateNearbyDiscovery } from "@/lib/geo/nearby-engine";
import { calculateDistanceKm } from "@/lib/geo/distance";

function mockPlace(overrides: Partial<DiscoveryPlace> & { id: number; lat: number; lng: number }): DiscoveryPlace {
  const { id, lat, lng, ...rest } = overrides;
  return {
    id,
    googlePlaceId: `mock-google-${id}`,
    section: "EAT",
    name: `Mock Place ${id}`,
    typeLabel: "Quán ăn",
    primaryType: "restaurant",
    address: `Địa chỉ ${id}`,
    area: { id: 1, name: "Hải Châu", unitType: "quận" },
    location: { lat, lng },
    googleMapsUrl: `https://maps.google.com/?cid=${id}`,
    rating: rest.rating !== undefined ? rest.rating : 4.5,
    reviewCount: rest.reviewCount !== undefined ? rest.reviewCount : 100,
    tags: [],
    description: null,
    translationFallback: false,
    featured: rest.featured ?? false,
    ...rest,
  };
}

describe("parseDiscoveryQuery - location contract", () => {
  it("accepts valid paired lat and lng", () => {
    const params = new URLSearchParams({
      intent: "EAT",
      preference: "an_ngon",
      lat: "16.0680",
      lng: "108.2210",
    });
    const result = parseDiscoveryQuery(params);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.query.location).toEqual({ lat: 16.068, lng: 108.221 });
    }
  });

  it("permits omitting both lat and lng (citywide discovery regression)", () => {
    const params = new URLSearchParams({
      intent: "EAT",
      preference: "an_ngon",
    });
    const result = parseDiscoveryQuery(params);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.query.location).toBeNull();
    }
  });

  it("rejects lat without lng", () => {
    const params = new URLSearchParams({
      intent: "EAT",
      lat: "16.0680",
    });
    const result = parseDiscoveryQuery(params);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.field).toBe("lng");
    }
  });

  it("rejects lng without lat", () => {
    const params = new URLSearchParams({
      intent: "EAT",
      lng: "108.2210",
    });
    const result = parseDiscoveryQuery(params);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.field).toBe("lat");
    }
  });

  it("rejects out-of-range latitude", () => {
    const params = new URLSearchParams({
      intent: "EAT",
      lat: "95.0",
      lng: "108.2210",
    });
    const result = parseDiscoveryQuery(params);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.field).toBe("lat");
    }
  });

  it("rejects non-numeric latitude", () => {
    const params = new URLSearchParams({
      intent: "EAT",
      lat: "abc",
      lng: "108.2210",
    });
    const result = parseDiscoveryQuery(params);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.field).toBe("lat");
    }
  });

  it("rejects out-of-range longitude", () => {
    const params = new URLSearchParams({
      intent: "EAT",
      lat: "16.0680",
      lng: "-185.0",
    });
    const result = parseDiscoveryQuery(params);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.field).toBe("lng");
    }
  });

  it("rejects duplicate lat or lng parameters", () => {
    const params = new URLSearchParams();
    params.append("intent", "EAT");
    params.append("lat", "16.0");
    params.append("lat", "16.1");
    params.append("lng", "108.0");
    const result = parseDiscoveryQuery(params);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.field).toBe("lat");
    }
  });
});

describe("evaluateNearbyDiscovery - radius escalation & precision", () => {
  const origin = { latitude: 16.068, longitude: 108.221 };

  // Calculate coordinates at precise distances north of origin
  // 1 degree latitude ~ 111.195 km -> 1 km ~ 1 / 111.195 = 0.0089932 deg
  const offsetKm = (km: number) => ({
    lat: origin.latitude + km / 111.19508,
    lng: origin.longitude,
  });

  it("chooses radius = 1 km when candidates within 1km >= 3", () => {
    const candidates = [
      mockPlace({ id: 1, ...offsetKm(0.2) }),
      mockPlace({ id: 2, ...offsetKm(0.5) }),
      mockPlace({ id: 3, ...offsetKm(0.8) }),
      mockPlace({ id: 4, ...offsetKm(2.0) }),
    ];

    const result = evaluateNearbyDiscovery(candidates, origin);
    expect(result.radiusKm).toBe(1);
    expect(result.places).toHaveLength(3);
    expect(result.places.map((p) => p.id)).toEqual([1, 2, 3]);
  });

  it("escalates 1 -> 3 km when candidates at 1km < 3 but candidates at 3km >= 3", () => {
    const candidates = [
      mockPlace({ id: 1, ...offsetKm(0.4) }),
      mockPlace({ id: 2, ...offsetKm(1.5) }),
      mockPlace({ id: 3, ...offsetKm(2.2) }),
      mockPlace({ id: 4, ...offsetKm(4.0) }),
    ];

    const result = evaluateNearbyDiscovery(candidates, origin);
    expect(result.radiusKm).toBe(3);
    expect(result.places).toHaveLength(3);
    expect(result.places.map((p) => p.id)).toEqual([1, 2, 3]);
  });

  it("strictly executes 1 -> 3 -> 5 km and does NOT stop at 3 km with < 3 results (Decision 1)", () => {
    // 1km: 1 place, 3km: 2 places, 5km: 2 places
    const candidates = [
      mockPlace({ id: 1, ...offsetKm(0.5) }), // in 1km
      mockPlace({ id: 2, ...offsetKm(2.5) }), // in 3km
      mockPlace({ id: 3, ...offsetKm(6.0) }), // > 5km
    ];

    const result = evaluateNearbyDiscovery(candidates, origin);
    expect(result.radiusKm).toBe(5);
    expect(result.places).toHaveLength(2);
    expect(result.places.map((p) => p.id)).toEqual([1, 2]);
  });

  it("returns truthful 1 result at 5 km without fake padding", () => {
    const candidates = [
      mockPlace({ id: 1, ...offsetKm(4.2) }),
      mockPlace({ id: 2, ...offsetKm(6.5) }),
    ];

    const result = evaluateNearbyDiscovery(candidates, origin);
    expect(result.radiusKm).toBe(5);
    expect(result.places).toHaveLength(1);
    expect(result.places[0].id).toBe(1);
  });

  it("returns truthful 0 results when all venues exceed 5 km", () => {
    const candidates = [
      mockPlace({ id: 1, ...offsetKm(5.5) }),
      mockPlace({ id: 2, ...offsetKm(8.0) }),
    ];

    const result = evaluateNearbyDiscovery(candidates, origin);
    expect(result.radiusKm).toBe(5);
    expect(result.places).toHaveLength(0);
  });

  it("strictly enforces full float precision and does not prematurely round", () => {
    // Place at exactly 1.04 km
    const place104 = mockPlace({ id: 104, ...offsetKm(1.04) });
    const dist = calculateDistanceKm(origin, { latitude: place104.location.lat, longitude: place104.location.lng })!;
    expect(dist).toBeGreaterThan(1.0);

    // Place should NOT be counted in 1km pool
    const candidates = [
      mockPlace({ id: 1, ...offsetKm(0.3) }),
      mockPlace({ id: 2, ...offsetKm(0.6) }),
      place104, // 1.04km
    ];

    // Since 1km only has 2 candidates (< 3), it must escalate to 3km
    const result = evaluateNearbyDiscovery(candidates, origin);
    expect(result.radiusKm).toBe(3);
    expect(result.places).toHaveLength(3);
    // After selection, distanceKm is formatted to 1 decimal: 1.0
    const matched104 = result.places.find((p) => p.id === 104);
    expect(matched104?.distanceKm).toBe(1.0);
  });

  it("correctly includes places on exact boundary <= 1.0 km", () => {
    const boundaryPlace = mockPlace({ id: 1, ...offsetKm(0.999) });
    const candidates = [
      boundaryPlace,
      mockPlace({ id: 2, ...offsetKm(0.2) }),
      mockPlace({ id: 3, ...offsetKm(0.5) }),
    ];
    const result = evaluateNearbyDiscovery(candidates, origin);
    expect(result.radiusKm).toBe(1);
    expect(result.places).toHaveLength(3);
  });

  it("enforces locked Nearby ranking: distanceRawKm ASC, featured DESC, review_count DESC, rating DESC, id ASC", () => {
    const candidates = [
      // Same distance (0.5 km), different featured
      mockPlace({ id: 10, ...offsetKm(0.5), featured: false, reviewCount: 500, rating: 5.0 }),
      mockPlace({ id: 11, ...offsetKm(0.5), featured: true, reviewCount: 10, rating: 3.0 }),
      // Closer distance (0.2 km), lower reviews
      mockPlace({ id: 12, ...offsetKm(0.2), featured: false, reviewCount: 5, rating: 2.0 }),
      // Same distance (0.8 km), different reviews
      mockPlace({ id: 13, ...offsetKm(0.8), featured: false, reviewCount: 100, rating: 4.0 }),
      mockPlace({ id: 14, ...offsetKm(0.8), featured: false, reviewCount: 200, rating: 4.0 }),
      // Same distance (0.9 km), null reviews vs non-null
      mockPlace({ id: 15, ...offsetKm(0.9), featured: false, reviewCount: null, rating: 5.0 }),
      mockPlace({ id: 16, ...offsetKm(0.9), featured: false, reviewCount: 1, rating: 1.0 }),
    ];

    const result = evaluateNearbyDiscovery(candidates, origin);
    // In 1 km pool, closest is id 12 (0.2 km).
    // Next are 0.5 km: id 11 (featured) beats id 10 (not featured).
    // Top 3 should be: [12, 11, 10]
    expect(result.places.map((p) => p.id)).toEqual([12, 11, 10]);
  });

  it("breaks ties with id ASC when all other metrics are equal", () => {
    const candidates = [
      mockPlace({ id: 99, ...offsetKm(0.3), featured: false, reviewCount: 50, rating: 4.0 }),
      mockPlace({ id: 42, ...offsetKm(0.3), featured: false, reviewCount: 50, rating: 4.0 }),
      mockPlace({ id: 77, ...offsetKm(0.3), featured: false, reviewCount: 50, rating: 4.0 }),
    ];

    const result = evaluateNearbyDiscovery(candidates, origin);
    expect(result.places.map((p) => p.id)).toEqual([42, 77, 99]);
  });

  it("ensures no duplicate IDs even if duplicate candidates are supplied", () => {
    const candidates = [
      mockPlace({ id: 10, ...offsetKm(0.3) }),
      mockPlace({ id: 10, ...offsetKm(0.3) }), // duplicate candidate
      mockPlace({ id: 20, ...offsetKm(0.4) }),
      mockPlace({ id: 30, ...offsetKm(0.5) }),
    ];

    const result = evaluateNearbyDiscovery(candidates, origin);
    const ids = result.places.map((p) => p.id);
    const uniqueIds = Array.from(new Set(ids));
    expect(ids).toEqual(uniqueIds);
    expect(ids).toEqual([10, 20, 30]);
  });
});
