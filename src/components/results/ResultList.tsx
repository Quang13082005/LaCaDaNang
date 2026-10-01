import React from "react";
import { RotateCcw } from "lucide-react";
import { PlaceCard } from "@/components/results/PlaceCard";
import { EmptyState } from "@/components/shared/EmptyState";
import type { DemoPlace } from "@/data/demo-places";

interface ResultListProps {
  places: DemoPlace[];
  preferenceLabel?: string;
  onResetPreference: () => void;
}

export const ResultList: React.FC<ResultListProps> = ({
  places,
  preferenceLabel,
  onResetPreference,
}) => {
  if (places.length === 0) {
    return <EmptyState onReset={onResetPreference} />;
  }

  return (
    <section className="w-full space-y-5 pt-8" aria-label="Kết quả gợi ý">
      {/* Result Section Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 px-1">
        <div>
          <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
            Đề xuất chọn lọc
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            {preferenceLabel
              ? `Gợi ý theo "${preferenceLabel}"`
              : "3 lựa chọn tốt nhất"}
          </h2>
        </div>

        <button
          type="button"
          onClick={onResetPreference}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 cursor-pointer shadow-sm"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Đổi tiêu chí</span>
        </button>
      </div>

      {/* Cards: Vertical Stack on Mobile (< md), 3-Column Grid on Desktop (>= md) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {places.map((place, idx) => (
          <PlaceCard key={place.id} place={place} rank={idx + 1} />
        ))}
      </div>
    </section>
  );
};
