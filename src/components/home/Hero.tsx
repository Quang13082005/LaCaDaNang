import React from "react";
import Image from "next/image";
import { useLocale } from "@/components/i18n/LocaleProvider";

export const Hero: React.FC = () => {
  const { t } = useLocale();

  return (
    <header className="relative w-full rounded-[22px] overflow-hidden shadow-[0_4px_20px_rgba(2,132,199,0.12)] border border-sky-100/80 bg-slate-900 flex-1 min-h-[190px] max-h-[460px] md:max-h-[360px] flex flex-col">
      {/* Scenic Da Nang Vector Banner Background */}
      <div className="relative w-full flex-1 min-h-[190px]">
        <Image
          src="/images/demo/danang-hero.svg"
          alt={t("hero.imageAlt")}
          fill
          priority
          className="object-cover object-center brightness-[0.92]"
        />

        {/* Dual Cinematic Gradient Scrim for Guaranteed Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/45 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 via-transparent to-slate-950/20 pointer-events-none" />

        {/* Content Container */}
        <div className="absolute inset-0 p-4 sm:p-5 flex flex-col justify-end text-left">
          {/* Brand Name - authentic and prominent */}
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight drop-shadow-sm mb-1">
            <span className="text-[11px] sm:text-xs font-bold text-amber-300 tracking-[0.22em] uppercase block drop-shadow-xs mb-0.5">
              LA CÀ
            </span>
            <span className="flex flex-col items-start">
              <span>ĐÀ NẴNG</span>
              <span className="w-10 sm:w-12 h-1 bg-amber-400 rounded-full mt-0.5 mb-1.5" aria-hidden="true" />
            </span>
          </h1>

          {/* Tagline: Clean, truthful, no line-clamp ellipsis truncation */}
          <p className="text-xs sm:text-sm font-medium text-sky-100 max-w-md drop-shadow-xs leading-relaxed">
            {t("hero.description")}
          </p>
        </div>
      </div>
    </header>
  );
};

