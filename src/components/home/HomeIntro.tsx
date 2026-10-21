import React from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";

export const HomeIntro: React.FC = () => {
  const { t } = useLocale();

  return (
    <section
      aria-labelledby="home-intro-heading"
      className="w-full mt-4 rounded-2xl border border-slate-200/80 bg-white/80 p-4 sm:p-5 text-left shadow-xs"
    >
      <h2
        id="home-intro-heading"
        className="text-base sm:text-lg font-bold text-slate-800 tracking-tight"
      >
        {t("home.intro.title")}
      </h2>
      <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
        {t("home.intro.description")}
      </p>

      <div className="mt-3.5 pt-3 border-t border-slate-200/70">
        <h3 className="text-xs sm:text-sm font-semibold text-slate-700">
          {t("home.intro.guideTitle")}
        </h3>
        <ol className="mt-2 space-y-1.5 text-xs sm:text-sm text-slate-600 leading-normal">
          <li>{t("home.intro.guideStep1")}</li>
          <li>{t("home.intro.guideStep2")}</li>
          <li>{t("home.intro.guideStep3")}</li>
        </ol>
      </div>
    </section>
  );
};
