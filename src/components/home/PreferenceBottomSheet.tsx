"use client";

import React, { useEffect, useRef } from "react";
import { X, Utensils, Compass, Bed, Zap } from "lucide-react";
import { MoodChip } from "@/components/shared/MoodChip";
import { useLocale } from "@/components/i18n/LocaleProvider";
import type { MessageKey } from "@/lib/i18n/messages";
import { PREFERENCES_BY_INTENT } from "@/data/demo-places";

const INTENT_THEMES = {
  NOW: {
    icon: Zap,
    badgeBg: "bg-[#FEF08A] text-amber-700",
    headerBg: "bg-amber-50/70",
  },
  EAT: {
    icon: Utensils,
    badgeBg: "bg-[#FFEDD5] text-orange-600",
    headerBg: "bg-orange-50/70",
  },
  GO: {
    icon: Compass,
    badgeBg: "bg-[#E0F2FE] text-sky-600",
    headerBg: "bg-sky-50/70",
  },
  STAY: {
    icon: Bed,
    badgeBg: "bg-[#EDE9FE] text-purple-600",
    headerBg: "bg-purple-50/70",
  },
} as const;

export interface PreferenceBottomSheetProps {
  intentId: "EAT" | "GO" | "NOW" | "STAY";
  isOpen: boolean;
  onClose: () => void;
  selectedPreferenceId: string | null;
  onSelectPreference: (preferenceId: string) => void;
}

export const PreferenceBottomSheet: React.FC<PreferenceBottomSheetProps> = ({
  intentId,
  isOpen,
  onClose,
  selectedPreferenceId,
  onSelectPreference,
}) => {
  const { t } = useLocale();
  const sheetRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Focus close button upon open
  useEffect(() => {
    if (isOpen) {
      closeBtnRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const chips = PREFERENCES_BY_INTENT[intentId] || [];
  const theme = INTENT_THEMES[intentId];
  const Icon = theme.icon;

  const intentLabelKey = `intent.${intentId.toLowerCase()}` as MessageKey;
  const intentLabel = t(intentLabelKey);
  const prompt =
    intentId === "NOW"
      ? t("preference.companionPrompt")
      : t("preference.prompt");

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet Container: Positioned directly in the comfortable lower thumb zone */}
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        id="preference-panel-active"
        aria-labelledby="preference-sheet-title"
        className="relative z-10 w-full max-w-lg mx-auto bg-white rounded-t-[24px] shadow-[0_-8px_30px_rgba(0,0,0,0.12)] border-t border-slate-200/90 p-4 sm:p-5 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] space-y-3.5 animate-in slide-in-from-bottom duration-200"
      >
        {/* Header Row */}
        <div className="flex items-center justify-between gap-3 pb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${theme.badgeBg}`}
            >
              <Icon className="w-4.5 h-4.5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h3
                id="preference-sheet-title"
                className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight leading-tight truncate"
              >
                {intentLabel} · {t("preference.sheetTitle")}
              </h3>
              <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                {prompt}
              </p>
            </div>
          </div>

          {/* Close button with >=44px touch target */}
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label={t("preference.close")}
            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200/80 transition-colors duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Chips Grid: 2 columns on mobile, 3 on larger screens, thumb-reachable */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 pt-1">
          {chips.map((chip) => {
            const labelKey = `pref.${chip.id}` as MessageKey;
            const translated = t(labelKey);
            const displayLabel = translated !== labelKey ? translated : chip.label;

            return (
              <MoodChip
                key={chip.id}
                id={chip.id}
                label={displayLabel}
                emoji={chip.emoji}
                isSelected={selectedPreferenceId === chip.id}
                onClick={() => onSelectPreference(chip.id)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
