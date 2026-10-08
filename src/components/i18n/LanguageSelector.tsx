"use client";

import React, { useState, useEffect, useRef } from "react";
import { Globe, X, Check } from "lucide-react";
import { useLocale } from "./LocaleProvider";
import type { SupportedLocale } from "@/lib/i18n/locales";

interface LanguageOption {
  id: SupportedLocale | "auto";
  nativeName: string;
}

const OPTIONS: LanguageOption[] = [
  { id: "vi", nativeName: "Tiếng Việt" },
  { id: "en", nativeName: "English" },
  { id: "ko", nativeName: "한국어" },
  { id: "auto", nativeName: "Theo thiết bị / Auto" },
];

export const LanguageSelector: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  const { locale, isManual, setLocale, setAuto, t } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close sheet on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const currentDisplayName = !isManual
    ? `${t("language.auto")} (${locale.toUpperCase()})`
    : locale === "vi"
    ? "Tiếng Việt"
    : locale === "en"
    ? "English"
    : "한국어";

  const handleSelect = (id: SupportedLocale | "auto") => {
    if (id === "auto") {
      setAuto();
    } else {
      setLocale(id);
    }
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <div className={`relative ${className}`}>
      {/* Reachable secondary trigger button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label={`${t("language.label")}: ${currentDisplayName}`}
        className="min-h-[44px] min-w-[44px] px-3.5 py-2 rounded-full border border-slate-200/90 bg-white/90 hover:bg-slate-50 active:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 cursor-pointer select-none"
      >
        <Globe className="w-4 h-4 text-sky-600 shrink-0" aria-hidden="true" />
        <span className="font-medium text-slate-800">{currentDisplayName}</span>
      </button>

      {/* Bottom Sheet Backdrop & Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Bottom Sheet Panel: Half-lower viewport, thumb-accessible */}
          <div
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-label={t("language.selectTitle")}
            className="relative z-10 w-full max-w-lg mx-auto bg-white rounded-t-[24px] p-5 shadow-2xl border-t border-slate-100 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] animate-in slide-in-from-bottom duration-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Globe
                  className="w-4 h-4 text-sky-600 shrink-0"
                  aria-hidden="true"
                />
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  {t("language.selectTitle")}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label={t("language.close")}
                className="w-10 h-10 min-h-[44px] min-w-[44px] rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Language Options List */}
            <div className="space-y-1.5 py-1" role="radiogroup">
              {OPTIONS.map((opt) => {
                const isSelected =
                  opt.id === "auto" ? !isManual : isManual && locale === opt.id;

                return (
                  <button
                    key={opt.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => handleSelect(opt.id)}
                    className={`w-full min-h-[48px] px-4 py-3 rounded-[14px] flex items-center justify-between transition-all cursor-pointer select-none text-left ${
                      isSelected
                        ? "bg-sky-50/90 text-sky-900 font-bold border border-sky-300 shadow-xs"
                        : "bg-white hover:bg-slate-50 text-slate-700 font-medium border border-transparent"
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="text-sm">{opt.nativeName}</span>
                      {opt.id === "auto" && (
                        <span className="text-xs text-slate-500 font-normal">
                          {t("language.autoDesc")}
                        </span>
                      )}
                    </div>
                    {isSelected && (
                      <Check
                        className="w-4 h-4 text-sky-600 shrink-0"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
