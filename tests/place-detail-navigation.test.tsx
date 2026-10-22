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
  setPendingNowRestore,
  consumePendingNowRestore,
  saveNowItinerarySnapshot,
  getValidNowItinerarySnapshot,
  clearNowItinerarySnapshot,
  isValidNowData,
  RETURN_RESTORE_KEY,
  DISCOVERY_SELECTION_STORAGE_KEY,
  NAV_SOURCE_STORAGE_KEY,
  NOW_ITINERARY_STORAGE_KEY,
  NOW_RETURN_RESTORE_KEY,
  NAV_STATE_TTL_MS,
} from "@/lib/navigation/nav-state";
import { apiPlace } from "./discovery-fixtures";
import type { DiscoveryPlace } from "@/lib/data/discovery-contract";
import type { NowData } from "@/lib/now/contract";

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
      expect(isSafeInternalPath("/?locale=ru")).toBe(true);
      expect(isSafeInternalPath("/?locale=zh")).toBe(true);
      expect(isSafeInternalPath("/places/1")).toBe(true);
      expect(isSafeInternalPath("/places/1501")).toBe(true);
      expect(isSafeInternalPath("/places/1501?locale=en")).toBe(true);
      expect(isSafeInternalPath("/places/1501?locale=ko")).toBe(true);
      expect(isSafeInternalPath("/places/1501?locale=ru")).toBe(true);
      expect(isSafeInternalPath("/places/1501?locale=zh")).toBe(true);
      expect(isSafeInternalPath("/browse/eat")).toBe(true);
      expect(isSafeInternalPath("/browse/cafe")).toBe(true);
      expect(isSafeInternalPath("/browse/go")).toBe(true);
      expect(isSafeInternalPath("/browse/stay")).toBe(true);
      expect(isSafeInternalPath("/browse/eat?page=2")).toBe(true);
      expect(isSafeInternalPath("/browse/cafe?locale=en")).toBe(true);
      expect(isSafeInternalPath("/browse/go?locale=ko&page=3")).toBe(true);
      expect(isSafeInternalPath("/browse/eat?locale=ru")).toBe(true);
      expect(isSafeInternalPath("/browse/stay?locale=zh&page=2")).toBe(true);
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

  for (const locale of ["vi", "en", "ko", "ru", "zh"] as const) {
    const labels = {
      vi: { back: "Quay lại", category: "Xem danh mục", home: "Trang chủ" },
      en: { back: "Back", category: "View category", home: "Home" },
      ko: { back: "뒤로 가기", category: "카테고리 보기", home: "홈" },
      ru: { back: "Назад", category: "Смотреть категорию", home: "Главная" },
      zh: { back: "返回", category: "查看分类", home: "首页" },
    }[locale];

    it(`${locale}: renders mobile fixed bottom nav with 2 distinct actions and minimum 48px touch height (fallback direct visit)`, () => {
      render(<PlaceDetail place={testPlace} locale={locale} />);

      // Find bottom navigation bar (fixed bottom on mobile)
      const bottomNav = screen.getByRole("navigation", { name: /Thao tác khám phá|Discovery actions|탐색 작업|Действия по поиску|探索操作/i });
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

  it("renders desktop language switcher with all 5 languages preserving place ID", () => {
    render(<PlaceDetail place={testPlace} locale="vi" />);
    const langNav = screen.getByRole("navigation", { name: "Ngôn ngữ" });
    expect(langNav).toBeInTheDocument();

    const expectedLinks = [
      { text: "Tiếng Việt", href: "/places/33" },
      { text: "English", href: "/places/33?locale=en" },
      { text: "한국어", href: "/places/33?locale=ko" },
      { text: "Русский", href: "/places/33?locale=ru" },
      { text: "简体中文", href: "/places/33?locale=zh" },
    ];

    for (const item of expectedLinks) {
      const link = langNav.querySelector(`a[href="${item.href}"]`);
      expect(link, `Link to ${item.href} must exist`).toBeInTheDocument();
      expect(link?.textContent).toContain(item.text);
    }
  });

  it("renders transparent translation fallback notice when place.translationFallback is true on non-VI locales", () => {
    const fallbackPlace: DiscoveryPlace = {
      ...testPlace,
      translationFallback: true,
    };

    // In Russian: shows Russian fallback note
    const { unmount: unmountRu } = render(<PlaceDetail place={fallbackPlace} locale="ru" />);
    expect(screen.getByText(/Название и адрес сохранены на вьетнамском языке/i)).toBeInTheDocument();
    unmountRu();

    // In Chinese: shows Chinese fallback note
    const { unmount: unmountZh } = render(<PlaceDetail place={fallbackPlace} locale="zh" />);
    expect(screen.getByText(/为方便问路与出行乘车/i)).toBeInTheDocument();
    unmountZh();

    // In Vietnamese: fallback note is not needed and not shown
    const { unmount: unmountVi } = render(<PlaceDetail place={fallbackPlace} locale="vi" />);
    expect(screen.queryByText(/Название и адрес сохранены/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/为方便问路与出行乘车/i)).not.toBeInTheDocument();
    unmountVi();
  });

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

  it("restores NOW citywide itinerary when returning from detail page without re-fetching API", async () => {
    const fetchSpy = vi.spyOn(global, "fetch");

    const sampleNowData: NowData = {
      locale: "vi",
      slot: "AFTERNOON",
      timeZone: "Asia/Ho_Chi_Minh",
      evaluatedAt: "2026-10-20T14:30:00.000Z",
      count: 3,
      places: [
        apiPlace(101, "EAT"),
        apiPlace(102, "CAFE"),
        apiPlace(103, "GO"),
      ],
      meta: {
        source: "neon-postgres",
        policy: "time-slot-v1.1",
        mode: "citywide",
        openingHoursVerified: false,
      },
    };

    saveDiscoverySelection("NOW", "time_slot");
    saveNowItinerarySnapshot(sampleNowData);
    setPendingReturnRestore(true);
    setPendingNowRestore(true);

    act(() => {
      render(<HomePage />);
    });

    // Should immediately render all 3 stops in order
    expect(screen.getByText("API fixture 101")).toBeInTheDocument();
    expect(screen.getByText("API fixture 102")).toBeInTheDocument();
    expect(screen.getByText("API fixture 103")).toBeInTheDocument();

    // Verify /api/now was NOT re-fetched on Back restore
    const nowFetchCalls = fetchSpy.mock.calls.filter((c) =>
      typeof c[0] === "string" && c[0].includes("/api/now")
    );
    expect(nowFetchCalls).toHaveLength(0);
  });

  it("restores NOW nearby itinerary without GPS prompt or location re-request", async () => {
    const sampleNearbyData: NowData = {
      locale: "vi",
      slot: "AFTERNOON",
      timeZone: "Asia/Ho_Chi_Minh",
      evaluatedAt: "2026-10-20T14:30:00.000Z",
      count: 3,
      places: [
        apiPlace(201, "EAT"),
        apiPlace(202, "CAFE"),
        apiPlace(203, "GO"),
      ],
      meta: {
        source: "neon-postgres",
        policy: "location-v2",
        mode: "nearby",
        radiusKm: 3,
        openingHoursVerified: false,
      },
    };

    saveDiscoverySelection("NOW", "time_slot");
    saveNowItinerarySnapshot(sampleNearbyData);
    setPendingReturnRestore(true);
    setPendingNowRestore(true);

    act(() => {
      render(<HomePage />);
    });

    // Renders the 3 nearby places directly
    expect(screen.getByText("API fixture 201")).toBeInTheDocument();
    expect(screen.getByText("API fixture 202")).toBeInTheDocument();
    expect(screen.getByText("API fixture 203")).toBeInTheDocument();

    // Geolocation prompt must NOT be displayed
    expect(screen.queryByText(/Dùng vị trí của bạn để gợi ý/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Cho phép vị trí/i)).not.toBeInTheDocument();
  });

  it("clears NOW snapshot on 'Đổi lựa chọn' so subsequent NOW visits start fresh in choose mode", () => {
    const sampleNowData: NowData = {
      locale: "vi",
      slot: "AFTERNOON",
      timeZone: "Asia/Ho_Chi_Minh",
      evaluatedAt: "2026-10-20T14:30:00.000Z",
      count: 3,
      places: [
        apiPlace(301, "EAT"),
        apiPlace(302, "CAFE"),
        apiPlace(303, "GO"),
      ],
      meta: {
        source: "neon-postgres",
        policy: "time-slot-v1.1",
        mode: "citywide",
        openingHoursVerified: false,
      },
    };

    saveDiscoverySelection("NOW", "time_slot");
    saveNowItinerarySnapshot(sampleNowData);
    setPendingReturnRestore(true);
    setPendingNowRestore(true);

    const { unmount } = render(<HomePage />);
    expect(screen.getByText("API fixture 301")).toBeInTheDocument();

    // User clicks "Đổi lựa chọn"
    const changeBtn = screen.getByRole("button", { name: "Đổi lựa chọn" });
    fireEvent.click(changeBtn);

    // Snapshot must be cleared from storage
    expect(getValidNowItinerarySnapshot()).toBeNull();
    unmount();

    // Re-render HomePage afresh and click NOW: must show location prompt, not old snapshot
    render(<HomePage />);
    const nowBtn = screen.getByText("BÂY GIỜ LÀM GÌ?");
    fireEvent.click(nowBtn);

    expect(screen.getByText(/Dùng vị trí của bạn để gợi ý/i)).toBeInTheDocument();
    expect(screen.queryByText("API fixture 301")).not.toBeInTheDocument();
  });
});

describe("NOW Itinerary Snapshot Manager (nav-state.ts)", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  const validData: NowData = {
    locale: "vi",
    slot: "MORNING",
    timeZone: "Asia/Ho_Chi_Minh",
    evaluatedAt: "2026-10-20T08:00:00.000Z",
    count: 2,
    places: [apiPlace(1, "EAT"), apiPlace(2, "CAFE")],
    meta: {
      source: "neon-postgres",
      policy: "time-slot-v1.1",
      mode: "citywide",
      openingHoursVerified: false,
    },
  };

  it("saves and retrieves valid NowData snapshot", () => {
    saveNowItinerarySnapshot(validData);
    const restored = getValidNowItinerarySnapshot();
    expect(restored).not.toBeNull();
    expect(restored?.count).toBe(2);
    expect(restored?.places[0].id).toBe(1);
    expect(restored?.places[1].id).toBe(2);
  });

  it("expires snapshot past 30-minute TTL", () => {
    const expiredTimestamp = Date.now() - (NAV_STATE_TTL_MS + 1000);
    sessionStorage.setItem(
      NOW_ITINERARY_STORAGE_KEY,
      JSON.stringify({ data: validData, timestamp: expiredTimestamp })
    );

    expect(getValidNowItinerarySnapshot()).toBeNull();
  });

  it("rejects invalid or corrupted snapshot data", () => {
    // Corrupted: count > 3
    const badData = { ...validData, count: 5 };
    sessionStorage.setItem(
      NOW_ITINERARY_STORAGE_KEY,
      JSON.stringify({ data: badData, timestamp: Date.now() })
    );
    expect(getValidNowItinerarySnapshot()).toBeNull();
  });

  it("handles pending restore flag lifecycle", () => {
    expect(consumePendingNowRestore()).toBe(false);
    setPendingNowRestore(true);
    expect(consumePendingNowRestore()).toBe(true);
    // Consumed: second read is false
    expect(consumePendingNowRestore()).toBe(false);
  });

  it("saves and retrieves snapshots with ru and zh locales preserving order", () => {
    for (const testLoc of ["ru", "zh"] as const) {
      const locData: NowData = {
        ...validData,
        locale: testLoc,
        places: [apiPlace(701, "EAT"), apiPlace(702, "CAFE"), apiPlace(703, "GO")],
        count: 3,
      };
      saveNowItinerarySnapshot(locData);
      const restored = getValidNowItinerarySnapshot();
      expect(restored).not.toBeNull();
      expect(restored?.locale).toBe(testLoc);
      expect(restored?.count).toBe(3);
      expect(restored?.places[0].id).toBe(701);
      expect(restored?.places[1].id).toBe(702);
      expect(restored?.places[2].id).toBe(703);
    }
  });
});
