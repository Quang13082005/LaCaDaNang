"use client";

import React, { useState, useRef, useEffect } from "react";
import { Hero } from "@/components/home/Hero";
import { IntentGrid } from "@/components/home/IntentGrid";
import { ResultList } from "@/components/results/ResultList";
import { EatDiscoveryResults } from "@/components/results/EatDiscoveryResults";
import { demoToCard } from "@/lib/data/place-card-model";
import { ItineraryTimeline } from "@/components/itinerary/ItineraryTimeline";
import {
  getPlacesForSelection,
  getItineraryForPreference,
  PREFERENCES_BY_INTENT,
  PRIMARY_INTENTS,
} from "@/data/demo-places";

export default function HomePage() {
  const [selectedIntent, setSelectedIntent] = useState<
    "EAT" | "GO" | "NOW" | "STAY" | null
  >(null);
  const [selectedPreference, setSelectedPreference] = useState<string | null>(
    null
  );

  const resultsRef = useRef<HTMLDivElement>(null);
  const selectionRef = useRef<HTMLDivElement>(null);

  const handleSelectIntent = (intent: "EAT" | "GO" | "NOW" | "STAY") => {
    if (selectedIntent === intent) {
      // Toggle off if tapping same intent
      setSelectedIntent(null);
      setSelectedPreference(null);
    } else {
      setSelectedIntent(intent);
      setSelectedPreference(null);
    }
  };

  const handleSelectPreference = (preferenceId: string) => {
    setSelectedPreference(preferenceId);
  };

  const handleResetPreference = () => {
    setSelectedPreference(null);
  };

  // Orient the user after the new state has mounted, including reset and Home.
  useEffect(() => {
    const target = selectedPreference ? resultsRef.current : selectionRef.current;
    const top = selectedIntent && target
      ? Math.max(0, target.getBoundingClientRect().top + window.scrollY - 20)
      : 0;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top, behavior: reduceMotion ? "auto" : "smooth" });
  }, [selectedIntent, selectedPreference]);

  // Derived results
  const currentPlaces =
    (selectedIntent === "GO" || selectedIntent === "STAY") && selectedPreference
      ? getPlacesForSelection(selectedIntent, selectedPreference).map(demoToCard)
      : [];

  const currentItinerary =
    selectedIntent === "NOW" && selectedPreference
      ? getItineraryForPreference(selectedPreference)
      : null;

  const currentIntentLabel =
    selectedIntent
      ? PRIMARY_INTENTS.find((i) => i.id === selectedIntent)?.label
      : undefined;

  const currentPreferenceLabel =
    selectedIntent && selectedPreference
      ? PREFERENCES_BY_INTENT[selectedIntent]?.find(
          (c) => c.id === selectedPreference
        )?.label
      : undefined;

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col justify-between">
      {/* Centered Mobile-First & Desktop-Balanced Container */}
      <main className="w-full max-w-lg md:max-w-4xl mx-auto px-4 sm:px-6 py-5 sm:py-8 flex-1">
        {/* Hero Section */}
        {selectedIntent === null && <Hero />}

        {/* 4 Primary Intents Grid & Expanding Preference Panels */}
        {selectedPreference === null && <div ref={selectionRef} className="mt-2">
          <IntentGrid
            selectedIntent={selectedIntent}
            selectedPreference={selectedPreference}
            onSelectIntent={handleSelectIntent}
            onSelectPreference={handleSelectPreference}
          />
        </div>}

        {/* Results Anchor */}
        <div ref={resultsRef}>
          {/* Result Branch 1: Normal Places Discovery (EAT / GO / STAY) */}
          {selectedIntent === "EAT" && selectedPreference && <EatDiscoveryResults key={selectedPreference} preference={selectedPreference} preferenceLabel={currentPreferenceLabel} onResetPreference={handleResetPreference} />}
          {(selectedIntent === "GO" || selectedIntent === "STAY") &&
            selectedPreference && (
              <ResultList
                places={currentPlaces}
                intentLabel={currentIntentLabel}
                preferenceLabel={currentPreferenceLabel}
                onResetPreference={handleResetPreference}
              />
            )}

          {/* Result Branch 2: Mini Itinerary (NOW) */}
          {selectedIntent === "NOW" && selectedPreference && currentItinerary && (
            <ItineraryTimeline
              itinerary={currentItinerary}
              preferenceLabel={currentPreferenceLabel}
              onResetPreference={handleResetPreference}
            />
          )}
        </div>
      </main>

      {/* Brand Footer */}
      <footer className="w-full border-t border-slate-200/80 bg-white py-6 px-4 text-center mt-8">
        <p className="text-xs font-semibold text-slate-700">
          LA CÀ ĐÀ NẴNG
        </p>
      </footer>
    </div>
  );
}
