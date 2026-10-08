import React from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { PlaceCard } from "@/components/results/PlaceCard";
import { discoveryToCard } from "@/lib/data/place-card-model";
import type { DiscoveryPlace } from "@/lib/data/discovery-contract";

export function ItineraryStop({ stop, index, isLast }: { stop: DiscoveryPlace; index: number; isLast: boolean }) {
  const { t } = useLocale();
  return <div className="relative flex items-start gap-2 pb-5">
    {!isLast && <div aria-hidden="true" className="absolute left-4 top-8 bottom-0 w-0.5 bg-sky-200" />}
    <span className="relative shrink-0 w-8 h-8 rounded-full bg-sky-500 text-white text-sm font-bold flex items-center justify-center">{index + 1}</span>
    <div className="min-w-0 flex-1"><p className="text-sm font-semibold text-sky-700 mb-2">{t(`now.section.${stop.section}`)}</p><PlaceCard place={discoveryToCard(stop)} intent="NOW" /></div>
  </div>;
}
