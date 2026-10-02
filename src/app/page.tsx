"use client";

import React, { useState, useRef, useEffect } from "react";
import { Hero } from "@/components/home/Hero";
import { IntentGrid } from "@/components/home/IntentGrid";
import { ResultList } from "@/components/results/ResultList";
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
    // P1.3: Smoothly return to the active preference panel without losing orientation or jumping to top
    setTimeout(() => {
      const panel = document.getElementById("preference-panel-active") || document.getElementById("preference-panel-active-desktop");
      if (panel) {
        const yOffset = -24;
        const y = panel.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
      }
    }, 50);
  };

  // Smooth scroll to results on preference selection for mobile comfort
  useEffect(() => {
    if (selectedPreference && resultsRef.current) {
      const yOffset = -20;
      const element = resultsRef.current;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, [selectedPreference]);

  // Derived results
  const currentPlaces =
    selectedIntent && selectedIntent !== "NOW" && selectedPreference
      ? getPlacesForSelection(selectedIntent, selectedPreference)
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
        <Hero />

        {/* 4 Primary Intents Grid & Expanding Preference Panels */}
        <div className="mt-2">
          <IntentGrid
            selectedIntent={selectedIntent}
            selectedPreference={selectedPreference}
            onSelectIntent={handleSelectIntent}
            onSelectPreference={handleSelectPreference}
          />
        </div>

        {/* Results Anchor */}
        <div ref={resultsRef}>
          {/* Result Branch 1: Normal Places Discovery (EAT / GO / STAY) */}
          {selectedIntent &&
            selectedIntent !== "NOW" &&
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
        <p className="text-[11px] text-slate-400 mt-1">
          Khám phá ẩm thực, điểm đến và lịch trình Đà Nẵng
        </p>
      </footer>
    </div>
  );
}
