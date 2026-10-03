import React from "react";
import { RotateCcw } from "lucide-react";
import { PlaceCard } from "@/components/results/PlaceCard";
import { EmptyState } from "@/components/shared/EmptyState";
import type { DemoPlace } from "@/data/demo-places";

interface ResultListProps {
  places: DemoPlace[];
  intentLabel?: string;
  preferenceLabel?: string;
  onResetPreference: () => void;
}

export const ResultList: React.FC<ResultListProps> = ({
  places,
  intentLabel,
  preferenceLabel,
  onResetPreference,
}) => {
  const contextTitle = intentLabel && preferenceLabel
    ? `${intentLabel} · ${preferenceLabel}`
    : preferenceLabel || "Gợi ý địa điểm";

  return (
    <section className="w-full space-y-4 pt-6" aria-label="Kết quả gợi ý">
      {/* Result Section Header / Context Row */}
      <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-200/80 px-1 gap-3">
        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
            {contextTitle}
          </h2>
          {/* P0.1 Truthful Count Information */}
          {places.length === 0 && (
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Chưa có gợi ý cho lựa chọn này.
            </p>
          )}
          {places.length === 1 && (
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Có 1 gợi ý cho lựa chọn này.
            </p>
          )}
          {places.length === 2 && (
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Có 2 gợi ý cho lựa chọn này.
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onResetPreference}
          className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-4 py-2 rounded-full text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 cursor-pointer shadow-sm shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Đổi lựa chọn</span>
        </button>
      </div>

      {/* Cards: Vertical Stack on Mobile (< md), 3-Column Grid on Desktop (>= md) */}
      {places.length === 0 ? <EmptyState /> : <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {places.map((place) => (
          <PlaceCard key={place.id} place={place} />
        ))}
      </div>}
    </section>
  );
};
