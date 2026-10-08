"use client";

import { useEffect, useState, useCallback } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
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
  const { locale } = useLocale();
  const [state, setState] = useState<State>({ status: "idle", places: [] });
  const [attempt, setAttempt] = useState(0);


  // Geolocation State Machine: idle | requesting | granted | denied | unavailable | timeout | inaccurate
  const [nearbyStatus, setNearbyStatus] = useState<GeolocationUiState>("idle");
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [radiusKm, setRadiusKm] = useState<1 | 3 | 5 | undefined>(undefined);

  const requestLocation = useCallback(() => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setNearbyStatus("unavailable");
      setUserCoords(null);
      return;
    }

    setNearbyStatus("requesting");

    let isTimedOut = false;
    const gpsTimer = window.setTimeout(() => {
      isTimedOut = true;
      setNearbyStatus("timeout");
      setUserCoords(null);
    }, 8000);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (isTimedOut) return;
        window.clearTimeout(gpsTimer);
        const { latitude, longitude, accuracy } = pos.coords;
        // Decision 4: Accuracy check threshold 1000m
        if (accuracy > 1000) {
          setNearbyStatus("inaccurate");
          setUserCoords(null);
        } else {
          setNearbyStatus("granted");
          setUserCoords({ lat: latitude, lng: longitude });
        }
      },
      (err) => {
        if (isTimedOut) return;
        window.clearTimeout(gpsTimer);
        if (err.code === err.PERMISSION_DENIED) {
          setNearbyStatus("denied");
        } else if (err.code === err.TIMEOUT) {
          setNearbyStatus("timeout");
        } else {
          setNearbyStatus("unavailable");
        }
        setUserCoords(null);
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 60000,
      }
    );
  }, []);

  const handleToggleNearby = () => {
    if (nearbyStatus === "granted") {
      // Toggle off back to citywide discovery
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
    // Empty state CTA: "Xem trên toàn Đà Nẵng"
    setNearbyStatus("idle");
    setUserCoords(null);
    setRadiusKm(undefined);
  };

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    setState({ status: "loading", places: [] });
    const timeout = window.setTimeout(() => controller.abort(), 15000);

    const params = new URLSearchParams({ intent, locale, preference });
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
          body.data.preference !== preference || !Array.isArray(body.data.places) ||
          body.data.count !== body.data.places.length || body.data.count > 3 ||
          body.data.places.some((place) => place.section !== intent) ||
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
        }
      } catch {
        // Never display raw server errors or substitute demo results.
        if (active) setState({ status: "error", places: [] });
      } finally {
        window.clearTimeout(timeout);
      }
    }
    void load();
    return () => { active = false; window.clearTimeout(timeout); controller.abort(); };
  }, [intent, preference, attempt, userCoords, locale]);

  return (
    <ResultList
      {...state}
      intentLabel={intentLabel}
      preferenceLabel={preferenceLabel}
      onResetPreference={onResetPreference}
      onRetry={() => { setState({ status: "loading", places: [] }); setAttempt((value) => value + 1); }}
      nearbyStatus={nearbyStatus}
      onToggleNearby={handleToggleNearby}
      onRetryNearby={handleRetryNearby}
      onResetNearby={handleResetNearby}
      radiusKm={radiusKm}
    />
  );
}
