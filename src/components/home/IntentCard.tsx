"use client";

import React from "react";
import { ChevronRight, Utensils, Compass, Bed, Zap } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import type { MessageKey } from "@/lib/i18n/messages";
import type { IntentConfig } from "@/data/discovery-ui";

interface IntentTheme {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  cardBg: string;
  cardBorder: string;
  chevronBg: string;
  chevronColor: string;
  renderAccent: () => React.ReactNode;
}

const INTENT_THEMES: Record<"NOW" | "EAT" | "GO" | "STAY", IntentTheme> = {
  NOW: {
    icon: Zap,
    iconBg: "bg-[#FEF08A] shadow-xs",
    iconColor: "text-amber-600 fill-amber-500",
    cardBg: "bg-gradient-to-b from-[#FFFDF0] via-[#FFFBEB] to-[#FEF3C7]/45",
    cardBorder: "border-[#FDE68A]/80 hover:border-amber-300",
    chevronBg: "bg-amber-100/75 text-amber-700 group-hover:bg-amber-200/90",
    chevronColor: "text-amber-700",
    renderAccent: () => (
      <svg
        className="absolute bottom-0 right-0 w-24 h-14 pointer-events-none text-amber-300/35"
        viewBox="0 0 100 60"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M0,45 Q30,30 60,48 T100,35 L100,60 L0,60 Z" />
        <circle cx="78" cy="22" r="8" fill="currentColor" opacity="0.6" />
      </svg>
    ),
  },
  EAT: {
    icon: Utensils,
    iconBg: "bg-[#FFEDD5] shadow-xs",
    iconColor: "text-orange-600",
    cardBg: "bg-gradient-to-b from-[#FFF8F5] via-[#FFF1ED] to-[#FFEDD5]/45",
    cardBorder: "border-[#FED7AA]/80 hover:border-orange-300",
    chevronBg: "bg-orange-100/75 text-orange-700 group-hover:bg-orange-200/90",
    chevronColor: "text-orange-700",
    renderAccent: () => (
      <svg
        className="absolute bottom-0 right-0 w-24 h-14 pointer-events-none text-orange-300/35"
        viewBox="0 0 100 60"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M0,50 Q40,32 75,45 T100,40 L100,60 L0,60 Z" />
        {/* Subtle steaming food bowl accent */}
        <path
          d="M62,48 C62,54 84,54 84,48 L86,44 L60,44 Z"
          fill="currentColor"
          opacity="0.8"
        />
        <path
          d="M68,40 Q71,36 68,32 M78,40 Q81,36 78,32"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          opacity="0.7"
        />
      </svg>
    ),
  },
  GO: {
    icon: Compass,
    iconBg: "bg-[#E0F2FE] shadow-xs",
    iconColor: "text-sky-600",
    cardBg: "bg-gradient-to-b from-[#F5FAFF] via-[#EBF5FF] to-[#E0F2FE]/45",
    cardBorder: "border-[#BAE6FD]/80 hover:border-sky-300",
    chevronBg: "bg-sky-100/75 text-sky-700 group-hover:bg-sky-200/90",
    chevronColor: "text-sky-700",
    renderAccent: () => (
      <svg
        className="absolute bottom-0 right-0 w-24 h-14 pointer-events-none text-sky-300/35"
        viewBox="0 0 100 60"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M0,52 Q35,38 70,48 T100,38 L100,60 L0,60 Z" />
        {/* Subtle bridge arch accent */}
        <path
          d="M58,54 Q72,40 86,54"
          stroke="currentColor"
          strokeWidth="2.5"
          fill="none"
          opacity="0.8"
        />
        <circle cx="82" cy="38" r="3.5" fill="currentColor" opacity="0.9" />
      </svg>
    ),
  },
  STAY: {
    icon: Bed,
    iconBg: "bg-[#EDE9FE] shadow-xs",
    iconColor: "text-purple-600",
    cardBg: "bg-gradient-to-b from-[#FAF8FF] via-[#F5EEFF] to-[#EDE9FE]/45",
    cardBorder: "border-[#DDD6FE]/80 hover:border-purple-300",
    chevronBg: "bg-purple-100/75 text-purple-700 group-hover:bg-purple-200/90",
    chevronColor: "text-purple-700",
    renderAccent: () => (
      <svg
        className="absolute bottom-0 right-0 w-24 h-14 pointer-events-none text-purple-300/35"
        viewBox="0 0 100 60"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M0,52 Q40,36 80,48 T100,42 L100,60 L0,60 Z" />
        {/* Subtle resort/palm accents */}
        <rect x="70" y="36" width="10" height="20" rx="1.5" fill="currentColor" opacity="0.6" />
        <rect x="83" y="42" width="8" height="14" rx="1.5" fill="currentColor" opacity="0.5" />
      </svg>
    ),
  },
};

export interface IntentCardProps {
  intent: IntentConfig;
  isSelected: boolean;
  onClick: () => void;
}

export const IntentCard: React.FC<IntentCardProps> = ({
  intent,
  isSelected,
  onClick,
}) => {
  const { t } = useLocale();
  const theme = INTENT_THEMES[intent.id];
  const Icon = theme.icon;

  const labelKey = `intent.${intent.id.toLowerCase()}` as MessageKey;
  const helperKey = `intent.${intent.id.toLowerCase()}.helper` as MessageKey;

  const localizedLabel = t(labelKey);
  const localizedSublabel = t(helperKey);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isSelected}
      className={`group relative w-full text-left rounded-[20px] min-h-[136px] sm:min-h-[148px] p-3 sm:p-4 transition-all duration-200 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 overflow-hidden flex flex-col justify-between ${
        theme.cardBg
      } border ${theme.cardBorder} ${
        isSelected
          ? "ring-2 ring-sky-500 border-sky-500 shadow-md translate-y-[-1px]"
          : "shadow-2xs hover:shadow-xs active:scale-[0.985]"
      }`}
    >
      {/* Decorative Bottom Vector Accent */}
      {theme.renderAccent()}

      {/* Top Row: Icon Badge (left) & Subtle Chevron Pill (right) */}
      <div className="relative z-10 flex items-center justify-between w-full">
        <div
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 ${theme.iconBg}`}
        >
          <Icon className={`w-4.5 h-4.5 sm:w-5 sm:h-5 ${theme.iconColor}`} aria-hidden="true" />
        </div>

        <div
          className={`w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-150 ${theme.chevronBg}`}
        >
          <ChevronRight
            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5] ${theme.chevronColor}`}
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Bottom Content: Title & Subtitle */}
      <div className="relative z-10 pt-2.5 sm:pt-3">
        <h2 className="text-sm sm:text-base font-extrabold tracking-tight text-slate-900 leading-snug break-words">
          {localizedLabel}
        </h2>
        <p className="text-[11px] sm:text-xs text-slate-500 font-medium leading-tight mt-0.5 break-words line-clamp-2">
          {localizedSublabel}
        </p>
      </div>
    </button>
  );
};
