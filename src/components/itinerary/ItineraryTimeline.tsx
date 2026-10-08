import React from "react";
import { ItineraryStop } from "./ItineraryStop";
import { useLocale } from "@/components/i18n/LocaleProvider";
import type { NowData } from "@/lib/now/contract";

export function ItineraryTimeline({ itinerary }: { itinerary: NowData }) {
  const { t } = useLocale();
  return <section className="w-full max-w-2xl mx-auto space-y-4 pt-8" aria-label={t(`now.${itinerary.slot}`)}>
    <div className="rounded-2xl bg-sky-600 text-white p-4 sm:p-5 space-y-2">
      <h2 className="text-xl font-bold">{t(`now.${itinerary.slot}`)}</h2>
      <p className="text-sm">{t("now.basedOn")}</p>
      <p className="text-sm">{t("now.hours")}</p>
      <p className="text-sm">{t("now.citywide")}</p>
    </div>
    <p role="status">{itinerary.count === 0 ? t("results.zero") : t("results.count", { count: itinerary.count })}</p>
    <div>{itinerary.places.map((stop, index) => <ItineraryStop key={stop.id} stop={stop} index={index} isLast={index === itinerary.count - 1} />)}</div>
  </section>;
}
