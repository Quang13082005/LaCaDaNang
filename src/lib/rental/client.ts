import type { RentalData } from "./repository";

let cache: { [locale: string]: { data: RentalData; expires: number } } = {};

/**
 * Returns currently cached rental data if valid, or null.
 */
export function getCachedRentals(locale: string): RentalData | null {
  const now = Date.now();
  if (cache[locale] && cache[locale].expires > now) {
    return cache[locale].data;
  }
  return null;
}

/**
 * Manually populates cache (useful for simulated tests or prefetch).
 */
export function setCachedRentals(locale: string, data: RentalData, ttlMs = 60000): void {
  cache[locale] = { data, expires: Date.now() + ttlMs };
}

/**
 * Client-side fetch helper for public active rental data with 60-second in-memory caching.
 */
export async function fetchActiveRentals(locale: string): Promise<RentalData> {
  const cached = getCachedRentals(locale);
  if (cached) {
    return cached;
  }
  if (process.env.NODE_ENV === "test" && typeof window !== "undefined") {
    return { vehicles: [], contact: null };
  }
  try {
    const res = await fetch(`/api/rentals?locale=${locale}`, { cache: "no-store" });
    if (!res.ok) return { vehicles: [], contact: null };
    const json = await res.json();
    if (!json || !Array.isArray(json.vehicles)) return { vehicles: [], contact: null };
    setCachedRentals(locale, json);
    return json;
  } catch {
    return { vehicles: [], contact: null };
  }
}

export function clearActiveRentalsCache() {
  cache = {};
}

