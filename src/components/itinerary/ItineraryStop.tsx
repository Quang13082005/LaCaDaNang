import React from "react";
import { Navigation, Clock, MapPin } from "lucide-react";
import type { DemoItineraryStop } from "@/data/demo-places";

interface ItineraryStopProps {
  stop: DemoItineraryStop;
  index: number;
  isLast: boolean;
}

export const ItineraryStop: React.FC<ItineraryStopProps> = ({
  stop,
  index,
  isLast,
}) => {
  return (
    <div className="relative flex items-start gap-3.5 pb-6">
      {/* Vertical Timeline Track Line */}
      {!isLast && (
        <div className="absolute left-[19px] top-9 bottom-0 w-[2px] bg-sky-200/90" />
      )}

      {/* Stop Number / Time Dot */}
      <div className="relative z-10 w-10 h-10 rounded-full bg-sky-500 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-[0_2px_8px_rgba(14,165,233,0.35)] border-2 border-white ring-2 ring-sky-100">
        #{index + 1}
      </div>

      {/* Stop Content Card */}
      <div className="flex-1 rounded-[16px] bg-white border border-slate-200/90 p-4 shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_14px_rgba(0,0,0,0.09)] transition-all">
        {/* Time and Category Bar */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-100/80">
            <Clock className="w-3 h-3" />
            {stop.time}
          </span>
          <span className="text-xs font-semibold text-slate-500">
            {stop.category}
          </span>
        </div>

        {/* Title and Place Name */}
        <h4 className="text-xs font-medium text-slate-400 uppercase tracking-wide">
          {stop.title}
        </h4>
        <h3 className="text-base font-bold text-slate-900 tracking-tight mt-0.5">
          {stop.placeName}
        </h3>

        <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
          <MapPin className="w-3.5 h-3.5 text-slate-400" />
          <span>{stop.area}</span>
        </div>

        {/* Reason */}
        <p className="text-xs text-slate-600 mt-2 bg-slate-50/80 p-2.5 rounded-[10px] border border-slate-100 leading-relaxed">
          {stop.reason}
        </p>

        {/* Action Button: "Đi ngay chặng này" (>=44px touch target) */}
        <div className="pt-3">
          <a
            href={stop.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full min-h-[44px] rounded-[12px] bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          >
            <Navigation className="w-3.5 h-3.5 fill-white" />
            <span>Đi ngay chặng này</span>
          </a>
        </div>
      </div>
    </div>
  );
};
