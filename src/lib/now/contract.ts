import type { DiscoveryLocale, DiscoveryPlace } from "@/lib/data/discovery-contract";

export const NOW_TIME_ZONE = "Asia/Ho_Chi_Minh" as const;
export const NOW_SLOTS = ["MORNING", "MIDDAY", "AFTERNOON", "EVENING", "NIGHT"] as const;
export type NowSlot = typeof NOW_SLOTS[number];
export interface NowData {
  locale: DiscoveryLocale;
  slot: NowSlot;
  timeZone: typeof NOW_TIME_ZONE;
  evaluatedAt: string;
  count: number;
  places: DiscoveryPlace[];
  meta: { source: "neon-postgres"; policy: "time-slot-v1.1"; shortfallReason?: "eligible-catalog-exhausted"; openingHoursVerified: false };
}

/** Absolute instant -> Da Nang wall time; never depend on the device/server timezone. */
export function getNowSlot(instant: Date): NowSlot {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: NOW_TIME_ZONE, hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(instant);
  const minutes = Number(parts.find(p => p.type === "hour")?.value) * 60 + Number(parts.find(p => p.type === "minute")?.value);
  if (minutes >= 360 && minutes < 660) return "MORNING";
  if (minutes >= 660 && minutes < 840) return "MIDDAY";
  if (minutes >= 840 && minutes < 1050) return "AFTERNOON";
  if (minutes >= 1050 && minutes < 1320) return "EVENING";
  return "NIGHT";
}
