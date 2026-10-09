"use client";

import React, { useEffect, useState, useRef } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { NOW_SLOTS, NOW_TIME_ZONE, type NowData } from "@/lib/now/contract";
import { requestLocation, type LocationFailure } from "@/lib/geo/request-location";
import type { Coordinates } from "@/lib/geo/distance";
import { ItineraryTimeline } from "./ItineraryTimeline";

export function NowResults({ onResetPreference }: { onResetPreference: () => void }) {
  const { locale, t } = useLocale();
  const [mode, setMode] = useState<"choose" | "nearby" | "citywide">("choose");
  const [origin, setOrigin] = useState<Coordinates | null>(null);
  const [gps, setGps] = useState<"idle" | "requesting" | LocationFailure>("idle");
  const cancelGps = useRef<() => void>(() => {});
  useEffect(() => () => cancelGps.current(), []);
  const locate = () => {
    cancelGps.current(); setGps("requesting");
    cancelGps.current = requestLocation(point => { setOrigin(point); setGps("idle"); setMode("nearby"); }, reason => setGps(reason));
  };
  const citywide = () => { cancelGps.current(); setGps("idle"); setOrigin(null); setMode("citywide"); };
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<{ locale: string; status: "loading" | "success" | "error"; data?: NowData }>({ locale, status: "loading" });
  useEffect(() => {
    if (mode === "choose") return;
    let active = true;
    const controller = new AbortController();
    setState({ locale, status: "loading" });
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    void (async () => {
      try {
        const params = new URLSearchParams({ locale });
        if (mode === "nearby" && origin) { params.set("lat", String(origin.latitude)); params.set("lng", String(origin.longitude)); }
        const response = await fetch(`/api/now?${params}`, { cache: "no-store", signal: controller.signal });
        if (!response.ok) throw new Error("Unavailable");
        const body: { ok: boolean; data: NowData } = await response.json();
        const d = body.data;
        if (!body.ok || d.locale !== locale || d.timeZone !== NOW_TIME_ZONE || !NOW_SLOTS.includes(d.slot) ||
          (mode === "nearby" && (d.meta.mode !== "nearby" || ![1,3,5].includes(d.meta.radiusKm ?? 0))) ||
          d.meta.source !== "neon-postgres" || d.meta.openingHoursVerified !== false ||
          !Array.isArray(d.places) || d.count !== d.places.length || d.count > 3 ||
          new Set(d.places.map(p => p.id)).size !== d.count) throw new Error("Invalid response");
        if (active) setState({ locale, status: "success", data: d });
      } catch {
        if (active) setState({ locale, status: "error" });
      } finally { window.clearTimeout(timeout); }
    })();
    return () => { active = false; controller.abort(); window.clearTimeout(timeout); };
  }, [locale, attempt, mode, origin]);
  const status = state.locale === locale ? state.status : "loading";
  if (mode === "choose") return <div className="pb-40 pt-8 min-h-[320px]">
    <h2 className="text-xl font-bold">{t("intent.now")}</h2>
    <p className="mt-3" role="status">{gps === "idle" ? t("now.locationPrompt") : gps === "requesting" ? t("action.locating") : t(`now.gps.${gps}`)}</p>
    <nav aria-label={t("action.navAria")} className="fixed bottom-0 inset-x-0 bg-white border-t p-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] z-40">
      <div className="max-w-lg mx-auto grid gap-2">
        <button disabled={gps === "requesting"} onClick={locate} className="min-h-[44px] rounded-xl bg-sky-500 text-white px-4 py-3 font-semibold">{t(gps === "idle" ? "now.allowLocation" : "action.retry")}</button>
        <button onClick={citywide} className="min-h-[44px] rounded-xl bg-sky-50 px-4 py-2 font-semibold">{t("now.showCitywide")}</button>
        <button onClick={onResetPreference} className="min-h-[44px] rounded-xl bg-slate-100 px-4 py-2">{t("action.changeSelection")}</button>
      </div>
    </nav>
  </div>;
  return <div className="pb-28">
    {status === "success" && state.data ? <ItineraryTimeline itinerary={state.data} /> :
      <div className="min-h-[320px] pt-8" role={status === "error" ? "alert" : "status"}>
        <h2 className="text-xl font-bold">{t("intent.now")}</h2>
        <p className="mt-3">{t(status === "error" ? "results.error.title" : "results.loading")}</p>
      </div>}
    <nav aria-label={t("action.navAria")} className="fixed bottom-0 inset-x-0 z-40 border-t border-slate-200 bg-white/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]">
      <div className="max-w-2xl mx-auto flex flex-wrap gap-3">
        {mode === "nearby" && <button onClick={citywide} className="min-h-[44px] w-full rounded-xl bg-sky-50 px-4 py-2 font-semibold">{t("now.showCitywide")}</button>}
        <button onClick={onResetPreference} className="min-h-[44px] flex-1 rounded-xl bg-slate-100 px-4 py-2 font-semibold">{t("action.changeSelection")}</button>
        {status === "error" && <button onClick={() => setAttempt(v => v + 1)} className="min-h-[44px] flex-1 rounded-xl bg-sky-500 text-white px-4 py-2 font-semibold">{t("action.retry")}</button>}
      </div>
    </nav>
  </div>;
}
