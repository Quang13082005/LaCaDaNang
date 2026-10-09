import { isValidCoordinates, type Coordinates } from "./distance";
export type LocationFailure = "denied" | "timeout" | "unavailable" | "inaccurate";
/** Shared opt-in GPS guard. Memory only; cancellation ignores late browser callbacks. */
export function requestLocation(onSuccess: (position: Coordinates) => void, onFailure: (reason: LocationFailure) => void): () => void {
  let active = true;
  const fail = (reason: LocationFailure) => { if (!active) return; active = false; clearTimeout(timer); onFailure(reason); };
  const timer = setTimeout(() => fail("timeout"), 8000);
  if (typeof navigator === "undefined" || !navigator.geolocation) { fail("unavailable"); return () => {}; }
  try {
    navigator.geolocation.getCurrentPosition(pos => {
      if (!active) return;
      if (!Number.isFinite(pos.coords.accuracy) || pos.coords.accuracy > 1000) { fail("inaccurate"); return; }
      const point = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
      if (!isValidCoordinates(point)) { fail("unavailable"); return; }
      active = false; clearTimeout(timer); onSuccess(point);
    }, error => fail(error.code === 1 ? "denied" : error.code === 3 ? "timeout" : "unavailable"),
    { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 });
  } catch { fail("unavailable"); }
  return () => { active = false; clearTimeout(timer); };
}
