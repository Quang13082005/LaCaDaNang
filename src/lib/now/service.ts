import type { DiscoveryLocale, DiscoveryPlace, DiscoverySection } from "@/lib/data/discovery-contract";
import { adaptRows } from "@/lib/data/place-adapter";
import type { PlaceRepository } from "@/lib/data/place-repository";
import { getNowSlot, NOW_SLOTS, NOW_TIME_ZONE, type NowData, type NowSlot } from "./contract";

type Leg = { section: DiscoverySection; tagCodes: readonly string[] | null };
/** Editorial composition, never operating hours or route optimization. */
export const NOW_POLICY: Record<NowSlot, readonly Leg[]> = {
  MORNING: [{ section: "CAFE", tagCodes: null }, { section: "EAT", tagCodes: null }, { section: "GO", tagCodes: ["NATURE"] }],
  MIDDAY: [{ section: "EAT", tagCodes: null }, { section: "CAFE", tagCodes: null }, { section: "GO", tagCodes: ["SCENIC"] }],
  AFTERNOON: [{ section: "GO", tagCodes: ["PHOTO"] }, { section: "CAFE", tagCodes: null }, { section: "EAT", tagCodes: null }],
  EVENING: [{ section: "EAT", tagCodes: null }, { section: "GO", tagCodes: ["ENTERTAINMENT"] }, { section: "CAFE", tagCodes: null }],
  NIGHT: [{ section: "EAT", tagCodes: ["NIGHT"] }, { section: "CAFE", tagCodes: null }, { section: "GO", tagCodes: ["BAR"] }],
};
const ALLOWED: readonly DiscoverySection[] = ["EAT", "CAFE", "GO"];
const hasTag = (p: DiscoveryPlace, codes: readonly string[]) => p.tags.some(t => codes.includes(t.code));
const daytimeCategory = (p: DiscoveryPlace) => hasTag(p, ["NATURE"]) || ["amusement_park", "water_park"].includes(p.primaryType);

/** Preserve stored URL bytes; only validated Google Maps destinations are eligible. */
export function hasValidNowMapsUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === "https:" && !u.username && !u.password &&
      (u.hostname === "maps.google.com" || (u.hostname === "www.google.com" && u.pathname.startsWith("/maps")) ||
       u.hostname === "maps.app.goo.gl" || (u.hostname === "goo.gl" && u.pathname.startsWith("/maps")));
  } catch { return false; }
}
function rank(a: DiscoveryPlace, b: DiscoveryPlace): number {
  const nullableDesc = (x: number | null, y: number | null) => x === y ? 0 : x === null ? 1 : y === null ? -1 : y - x;
  return Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || nullableDesc(a.reviewCount, b.reviewCount) || nullableDesc(a.rating, b.rating) || a.id - b.id;
}

/** Fetch complete eligible pools so invalid top rows/duplicates cannot falsely exhaust candidates. */
export async function findNowItinerary(repo: PlaceRepository, locale: DiscoveryLocale, instant = new Date()): Promise<NowData> {
  const slot = getNowSlot(instant);
  const pools = await Promise.all(ALLOWED.map(async section => {
    // Existing parameterized all-candidate SELECT; no GPS or nearby evaluation here.
    const rows = await repo.findNearbyCandidateRows({ section, locale, tagCodes: null });
    return adaptRows(rows, locale).filter(p => p.section === section && hasValidNowMapsUrl(p.googleMapsUrl)).sort(rank);
  }));
  const all = pools.flat().sort(rank);
  const places: DiscoveryPlace[] = [];
  const offset = NOW_SLOTS.indexOf(slot) % 3;
  const choose = (pool: DiscoveryPlace[]) => {
    const available = pool.filter(p => !places.some(s => s.id === p.id));
    // Stable slot-specific choice within the top three ranked valid candidates, then full pool.
    const window = available.slice(0, 3);
    return window.length ? window[offset % window.length] : undefined;
  };
  for (const leg of NOW_POLICY[slot]) {
    const same = all.filter(p => p.section === leg.section);
    const preferred = leg.tagCodes ? same.filter(p => hasTag(p, leg.tagCodes!)) : same;
    const alternatives = NOW_POLICY[slot].filter(l => l.section !== leg.section).flatMap(l => all.filter(p => p.section === l.section));
    const tiers = [preferred, same, alternatives, all];
    // Verified BAR association is preferred at night; daytime categories remain only last-resort real fallback.
    const sensibleTiers = slot === "NIGHT" ? [...tiers.map(pool => pool.filter(p => !daytimeCategory(p))), ...tiers] : tiers;
    let place: DiscoveryPlace | undefined;
    for (const tier of sensibleTiers) { place = choose(tier); if (place) break; }
    if (place) places.push(place);
  }
  return { locale, slot, timeZone: NOW_TIME_ZONE, evaluatedAt: instant.toISOString(), count: places.length, places,
    meta: { source: "neon-postgres", policy: "time-slot-v1.1", openingHoursVerified: false,
      ...(places.length < 3 ? { shortfallReason: "eligible-catalog-exhausted" as const } : {}) } };
}
