import React from "react";
import { RotateCcw } from "lucide-react";
import { PlaceCard } from "@/components/results/PlaceCard";
import { EmptyState } from "@/components/shared/EmptyState";
import type { PlaceCardModel } from "@/lib/data/place-card-model";

interface ResultListProps {
  places: PlaceCardModel[];
  status?: "idle" | "loading" | "success" | "empty" | "error";
  onRetry?: () => void;
  intentLabel?: string;
  preferenceLabel?: string;
  onResetPreference: () => void;
}

export const ResultList: React.FC<ResultListProps> = ({
  places,
  intentLabel,
  preferenceLabel,
  onResetPreference,
  status = places.length ? "success" : "empty",
  onRetry,
}) => {
  const pending = status === "idle" || status === "loading";
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
          {status === "empty" && (
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Chưa có gợi ý cho lựa chọn này.
            </p>
          )}
          {status === "success" && places.length === 1 && (
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Có 1 gợi ý cho lựa chọn này.
            </p>
          )}
          {status === "success" && places.length === 2 && (
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Có 2 gợi ý cho lựa chọn này.
            </p>
          )}
          {status === "success" && places.length === 3 && <p className="text-xs text-slate-500 font-medium mt-0.5">Có 3 gợi ý cho lựa chọn này.</p>}
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
      <div className="min-h-[320px]" aria-busy={pending}>
      {pending ? <div role="status" className="rounded-[16px] border border-slate-200 bg-white p-6 text-slate-600">Đang tìm địa điểm…</div> : status === "error" ? (
        <div role="alert" className="rounded-[16px] border border-slate-200 bg-white p-5 space-y-3">
          <h3 className="font-semibold text-slate-900">Chưa tải được địa điểm.</h3>
          <p className="text-sm text-slate-600">Hãy thử lại hoặc đổi lựa chọn.</p>
          {onRetry && <button type="button" onClick={onRetry} className="min-h-[44px] px-5 py-3 rounded-xl bg-sky-500 text-white font-semibold focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2">Thử lại</button>}
        </div>
      ) : status === "empty" ? <EmptyState /> : <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {places.map((place) => (
          <PlaceCard key={place.id} place={place} />
        ))}
      </div>}
      </div>
    </section>
  );
};
