import React from "react";
import { Sparkles, RotateCcw } from "lucide-react";
import { ItineraryStop } from "@/components/itinerary/ItineraryStop";
import type { DemoItinerary } from "@/data/demo-places";

interface ItineraryTimelineProps {
  itinerary: DemoItinerary;
  onResetPreference: () => void;
}

export const ItineraryTimeline: React.FC<ItineraryTimelineProps> = ({
  itinerary,
  onResetPreference,
}) => {
  return (
    <section
      className="w-full max-w-2xl mx-auto space-y-4 pt-8"
      aria-label="Lịch trình tức thì"
    >
      {/* Header Banner */}
      <div className="rounded-[16px] bg-gradient-to-br from-sky-500 to-sky-600 text-white p-4 sm:p-5 shadow-[0_4px_16px_rgba(14,165,233,0.25)]">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-[11px] font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Lịch trình tức thì</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              {itinerary.title}
            </h2>
            <p className="text-xs sm:text-sm text-sky-100 mt-1 leading-relaxed">
              {itinerary.subtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={onResetPreference}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-sky-900 bg-white hover:bg-sky-50 active:bg-sky-100 transition-colors shrink-0 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Đổi gu</span>
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
