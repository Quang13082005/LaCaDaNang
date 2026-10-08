import React from "react";
import { RotateCcw, Navigation, Loader2 } from "lucide-react";
import { PlaceCard } from "@/components/results/PlaceCard";
import { EmptyState } from "@/components/shared/EmptyState";
import type { PlaceCardModel } from "@/lib/data/place-card-model";

export type GeolocationUiState =
  | "idle"
  | "requesting"
  | "granted"
  | "denied"
  | "unavailable"
  | "timeout"
  | "inaccurate";

interface ResultListProps {
  places: PlaceCardModel[];
  status?: "idle" | "loading" | "success" | "empty" | "error";
  onRetry?: () => void;
  intentLabel?: string;
  preferenceLabel?: string;
  onResetPreference: () => void;
  nearbyStatus?: GeolocationUiState;
  onToggleNearby?: () => void;
  onRetryNearby?: () => void;
  onResetNearby?: () => void;
  radiusKm?: 1 | 3 | 5;
}

export const ResultList: React.FC<ResultListProps> = ({
  places,
  intentLabel,
  preferenceLabel,
  onResetPreference,
  status = places.length ? "success" : "empty",
  onRetry,
  nearbyStatus = "idle",
  onToggleNearby,
  onRetryNearby,
  onResetNearby,
  radiusKm,
}) => {
  const pending = status === "idle" || status === "loading";
  const contextTitle = intentLabel && preferenceLabel
    ? `${intentLabel} · ${preferenceLabel}`
    : preferenceLabel || "Gợi ý địa điểm";

  const isNearbyActive = nearbyStatus === "granted";

  return (
    <section className="w-full space-y-4 pt-6" aria-label="Kết quả gợi ý">
      {/* Result Section Header / Context Row */}
      <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-200/80 px-1 gap-3">
        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
            {contextTitle}
          </h2>
          {/* Truthful Count Information */}
          {status === "empty" && !isNearbyActive && (
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Chưa có gợi ý cho lựa chọn này.
            </p>
          )}
          {status === "empty" && isNearbyActive && (
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Không tìm thấy gợi ý gần bạn trong 5 km.
            </p>
          )}
          {status === "success" && (
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {isNearbyActive
                ? `Có ${places.length} gợi ý gần bạn (trong bán kính ${radiusKm || 5} km).`
                : `Có ${places.length} gợi ý cho lựa chọn này.`}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Action: Gần tôi (Nearby Toggle) */}
          {onToggleNearby && (
            <button
              type="button"
              onClick={onToggleNearby}
              disabled={nearbyStatus === "requesting"}
              aria-pressed={isNearbyActive}
              className={`inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3.5 sm:px-4 py-2 rounded-full text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 cursor-pointer shadow-sm shrink-0 ${
                isNearbyActive
                  ? "bg-sky-500 text-white hover:bg-sky-600 active:bg-sky-700"
                  : nearbyStatus === "requesting"
                  ? "bg-slate-200 text-slate-600 cursor-wait opacity-80"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 active:bg-slate-100"
              }`}
            >
              {nearbyStatus === "requesting" ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Đang định vị…</span>
                </>
              ) : isNearbyActive ? (
                <>
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Gần tôi (Bật)</span>
                </>
              ) : (
                <>
                  <Navigation className="w-3.5 h-3.5 text-slate-500" />
                  <span>Gần tôi</span>
                </>
              )}
            </button>
          )}

          {/* Action: Đổi lựa chọn */}
          <button
            type="button"
            onClick={onResetPreference}
            className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3.5 sm:px-4 py-2 rounded-full text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 cursor-pointer shadow-sm shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Đổi lựa chọn</span>
          </button>
        </div>
      </div>

      {/* Geolocation Warning & Fallback Notices */}
      {nearbyStatus === "inaccurate" && (
        <div
          role="status"
          className="rounded-[14px] bg-amber-50 border border-amber-200/90 p-3 sm:p-3.5 text-xs text-amber-900 flex flex-wrap items-center justify-between gap-2"
        >
          <p className="leading-relaxed">
            Vị trí chưa đủ chính xác để tìm địa điểm gần bạn. Đang hiển thị gợi ý toàn thành phố.
          </p>
          {onRetryNearby && (
            <button
              type="button"
              onClick={onRetryNearby}
              className="font-bold underline hover:text-amber-950 shrink-0 min-h-[44px] px-2 flex items-center"
            >
              Thử lại
            </button>
          )}
        </div>
      )}

      {nearbyStatus === "denied" && (
        <div
          role="status"
          className="rounded-[14px] bg-slate-100 border border-slate-200/90 p-3 sm:p-3.5 text-xs text-slate-700 flex flex-wrap items-center justify-between gap-2"
        >
          <p className="leading-relaxed">
            Bạn đã từ chối quyền vị trí. Đang hiển thị gợi ý toàn thành phố.
          </p>
          {onRetryNearby && (
            <button
              type="button"
              onClick={onRetryNearby}
              className="font-bold underline hover:text-slate-900 shrink-0 min-h-[44px] px-2 flex items-center"
            >
              Thử lại
            </button>
          )}
        </div>
      )}

      {nearbyStatus === "timeout" && (
        <div
          role="status"
          className="rounded-[14px] bg-slate-100 border border-slate-200/90 p-3 sm:p-3.5 text-xs text-slate-700 flex flex-wrap items-center justify-between gap-2"
        >
          <p className="leading-relaxed">
            Không nhận được phản hồi vị trí kịp thời. Đang hiển thị gợi ý toàn thành phố.
          </p>
          {onRetryNearby && (
            <button
              type="button"
              onClick={onRetryNearby}
              className="font-bold underline hover:text-slate-900 shrink-0 min-h-[44px] px-2 flex items-center"
            >
              Thử lại
            </button>
          )}
        </div>
      )}

      {nearbyStatus === "unavailable" && (
        <div
          role="status"
          className="rounded-[14px] bg-slate-100 border border-slate-200/90 p-3 sm:p-3.5 text-xs text-slate-700 flex flex-wrap items-center justify-between gap-2"
        >
          <p className="leading-relaxed">
            Thiết bị không thể xác định vị trí hiện tại. Đang hiển thị gợi ý toàn thành phố.
          </p>
          {onRetryNearby && (
            <button
              type="button"
              onClick={onRetryNearby}
              className="font-bold underline hover:text-slate-900 shrink-0 min-h-[44px] px-2 flex items-center"
            >
              Thử lại
            </button>
          )}
        </div>
      )}

      {/* Cards or Empty/Error States */}
      <div className="min-h-[320px]" aria-busy={pending}>
        {pending ? (
          <div role="status" className="rounded-[16px] border border-slate-200 bg-white p-6 text-slate-600">
            Đang tìm địa điểm…
          </div>
        ) : status === "error" ? (
          <div role="alert" className="rounded-[16px] border border-slate-200 bg-white p-5 space-y-3">
            <h3 className="font-semibold text-slate-900">Chưa tải được địa điểm.</h3>
            <p className="text-sm text-slate-600">Hãy thử lại hoặc đổi lựa chọn.</p>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="min-h-[44px] px-5 py-3 rounded-xl bg-sky-500 text-white font-semibold focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
              >
                Thử lại
              </button>
            )}
          </div>
        ) : status === "empty" ? (
          isNearbyActive ? (
            /* Dedicated Nearby Empty State with CTA */
            <div
              role="status"
              className="rounded-[16px] border border-slate-200 bg-white p-6 sm:p-8 text-center space-y-4"
            >
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-base">
                  Không tìm thấy địa điểm phù hợp trong 5 km.
                </h3>
                <p className="text-xs text-slate-500">
                  Hãy thử mở rộng tìm kiếm trên toàn thành phố hoặc đổi lựa chọn khác.
                </p>
              </div>
              {onResetNearby && (
                <button
                  type="button"
                  onClick={onResetNearby}
                  className="min-h-[44px] px-5 py-2.5 rounded-full bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white text-xs font-semibold shadow-sm focus-visible:ring-2 focus-visible:ring-sky-500 cursor-pointer"
                >
                  Xem trên toàn Đà Nẵng
                </button>
              )}
            </div>
          ) : (
            <EmptyState />
          )
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {places.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
