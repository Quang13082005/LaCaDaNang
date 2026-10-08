import type { DiscoveryLocale, DiscoverySection } from "@/lib/data/discovery-contract";
import { adaptRows } from "@/lib/data/place-adapter";
import type { PlaceRepository } from "@/lib/data/place-repository";
import { getNowSlot, NOW_TIME_ZONE, type NowData, type NowSlot } from "./contract";

type Leg = { section: DiscoverySection; tagCodes: readonly string[] | null };
/** Editorial time-slot sequence, not operating hours, distance or route optimization. */
export const NOW_POLICY: Record<NowSlot, readonly Leg[]> = {
  MORNING: [{ section: "CAFE", tagCodes: null }, { section: "GO", tagCodes: ["NATURE"] }],
  MIDDAY: [{ section: "EAT", tagCodes: null }, { section: "GO", tagCodes: ["SCENIC"] }],
  AFTERNOON: [{ section: "GO", tagCodes: ["PHOTO"] }, { section: "CAFE", tagCodes: null }],
  EVENING: [{ section: "EAT", tagCodes: null }, { section: "GO", tagCodes: ["ENTERTAINMENT"] }],
  NIGHT: [{ section: "EAT", tagCodes: ["NIGHT"] }, { section: "GO", tagCodes: ["NIGHT"] }],
};

/** Clock injection is server/test-only. Public API does not accept a synthetic time. */
export async function findNowItinerary(repo: PlaceRepository, locale: DiscoveryLocale, instant = new Date()): Promise<NowData> {
  const slot = getNowSlot(instant);
  const places: NowData["places"] = [];
  for (const leg of NOW_POLICY[slot]) {
    const pick = async (tagCodes: readonly string[] | null) => {
      const rows = await repo.findDiscoveryRows({ section: leg.section, locale, tagCodes, limit: 3 });
      return adaptRows(rows, locale).find(p => p.section === leg.section && !places.some(selected => selected.id === p.id));
    };
    // Tagged leg -> same section general; never demo or another section to fill a slot.
    let place = await pick(leg.tagCodes);
    if (!place && leg.tagCodes) place = await pick(null);
    if (place) places.push(place);
  }
  return { locale, slot, timeZone: NOW_TIME_ZONE, evaluatedAt: instant.toISOString(), count: places.length, places,
    meta: { source: "neon-postgres", policy: "time-slot-v1", openingHoursVerified: false } };
}
