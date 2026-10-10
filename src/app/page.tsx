"use client";

import React, { useState, useRef, useEffect } from "react";
import { Hero } from "@/components/home/Hero";
import { IntentGrid } from "@/components/home/IntentGrid";
import { DiscoveryResults } from "@/components/results/DiscoveryResults";
import { NowResults } from "@/components/itinerary/NowResults";
import { LanguageSelector } from "@/components/i18n/LanguageSelector";
import { useLocale } from "@/components/i18n/LocaleProvider";
import {
  trackSessionStarted,
  trackHomeViewed,
  trackIntentSelected,
  trackPreferenceSelected,
  resetJourneyId,
} from "@/lib/analytics/client";
import type { MessageKey } from "@/lib/i18n/messages";
import { BROWSE_COPY, BROWSE_SLUGS, hubPath } from "@/lib/seo/browse";
import {
  PREFERENCES_BY_INTENT,
} from "@/data/discovery-ui";

export default function HomePage() {
  const { t, locale, isManual } = useLocale();
  const [selectedIntent, setSelectedIntent] = useState<
    "EAT" | "GO" | "NOW" | "STAY" | null
  >(null);
  const [selectedPreference, setSelectedPreference] = useState<string | null>(
    null
  );

  const resultsRef = useRef<HTMLDivElement>(null);
  const selectionRef = useRef<HTMLDivElement>(null);
  const prevPreferenceRef = useRef<string | null>(null);

  useEffect(() => {
    trackSessionStarted(locale, isManual ? "manual" : "auto");
  }, [locale, isManual]);

  useEffect(() => {
    if (selectedPreference === null) {
      trackHomeViewed(locale, isManual ? "manual" : "auto");
    }
  }, [selectedPreference, locale, isManual]);

  const handleSelectIntent = (intent: "EAT" | "GO" | "NOW" | "STAY") => {
    if (selectedIntent === intent) {
      // Toggle off if tapping same intent
      setSelectedIntent(null);
      setSelectedPreference(null);
    } else {
      trackIntentSelected(intent, locale, isManual ? "manual" : "auto");
      setSelectedIntent(intent);
      setSelectedPreference(intent === "NOW" ? "time_slot" : null);
    }
  };

  const handleSelectPreference = (preferenceId: string) => {
    if (selectedIntent) {
      trackPreferenceSelected(
        selectedIntent,
        preferenceId,
        locale,
        isManual ? "manual" : "auto"
      );
    }
    setSelectedPreference(preferenceId);
  };

  const handleResetPreference = () => {
    resetJourneyId();
    if (selectedIntent === "NOW") setSelectedIntent(null);
    setSelectedPreference(null);
  };

  // Orient user only when results are mounted or reset.
  // Never jump/auto-scroll on intent click to prevent moving controls under the user's thumb.
  useEffect(() => {
    const prev = prevPreferenceRef.current;
    prevPreferenceRef.current = selectedPreference;

    // Do not scroll if preference did not change (e.g. user selected or toggled intent)
    if (prev === null && selectedPreference === null) {
      return;
    }

    if (selectedPreference !== null) {
      const target = resultsRef.current;
      const top = target
        ? Math.max(0, target.getBoundingClientRect().top + window.scrollY - 20)
        : 0;
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top, behavior: reduceMotion ? "auto" : "smooth" });
    } else if (selectedIntent !== null) {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    }
  }, [selectedPreference, selectedIntent]);

  const currentIntentLabel = selectedIntent
    ? t(`intent.${selectedIntent.toLowerCase()}` as MessageKey)
    : undefined;

  const currentPreferenceLabel =
    selectedIntent && selectedPreference
      ? (() => {
          const prefKey = `pref.${selectedPreference}` as MessageKey;
          const translated = t(prefKey);
          return translated !== prefKey
            ? translated
            : PREFERENCES_BY_INTENT[selectedIntent]?.find(
                (c) => c.id === selectedPreference
              )?.label;
        })()
      : undefined;

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col justify-between">
      {/* Centered Mobile-First & Desktop-Balanced Container */}
      <main className="w-full max-w-lg md:max-w-4xl mx-auto px-4 sm:px-6 pt-2.5 sm:pt-4 pb-1 flex-1 flex flex-col justify-between min-h-0">
        {/* Hero Section: stays stable in selection state to prevent upward layout shift */}
        {selectedPreference === null && <Hero />}

        {/* 4 Primary Intents Grid & Preference Bottom Sheet */}
        {selectedPreference === null && (
          <div ref={selectionRef} className="mt-2.5 sm:mt-3 shrink-0">
            <IntentGrid
              selectedIntent={selectedIntent}
              selectedPreference={selectedPreference}
              onSelectIntent={handleSelectIntent}
              onSelectPreference={handleSelectPreference}
            />
          </div>
        )}

        {/* Results Anchor */}
        <div ref={resultsRef}>
          {/* Result Branch 1: Normal Places Discovery (EAT / GO / STAY) */}
          {(selectedIntent === "EAT" || selectedIntent === "GO" || selectedIntent === "STAY") &&
            selectedPreference && (
              <DiscoveryResults
                key={`${selectedIntent}:${selectedPreference}`}
                intent={selectedIntent}
                preference={selectedPreference}
                intentLabel={currentIntentLabel}
                preferenceLabel={currentPreferenceLabel}
                onResetPreference={handleResetPreference}
              />
            )}

          {/* Result Branch 2: Mini Itinerary (NOW) */}
          {selectedIntent === "NOW" && selectedPreference && (
            <NowResults
              onResetPreference={handleResetPreference}
            />
          )}
        </div>
      </main>

      {/* Footer utility row: immediately below grid on Home, natural spacing */}
      <footer
        className={`w-full border-t border-slate-200/80 bg-white/80 py-2.5 px-4 sm:px-6 shrink-0 ${
          selectedPreference === null ? "mt-2 sm:mt-2.5" : selectedIntent === "NOW" ? "mt-8 !pb-[calc(6rem+env(safe-area-inset-bottom,0px))]" : "mt-8 !pb-[calc(10rem+env(safe-area-inset-bottom,0px))]"
        }`}
      >
        <div className="w-full max-w-lg md:max-w-4xl mx-auto flex items-center justify-between gap-3 flex-wrap">
          <span className="text-xs sm:text-sm font-bold text-slate-800 tracking-wider uppercase select-none">
            LA CÀ ĐÀ NẴNG
          </span>
          <div className="shrink-0 flex items-center gap-3">
            <LanguageSelector />
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.dispatchEvent(new Event("laca_open_consent_settings"));
                }
              }}
              className="text-xs text-slate-500 hover:text-slate-800 underline underline-offset-2 min-h-[44px] px-1 inline-flex items-center cursor-pointer"
            >
              {locale === "en"
                ? "Privacy"
                : locale === "ko"
                ? "개인정보"
                : "Quyền riêng tư"}
            </button>
          </div>
          {/* Crawlable plain links to the public place directory; not an intent and not a recommendation. */}
          <nav aria-label={BROWSE_COPY[locale].navLabel} className="w-full flex flex-wrap items-center gap-x-4">
            {(["eat", "go", "stay"] as const).map((slug) => (
              <a
                key={slug}
                href={hubPath(slug, 1, locale)}
                className="text-xs text-slate-500 hover:text-slate-800 underline underline-offset-2 min-h-[44px] px-1 inline-flex items-center"
              >
                {BROWSE_COPY[locale].sections[BROWSE_SLUGS[slug]]}
              </a>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}

