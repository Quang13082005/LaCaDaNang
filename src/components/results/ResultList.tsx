import React from "react";
import { PlaceCard } from "@/components/results/PlaceCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { BottomActionBar } from "@/components/results/BottomActionBar";
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
    <section
      className="w-full space-y-4 pt-6 pb-28 sm:pb-32 pb-[calc(7rem+env(safe-area-inset-bottom,0px))]"
      aria-label="Kết quả gợi ý"
    >
      {/* Result Section Header / Context Row */}
      <div className="pb-3 border-b border-slate-200/80 px-1">
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

      {/* Geolocation Warning & Fallback Notices */}
      {nearbyStatus === "inaccurate" && (
        <div
          role="status"
          className="rounded-[14px] bg-amber-50 border border-amber-200/90 p-3 sm:p-3.5 text-xs text-amber-900 flex items-center justify-between gap-2"
        >
          <p className="leading-relaxed">
            Vị trí chưa đủ chính xác để tìm địa điểm gần bạn. Đang hiển thị gợi ý toàn thành phố.
          </p>
        </div>
      )}

      {nearbyStatus === "denied" && (
        <div
          role="status"
          className="rounded-[14px] bg-slate-100 border border-slate-200/90 p-3 sm:p-3.5 text-xs text-slate-700 flex items-center justify-between gap-2"
        >
          <p className="leading-relaxed">
            Bạn đã từ chối quyền vị trí. Đang hiển thị gợi ý toàn thành phố.
          </p>
        </div>
      )}

      {nearbyStatus === "timeout" && (
        <div
          role="status"
          className="rounded-[14px] bg-slate-100 border border-slate-200/90 p-3 sm:p-3.5 text-xs text-slate-700 flex items-center justify-between gap-2"
        >
          <p className="leading-relaxed">
            Không nhận được phản hồi vị trí kịp thời. Đang hiển thị gợi ý toàn thành phố.
          </p>
        </div>
      )}

      {nearbyStatus === "unavailable" && (
        <div
          role="status"
          className="rounded-[14px] bg-slate-100 border border-slate-200/90 p-3 sm:p-3.5 text-xs text-slate-700 flex items-center justify-between gap-2"
        >
          <p className="leading-relaxed">
            Thiết bị không thể xác định vị trí hiện tại. Đang hiển thị gợi ý toàn thành phố.
          </p>
        </div>
      )}

      {/* Cards or Empty/Error States */}
      <div className="min-h-[320px]" aria-busy={pending}>
        {pending ? (
          <div role="status" className="rounded-[16px] border border-slate-200 bg-white p-6 text-slate-600">
            Đang tìm địa điểm…
          </div>
        ) : status === "error" ? (
          <div role="alert" className="rounded-[16px] border border-slate-200 bg-white p-5 space-y-2">
            <h3 className="font-semibold text-slate-900">Chưa tải được địa điểm.</h3>
            <p className="text-sm text-slate-600">Hãy thử lại hoặc đổi lựa chọn.</p>
          </div>
        ) : status === "empty" ? (
          isNearbyActive ? (
            /* Dedicated Nearby Empty State */
            <div
              role="status"
              className="rounded-[16px] border border-slate-200 bg-white p-6 sm:p-8 text-center space-y-2"
            >
              <h3 className="font-bold text-slate-900 text-base">
                Không tìm thấy địa điểm phù hợp trong 5 km.
              </h3>
              <p className="text-xs text-slate-500">
                Hãy thử mở rộng tìm kiếm trên toàn thành phố hoặc đổi lựa chọn khác.
              </p>
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

      {/* Persistent Mobile Bottom Action Bar */}
      <BottomActionBar
        status={status}
        nearbyStatus={nearbyStatus}
        onToggleNearby={onToggleNearby}
        onRetryNearby={onRetryNearby}
        onResetNearby={onResetNearby}
        onResetPreference={onResetPreference}
        onRetryDiscovery={onRetry}
      />
    </section>
  );
};
