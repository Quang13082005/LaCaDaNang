import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, act } from "@testing-library/react";
import { PlaceDetail } from "@/components/places/PlaceDetail";
import HomePage from "@/app/page";
import {
  isSafeInternalPath,
  saveDiscoverySelection,
  getValidDiscoverySelection,
  clearDiscoverySelection,
  saveNavSource,
  getValidNavSource,
  clearNavSource,
  resolveBackTarget,
  setPendingReturnRestore,
  consumeReturnRestoreFlag,
  RETURN_RESTORE_KEY,
  DISCOVERY_SELECTION_STORAGE_KEY,
  NAV_SOURCE_STORAGE_KEY,
  NAV_STATE_TTL_MS,
} from "@/lib/navigation/nav-state";
import { apiPlace } from "./discovery-fixtures";
import type { DiscoveryPlace } from "@/lib/data/discovery-contract";

describe("Safe Navigation State Manager (nav-state.ts)", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  afterEach(() => {
    cleanup();
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  describe("isSafeInternalPath", () => {
    it("accepts valid internal application paths", () => {
      expect(isSafeInternalPath("/")).toBe(true);
      expect(isSafeInternalPath("/?locale=en")).toBe(true);
      expect(isSafeInternalPath("/?locale=ko")).toBe(true);
      expect(isSafeInternalPath("/places/1")).toBe(true);
      expect(isSafeInternalPath("/places/1501")).toBe(true);
      expect(isSafeInternalPath("/places/1501?locale=en")).toBe(true);
      expect(isSafeInternalPath("/places/1501?locale=ko")).toBe(true);
      expect(isSafeInternalPath("/browse/eat")).toBe(true);
      expect(isSafeInternalPath("/browse/cafe")).toBe(true);
      expect(isSafeInternalPath("/browse/go")).toBe(true);
      expect(isSafeInternalPath("/browse/stay")).toBe(true);
      expect(isSafeInternalPath("/browse/eat?page=2")).toBe(true);
      expect(isSafeInternalPath("/browse/cafe?locale=en")).toBe(true);
      expect(isSafeInternalPath("/browse/go?locale=ko&page=3")).toBe(true);
    });

    it("rejects untrusted, external, or malformed paths", () => {
      expect(isSafeInternalPath("https://google.com")).toBe(false);
      expect(isSafeInternalPath("http://evil.test")).toBe(false);
      expect(isSafeInternalPath("//evil.test/places/1")).toBe(false);
      expect(isSafeInternalPath("/\\evil.test")).toBe(false);
      expect(isSafeInternalPath("places/1501")).toBe(false);
      expect(isSafeInternalPath("/places/0")).toBe(false);
      expect(isSafeInternalPath("/places/abc")).toBe(false);
      expect(isSafeInternalPath("/places/-1")).toBe(false);
      expect(isSafeInternalPath("/api/now")).toBe(false);
      expect(isSafeInternalPath("/api/analytics")).toBe(false);
      expect(isSafeInternalPath("javascript:alert(1)")).toBe(false);
      expect(isSafeInternalPath("")).toBe(false);
      expect(isSafeInternalPath(null)).toBe(false);
      expect(isSafeInternalPath(undefined)).toBe(false);
    });
  });

  describe("Discovery Selection persistence & hydration", () => {
    it("stores and retrieves valid discovery selections", () => {
      saveDiscoverySelection("EAT", "an_ngon");
      const saved = getValidDiscoverySelection();
      expect(saved).toEqual({ intent: "EAT", preference: "an_ngon" });
    });

    it("stores and retrieves GO -> Đi cafe preference", () => {
      saveDiscoverySelection("GO", "cafe");
      const saved = getValidDiscoverySelection();
      expect(saved).toEqual({ intent: "GO", preference: "cafe" });
    });

    it("stores and retrieves NOW -> time_slot", () => {
      saveDiscoverySelection("NOW", "time_slot");
      const saved = getValidDiscoverySelection();
      expect(saved).toEqual({ intent: "NOW", preference: "time_slot" });
    });

    it("rejects invalid intent or preference", () => {
      saveDiscoverySelection("INVALID" as any, "an_ngon");
      expect(getValidDiscoverySelection()).toBeNull();

      saveDiscoverySelection("EAT", "invalid_preference_xyz");
      expect(getValidDiscoverySelection()).toBeNull();
    });

    it("expires and discards state after TTL (30 minutes)", () => {
      saveDiscoverySelection("EAT", "dac_san");
      expect(getValidDiscoverySelection()).not.toBeNull();

      // Mock expired timestamp
      const expiredTimestamp = Date.now() - NAV_STATE_TTL_MS - 1000;
      sessionStorage.setItem(
        DISCOVERY_SELECTION_STORAGE_KEY,
        JSON.stringify({ intent: "EAT", preference: "dac_san", timestamp: expiredTimestamp })
      );

      expect(getValidDiscoverySelection()).toBeNull();
      expect(sessionStorage.getItem(DISCOVERY_SELECTION_STORAGE_KEY)).toBeNull();
    });

    it("clears discovery selection explicitly", () => {
      saveDiscoverySelection("STAY", "gan_bien");
      expect(getValidDiscoverySelection()).not.toBeNull();
      clearDiscoverySelection();
      expect(getValidDiscoverySelection()).toBeNull();
    });
  });

  describe("Internal navigation source tracking & resolveBackTarget", () => {
    const cafePlace: DiscoveryPlace = {
      ...apiPlace(1501, "CAFE"),
      section: "CAFE",
    };

    it("direct/cold landing (no nav source) falls back to category browse hub", () => {
      const back = resolveBackTarget(cafePlace, "vi");
      expect(back.href).toBe("/browse/cafe");
      expect(back.isFallback).toBe(true);

      const backEn = resolveBackTarget(cafePlace, "en");
      expect(backEn.href).toBe("/browse/cafe?locale=en");

      const backKo = resolveBackTarget(cafePlace, "ko");
      expect(backKo.href).toBe("/browse/cafe?locale=ko");
    });

    it("direct landing for EAT falls back to /browse/eat", () => {
      const eatPlace: DiscoveryPlace = {
        ...apiPlace(200, "EAT"),
        section: "EAT",
      };
      const back = resolveBackTarget(eatPlace, "vi");
      expect(back.href).toBe("/browse/eat");
      expect(back.isFallback).toBe(true);
    });

    it("when navigating from Home, resolves back to /", () => {
      saveNavSource("/", "home");
      const back = resolveBackTarget(cafePlace, "vi");
      expect(back.href).toBe("/");
      expect(back.isFallback).toBe(false);
    });

    it("when navigating from Place A (/places/100) to Place B (/places/1501), resolves back to Place A", () => {
      saveNavSource("/places/100", "place");
      const back = resolveBackTarget(cafePlace, "vi");
      expect(back.href).toBe("/places/100");
      expect(back.isFallback).toBe(false);
    });

    it("when navigating from browse hub (/browse/cafe?page=2), resolves back to that browse hub", () => {
      saveNavSource("/browse/cafe?page=2", "browse");
      const back = resolveBackTarget(cafePlace, "vi");
      expect(back.href).toBe("/browse/cafe?page=2");
      expect(back.isFallback).toBe(false);
    });

    it("ignores nav source if it matches the current page (prevents back-to-self loop)", () => {
      saveNavSource("/places/1501", "place");
      // Current page is 1501, so it shouldn't point to itself!
      const back = resolveBackTarget(cafePlace, "vi");
      expect(back.href).toBe("/browse/cafe");
      expect(back.isFallback).toBe(true);
    });
  });
});

describe("PlaceDetail Mobile Bottom Navigation UI", () => {
  const testPlace: DiscoveryPlace = {
    ...apiPlace(33, "EAT"),
    name: "Quán Ăn Mẫu",
    address: "456 Đường Bạch Đằng, Đà Nẵng",
    googleMapsUrl: "https://maps.google.com/?cid=33",
  };

  beforeEach(() => {
    sessionStorage.clear();
  });

  afterEach(() => {
    cleanup();
    sessionStorage.clear();
  });

  for (const locale of ["vi", "en", "ko"] as const) {
    const labels = {
      vi: { back: "Quay lại", category: "Xem danh mục", home: "Trang chủ" },
      en: { back: "Back", category: "View category", home: "Home" },
      ko: { back: "뒤로 가기", category: "카테고리 보기", home: "홈" },
    }[locale];

    it(`${locale}: renders mobile fixed bottom nav with 2 distinct actions and minimum 48px touch height (fallback direct visit)`, () => {
      render(<PlaceDetail place={testPlace} locale={locale} />);

      // Find bottom navigation bar (fixed bottom on mobile)
      const bottomNav = screen.getByRole("navigation", { name: /Thao tác khám phá|Discovery actions|탐색 작업/i });
      expect(bottomNav).toBeInTheDocument();
      expect(bottomNav.className).toContain("fixed bottom-0");
      expect(bottomNav.className).toContain("md:hidden");

      // Verify Category button (60% width, min-h-[48px], light blue style)
      const backBtn = bottomNav.querySelector("a[aria-label='" + labels.category + "']");
      expect(backBtn).toBeInTheDocument();
      expect(backBtn).toHaveAttribute("href", locale === "vi" ? "/browse/eat" : `/browse/eat?locale=${locale}`);
      expect(backBtn?.className).toContain("min-h-[48px]");
      expect(backBtn?.className).toContain("flex-[3]");
      expect(backBtn?.className).toContain("bg-sky-50");
      expect(backBtn?.textContent).toContain(labels.category);

      // Verify Home button (40% width, min-h-[48px], neutral white style)
      const homeBtn = bottomNav.querySelector("a[aria-label='" + labels.home + "']");
      expect(homeBtn).toBeInTheDocument();
      expect(homeBtn).toHaveAttribute("href", "/");
      expect(homeBtn?.className).toContain("min-h-[48px]");
      expect(homeBtn?.className).toContain("flex-[2]");
      expect(homeBtn?.className).toContain("bg-white");
      expect(homeBtn?.textContent).toContain(labels.home);
    });
  }

  it("clicking Home on bottom nav clears discovery selection to reset to clean initial state", () => {
    saveDiscoverySelection("EAT", "an_ngon");
    saveNavSource("/", "home");
    expect(getValidDiscoverySelection()).not.toBeNull();

    render(<PlaceDetail place={testPlace} locale="vi" />);

    const bottomNav = screen.getByRole("navigation", { name: /Thao tác khám phá/i });
    const homeBtn = bottomNav.querySelector("a[aria-label='Trang chủ']")!;
    fireEvent.click(homeBtn);

    // Verified: discovery selection is cleared upon Home click
    expect(getValidDiscoverySelection()).toBeNull();
    expect(getValidNavSource()).toBeNull();
  });

  it("navigates to previous screen when reliable internal navSource exists", () => {
    saveNavSource("/places/100", "place");

    render(<PlaceDetail place={testPlace} locale="vi" />);

    const bottomNav = screen.getByRole("navigation", { name: /Thao tác khám phá/i });
    const backBtn = bottomNav.querySelector("a[aria-label='Quay lại']")!;
    expect(backBtn).toHaveAttribute("href", "/places/100");
  });

  it("renders desktop top navigation header with Back and Home links (hidden on mobile, visible on desktop)", () => {
    render(<PlaceDetail place={testPlace} locale="vi" />);

    // In the main content area at the top
    const main = screen.getByRole("main");
    expect(main.className).toContain("pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))]");

    // Both top Back/Category and Home links exist
    const topBackLink = screen.getAllByRole("link", { name: /Xem danh mục/i })[0];
    const topHomeLink = screen.getAllByRole("link", { name: /Trang chủ/i })[0];

    expect(topBackLink).toBeInTheDocument();
    expect(topHomeLink).toBeInTheDocument();
    expect(topHomeLink).toHaveAttribute("href", "/");

    // Verified: Top container is hidden on mobile and only visible on desktop (md:flex)
    const topContainer = topBackLink.closest("div");
    expect(topContainer?.className).toContain("hidden");
    expect(topContainer?.className).toContain("md:flex");
  });

  it("sets pending return restore flag when clicking Quay lại to return to Home", () => {
    saveNavSource("/", "home");
    render(<PlaceDetail place={testPlace} locale="vi" />);

    const bottomNav = screen.getByRole("navigation", { name: /Thao tác khám phá/i });
    const backBtn = bottomNav.querySelector("a[aria-label='Quay lại']")!;
    fireEvent.click(backBtn);

    expect(sessionStorage.getItem(RETURN_RESTORE_KEY)).toBe("true");
    expect(consumeReturnRestoreFlag()).toBe(true);
    expect(consumeReturnRestoreFlag()).toBe(false); // consumed once
  });

  it("clears pending return restore flag when clicking Trang chủ", () => {
    setPendingReturnRestore(true);
    render(<PlaceDetail place={testPlace} locale="vi" />);

    const bottomNav = screen.getByRole("navigation", { name: /Thao tác khám phá/i });
    const homeBtn = bottomNav.querySelector("a[aria-label='Trang chủ']")!;
    fireEvent.click(homeBtn);

    expect(sessionStorage.getItem(RETURN_RESTORE_KEY)).toBeNull();
    expect(consumeReturnRestoreFlag()).toBe(false);
  });
});

describe("Discovery State Restoration Flow (HomePage <-> PlaceDetail)", () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    sessionStorage.clear();
    localStorage.clear();
  });

  it("restores EAT selection when returning to Home with pending restore flag", () => {
    saveDiscoverySelection("EAT", "an_ngon");
    setPendingReturnRestore(true);

    act(() => {
      render(<HomePage />);
    });

    // Should have restored "ĂN GÌ? · Ăn ngon"
    expect(screen.getByText(/ĂN GÌ\? · Ăn ngon/i)).toBeInTheDocument();
  });

  it("does NOT restore selection on clean cold load (flag is absent)", () => {
    saveDiscoverySelection("EAT", "an_ngon");
    // setPendingReturnRestore is NOT called (or false)

    act(() => {
      render(<HomePage />);
    });

    // Initial 4 intents should be displayed
    expect(screen.getByText("ĂN GÌ?")).toBeInTheDocument();
    expect(screen.queryByText(/ĂN GÌ\? · Ăn ngon/i)).not.toBeInTheDocument();
  });

  it("restores GO -> Đi cafe selection when returning from cafe place detail", () => {
    saveDiscoverySelection("GO", "cafe");
    setPendingReturnRestore(true);

    act(() => {
      render(<HomePage />);
    });

    expect(screen.getByText(/ĐI ĐÂU\? · Đi cafe/i)).toBeInTheDocument();
  });
});
