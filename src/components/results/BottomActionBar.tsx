"use client";

import React from "react";
import { Navigation, RotateCcw, Loader2 } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import type { GeolocationUiState } from "./ResultList";

export interface BottomActionBarProps {
  status: "idle" | "loading" | "success" | "empty" | "error";
  nearbyStatus: GeolocationUiState;
  onToggleNearby?: () => void;
  onRetryNearby?: () => void;
  onResetNearby?: () => void;
  onGeneralNearby?: () => void;
  onResetPreference: () => void;
  onRetryDiscovery?: () => void;
}

export const BottomActionBar: React.FC<BottomActionBarProps> = ({
  status,
  nearbyStatus,
  onToggleNearby,
  onRetryNearby,
  onResetNearby,
  onGeneralNearby,
  onResetPreference,
  onRetryDiscovery,
}) => {
  const { t } = useLocale();
  const isNearbyActive = nearbyStatus === "granted";
  const isGpsError =
    nearbyStatus === "denied" ||
    nearbyStatus === "unavailable" ||
    nearbyStatus === "timeout" ||
    nearbyStatus === "inaccurate";

  // Determine Primary Action based on current state
  let primaryAction: {
    label: string;
    onClick?: () => void;
    disabled?: boolean;
    icon: React.ReactNode;
    ariaLabel?: string;
  };

  if (nearbyStatus === "requesting") {
    // 1. Requesting GPS
    primaryAction = {
      label: t("action.locating"),
      disabled: true,
      icon: <Loader2 className="w-4 h-4 animate-spin shrink-0" />,
    };
  } else if (isGpsError) {
    // 2. GPS Error / Fallback state -> Retry GPS
    primaryAction = {
      label: t("action.retry"),
      onClick: onRetryNearby,
      icon: <RotateCcw className="w-4 h-4 shrink-0" />,
    };
  } else if (status === "error") {
    // 3. Discovery Fetch Error -> Retry Fetch
    primaryAction = {
      label: t("action.retry"),
      onClick: onRetryDiscovery,
      icon: <RotateCcw className="w-4 h-4 shrink-0" />,
    };
  } else if (status === "empty" && isNearbyActive) {
    // 4. Nearby Empty (0 matches in 5km) -> Return to Citywide
    primaryAction = {
      label: t("action.viewCitywide"),
      onClick: onResetNearby,
      icon: <Navigation className="w-4 h-4 shrink-0" />,
      ariaLabel: t("action.viewCitywide"),
    };
  } else if (isNearbyActive) {
    // 5. Nearby Active -> Toggle back to Citywide
    primaryAction = {
      label: t("action.citywide"),
      onClick: onResetNearby || onToggleNearby,
      icon: <Navigation className="w-4 h-4 shrink-0" />,
    };
  } else {
    // 6. Citywide Discovery -> Trigger Nearby GPS
    primaryAction = {
      label: t("action.nearby"),
      onClick: onToggleNearby,
      icon: <Navigation className="w-4 h-4 shrink-0" />,
    };
  }

  return (
    <aside
      aria-label={t("action.navAria")}
      className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-4 pt-2.5 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]"
    >
      <div className="w-full max-w-lg md:max-w-4xl mx-auto flex items-center justify-between gap-2.5 sm:gap-3">
        {/* Secondary Action: Đổi lựa chọn */}
        <button
          type="button"
          onClick={onResetPreference}
          className="flex-1 min-h-[44px] min-w-0 px-2.5 sm:px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 border border-slate-200/80 transition-colors flex items-center justify-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 cursor-pointer select-none shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span className="whitespace-normal">{t("action.changeSelection")}</span>
        </button>

        {/* Primary Action: State-aware */}
        <button
          type="button"
          onClick={primaryAction.onClick}
          disabled={primaryAction.disabled}
          aria-label={primaryAction.ariaLabel}
          className={`flex-1 min-h-[44px] min-w-0 px-2.5 sm:px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 select-none shadow-sm shrink-0 ${
            primaryAction.disabled
              ? "bg-slate-200 text-slate-500 cursor-wait opacity-80"
              : isNearbyActive && status !== "empty"
              ? "bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white cursor-pointer"
              : "bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white cursor-pointer"
          }`}
        >
          {primaryAction.icon}
          <span className="whitespace-normal">{primaryAction.label}</span>
        </button>
      </div>
      {status === "empty" && isNearbyActive && onGeneralNearby && (
        <button type="button" onClick={onGeneralNearby}
          className="block w-full max-w-lg md:max-w-4xl mx-auto mt-2 min-h-[44px] px-4 py-2.5 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-sm font-semibold whitespace-normal">
          {t("action.generalNearby")}
        </button>
      )}
    </aside>
  );
};

