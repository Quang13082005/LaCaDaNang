/**
 * LA CÀ ĐÀ NẴNG — Client Analytics Dispatcher & Session / Journey State
 *
 * Requirements:
 * - Non-blocking, best-effort dispatch via navigator.sendBeacon or fetch(..., { keepalive: true }).
 * - In development / test: no-op dispatcher (zero network requests unless test override set).
 * - Ephemeral tab lifetime session in sessionStorage ("laca.analytics-session.v1").
 * - Ephemeral journey in sessionStorage ("laca.analytics-journey.v1").
 * - Resets journey and meaningful_tap_count upon "Đổi lựa chọn" or returning to Home.
 * - Meaningful tap count increments strictly on:
 *     intent tap (+1), preference tap (+1), nearby/citywide toggle (+1).
 */

import type {
  AnalyticsFailureReason,
  AnalyticsIntent,
  AnalyticsLanguageMode,
  AnalyticsLocale,
  AnalyticsRadiusValue,
  ClientAnalyticsPayload,
} from "./types";

const SESSION_KEY = "laca.analytics-session.v1";
const JOURNEY_KEY = "laca.analytics-journey.v1";

let memorySessionId: string | null = null;
let memoryJourneyId: string | null = null;
let memoryTapCount = 0;
let sessionStartedFired = false;
let lastHomeViewedJourneyId: string | null = null;
let lastMapsClickTimestamp = 0;

function generateUuid(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  // Fallback RFC4122 v4 generator
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/** Get or initialize the ephemeral session ID (one tab lifetime) */
export function getSessionId(): string {
  if (typeof window === "undefined") {
    if (!memorySessionId) memorySessionId = generateUuid();
    return memorySessionId;
  }

  try {
    const stored = window.sessionStorage.getItem(SESSION_KEY);
    if (stored && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(stored)) {
      return stored;
    }
    const newId = generateUuid();
    window.sessionStorage.setItem(SESSION_KEY, newId);
    return newId;
  } catch {
    if (!memorySessionId) memorySessionId = generateUuid();
    return memorySessionId;
  }
}

/** Get current active journey ID (or create one) */
export function getJourneyId(): string {
  if (typeof window === "undefined") {
    if (!memoryJourneyId) memoryJourneyId = generateUuid();
    return memoryJourneyId;
  }

  try {
    const stored = window.sessionStorage.getItem(JOURNEY_KEY);
    if (stored && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(stored)) {
      return stored;
    }
    const newId = generateUuid();
    window.sessionStorage.setItem(JOURNEY_KEY, newId);
    return newId;
  } catch {
    if (!memoryJourneyId) memoryJourneyId = generateUuid();
    return memoryJourneyId;
  }
}

/** Reset to a new journey ID and reset meaningful tap counter to 0 */
export function resetJourneyId(): string {
  const newId = generateUuid();
  memoryJourneyId = newId;
  memoryTapCount = 0;
  if (typeof window !== "undefined") {
    try {
      window.sessionStorage.setItem(JOURNEY_KEY, newId);
    } catch {
      // storage unavailable
    }
  }
  return newId;
}

/** Get current meaningful tap count for active journey */
export function getMeaningfulTapCount(): number {
  return memoryTapCount;
}

/** Increment meaningful tap count by 1 */
export function incrementMeaningfulTapCount(): number {
  memoryTapCount += 1;
  return memoryTapCount;
}

/** Reset meaningful tap counter to 0 */
export function resetMeaningfulTapCount(): void {
  memoryTapCount = 0;
}

/** Check if client should dispatch telemetry */
function isDispatchEnabled(): boolean {
  // Test override flag for synthetic verification
  if (
    typeof window !== "undefined" &&
    (window as unknown as { __FORCE_ANALYTICS_DISPATCH__?: boolean }).__FORCE_ANALYTICS_DISPATCH__
  ) {
    return true;
  }

  // Development and test environments default to no-op
  if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
    return false;
  }

  return true;
}

/**
 * Dispatches an analytics event to /api/analytics in a non-blocking fashion.
 * Errors are caught and discarded to protect the core user experience.
 */
export function dispatchAnalyticsEvent(payload: ClientAnalyticsPayload): void {
  if (!isDispatchEnabled()) {
    return;
  }

  const jsonString = JSON.stringify(payload);
  const endpoint = "/api/analytics";

  try {
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const blob = new Blob([jsonString], { type: "application/json" });
      const sent = navigator.sendBeacon(endpoint, blob);
      if (sent) return;
    }

    if (typeof fetch === "function") {
      void fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: jsonString,
        keepalive: true,
      }).catch(() => {
        // Silently discard dispatch failures
      });
    }
  } catch {
    // Silently ignore synchronous dispatch exceptions
  }
}

// -----------------------------------------------------------------------------
// High-Level Helper Functions for Product Components
// -----------------------------------------------------------------------------

/** Fire session_started once per tab session */
export function trackSessionStarted(locale: AnalyticsLocale, languageMode: AnalyticsLanguageMode): void {
  if (sessionStartedFired) return;
  sessionStartedFired = true;

  dispatchAnalyticsEvent({
    event_name: "session_started",
    session_id: getSessionId(),
    journey_id: getJourneyId(),
    locale,
    language_mode: languageMode,
    meaningful_tap_count: memoryTapCount,
  });
}

/** Fire home_viewed when user reaches Home (deduped per journey) */
export function trackHomeViewed(locale: AnalyticsLocale, languageMode: AnalyticsLanguageMode): void {
  const currentJourney = getJourneyId();
  if (lastHomeViewedJourneyId === currentJourney) return;
  lastHomeViewedJourneyId = currentJourney;

  dispatchAnalyticsEvent({
    event_name: "home_viewed",
    session_id: getSessionId(),
    journey_id: currentJourney,
    locale,
    language_mode: languageMode,
    meaningful_tap_count: memoryTapCount,
  });
}

/** Fire intent_selected (+1 meaningful tap) */
export function trackIntentSelected(
  intent: AnalyticsIntent,
  locale: AnalyticsLocale,
  languageMode: AnalyticsLanguageMode
): void {
  const taps = incrementMeaningfulTapCount();
  dispatchAnalyticsEvent({
    event_name: "intent_selected",
    session_id: getSessionId(),
    journey_id: getJourneyId(),
    locale,
    language_mode: languageMode,
    intent,
    meaningful_tap_count: taps,
  });
}

/** Fire preference_selected (+1 meaningful tap) */
export function trackPreferenceSelected(
  intent: AnalyticsIntent,
  preference: string,
  locale: AnalyticsLocale,
  languageMode: AnalyticsLanguageMode
): void {
  const taps = incrementMeaningfulTapCount();
  dispatchAnalyticsEvent({
    event_name: "preference_selected",
    session_id: getSessionId(),
    journey_id: getJourneyId(),
    locale,
    language_mode: languageMode,
    intent,
    preference,
    meaningful_tap_count: taps,
  });
}

/** Fire results_shown for successful places rendering (NOW is excluded) */
export function trackResultsShown(
  intent: AnalyticsIntent,
  preference: string,
  resultCount: number,
  isNearby: boolean,
  locale: AnalyticsLocale,
  languageMode: AnalyticsLanguageMode,
  radiusKm?: AnalyticsRadiusValue
): void {
  // NOW static itinerary is strictly excluded from places discovery conversion funnel
  if (intent === "NOW") return;

  dispatchAnalyticsEvent({
    event_name: "results_shown",
    session_id: getSessionId(),
    journey_id: getJourneyId(),
    locale,
    language_mode: languageMode,
    intent,
    preference,
    result_count: resultCount,
    is_nearby: isNearby,
    radius_km: radiusKm,
    meaningful_tap_count: memoryTapCount,
  });
}

/** Fire nearby_requested (+1 meaningful tap) */
export function trackNearbyRequested(
  intent: AnalyticsIntent,
  preference: string,
  locale: AnalyticsLocale,
  languageMode: AnalyticsLanguageMode
): void {
  const taps = incrementMeaningfulTapCount();
  dispatchAnalyticsEvent({
    event_name: "nearby_requested",
    session_id: getSessionId(),
    journey_id: getJourneyId(),
    locale,
    language_mode: languageMode,
    intent,
    preference,
    meaningful_tap_count: taps,
  });
}

/** Fire nearby_resolved upon successful GPS resolution */
export function trackNearbyResolved(
  intent: AnalyticsIntent,
  preference: string,
  resultCount: number,
  radiusKm: AnalyticsRadiusValue,
  locale: AnalyticsLocale,
  languageMode: AnalyticsLanguageMode
): void {
  dispatchAnalyticsEvent({
    event_name: "nearby_resolved",
    session_id: getSessionId(),
    journey_id: getJourneyId(),
    locale,
    language_mode: languageMode,
    intent,
    preference,
    result_count: resultCount,
    is_nearby: true,
    radius_km: radiusKm,
    meaningful_tap_count: memoryTapCount,
  });
}

/** Fire nearby_failed upon GPS or network failure */
export function trackNearbyFailed(
  intent: AnalyticsIntent,
  preference: string,
  failureReason: AnalyticsFailureReason,
  locale: AnalyticsLocale,
  languageMode: AnalyticsLanguageMode
): void {
  dispatchAnalyticsEvent({
    event_name: "nearby_failed",
    session_id: getSessionId(),
    journey_id: getJourneyId(),
    locale,
    language_mode: languageMode,
    intent,
    preference,
    failure_reason: failureReason,
    meaningful_tap_count: memoryTapCount,
  });
}

/** Fire citywide_selected when user explicitly switches back from nearby to all-city */
export function trackCitywideSelected(
  intent: AnalyticsIntent,
  preference: string,
  locale: AnalyticsLocale,
  languageMode: AnalyticsLanguageMode
): void {
  const taps = incrementMeaningfulTapCount();
  dispatchAnalyticsEvent({
    event_name: "citywide_selected",
    session_id: getSessionId(),
    journey_id: getJourneyId(),
    locale,
    language_mode: languageMode,
    intent,
    preference,
    meaningful_tap_count: taps,
  });
}

/** Fire maps_clicked when user clicks Google Maps link (debounced 1s) */
export function trackMapsClicked(
  placeId: number,
  resultPosition: 1 | 2 | 3,
  intent: AnalyticsIntent,
  preference: string,
  locale: AnalyticsLocale,
  languageMode: AnalyticsLanguageMode,
  isNearby?: boolean,
  radiusKm?: AnalyticsRadiusValue
): void {
  const now = Date.now();
  if (now - lastMapsClickTimestamp < 1000) {
    return; // Debounce accidental double clicks
  }
  lastMapsClickTimestamp = now;

  dispatchAnalyticsEvent({
    event_name: "maps_clicked",
    session_id: getSessionId(),
    journey_id: getJourneyId(),
    locale,
    language_mode: languageMode,
    intent,
    preference,
    place_id: placeId,
    result_position: resultPosition,
    is_nearby: isNearby,
    radius_km: radiusKm,
    meaningful_tap_count: memoryTapCount,
  });
}

/** Fire language_changed when user explicitly changes language */
export function trackLanguageChanged(
  newLocale: AnalyticsLocale,
  languageMode: AnalyticsLanguageMode,
  intent?: AnalyticsIntent,
  preference?: string
): void {
  dispatchAnalyticsEvent({
    event_name: "language_changed",
    session_id: getSessionId(),
    journey_id: getJourneyId(),
    locale: newLocale,
    language_mode: languageMode,
    intent,
    preference,
    meaningful_tap_count: memoryTapCount,
  });
}

/** Reset test state (for unit testing) */
export function resetAnalyticsClientForTests(): void {
  memorySessionId = null;
  memoryJourneyId = null;
  memoryTapCount = 0;
  sessionStartedFired = false;
  lastHomeViewedJourneyId = null;
  lastMapsClickTimestamp = 0;
  if (typeof window !== "undefined") {
    try {
      window.sessionStorage.removeItem(SESSION_KEY);
      window.sessionStorage.removeItem(JOURNEY_KEY);
    } catch {
      // ignore
    }
  }
}
