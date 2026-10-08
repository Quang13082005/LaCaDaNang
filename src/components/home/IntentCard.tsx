import React from "react";
import { ChevronDown, Utensils, Compass, Bed, Zap } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import type { MessageKey } from "@/lib/i18n/messages";
import type { IntentConfig } from "@/data/demo-places";

const INTENT_VISUALS = {
  EAT: {
    icon: Utensils,
    bg: "bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100/70 border border-amber-200/80",
    iconColor: "text-amber-600",
  },
  GO: {
    icon: Compass,
    bg: "bg-gradient-to-br from-sky-50 via-cyan-50 to-sky-100/70 border border-sky-200/80",
    iconColor: "text-sky-600",
  },
  STAY: {
    icon: Bed,
    bg: "bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-100/70 border border-indigo-200/80",
    iconColor: "text-indigo-600",
  },
  NOW: {
    icon: Zap,
    bg: "bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100/70 border border-amber-200/80",
    iconColor: "text-amber-600",
  },
} as const;

interface IntentCardProps {
  intent: IntentConfig;
  isSelected: boolean;
  onClick: () => void;
  layoutMode?: "featured" | "grid" | "compact";
}

export const IntentCard: React.FC<IntentCardProps> = ({
  intent,
  isSelected,
  onClick,
  layoutMode = "grid",
}) => {
  const { t } = useLocale();
  const labelKey = `intent.${intent.id.toLowerCase()}` as MessageKey;
  const helperKey = `intent.${intent.id.toLowerCase()}.helper` as MessageKey;
  const badgeKey = `intent.${intent.id.toLowerCase()}.badge` as MessageKey;

  const localizedLabel = t(labelKey);
  const localizedSublabel = t(helperKey);
  const localizedBadge = t(badgeKey);

  // Compact mode for State B/C when intent is unselected or compacted
  if (layoutMode === "compact") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={isSelected}
        className={`group relative w-full text-left rounded-[14px] min-h-[44px] px-3.5 py-2.5 transition-all duration-150 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 flex items-center justify-between gap-2.5 ${
          isSelected
            ? "bg-sky-50 border-2 border-sky-500 text-sky-900 shadow-sm"
            : "bg-white border border-slate-200/90 hover:border-slate-300 text-slate-700 hover:text-slate-900 shadow-[0_1px_3px_rgba(0,0,0,0.03)]"
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-lg shrink-0" role="img" aria-hidden="true">
            {intent.emoji}
          </span>
          <span className={`font-bold text-sm break-words ${isSelected ? "text-sky-600" : "text-slate-800"}`}>
            {localizedLabel}
          </span>
        </div>
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
            isSelected
              ? "bg-sky-500 text-white rotate-180 shadow-xs"
              : "bg-slate-100 text-slate-400 group-hover:text-slate-600"
          }`}
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </div>
      </button>
    );
  }


  const isNow = intent.id === "NOW" || layoutMode === "featured";

  // Featured "BÂY GIỜ LÀM GÌ?" card treatment
  if (isNow) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={isSelected}
        className={`group relative w-full text-left rounded-[18px] p-4 sm:p-5 transition-all duration-200 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 ${
          isSelected
            ? "bg-gradient-to-r from-sky-50/80 via-white to-amber-50/40 border-2 border-sky-500 shadow-[0_4px_20px_rgba(14,165,233,0.18)] translate-y-[-1px]"
            : "bg-gradient-to-br from-amber-50/50 via-white to-slate-50/40 border border-slate-200/90 hover:border-amber-300/80 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
        }`}
      >
        {/* Content Row */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3.5">
            <div
              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-[14px] flex items-center justify-center text-2xl shrink-0 transition-transform duration-200 group-hover:scale-105 shadow-sm ${
                isSelected
                  ? "bg-sky-500 text-white"
                  : "bg-amber-100/70 text-amber-900 border border-amber-200/80"
              }`}
            >
              <span role="img" aria-hidden="true">
                {intent.emoji}
              </span>
            </div>

            <div className="min-w-0 break-words">
              <h2
                className={`text-lg sm:text-xl font-bold tracking-tight ${
                  isSelected ? "text-sky-600" : "text-slate-900"
                }`}
              >
                {localizedLabel}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5 leading-relaxed">
                {localizedSublabel}
              </p>
            </div>
          </div>

          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 ${
              isSelected
                ? "bg-sky-500 text-white rotate-180 shadow-sm"
                : "bg-slate-100 text-slate-500 group-hover:bg-sky-50 group-hover:text-sky-600"
            }`}
          >
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </button>
    );
  }

  const visual = INTENT_VISUALS[intent.id] || INTENT_VISUALS.EAT;
  const Icon = visual.icon;

  // Standard Discovery Intent Card (ĂN GÌ?, ĐI ĐÂU?, Ở ĐÂU?)
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isSelected}
      className={`group relative w-full text-left rounded-[18px] bg-white transition-all duration-200 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 overflow-hidden h-full ${
        isSelected
          ? "border-2 border-sky-500 shadow-[0_4px_18px_rgba(14,165,233,0.18)] translate-y-[-1px] ring-2 ring-sky-100"
          : "border border-slate-200/80 hover:border-slate-300 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_14px_rgba(0,0,0,0.08)]"
      }`}
    >
      <div className="flex flex-row md:flex-col items-center md:items-stretch p-3 md:p-0 gap-3 md:gap-0 h-full">
        {/* Visual Vector Container: 72px on mobile, full width on desktop */}
        <div
          className={`relative w-[72px] h-[72px] md:w-full md:h-28 rounded-[14px] md:rounded-none overflow-hidden shrink-0 flex items-center justify-center transition-all duration-200 ${
            isSelected
              ? "bg-sky-50 border border-sky-300 md:border-b-0"
              : visual.bg
          }`}
        >
          {/* Decorative highlight */}
          <div className="absolute inset-0 bg-radial from-white/70 to-transparent pointer-events-none" />

          {/* Centerpiece Vector Icon */}
          <div
            className={`transition-transform duration-200 group-hover:scale-110 flex items-center justify-center ${
              isSelected ? "text-sky-600" : visual.iconColor
            }`}
          >
            <Icon className="w-7 h-7 md:w-8 md:h-8" aria-hidden="true" />
          </div>

          {/* Badge & Emoji Pill */}
          <div className="absolute top-1 left-1 md:top-auto md:bottom-2 md:left-2.5 flex items-center gap-1.5">
            <span className="w-5 h-5 md:w-5.5 md:h-5.5 rounded-full bg-white/95 flex items-center justify-center text-[11px] shadow-xs border border-slate-100">
              <span role="img" aria-hidden="true">
                {intent.emoji}
              </span>
            </span>
            <span className="hidden md:inline text-[11px] font-semibold text-slate-700 bg-white/90 px-2 py-0.5 rounded-full shadow-xs border border-slate-100">
              {localizedBadge}
            </span>
          </div>
        </div>

        {/* Info Content Body */}
        <div className="flex-1 min-w-0 md:p-4 flex flex-col justify-between">
          <div>
            <h2
              className={`text-base md:text-lg font-bold tracking-tight mt-0.5 ${
                isSelected ? "text-sky-600" : "text-slate-900"
              }`}
            >
              {localizedLabel}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 md:mt-1 font-normal leading-relaxed break-words">
              {localizedSublabel}
            </p>
          </div>

          {/* Desktop-only status line */}
          <div className="hidden md:flex items-center justify-between border-t border-slate-100 pt-3 mt-3 text-xs font-semibold">
            <span
              className={
                isSelected
                  ? "text-sky-600"
                  : "text-slate-400 group-hover:text-sky-600"
              }
            >
              {isSelected ? t("action.selected") : t("action.explore")}
            </span>
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-200 ${
                isSelected
                  ? "bg-sky-500 text-white rotate-180"
                  : "bg-slate-100 text-slate-500 group-hover:bg-sky-50 group-hover:text-sky-600"
              }`}
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Mobile-only expand indicator */}
        <div
          className={`md:hidden w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
            isSelected
              ? "bg-sky-100 text-sky-600 rotate-180"
              : "text-slate-400 group-hover:text-slate-700 bg-slate-50"
          }`}
        >
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
    </button>
  );
};
