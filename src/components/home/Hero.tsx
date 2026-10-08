import React from "react";
import Image from "next/image";
import { useLocale } from "@/components/i18n/LocaleProvider";

export const Hero: React.FC = () => {
  const { t } = useLocale();

  return (
    <header className="relative w-full rounded-[18px] overflow-hidden shadow-[0_4px_16px_rgba(2,132,199,0.10)] border border-sky-100/80 mb-3.5 sm:mb-4.5 bg-slate-900">
      {/* Scenic Da Nang Vector Banner Background */}
      <div className="relative w-full h-[125px] sm:h-[155px] md:h-[175px]">
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
        <div className="absolute inset-0 p-3.5 sm:p-5 flex flex-col justify-end text-left">
          {/* Brand Name - authentic and prominent */}
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight drop-shadow-sm mb-0.5">
            <span className="text-[10px] sm:text-[11px] font-bold text-amber-300 tracking-[0.2em] uppercase block drop-shadow-xs">
              LA CÀ
            </span>
            <span className="flex flex-col items-start">
              <span>ĐÀ NẴNG</span>
              <span className="w-8 sm:w-10 h-1 bg-amber-400 rounded-full mt-0.5 mb-1" aria-hidden="true" />
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

