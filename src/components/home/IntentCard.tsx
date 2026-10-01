import React from "react";
import Image from "next/image";
import { ChevronDown, Sparkles } from "lucide-react";
import type { IntentConfig } from "@/data/demo-places";

interface IntentCardProps {
  intent: IntentConfig;
  isSelected: boolean;
  onClick: () => void;
  layoutMode?: "featured" | "grid";
}

export const IntentCard: React.FC<IntentCardProps> = ({
  intent,
  isSelected,
  onClick,
  layoutMode = "grid",
}) => {
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
        {/* Top Badges Row */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-300/60 text-amber-800 text-[11px] font-bold tracking-wide uppercase">
            <Sparkles className="w-3 h-3 text-amber-600" />
            Lịch trình tức thì
          </span>
          <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
            Gợi ý theo giờ
          </span>
        </div>

        {/* Content Row */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3.5">
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

            <div>
              <h2
                className={`text-lg sm:text-xl font-bold tracking-tight ${
                  isSelected ? "text-sky-600" : "text-slate-900"
                }`}
              >
                {intent.label}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5 leading-relaxed">
                {intent.sublabel}
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
        {/* Visual Thumbnail: 72px on mobile, full width 124px high on desktop */}
        <div className="relative w-[72px] h-[72px] md:w-full md:h-32 rounded-[12px] md:rounded-none overflow-hidden shrink-0 bg-slate-100 border border-slate-100 md:border-0 shadow-sm md:shadow-none">
          <Image
            src={intent.thumbnailUrl}
            alt={intent.label}
            fill
            sizes="(max-width: 768px) 80px, 320px"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 hidden md:block bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />

          {/* Badge & Emoji Pill */}
          <div className="absolute top-1 left-1 md:top-auto md:bottom-2.5 md:left-3 flex items-center gap-1.5">
            <span className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-white/95 flex items-center justify-center text-xs shadow-sm">
              <span role="img" aria-hidden="true">
                {intent.emoji}
              </span>
            </span>
            <span className="hidden md:inline text-xs font-semibold text-white drop-shadow-sm">
              {intent.categoryBadge}
            </span>
          </div>
        </div>

        {/* Info Content Body */}
        <div className="flex-1 min-w-0 md:p-4 flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-semibold text-sky-600 uppercase tracking-wide block md:hidden">
              {intent.categoryBadge}
            </span>
            <h2
              className={`text-base md:text-lg font-bold tracking-tight mt-0.5 ${
                isSelected ? "text-sky-600" : "text-slate-900"
              }`}
            >
              {intent.label}
            </h2>
            <p className="text-xs text-slate-500 line-clamp-1 md:line-clamp-2 mt-0.5 md:mt-1 font-normal leading-relaxed">
              {intent.sublabel}
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
              {isSelected ? "Đang chọn" : "Khám phá"}
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
