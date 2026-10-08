import React from "react";
import { PlaceCard } from "@/components/results/PlaceCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { BottomActionBar } from "@/components/results/BottomActionBar";
import { useLocale } from "@/components/i18n/LocaleProvider";
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
  const { t } = useLocale();
  const pending = status === "idle" || status === "loading";
  const contextTitle = intentLabel && preferenceLabel
    ? `${intentLabel} · ${preferenceLabel}`
    : preferenceLabel || t("results.title");

  const isNearbyActive = nearbyStatus === "granted";

  return (
    <section
      className="w-full space-y-4 pt-6 pb-28 sm:pb-32 pb-[calc(7rem+env(safe-area-inset-bottom,0px))]"
      aria-label={t("results.region")}
    >
      {/* Result Section Header / Context Row */}
      <div className="pb-3 border-b border-slate-200/80 px-1">
        <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
          {contextTitle}
        </h2>
        {/* Truthful Count Information */}
        {status === "empty" && !isNearbyActive && (
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {t("results.zero")}
          </p>
        )}
        {status === "empty" && isNearbyActive && (
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {t("results.nearbyZero")}
          </p>
        )}
        {status === "success" && (
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {isNearbyActive
              ? t("results.nearbyCount", { count: places.length, radiusKm: radiusKm || 5 })
              : t("results.count", { count: places.length })}
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
            {t("gps.warning.inaccurate")}
          </p>
        </div>
      )}

      {nearbyStatus === "denied" && (
        <div
          role="status"
          className="rounded-[14px] bg-slate-100 border border-slate-200/90 p-3 sm:p-3.5 text-xs text-slate-700 flex items-center justify-between gap-2"
        >
          <p className="leading-relaxed">
            {t("gps.warning.denied")}
          </p>
        </div>
      )}

      {nearbyStatus === "timeout" && (
        <div
          role="status"
          className="rounded-[14px] bg-slate-100 border border-slate-200/90 p-3 sm:p-3.5 text-xs text-slate-700 flex items-center justify-between gap-2"
        >
          <p className="leading-relaxed">
            {t("gps.warning.timeout")}
          </p>
        </div>
      )}

      {nearbyStatus === "unavailable" && (
        <div
          role="status"
          className="rounded-[14px] bg-slate-100 border border-slate-200/90 p-3 sm:p-3.5 text-xs text-slate-700 flex items-center justify-between gap-2"
        >
          <p className="leading-relaxed">
            {t("gps.warning.unavailable")}
          </p>
        </div>
      )}

      {/* Cards or Empty/Error States */}
      <div className="min-h-[320px]" aria-busy={pending}>
        {pending ? (
          <div role="status" className="rounded-[16px] border border-slate-200 bg-white p-6 text-slate-600">
            {t("results.loading")}
          </div>
        ) : status === "error" ? (
          <div role="alert" className="rounded-[16px] border border-slate-200 bg-white p-5 space-y-2">
            <h3 className="font-semibold text-slate-900">{t("results.error.title")}</h3>
            <p className="text-sm text-slate-600">{t("results.error.message")}</p>
          </div>
        ) : status === "empty" ? (
          isNearbyActive ? (
            /* Dedicated Nearby Empty State */
            <div
              role="status"
              className="rounded-[16px] border border-slate-200 bg-white p-6 sm:p-8 text-center space-y-2"
            >
              <h3 className="font-bold text-slate-900 text-base">
                {t("nearby.empty.title")}
              </h3>
              <p className="text-xs text-slate-500">
                {t("nearby.empty.message")}
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
