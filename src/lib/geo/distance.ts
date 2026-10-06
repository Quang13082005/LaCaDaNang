/** Geometry only: this is not a database Place model or a geolocation request. */
export interface Coordinates {
  readonly latitude: number;
  readonly longitude: number;
}

export function isValidCoordinates(value: Coordinates): boolean {
  return Number.isFinite(value.latitude) && Math.abs(value.latitude) <= 90
    && Number.isFinite(value.longitude) && Math.abs(value.longitude) <= 180;
}

/** Great-circle distance, not road distance or travel time. Invalid input returns null. */
export function calculateDistanceKm(from: Coordinates, to: Coordinates): number | null {
  if (!isValidCoordinates(from) || !isValidCoordinates(to)) return null;
  const radians = (degrees: number) => degrees * Math.PI / 180;
  const lat = radians(to.latitude - from.latitude);
  const lng = radians(to.longitude - from.longitude);
  const a = Math.sin(lat / 2) ** 2
    + Math.cos(radians(from.latitude)) * Math.cos(radians(to.latitude))
    * Math.sin(lng / 2) ** 2;
  // Floating-point drift near antipodes can otherwise make sqrt(1-a) invalid.
  const bounded = Math.min(1, Math.max(0, a));
  return 6371.0088 * 2 * Math.atan2(Math.sqrt(bounded), Math.sqrt(1 - bounded));
}
