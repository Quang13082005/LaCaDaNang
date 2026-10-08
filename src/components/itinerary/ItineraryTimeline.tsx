import React from "react";
import { RotateCcw } from "lucide-react";
import { ItineraryStop } from "@/components/itinerary/ItineraryStop";
import { useLocale } from "@/components/i18n/LocaleProvider";
import type { DemoItinerary } from "@/data/demo-places";

interface ItineraryTimelineProps {
  itinerary: DemoItinerary;
  preferenceLabel?: string;
  onResetPreference: () => void;
}

export const ItineraryTimeline: React.FC<ItineraryTimelineProps> = ({
  itinerary,
  preferenceLabel,
  onResetPreference,
}) => {
  const { t } = useLocale();

  return (
    <section
      className="w-full max-w-2xl mx-auto space-y-4 pt-8"
      aria-label={t("itinerary.sample")}
    >
      {/* Header Banner */}
      <div className="rounded-[16px] bg-gradient-to-br from-sky-500 to-sky-600 text-white p-4 sm:p-5 shadow-[0_4px_16px_rgba(14,165,233,0.25)]">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-medium mb-2">
              {t("intent.now")}{preferenceLabel ? ` · ${preferenceLabel}` : ""}
            </p>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              {t("itinerary.sample")}
            </h2>
          </div>

          <button
            type="button"
            onClick={onResetPreference}
            className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3.5 py-2 rounded-full text-xs font-semibold text-sky-900 bg-white hover:bg-sky-50 active:bg-sky-100 transition-colors shrink-0 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t("action.changeSelection")}</span>
          </button>
        </div>
      </div>


      {/* Timeline Stops */}
      <div className="pt-2 px-1">
        {itinerary.stops.map((stop, idx) => (
          <ItineraryStop
            key={stop.id}
            stop={stop}
            index={idx}
            isLast={idx === itinerary.stops.length - 1}
          />
        ))}
      </div>
    </section>
  );
};
