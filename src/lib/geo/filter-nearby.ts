import { calculateDistanceKm, isValidCoordinates, type Coordinates } from "./distance";

export interface DistanceMatch<T> {
  readonly item: T;
  readonly distanceKm: number;
}

export type NearbyResult<T> =
  | { status: "invalid_origin" | "invalid_radius"; matches: DistanceMatch<T>[]; invalidPlaceCount: number }
  | { status: "ok"; matches: DistanceMatch<T>[]; invalidPlaceCount: number };

/** Caller supplies the coordinate selector; no dependency on a DB schema. */
export function filterPlacesWithinRadius<T>(
  places: readonly T[],
  origin: Coordinates,
  radiusKm: number,
  coordinatesOf: (place: T) => Coordinates | null | undefined,
): NearbyResult<T> {
  if (!isValidCoordinates(origin)) return { status: "invalid_origin", matches: [], invalidPlaceCount: 0 };
  if (!Number.isFinite(radiusKm) || radiusKm < 0) {
    return { status: "invalid_radius", matches: [], invalidPlaceCount: 0 };
  }
  const matches: DistanceMatch<T>[] = [];
  let invalidPlaceCount = 0;
  for (const item of places) {
    const coordinates = coordinatesOf(item);
    const distanceKm = coordinates ? calculateDistanceKm(origin, coordinates) : null;
    if (distanceKm === null) { invalidPlaceCount++; continue; }
    if (distanceKm <= radiusKm) matches.push({ item, distanceKm });
  }
  return { status: "ok", matches, invalidPlaceCount };
}

/** Non-mutating; equal distances preserve caller order. No recommendation score is invented. */
export function sortPlacesByDistance<T>(matches: readonly DistanceMatch<T>[]): DistanceMatch<T>[] {
  return matches.filter(match => Number.isFinite(match.distanceKm) && match.distanceKm >= 0)
    .map((match, index) => ({ match, index }))
    .sort((a, b) => a.match.distanceKm - b.match.distanceKm || a.index - b.index)
    .map(({ match }) => match);
}
