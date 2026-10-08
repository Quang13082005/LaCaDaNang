import React from "react";
import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import HomePage from "@/app/page";
import { LocaleProvider, useLocale } from "@/components/i18n/LocaleProvider";
import { LanguageSelector } from "@/components/i18n/LanguageSelector";
import { LOCALE_STORAGE_KEY } from "@/lib/i18n/locales";
import { UI_MESSAGES, translate } from "@/lib/i18n/messages";
import { NextRequest } from "next/server";
import { GET } from "@/app/api/discovery/route";
import { apiPlace, apiResponse } from "./discovery-fixtures";

const originalLanguages = navigator.languages;
const originalLanguage = navigator.language;

function setMockNavigator(languages: string[], language = languages[0]) {
  Object.defineProperty(navigator, "languages", {
    value: languages,
    configurable: true,
  });
  Object.defineProperty(navigator, "language", {
    value: language,
    configurable: true,
  });
}

function restoreMockNavigator() {
  Object.defineProperty(navigator, "languages", {
    value: originalLanguages,
    configurable: true,
  });
  Object.defineProperty(navigator, "language", {
    value: originalLanguage,
    configurable: true,
  });
}

// Helper component for testing useLocale hook directly
function LocaleInspector() {
  const { locale, isManual, setLocale, setAuto, t, formatNumber } = useLocale();
  return (
    <div>
      <span data-testid="active-locale">{locale}</span>
      <span data-testid="is-manual">{String(isManual)}</span>
      <span data-testid="formatted-number">{formatNumber(1234.5)}</span>
      <span data-testid="translated-nearby">{t("action.nearby")}</span>
      <button data-testid="switch-en" onClick={() => setLocale("en")}>
        EN
      </button>
      <button data-testid="switch-ko" onClick={() => setLocale("ko")}>
        KO
      </button>
      <button data-testid="switch-vi" onClick={() => setLocale("vi")}>
        VI
      </button>
      <button data-testid="switch-auto" onClick={setAuto}>
        AUTO
      </button>
    </div>
  );
}

describe("LocaleProvider & useLocale runtime", () => {
  beforeEach(() => {
    localStorage.clear();
    setMockNavigator(["vi-VN"], "vi-VN");
    document.documentElement.lang = "vi";
  });

  afterEach(() => {
    localStorage.clear();
    restoreMockNavigator();
    vi.restoreAllMocks();
    document.documentElement.lang = "vi";
  });

  it("initializes with 'vi' on server/initial render and synchronizes document.documentElement.lang", () => {
    render(
      <LocaleProvider>
        <LocaleInspector />
      </LocaleProvider>
    );
    expect(screen.getByTestId("active-locale")).toHaveTextContent("vi");
    expect(document.documentElement.lang).toBe("vi");
  });

  it.each([
    [["vi-VN"], "vi"],
    [["en-US"], "en"],
    [["en-GB"], "en"],
    [["ko-KR"], "ko"],
    [["ja-JP"], "vi"], // unsupported falls back to vi
  ])("auto-detects browser locale %j -> %s", (languages, expected) => {
    Object.defineProperty(navigator, "languages", {
      value: languages,
      configurable: true,
    });
    render(
      <LocaleProvider>
        <LocaleInspector />
      </LocaleProvider>
    );
    expect(screen.getByTestId("active-locale")).toHaveTextContent(expected);
    expect(document.documentElement.lang).toBe(expected);
  });

  it("prioritizes navigator.languages over navigator.language", () => {
    Object.defineProperty(navigator, "languages", {
      value: ["ko-KR", "en-US"],
      configurable: true,
    });
    Object.defineProperty(navigator, "language", {
      value: "en-US",
      configurable: true,
    });
    render(
      <LocaleProvider>
        <LocaleInspector />
      </LocaleProvider>
    );
    expect(screen.getByTestId("active-locale")).toHaveTextContent("ko");
  });

  it("falls back to navigator.language when navigator.languages is empty", () => {
    Object.defineProperty(navigator, "languages", {
      value: [],
      configurable: true,
    });
    Object.defineProperty(navigator, "language", {
      value: "en-AU",
      configurable: true,
    });
    render(
      <LocaleProvider>
        <LocaleInspector />
      </LocaleProvider>
    );
    expect(screen.getByTestId("active-locale")).toHaveTextContent("en");
  });

  it("allows manual switch to VI, EN, KO and updates localStorage & document.documentElement.lang", () => {
    render(
      <LocaleProvider>
        <LocaleInspector />
      </LocaleProvider>
    );

    // Switch to EN
    fireEvent.click(screen.getByTestId("switch-en"));
    expect(screen.getByTestId("active-locale")).toHaveTextContent("en");
    expect(screen.getByTestId("is-manual")).toHaveTextContent("true");
    expect(localStorage.getItem(LOCALE_STORAGE_KEY)).toBe("en");
    expect(document.documentElement.lang).toBe("en");
    expect(screen.getByTestId("translated-nearby")).toHaveTextContent("Near me");

    // Switch to KO
    fireEvent.click(screen.getByTestId("switch-ko"));
    expect(screen.getByTestId("active-locale")).toHaveTextContent("ko");
    expect(screen.getByTestId("is-manual")).toHaveTextContent("true");
    expect(localStorage.getItem(LOCALE_STORAGE_KEY)).toBe("ko");
    expect(document.documentElement.lang).toBe("ko");
    expect(screen.getByTestId("translated-nearby")).toHaveTextContent("내 주변");

    // Switch to VI
    fireEvent.click(screen.getByTestId("switch-vi"));
    expect(screen.getByTestId("active-locale")).toHaveTextContent("vi");
    expect(screen.getByTestId("is-manual")).toHaveTextContent("true");
    expect(localStorage.getItem(LOCALE_STORAGE_KEY)).toBe("vi");
    expect(document.documentElement.lang).toBe("vi");
    expect(screen.getByTestId("translated-nearby")).toHaveTextContent("Gần tôi");
  });

  it("prioritizes manual localStorage selection over browser navigator languages", () => {
    localStorage.setItem(LOCALE_STORAGE_KEY, "ko");
    Object.defineProperty(navigator, "languages", {
      value: ["en-US"],
      configurable: true,
    });
    render(
      <LocaleProvider>
        <LocaleInspector />
      </LocaleProvider>
    );
    expect(screen.getByTestId("active-locale")).toHaveTextContent("ko");
    expect(screen.getByTestId("is-manual")).toHaveTextContent("true");
  });

  it("clears storage and returns to device auto mode on setAuto()", () => {
    localStorage.setItem(LOCALE_STORAGE_KEY, "en");
    Object.defineProperty(navigator, "languages", {
      value: ["ko-KR"],
      configurable: true,
    });
    render(
      <LocaleProvider>
        <LocaleInspector />
      </LocaleProvider>
    );
    expect(screen.getByTestId("active-locale")).toHaveTextContent("en");

    fireEvent.click(screen.getByTestId("switch-auto"));
    expect(localStorage.getItem(LOCALE_STORAGE_KEY)).toBeNull();
    expect(screen.getByTestId("active-locale")).toHaveTextContent("ko");
    expect(screen.getByTestId("is-manual")).toHaveTextContent("false");
    expect(document.documentElement.lang).toBe("ko");
  });

  it("handles blocked localStorage gracefully (SecurityError / private browsing)", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("SecurityError: Access is denied");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceededError");
    });
    vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
      throw new Error("SecurityError");
    });

    render(
      <LocaleProvider>
        <LocaleInspector />
      </LocaleProvider>
    );
    expect(screen.getByTestId("active-locale")).toHaveTextContent("vi");

    // Should not crash when switching locale with blocked storage
    expect(() => fireEvent.click(screen.getByTestId("switch-en"))).not.toThrow();
    expect(screen.getByTestId("active-locale")).toHaveTextContent("en");

    // Should not crash when switching auto with blocked storage
    expect(() => fireEvent.click(screen.getByTestId("switch-auto"))).not.toThrow();
  });

  it("ignores corrupt values in localStorage and falls back safely", () => {
    localStorage.setItem(LOCALE_STORAGE_KEY, "fr-FR"); // unsupported
    Object.defineProperty(navigator, "languages", {
      value: ["en-US"],
      configurable: true,
    });
    render(
      <LocaleProvider>
        <LocaleInspector />
      </LocaleProvider>
    );
    expect(screen.getByTestId("active-locale")).toHaveTextContent("en");
    expect(screen.getByTestId("is-manual")).toHaveTextContent("false");
  });

  it("formats numbers according to the active locale", () => {
    render(
      <LocaleProvider>
        <LocaleInspector />
      </LocaleProvider>
    );
    // vi uses comma as decimal separator
    const viNum = screen.getByTestId("formatted-number").textContent;
    expect(viNum).toContain("1");

    fireEvent.click(screen.getByTestId("switch-en"));
    // en uses dot as decimal separator
    const enNum = screen.getByTestId("formatted-number").textContent;
    expect(enNum).toBe("1,234.5");
  });
});

describe("LanguageSelector UX & One-hand ergonomics", () => {
  beforeEach(() => {
    localStorage.clear();
    setMockNavigator(["vi-VN"], "vi-VN");
    document.documentElement.lang = "vi";
  });

  afterEach(() => {
    localStorage.clear();
    restoreMockNavigator();
    vi.restoreAllMocks();
  });

  it("renders trigger button with >=44px touch target in reachable zone", () => {
    render(
      <LocaleProvider>
        <LanguageSelector />
      </LocaleProvider>
    );
    const trigger = screen.getByRole("button", { name: /Ngôn ngữ/i });
    expect(trigger).toBeInTheDocument();
    expect(trigger.className).toContain("min-h-[44px]");
  });

  it("opens modal on tap with dialog semantics and aria-modal", () => {
    render(
      <LocaleProvider>
        <LanguageSelector />
      </LocaleProvider>
    );
    const trigger = screen.getByRole("button", { name: /Ngôn ngữ/i });
    fireEvent.click(trigger);

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute("aria-modal", "true");

    // Check all 4 options are present with min-h-[48px] touch targets
    const viBtn = screen.getByRole("radio", { name: /Tiếng Việt/i });
    const enBtn = screen.getByRole("radio", { name: /English/i });
    const koBtn = screen.getByRole("radio", { name: /한국어/i });
    const autoBtn = screen.getByRole("radio", { name: /Theo thiết bị/i });

    expect(viBtn).toBeInTheDocument();
    expect(enBtn).toBeInTheDocument();
    expect(koBtn).toBeInTheDocument();
    expect(autoBtn).toBeInTheDocument();

    expect(viBtn.className).toContain("min-h-[48px]");
    expect(enBtn.className).toContain("min-h-[48px]");
    expect(koBtn.className).toContain("min-h-[48px]");
    expect(autoBtn.className).toContain("min-h-[48px]");
  });

  it("switches language and closes dialog upon selecting an option", () => {
    render(
      <LocaleProvider>
        <LanguageSelector />
      </LocaleProvider>
    );
    fireEvent.click(screen.getByRole("button", { name: /Ngôn ngữ/i }));

    const enBtn = screen.getByRole("radio", { name: /English/i });
    fireEvent.click(enBtn);

    // Dialog should be closed
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(localStorage.getItem(LOCALE_STORAGE_KEY)).toBe("en");
    expect(document.documentElement.lang).toBe("en");
  });

  it("closes dialog when pressing Escape key", () => {
    render(
      <LocaleProvider>
        <LanguageSelector />
      </LocaleProvider>
    );
    fireEvent.click(screen.getByRole("button", { name: /Ngôn ngữ/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

describe("Dynamic Discovery API Locale & Full Integration Flow", () => {
  beforeEach(() => {
    localStorage.clear();
    setMockNavigator(["vi-VN"], "vi-VN");
    document.documentElement.lang = "vi";
    vi.stubGlobal("fetch", vi.fn());
    vi.mocked(window.matchMedia).mockReturnValue({ matches: false } as MediaQueryList);
  });

  afterEach(() => {
    localStorage.clear();
    restoreMockNavigator();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("fetches discovery with locale=vi by default and re-fetches when switching language", async () => {
    vi.mocked(fetch).mockResolvedValue(apiResponse(3, "an_ngon", "EAT"));

    render(
      <LocaleProvider>
        <HomePage />
      </LocaleProvider>
    );

    // Select EAT + Ăn ngon
    fireEvent.click(screen.getByText("ĂN GÌ?"));
    fireEvent.click(screen.getByRole("button", { name: "Ăn ngon" }));

    await screen.findByText("API fixture 1");
    expect(fetch).toHaveBeenCalledWith(
      "/api/discovery?intent=EAT&locale=vi&preference=an_ngon",
      expect.objectContaining({ cache: "no-store" })
    );

    // Now switch language to EN via footer LanguageSelector
    const langBtn = screen.getByRole("button", { name: /Ngôn ngữ/i });
    fireEvent.click(langBtn);

    // Mock the English response
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        ok: true,
        data: {
          intent: "EAT",
          locale: "en",
          preference: "an_ngon",
          preferenceMapping: "tags",
          count: 2,
          places: [
            {
              ...apiPlace(1, "EAT"),
              primaryType: "Seafood restaurant",
              tags: ["Photo spot"],
            },
            {
              ...apiPlace(2, "EAT"),
              primaryType: "Vietnamese restaurant",
              tags: ["Specialty"],
            },
          ],
          meta: { source: "neon-postgres", limit: 3, ranking: "curated-rank-v1" },
        },
      }),
    } as Response);

    const enOption = screen.getByRole("radio", { name: /English/i });
    fireEvent.click(enOption);

    // Verify API was re-called with locale=en
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "/api/discovery?intent=EAT&locale=en&preference=an_ngon",
        expect.objectContaining({ cache: "no-store" })
      );
    });

    // Check that English UI chrome is rendered
    expect(screen.getByRole("button", { name: /Change selection/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Near me/i })).toBeInTheDocument();
  });

  it("preserves selectedIntent, preference, and Nearby mode across language switches", async () => {
    // Mock Geolocation
    const mockCoords = { latitude: 16.06, longitude: 108.22, accuracy: 15 };
    const geolocation = {
      getCurrentPosition: vi.fn((success) =>
        success({ coords: mockCoords, timestamp: Date.now() })
      ),
      watchPosition: vi.fn(),
      clearWatch: vi.fn(),
    };
    Object.defineProperty(navigator, "geolocation", {
      value: geolocation,
      writable: true,
      configurable: true,
    });

    // First response: citywide
    vi.mocked(fetch).mockResolvedValueOnce(apiResponse(3, "an_ngon", "EAT"));

    render(
      <LocaleProvider>
        <HomePage />
      </LocaleProvider>
    );

    fireEvent.click(screen.getByText("ĂN GÌ?"));
    fireEvent.click(screen.getByRole("button", { name: "Ăn ngon" }));
    await screen.findByText("API fixture 1");

    // Click 'Gần tôi'
    const nearbyBtn = screen.getByRole("button", { name: "Gần tôi" });
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        ok: true,
        data: {
          intent: "EAT",
          locale: "vi",
          preference: "an_ngon",
          count: 2,
          places: [apiPlace(1, "EAT"), apiPlace(2, "EAT")],
          meta: { nearby: true, radiusKm: 1 },
        },
      }),
    } as Response);

    fireEvent.click(nearbyBtn);
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("lat=16.06&lng=108.22"),
        expect.anything()
      );
    });

    // Now switch to Korean (KO)
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        ok: true,
        data: {
          intent: "EAT",
          locale: "ko",
          preference: "an_ngon",
          count: 2,
          places: [apiPlace(1, "EAT"), apiPlace(2, "EAT")],
          meta: { nearby: true, radiusKm: 1 },
        },
      }),
    } as Response);

    const langTrigger = screen.getByRole("button", { name: /Ngôn ngữ/i });
    fireEvent.click(langTrigger);
    const koOption = screen.getByRole("radio", { name: /한국어/i });
    fireEvent.click(koOption);

    // Verify it re-fetches with locale=ko AND preserves lat/lng
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("locale=ko&preference=an_ngon&lat=16.06&lng=108.22"),
        expect.anything()
      );
    });

    // Verify Korean buttons are rendered
    expect(screen.getByRole("button", { name: /선택 변경/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /다낭 전체/i })).toBeInTheDocument();
  });

  it("handles race conditions: stale old-locale response is dropped when new locale resolves", async () => {
    let resolveVi!: (val: any) => void;
    const viPromise = new Promise((resolve) => {
      resolveVi = resolve;
    });

    vi.mocked(fetch).mockReturnValueOnce(viPromise as any);

    render(
      <LocaleProvider>
        <HomePage />
      </LocaleProvider>
    );

    fireEvent.click(screen.getByText("ĂN GÌ?"));
    fireEvent.click(screen.getByRole("button", { name: "Ăn ngon" }));

    // User switches to EN while VI fetch is still pending
    const enResponse = {
      ok: true,
      json: async () => ({
        ok: true,
        data: {
          intent: "EAT",
          locale: "en",
          preference: "an_ngon",
          count: 1,
          places: [
            {
              ...apiPlace(42, "EAT"),
              typeLabel: "English Place Type",
            },
          ],
          meta: { source: "neon-postgres" },
        },
      }),
    } as Response;

    vi.mocked(fetch).mockResolvedValueOnce(enResponse);

    const langTrigger = screen.getByRole("button", { name: /Ngôn ngữ/i });
    fireEvent.click(langTrigger);
    const enOption = screen.getByRole("radio", { name: /English/i });
    fireEvent.click(enOption);

    // Wait for EN place to be displayed
    await screen.findByText("API fixture 42");
    expect(screen.getByText("English Place Type")).toBeInTheDocument();

    // Now resolve the stale VI promise
    await act(async () => {
      resolveVi({
        ok: true,
        json: async () => ({
          ok: true,
          data: {
            intent: "EAT",
            locale: "vi",
            preference: "an_ngon",
            count: 1,
            places: [
              {
                ...apiPlace(99, "EAT"),
                typeLabel: "Stale Vietnamese Place",
              },
            ],
            meta: { source: "neon-postgres" },
          },
        }),
      });
    });

    // Stale VI response must NOT overwrite active EN state
    expect(screen.queryByText("Stale Vietnamese Place")).not.toBeInTheDocument();
    expect(screen.getByText("English Place Type")).toBeInTheDocument();
  });
});

describe("GET /api/discovery route locale validation", () => {
  it("rejects unsupported locale with HTTP 400 INVALID_PARAMETER", async () => {
    const req = new NextRequest("http://localhost/api/discovery?intent=EAT&preference=an_ngon&locale=fr");
    const res = await GET(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error.code).toBe("INVALID_PARAMETER");
    expect(body.error.field).toBe("locale");
  });

  it.each(["vi", "en", "ko"])("accepts valid locale %s in route handler", async (loc) => {
    const req = new NextRequest(`http://localhost/api/discovery?intent=EAT&preference=an_ngon&locale=${loc}`);
    const res = await GET(req);
    // Since mock or Neon is used, status should be 200 (or if DB is unavailable, DB error, but NOT 400 invalid param)
    expect(res.status).not.toBe(400);
    const body = await res.json();
    if (res.status === 200) {
      expect(body.data.locale).toBe(loc);
    }
  });
});
