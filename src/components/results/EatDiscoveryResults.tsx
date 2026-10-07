"use client";

import { useEffect, useState } from "react";
import type { DiscoveryApiBody } from "@/lib/data/discovery-contract";
import { discoveryToCard, type PlaceCardModel } from "@/lib/data/place-card-model";
import { ResultList } from "./ResultList";

type State = { status: "idle" | "loading" | "success" | "empty" | "error"; places: PlaceCardModel[] };

/** Parent keys by preference so a new selection never renders old cards. */
export function EatDiscoveryResults({ preference, preferenceLabel, onResetPreference }: {
  preference: string;
  preferenceLabel?: string;
  onResetPreference: () => void;
}) {
  const [state, setState] = useState<State>({ status: "idle", places: [] });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    setState({ status: "loading", places: [] });
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    const params = new URLSearchParams({ intent: "EAT", locale: "vi", preference });
    async function load() {
      try {
        const response = await fetch(`/api/discovery?${params}`, { signal: controller.signal, cache: "no-store" });
        if (!response.ok) throw new Error("Discovery unavailable");
        const body: DiscoveryApiBody = await response.json();
        if (
          !body.ok || body.data.intent !== "EAT" || body.data.locale !== "vi" ||
          body.data.preference !== preference || !Array.isArray(body.data.places) ||
          body.data.count !== body.data.places.length || body.data.count > 3 ||
          body.data.places.some((place) => place.section !== "EAT") ||
          new Set(body.data.places.map((place) => place.id)).size !== body.data.count
        ) {
          throw new Error("Invalid discovery response");
        }
        const places = body.data.places.map(discoveryToCard);
        if (active) setState({ status: places.length ? "success" : "empty", places });
      } catch {
        // Never display raw server errors or substitute demo results.
        if (active) setState({ status: "error", places: [] });
      } finally {
        window.clearTimeout(timeout);
      }
    }
    void load();
    return () => { active = false; window.clearTimeout(timeout); controller.abort(); };
  }, [preference, attempt]);

  return <ResultList {...state} intentLabel="ĂN GÌ?" preferenceLabel={preferenceLabel} onResetPreference={onResetPreference} onRetry={() => { setState({ status: "loading", places: [] }); setAttempt((value) => value + 1); }} />;
}
