"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import {
  trackResultsShown,
  trackNearbyRequested,
  trackNearbyResolved,
  trackNearbyFailed,
  trackCitywideSelected,
} from "@/lib/analytics/client";
import { requestLocation as requestUserLocation } from "@/lib/geo/request-location";
import { discoverySectionFor } from "@/lib/data/preference-map";
import type { DiscoveryApiBody } from "@/lib/data/discovery-contract";
import { discoveryToCard, type PlaceCardModel } from "@/lib/data/place-card-model";
import { ResultList, type GeolocationUiState } from "./ResultList";

type State = { status: "idle" | "loading" | "success" | "empty" | "error"; places: PlaceCardModel[] };

/** Parent keys by intent + preference so a new selection never renders old cards. */
export function DiscoveryResults({ intent, intentLabel, preference, preferenceLabel, onResetPreference }: {
  intent: "EAT" | "GO" | "STAY";
  intentLabel?: string;
  preference: string;
  preferenceLabel?: string;
  onResetPreference: () => void;
}) {
  const { locale, isManual, t } = useLocale();
  const languageMode = isManual ? "manual" : "auto";
  const [state, setState] = useState<State>({ status: "idle", places: [] });
  const [attempt, setAttempt] = useState(0);

  // Geolocation State Machine: idle | requesting | granted | denied | unavailable | timeout | inaccurate
  const [nearbyStatus, setNearbyStatus] = useState<GeolocationUiState>("idle");
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [radiusKm, setRadiusKm] = useState<1 | 3 | 5 | undefined>(undefined);

  const [generalNearby, setGeneralNearby] = useState(false);
  const effectivePreference = generalNearby && !(intent === "GO" && preference === "cafe") ? null : preference;
  const analyticsPreference = effectivePreference ?? "general";

  // Tracks the last rendered result state to suppress duplicate results_shown on locale-only refetches
  const lastResultsStateRef = useRef<string | null>(null);

  const cancelGps = useRef<() => void>(() => {});
  useEffect(() => () => cancelGps.current(), []);
  const requestLocation = useCallback(() => {
    cancelGps.current();
    trackNearbyRequested(intent, preference, locale, languageMode);
    setNearbyStatus("requesting");
    cancelGps.current = requestUserLocation(point => {
      setNearbyStatus("granted");
      setUserCoords({ lat: point.latitude, lng: point.longitude });
    }, reason => {
      setNearbyStatus(reason); setUserCoords(null);
      trackNearbyFailed(intent, preference, reason, locale, languageMode);
    });
  }, [intent, preference, locale, languageMode]);

  const handleToggleNearby = () => {
    setGeneralNearby(false);
    if (nearbyStatus === "granted") {
      // Toggle off back to citywide discovery
      trackCitywideSelected(intent, preference, locale, languageMode);
      setNearbyStatus("idle");
      setUserCoords(null);
      setRadiusKm(undefined);
      return;
    }
    requestLocation();
  };

  const handleRetryNearby = () => {
    requestLocation();
  };

  const handleResetNearby = () => {
    setGeneralNearby(false);
    // Empty state CTA: "Xem trên toàn Đà Nẵng"
    trackCitywideSelected(intent, preference, locale, languageMode);
    setNearbyStatus("idle");
    setUserCoords(null);
    setRadiusKm(undefined);
  };

  const handleGeneralNearby = () => {
    if (!userCoords) return;
    setState({ status: "loading", places: [] });
    setGeneralNearby(true);
    setAttempt(value => value + 1);
  };

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    setState({ status: "loading", places: [] });
    const timeout = window.setTimeout(() => controller.abort(), 15000);

    const params = new URLSearchParams({ intent, locale });
    if (effectivePreference !== null) params.set("preference", effectivePreference);
    if (userCoords) {
      params.set("lat", userCoords.lat.toString());
      params.set("lng", userCoords.lng.toString());
    }

    async function load() {
      try {
        const response = await fetch(`/api/discovery?${params}`, { signal: controller.signal, cache: "no-store" });
        if (!response.ok) throw new Error("Discovery unavailable");
        const body: DiscoveryApiBody = await response.json();
        if (
          !body.ok || body.data.intent !== intent || body.data.locale !== locale ||
          body.data.preference !== effectivePreference || !Array.isArray(body.data.places) ||
          body.data.count !== body.data.places.length || body.data.count > 3 ||
          body.data.places.some((place) => place.section !== discoverySectionFor(intent, effectivePreference)) ||
          new Set(body.data.places.map((place) => place.id)).size !== body.data.count
        ) {
          throw new Error("Invalid discovery response");
        }
        if (active) {
          if (body.data.meta.radiusKm) {
            setRadiusKm(body.data.meta.radiusKm);
          } else {
            setRadiusKm(undefined);
          }
          const places = body.data.places.map(discoveryToCard);
          setState({ status: places.length ? "success" : "empty", places });

          // Analytics: Deduplicated results_shown
          const isNearby = Boolean(userCoords);
          const stateKey = `${intent}:${analyticsPreference}:${isNearby ? "nearby" : "citywide"}`;
          if (lastResultsStateRef.current !== stateKey) {
            lastResultsStateRef.current = stateKey;
            trackResultsShown(
              intent,
              analyticsPreference,
              places.length,
              isNearby,
              locale,
              languageMode,
              body.data.meta.radiusKm as (1 | 3 | 5 | undefined)
            );
          }

          if (isNearby && body.data.meta.radiusKm) {
            trackNearbyResolved(
              intent,
              analyticsPreference,
              places.length,
              body.data.meta.radiusKm as 1 | 3 | 5,
              locale,
              languageMode
            );
          }
        }
      } catch {
        // Never display raw server errors or substitute demo results.
        if (active) {
          lastResultsStateRef.current = null;
          setState({ status: "error", places: [] });
        }
      } finally {
        window.clearTimeout(timeout);
      }
    }
    void load();
    return () => { active = false; window.clearTimeout(timeout); controller.abort(); };
  }, [intent, effectivePreference, analyticsPreference, attempt, userCoords, locale, languageMode]);

  return (
    <ResultList
      {...state}
      intent={intent}
      preference={analyticsPreference}
      intentLabel={intentLabel}
      preferenceLabel={generalNearby && effectivePreference === null ? t("pref.general") : preferenceLabel}
      onResetPreference={onResetPreference}
      onRetry={() => { setState({ status: "loading", places: [] }); setAttempt((value) => value + 1); }}
      nearbyStatus={nearbyStatus}
      onToggleNearby={handleToggleNearby}
      onRetryNearby={handleRetryNearby}
      onResetNearby={handleResetNearby}
      onGeneralNearby={handleGeneralNearby}
      radiusKm={radiusKm}
    />
  );
}
