"use client";
import { useState } from "react";
import { ResultList } from "@/components/results/ResultList";
import { LanguageSelector } from "@/components/i18n/LanguageSelector";
/** Explicit empty-state visual fixture; no fake places, location, API or telemetry. */
export function NearbyRecoveryPreview() {
 const [action, setAction] = useState("none");
 return <main className="max-w-lg mx-auto p-4 pb-40">
  <p>DEV VISUAL FIXTURE — empty response, no GPS. Last action: {action}</p>
  <LanguageSelector />
  <ResultList places={[]} status="empty" nearbyStatus="granted" radiusKm={5}
   onResetPreference={() => setAction("reset")}
   onResetNearby={() => setAction("citywide")}
   onGeneralNearby={() => setAction("general nearby")} />
 </main>;
}

