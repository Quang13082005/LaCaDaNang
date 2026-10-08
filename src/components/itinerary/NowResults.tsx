"use client";

import React, { useEffect, useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { NOW_SLOTS, NOW_TIME_ZONE, type NowData } from "@/lib/now/contract";
import { ItineraryTimeline } from "./ItineraryTimeline";

export function NowResults({ onResetPreference }: { onResetPreference: () => void }) {
  const { locale, t } = useLocale();
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<{ locale: string; status: "loading" | "success" | "error"; data?: NowData }>({ locale, status: "loading" });
  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    setState({ locale, status: "loading" });
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    void (async () => {
      try {
        const response = await fetch(`/api/now?locale=${locale}`, { cache: "no-store", signal: controller.signal });
        if (!response.ok) throw new Error("Unavailable");
        const body: { ok: boolean; data: NowData } = await response.json();
        const d = body.data;
        if (!body.ok || d.locale !== locale || d.timeZone !== NOW_TIME_ZONE || !NOW_SLOTS.includes(d.slot) ||
          d.meta.source !== "neon-postgres" || d.meta.openingHoursVerified !== false ||
          !Array.isArray(d.places) || d.count !== d.places.length || d.count > 3 ||
          new Set(d.places.map(p => p.id)).size !== d.count) throw new Error("Invalid response");
        if (active) setState({ locale, status: "success", data: d });
      } catch {
        if (active) setState({ locale, status: "error" });
      } finally { window.clearTimeout(timeout); }
    })();
    return () => { active = false; controller.abort(); window.clearTimeout(timeout); };
  }, [locale, attempt]);
  const status = state.locale === locale ? state.status : "loading";
  return <div className="pb-4">
    {status === "success" && state.data ? <ItineraryTimeline itinerary={state.data} /> :
      <div className="min-h-[320px] pt-8" role={status === "error" ? "alert" : "status"}>
        <h2 className="text-xl font-bold">{t("intent.now")}</h2>
        <p className="mt-3">{t(status === "error" ? "results.error.title" : "results.loading")}</p>
      </div>}
    <nav aria-label={t("action.navAria")} className="fixed bottom-0 inset-x-0 z-40 border-t border-slate-200 bg-white/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]">
      <div className="max-w-2xl mx-auto flex gap-3">
        <button onClick={onResetPreference} className="min-h-[44px] flex-1 rounded-xl bg-slate-100 px-4 py-2 font-semibold">{t("action.changeSelection")}</button>
        {status === "error" && <button onClick={() => setAttempt(v => v + 1)} className="min-h-[44px] flex-1 rounded-xl bg-sky-500 text-white px-4 py-2 font-semibold">{t("action.retry")}</button>}
      </div>
    </nav>
  </div>;
}
