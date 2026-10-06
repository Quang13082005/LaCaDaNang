import { describe, expect, it } from "vitest";
import { calculateDistanceKm, isValidCoordinates } from "@/lib/geo/distance";
import { filterPlacesWithinRadius, sortPlacesByDistance } from "@/lib/geo/filter-nearby";

const origin = { latitude: 0, longitude: 0 };
const coordinate = (longitude: number) => ({ latitude: 0, longitude });

describe("isolated geospatial geometry", () => {
  it("returns zero at identical coordinates and about 111.195km per equatorial degree", () => {
    expect(calculateDistanceKm(origin, origin)).toBe(0);
    expect(calculateDistanceKm(origin, coordinate(1))).toBeCloseTo(111.19508, 4);
  });
  it("is symmetric and crosses the antimeridian on the short arc", () => {
    const a = coordinate(179.9), b = coordinate(-179.9);
    expect(calculateDistanceKm(a, b)).toBeCloseTo(22.239016, 4);
    expect(calculateDistanceKm(a, b)).toBe(calculateDistanceKm(b, a));
  });
  it("handles poles and antipodes without NaN", () => {
    expect(calculateDistanceKm(origin, coordinate(180))).toBeCloseTo(Math.PI * 6371.0088, 5);
    expect(calculateDistanceKm({ latitude: 90, longitude: 0 }, { latitude: 90, longitude: 180 })).toBeLessThan(1e-9);
    expect(isValidCoordinates({ latitude: -90, longitude: -180 })).toBe(true);
  });
  it.each([
    { latitude: 91, longitude: 0 }, { latitude: -91, longitude: 0 },
    { latitude: 0, longitude: 181 }, { latitude: 0, longitude: -181 },
    { latitude: NaN, longitude: 0 }, { latitude: 0, longitude: Infinity },
  ])("rejects invalid coordinates instead of fabricating distance: %j", point => {
    expect(calculateDistanceKm(origin, point)).toBeNull();
    expect(calculateDistanceKm(point, origin)).toBeNull();
  });
});

describe("schema-independent nearby helpers", () => {
  const places = [
    { id: "far", position: coordinate(0.02) },
    { id: "near", position: coordinate(0.004) },
    { id: "middle", position: coordinate(0.008) },
    { id: "missing", position: null },
    { id: "invalid", position: coordinate(200) },
  ];
  it("includes the exact radius boundary and counts invalid place coordinates", () => {
    const radius = calculateDistanceKm(origin, coordinate(0.008))!;
    const result = filterPlacesWithinRadius(places, origin, radius, p => p.position);
    expect(result.status).toBe("ok");
    expect(result.invalidPlaceCount).toBe(2);
    expect(result.matches.map(m => m.item.id)).toEqual(["near", "middle"]);
  });
  it("preserves truthful zero, one and two matches without padding", () => {
    for (const [radius, count] of [[0.1, 0], [0.5, 1], [1, 2]]) {
      expect(filterPlacesWithinRadius(places, origin, radius, p => p.position).matches).toHaveLength(count);
    }
    expect(filterPlacesWithinRadius([], origin, 1, () => null).matches).toEqual([]);
  });
  it("accepts radius zero only for coincident places", () => {
    expect(filterPlacesWithinRadius([origin, coordinate(1)], origin, 0, p => p).matches).toHaveLength(1);
  });
  it.each([-1, NaN, Infinity])("distinguishes invalid radius %s from zero results", radius => {
    expect(filterPlacesWithinRadius(places, origin, radius, p => p.position).status).toBe("invalid_radius");
  });
  it("distinguishes invalid origin", () => {
    expect(filterPlacesWithinRadius(places, coordinate(181), 1, p => p.position).status).toBe("invalid_origin");
  });
  it("sorts without mutating input, keeps ties stable and discards invalid distances", () => {
    const input = Object.freeze([
      { item: "b", distanceKm: 2 }, { item: "a", distanceKm: 1 },
      { item: "c", distanceKm: 1 }, { item: "bad", distanceKm: NaN },
      { item: "negative", distanceKm: -1 },
    ]);
    expect(sortPlacesByDistance(input).map(m => m.item)).toEqual(["a", "c", "b"]);
    expect(input[0].item).toBe("b");
  });
  it("does not silently cap a large set or impose recommendation ranking", () => {
    const points = Array.from({ length: 1000 }, (_, i) => coordinate(i / 1000000));
    expect(filterPlacesWithinRadius(points, origin, 1, p => p).matches).toHaveLength(1000);
  });
});
