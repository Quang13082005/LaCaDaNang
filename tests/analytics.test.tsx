import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import {
  ANALYTICS_EVENT_NAMES,
  ANALYTICS_ENVIRONMENTS,
  ANALYTICS_LOCALES,
  ANALYTICS_LANGUAGE_MODES,
  ANALYTICS_INTENTS,
  ANALYTICS_FAILURE_REASONS,
  ANALYTICS_RADIUS_VALUES,
} from "@/lib/analytics/types";
import {
  validateClientAnalyticsPayload,
  FORBIDDEN_SERVER_KEYS,
  FORBIDDEN_GPS_KEYS,
} from "@/lib/analytics/validator";
import {
  getSessionId,
  getJourneyId,
  resetJourneyId,
  getMeaningfulTapCount,
  incrementMeaningfulTapCount,
  resetMeaningfulTapCount,
  resetAnalyticsClientForTests,
  trackSessionStarted,
  trackHomeViewed,
  trackIntentSelected,
  trackPreferenceSelected,
  trackResultsShown,
  trackNearbyRequested,
  trackNearbyResolved,
  trackNearbyFailed,
  trackCitywideSelected,
  trackMapsClicked,
  trackLanguageChanged,
  dispatchAnalyticsEvent,
} from "@/lib/analytics/client";
import { resolveServerEnvironment } from "@/lib/analytics/db";
import { POST, GET } from "@/app/api/analytics/route";
import { NextRequest } from "next/server";

describe("LA CÀ ĐÀ NẴNG — First-Party Analytics Suite", () => {
  const dummySession = "11111111-1111-4111-8111-111111111111";
  const dummyJourney = "22222222-2222-4222-8222-222222222222";

  beforeEach(() => {
    resetAnalyticsClientForTests();
    vi.restoreAllMocks();
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
    window.scrollTo = vi.fn();
  });

  afterEach(() => {
    resetAnalyticsClientForTests();
  });

  // ---------------------------------------------------------------------------
  // 1. EVENT VOCABULARY & CONTRACT (EXACTLY 11 EVENTS)
  // ---------------------------------------------------------------------------
  describe("1. Event Vocabulary", () => {
    it("defines exactly 11 allowed canonical events", () => {
      expect(ANALYTICS_EVENT_NAMES).toHaveLength(11);
      expect(ANALYTICS_EVENT_NAMES).toEqual([
        "session_started",
        "home_viewed",
        "intent_selected",
        "preference_selected",
        "results_shown",
        "nearby_requested",
        "nearby_resolved",
        "nearby_failed",
        "citywide_selected",
        "maps_clicked",
        "language_changed",
      ]);
    });

    it("defines supported environments, locales, language modes, intents, radius", () => {
      expect(ANALYTICS_ENVIRONMENTS).toEqual(["production", "preview"]);
      expect(ANALYTICS_LOCALES).toEqual(["vi", "en", "ko"]);
      expect(ANALYTICS_LANGUAGE_MODES).toEqual(["auto", "manual"]);
      expect(ANALYTICS_INTENTS).toEqual(["NOW", "EAT", "GO", "STAY"]);
      expect(ANALYTICS_RADIUS_VALUES).toEqual([1, 3, 5]);
      expect(ANALYTICS_FAILURE_REASONS).toEqual([
        "denied",
        "unavailable",
        "timeout",
        "inaccurate",
        "network_error",
        "no_results",
      ]);
    });
  });

  // ---------------------------------------------------------------------------
  // 2. STRICT SCHEMA VALIDATION & REJECTIONS
  // ---------------------------------------------------------------------------
  describe("2. Schema Validator", () => {
    it("rejects unknown arbitrary keys (strict mode)", () => {
      const res = validateClientAnalyticsPayload({
        event_name: "session_started",
        session_id: dummySession,
        journey_id: dummyJourney,
        locale: "vi",
        language_mode: "auto",
        unknown_extra_property: "bad_value",
      });
      expect(res.ok).toBe(false);
      if (!res.ok) {
        expect(res.error).toMatch(/unrecognized_keys|Validation error/i);
      }
    });

    it("rejects server-owned fields: id, occurred_at, environment", () => {
      for (const forbiddenKey of FORBIDDEN_SERVER_KEYS) {
        const payload = {
          event_name: "session_started",
          session_id: dummySession,
          journey_id: dummyJourney,
          locale: "vi",
          language_mode: "auto",
          [forbiddenKey]: "should_be_rejected",
        };
        const res = validateClientAnalyticsPayload(payload);
        expect(res.ok).toBe(false);
        if (!res.ok) {
          expect(res.error).toContain(`Server-owned field '${forbiddenKey}' is forbidden`);
        }
      }
    });

    it("rejects raw GPS keys and PII under privacy hard rule", () => {
      for (const gpsKey of FORBIDDEN_GPS_KEYS) {
        const payload = {
          event_name: "nearby_requested",
          session_id: dummySession,
          journey_id: dummyJourney,
          locale: "vi",
          language_mode: "auto",
          intent: "EAT",
          preference: "an_ngon",
          meaningful_tap_count: 1,
          [gpsKey]: 108.2022,
        };
        const res = validateClientAnalyticsPayload(payload);
        expect(res.ok).toBe(false);
        if (!res.ok) {
          expect(res.error).toContain("Privacy violation");
          expect(res.field).toBe(gpsKey);
        }
      }
    });

    it("rejects invalid event names", () => {
      const res = validateClientAnalyticsPayload({
        event_name: "invalid_event_custom",
        session_id: dummySession,
        journey_id: dummyJourney,
        locale: "vi",
        language_mode: "auto",
      });
      expect(res.ok).toBe(false);
      if (!res.ok) {
        expect(res.error).toContain("Invalid or missing event_name");
      }
    });

    it("rejects non-object or null payloads", () => {
      expect(validateClientAnalyticsPayload(null).ok).toBe(false);
      expect(validateClientAnalyticsPayload([]).ok).toBe(false);
      expect(validateClientAnalyticsPayload("string").ok).toBe(false);
      expect(validateClientAnalyticsPayload(123).ok).toBe(false);
    });
  });

  // ---------------------------------------------------------------------------
  // 3. EVENT-SPECIFIC VALIDATION CONTRACTS
  // ---------------------------------------------------------------------------
  describe("3. Event-Specific Validation", () => {
    it("validates session_started successfully", () => {
      const res = validateClientAnalyticsPayload({
        event_name: "session_started",
        session_id: dummySession,
        journey_id: dummyJourney,
        locale: "vi",
        language_mode: "auto",
        meaningful_tap_count: 0,
      });
      expect(res.ok).toBe(true);
    });

    it("validates home_viewed successfully", () => {
      const res = validateClientAnalyticsPayload({
        event_name: "home_viewed",
        session_id: dummySession,
        journey_id: dummyJourney,
        locale: "en",
        language_mode: "manual",
      });
      expect(res.ok).toBe(true);
    });

    it("validates intent_selected requires intent and meaningful_tap_count", () => {
      const valid = validateClientAnalyticsPayload({
        event_name: "intent_selected",
        session_id: dummySession,
        journey_id: dummyJourney,
        locale: "vi",
        language_mode: "manual",
        intent: "EAT",
        meaningful_tap_count: 1,
      });
      expect(valid.ok).toBe(true);

      const missingIntent = validateClientAnalyticsPayload({
        event_name: "intent_selected",
        session_id: dummySession,
        journey_id: dummyJourney,
        locale: "vi",
        language_mode: "manual",
        meaningful_tap_count: 1,
      });
      expect(missingIntent.ok).toBe(false);
    });

    it("validates preference_selected requires intent, preference, and meaningful_tap_count", () => {
      const valid = validateClientAnalyticsPayload({
        event_name: "preference_selected",
        session_id: dummySession,
        journey_id: dummyJourney,
        locale: "ko",
        language_mode: "manual",
        intent: "GO",
        preference: "song_ao",
        meaningful_tap_count: 2,
      });
      expect(valid.ok).toBe(true);

      const missingPref = validateClientAnalyticsPayload({
        event_name: "preference_selected",
        session_id: dummySession,
        journey_id: dummyJourney,
        locale: "ko",
        language_mode: "manual",
        intent: "GO",
        meaningful_tap_count: 2,
      });
      expect(missingPref.ok).toBe(false);
    });

    it("validates results_shown requires intent, preference, result_count (0..3), is_nearby", () => {
      const valid = validateClientAnalyticsPayload({
        event_name: "results_shown",
        session_id: dummySession,
        journey_id: dummyJourney,
        locale: "vi",
        language_mode: "auto",
        intent: "STAY",
        preference: "view_bien",
        result_count: 3,
        is_nearby: false,
        meaningful_tap_count: 2,
      });
      expect(valid.ok).toBe(true);

      const invalidCount = validateClientAnalyticsPayload({
        event_name: "results_shown",
        session_id: dummySession,
        journey_id: dummyJourney,
        locale: "vi",
        language_mode: "auto",
        intent: "STAY",
        preference: "view_bien",
        result_count: 10, // Max is 3
        is_nearby: false,
        meaningful_tap_count: 2,
      });
      expect(invalidCount.ok).toBe(false);
    });

    it("validates nearby_resolved requires result_count, radius_km (1|3|5), is_nearby: true", () => {
      const valid = validateClientAnalyticsPayload({
        event_name: "nearby_resolved",
        session_id: dummySession,
        journey_id: dummyJourney,
        locale: "vi",
        language_mode: "auto",
        intent: "EAT",
        preference: "an_ngon",
        result_count: 2,
        is_nearby: true,
        radius_km: 3,
      });
      expect(valid.ok).toBe(true);

      const invalidRadius = validateClientAnalyticsPayload({
        event_name: "nearby_resolved",
        session_id: dummySession,
        journey_id: dummyJourney,
        locale: "vi",
        language_mode: "auto",
        intent: "EAT",
        preference: "an_ngon",
        result_count: 2,
        is_nearby: true,
        radius_km: 15, // Invalid radius
      });
      expect(invalidRadius.ok).toBe(false);
    });

    it("validates nearby_failed requires failure_reason", () => {
      const valid = validateClientAnalyticsPayload({
        event_name: "nearby_failed",
        session_id: dummySession,
        journey_id: dummyJourney,
        locale: "vi",
        language_mode: "auto",
        intent: "EAT",
        preference: "an_ngon",
        failure_reason: "denied",
      });
      expect(valid.ok).toBe(true);

      const invalidReason = validateClientAnalyticsPayload({
        event_name: "nearby_failed",
        session_id: dummySession,
        journey_id: dummyJourney,
        locale: "vi",
        language_mode: "auto",
        intent: "EAT",
        preference: "an_ngon",
        failure_reason: "unknown_custom_reason",
      });
      expect(invalidReason.ok).toBe(false);
    });

    it("validates maps_clicked requires place_id > 0 and result_position (1..3)", () => {
      const valid = validateClientAnalyticsPayload({
        event_name: "maps_clicked",
        session_id: dummySession,
        journey_id: dummyJourney,
        locale: "vi",
        language_mode: "auto",
        intent: "EAT",
        preference: "dac_san",
        place_id: 101,
        result_position: 1,
        meaningful_tap_count: 2,
      });
      expect(valid.ok).toBe(true);

      const invalidPos = validateClientAnalyticsPayload({
        event_name: "maps_clicked",
        session_id: dummySession,
        journey_id: dummyJourney,
        locale: "vi",
        language_mode: "auto",
        intent: "EAT",
        preference: "dac_san",
        place_id: 101,
        result_position: 4, // > 3
        meaningful_tap_count: 2,
      });
      expect(invalidPos.ok).toBe(false);

      const invalidPlaceId = validateClientAnalyticsPayload({
        event_name: "maps_clicked",
        session_id: dummySession,
        journey_id: dummyJourney,
        locale: "vi",
        language_mode: "auto",
        intent: "EAT",
        preference: "dac_san",
        place_id: -5,
        result_position: 1,
        meaningful_tap_count: 2,
      });
      expect(invalidPlaceId.ok).toBe(false);
    });

    it("validates language_changed with optional intent/preference", () => {
      const valid = validateClientAnalyticsPayload({
        event_name: "language_changed",
        session_id: dummySession,
        journey_id: dummyJourney,
        locale: "ko",
        language_mode: "manual",
        intent: "EAT",
        preference: "an_ngon",
        meaningful_tap_count: 2,
      });
      expect(valid.ok).toBe(true);
    });
  });

  // ---------------------------------------------------------------------------
  // 4. CLIENT TELEMETRY STATE (SESSION, JOURNEY, TAP COUNTING)
  // ---------------------------------------------------------------------------
  describe("4. Client Session & Journey Stores", () => {
    it("maintains stable session UUID across multiple calls", () => {
      const id1 = getSessionId();
      const id2 = getSessionId();
      expect(id1).toBe(id2);
      expect(id1).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it("maintains stable journey UUID until explicit reset", () => {
      const j1 = getJourneyId();
      const j2 = getJourneyId();
      expect(j1).toBe(j2);

      const j3 = resetJourneyId();
      expect(j3).not.toBe(j1);
      expect(getJourneyId()).toBe(j3);
    });

    it("resets meaningful_tap_count to 0 upon journey reset", () => {
      incrementMeaningfulTapCount();
      incrementMeaningfulTapCount();
      expect(getMeaningfulTapCount()).toBe(2);

      resetJourneyId();
      expect(getMeaningfulTapCount()).toBe(0);
    });

    it("increments meaningful tap count strictly on meaningful actions", () => {
      resetMeaningfulTapCount();
      expect(getMeaningfulTapCount()).toBe(0);

      incrementMeaningfulTapCount(); // intent tap
      expect(getMeaningfulTapCount()).toBe(1);

      incrementMeaningfulTapCount(); // preference tap
      expect(getMeaningfulTapCount()).toBe(2);

      incrementMeaningfulTapCount(); // nearby toggle
      expect(getMeaningfulTapCount()).toBe(3);
    });
  });

  // ---------------------------------------------------------------------------
  // 5. CLIENT DISPATCHER BEHAVIOR & DEDUPLICATION
  // ---------------------------------------------------------------------------
  describe("5. Client Dispatcher & Deduplication", () => {
    it("is no-op in test/dev environment by default", () => {
      const fetchSpy = vi.spyOn(globalThis, "fetch");
      dispatchAnalyticsEvent({
        event_name: "session_started",
        session_id: dummySession,
        journey_id: dummyJourney,
        locale: "vi",
        language_mode: "auto",
      });
      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it("fires session_started exactly once per tab session", () => {
      // Enable synthetic force dispatch for testing event invocation
      (window as unknown as { __FORCE_ANALYTICS_DISPATCH__?: boolean }).__FORCE_ANALYTICS_DISPATCH__ = true;
      const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response());

      trackSessionStarted("vi", "auto");
      trackSessionStarted("vi", "auto"); // second call should be ignored
      trackSessionStarted("en", "manual"); // third call should be ignored

      expect(fetchSpy).toHaveBeenCalledTimes(1);
      const call = JSON.parse(fetchSpy.mock.calls[0][1]?.body as string);
      expect(call.event_name).toBe("session_started");

      delete (window as unknown as { __FORCE_ANALYTICS_DISPATCH__?: boolean }).__FORCE_ANALYTICS_DISPATCH__;
    });

    it("deduplicates home_viewed within the same journey", () => {
      (window as unknown as { __FORCE_ANALYTICS_DISPATCH__?: boolean }).__FORCE_ANALYTICS_DISPATCH__ = true;
      const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response());

      trackHomeViewed("vi", "auto");
      trackHomeViewed("vi", "auto"); // same journey: suppressed

      expect(fetchSpy).toHaveBeenCalledTimes(1);

      // Resetting journey allows one new home_viewed
      resetJourneyId();
      trackHomeViewed("vi", "auto");
      expect(fetchSpy).toHaveBeenCalledTimes(2);

      delete (window as unknown as { __FORCE_ANALYTICS_DISPATCH__?: boolean }).__FORCE_ANALYTICS_DISPATCH__;
    });

    it("debounces maps_clicked double clicks within 1 second", () => {
      (window as unknown as { __FORCE_ANALYTICS_DISPATCH__?: boolean }).__FORCE_ANALYTICS_DISPATCH__ = true;
      const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response());

      trackMapsClicked(10, 1, "EAT", "an_ngon", "vi", "auto");
      trackMapsClicked(10, 1, "EAT", "an_ngon", "vi", "auto"); // rapid double click

      expect(fetchSpy).toHaveBeenCalledTimes(1);

      delete (window as unknown as { __FORCE_ANALYTICS_DISPATCH__?: boolean }).__FORCE_ANALYTICS_DISPATCH__;
    });

    it("does not emit results_shown for NOW static itinerary", () => {
      (window as unknown as { __FORCE_ANALYTICS_DISPATCH__?: boolean }).__FORCE_ANALYTICS_DISPATCH__ = true;
      const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response());

      trackResultsShown("NOW", "morning", 3, false, "vi", "auto");
      expect(fetchSpy).not.toHaveBeenCalled();

      delete (window as unknown as { __FORCE_ANALYTICS_DISPATCH__?: boolean }).__FORCE_ANALYTICS_DISPATCH__;
    });
  });

  // ---------------------------------------------------------------------------
  // 6. SERVER ENVIRONMENT RESOLUTION
  // ---------------------------------------------------------------------------
  describe("6. Server Environment Resolver", () => {
    const originalEnv = { ...process.env };

    afterEach(() => {
      process.env = { ...originalEnv };
    });

    it("resolves production when APP_ENV is production", () => {
      process.env.APP_ENV = "production";
      expect(resolveServerEnvironment()).toBe("production");
    });

    it("resolves preview when APP_ENV is preview", () => {
      process.env.APP_ENV = "preview";
      expect(resolveServerEnvironment()).toBe("preview");
    });

    it("resolves preview for test/dev fallbacks", () => {
      delete process.env.APP_ENV;
      delete process.env.VERCEL_ENV;
      delete process.env.ENVIRONMENT;
      (process.env as Record<string, string | undefined>).NODE_ENV = "test";
      expect(resolveServerEnvironment()).toBe("preview");
    });
  });

  // ---------------------------------------------------------------------------
  // 7. POST /api/analytics ROUTE HANDLER
  // ---------------------------------------------------------------------------
  describe("7. POST /api/analytics Route", () => {
    it("returns 405 for GET requests", async () => {
      const res = await GET();
      expect(res.status).toBe(405);
    });

    it("returns 413 when payload exceeds 2 KB", async () => {
      const largeString = "a".repeat(2500);
      const req = new NextRequest("http://localhost:3000/api/analytics", {
        method: "POST",
        body: JSON.stringify({ large: largeString }),
      });
      const res = await POST(req);
      expect(res.status).toBe(413);
      const data = await res.json();
      expect(data.error).toContain("2 KB");
    });

    it("returns 400 for malformed JSON", async () => {
      const req = new NextRequest("http://localhost:3000/api/analytics", {
        method: "POST",
        body: "{ this is not valid json :",
      });
      const res = await POST(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toContain("Malformed JSON");
    });

    it("returns 400 when client sends server-owned or forbidden fields", async () => {
      const req = new NextRequest("http://localhost:3000/api/analytics", {
        method: "POST",
        body: JSON.stringify({
          event_name: "session_started",
          session_id: dummySession,
          journey_id: dummyJourney,
          locale: "vi",
          language_mode: "auto",
          environment: "production", // Forbidden server field
        }),
      });
      const res = await POST(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toContain("Server-owned field 'environment' is forbidden");
    });

    it("returns 400 when client sends raw GPS coordinates", async () => {
      const req = new NextRequest("http://localhost:3000/api/analytics", {
        method: "POST",
        body: JSON.stringify({
          event_name: "nearby_requested",
          session_id: dummySession,
          journey_id: dummyJourney,
          locale: "vi",
          language_mode: "auto",
          intent: "EAT",
          preference: "an_ngon",
          meaningful_tap_count: 1,
          latitude: 16.0544, // Privacy violation
        }),
      });
      const res = await POST(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toContain("Privacy violation");
    });
  });

  // ---------------------------------------------------------------------------
  // 8. REACT UI INTEGRATION & FLOW VERIFICATION
  // ---------------------------------------------------------------------------
  describe("8. React UI Analytics Flow", () => {
    let dispatchedEvents: any[] = [];

    beforeEach(() => {
      dispatchedEvents = [];
      Object.defineProperty(navigator, "languages", {
        value: ["vi-VN"],
        configurable: true,
      });
      Object.defineProperty(navigator, "language", {
        value: "vi-VN",
        configurable: true,
      });
      document.documentElement.lang = "vi";
      (window as unknown as { __FORCE_ANALYTICS_DISPATCH__?: boolean }).__FORCE_ANALYTICS_DISPATCH__ = true;
      vi.spyOn(globalThis, "fetch").mockImplementation(async (url: any, init?: any) => {
        if (typeof url === "string" && url.includes("/api/analytics")) {
          if (init?.body) {
            dispatchedEvents.push(JSON.parse(init.body));
          }
          return new Response(JSON.stringify({ ok: true }), { status: 202 });
        }
        // Discovery API mock response
        if (typeof url === "string" && url.includes("/api/discovery")) {
          const parsedUrl = new URL(url, "http://localhost:3000");
          const requestedLocale = parsedUrl.searchParams.get("locale") || "vi";
          const requestedIntent = parsedUrl.searchParams.get("intent") || "EAT";
          const requestedPref = parsedUrl.searchParams.get("preference") || "an_ngon";
          return new Response(
            JSON.stringify({
              ok: true,
              data: {
                intent: requestedIntent,
                locale: requestedLocale,
                preference: requestedPref,
                count: 1,
                places: [
                  {
                    id: 101,
                    googlePlaceId: "fixture-101",
                    section: requestedIntent,
                    name: "Quán Ăn Ngon Đà Nẵng",
                    typeLabel: "Nhà hàng",
                    primaryType: "restaurant",
                    address: "123 Trần Phú, Hải Châu",
                    area: { id: 1, name: "Hải Châu 1", unitType: "ward" },
                    location: { lat: 16.06, lng: 108.22 },
                    googleMapsUrl: "https://maps.google.com/?cid=101",
                    rating: 4.5,
                    reviewCount: 120,
                    tags: [{ code: "SPECIALTY", label: "Đặc sản", domain: "EAT" }],
                    description: null,
                    translationFallback: false,
                  },
                ],
                meta: { source: "neon-postgres", limit: 3, ranking: "curated-rank-v1" },
              },
            }),
            { status: 200 }
          );
        }
        return new Response();
      });
    });

    afterEach(() => {
      delete (window as unknown as { __FORCE_ANALYTICS_DISPATCH__?: boolean }).__FORCE_ANALYTICS_DISPATCH__;
    });

    it("verifies intent -> preference -> results -> maps -> language flow", async () => {
      const { render, screen, fireEvent, waitFor } = await import("@testing-library/react");
      const { default: HomePage } = await import("@/app/page");
      const { LocaleProvider } = await import("@/components/i18n/LocaleProvider");

      render(
        <LocaleProvider>
          <HomePage />
        </LocaleProvider>
      );

      // 1. Initial Home mount should fire home_viewed
      expect(dispatchedEvents.some((e) => e.event_name === "home_viewed")).toBe(true);

      // 2. Select intent EAT
      const eatButton = screen.getByText("ĂN GÌ?");
      fireEvent.click(eatButton);

      expect(
        dispatchedEvents.some((e) => e.event_name === "intent_selected" && e.intent === "EAT")
      ).toBe(true);

      // 3. Select preference "Ăn ngon"
      const prefButton = screen.getByRole("button", { name: "Ăn ngon" });
      fireEvent.click(prefButton);

      expect(
        dispatchedEvents.some(
          (e) => e.event_name === "preference_selected" && e.preference === "an_ngon"
        )
      ).toBe(true);

      // 4. Wait for results to be shown
      await waitFor(() => {
        expect(screen.getByText("Quán Ăn Ngon Đà Nẵng")).toBeInTheDocument();
      });

      expect(
        dispatchedEvents.some(
          (e) =>
            e.event_name === "results_shown" &&
            e.intent === "EAT" &&
            e.preference === "an_ngon" &&
            e.result_count === 1
        )
      ).toBe(true);

      const resultsShownCountBefore = dispatchedEvents.filter(
        (e) => e.event_name === "results_shown"
      ).length;

      // 5. Click Google Maps link
      const mapsLink = screen.getByRole("link", { name: /Google Maps/i });
      fireEvent.click(mapsLink);

      expect(
        dispatchedEvents.some(
          (e) =>
            e.event_name === "maps_clicked" &&
            e.place_id === 101 &&
            e.result_position === 1 &&
            e.intent === "EAT"
        )
      ).toBe(true);

      // 6. Switch language via footer control
      const languageControl = screen.getByRole("button", { name: /Ngôn ngữ/i });
      fireEvent.click(languageControl);
      const enRadio = screen.getByRole("radio", { name: /English/i });
      fireEvent.click(enRadio);

      // Should emit language_changed
      expect(
        dispatchedEvents.some(
          (e) => e.event_name === "language_changed" && e.locale === "en"
        )
      ).toBe(true);

      // Language switch must NOT double-fire results_shown
      const resultsShownCountAfter = dispatchedEvents.filter(
        (e) => e.event_name === "results_shown"
      ).length;
      expect(resultsShownCountAfter).toBe(resultsShownCountBefore);
    });
  });
});

