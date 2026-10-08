import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import HomePage from "@/app/page";
import { PlaceCard } from "@/components/results/PlaceCard";
import { discoveryToCard } from "@/lib/data/place-card-model";
import type { DiscoveryPlace, DiscoverySection } from "@/lib/data/discovery-contract";
import { apiPlace } from "./discovery-fixtures";

function selectPreference(intentText: string, prefLabel: string) {
  fireEvent.click(screen.getByText(intentText));
  fireEvent.click(screen.getByRole("button", { name: prefLabel }));
}

function mockGeolocation(impl: (success: PositionCallback, error: PositionErrorCallback, options?: PositionOptions) => void) {
  const geolocation = {
    getCurrentPosition: vi.fn(impl),
    watchPosition: vi.fn(),
    clearWatch: vi.fn(),
  };
  Object.defineProperty(navigator, "geolocation", {
    value: geolocation,
    writable: true,
    configurable: true,
  });
  return geolocation;
}

function mockNearbyResponse(
  places: Partial<DiscoveryPlace>[],
  radiusKm = 1,
  section: DiscoverySection = "EAT",
  preference = "an_ngon"
) {
  return {
    ok: true,
    json: async () => ({
      ok: true,
      data: {
        intent: section,
        locale: "vi",
        preference,
        preferenceMapping: "tags",
        count: places.length,
        places: places.map((p, i) => ({
          ...apiPlace(p.id ?? i + 1, (p.section as any) ?? section),
          ...p,
        })),
        meta: {
          source: "neon-postgres",
          limit: 3,
          ranking: "nearby-provisional-v1",
          nearby: true,
          radiusKm,
        },
      },
    }),
  } as Response;
}

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn());
  vi.mocked(window.matchMedia).mockReturnValue({ matches: false } as MediaQueryList);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("Nearby Discovery Frontend UX", () => {
  it("renders 'Gần tôi' button after selecting preference, without auto-requesting GPS on load", async () => {
    const geo = mockGeolocation(() => {});
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        ok: true,
        data: {
          intent: "EAT",
          locale: "vi",
          preference: "an_ngon",
          count: 1,
          places: [apiPlace(1)],
          meta: { source: "neon-postgres", limit: 3, ranking: "provisional-v1" },
        },
      }),
    } as Response);

    render(<HomePage />);
    expect(geo.getCurrentPosition).not.toHaveBeenCalled();

    selectPreference("ĂN GÌ?", "Ăn ngon");
    await screen.findByText("API fixture 1");

    // Geolocation was NOT called automatically
    expect(geo.getCurrentPosition).not.toHaveBeenCalled();

    // 'Gần tôi' action button is rendered and clickable
    const nearbyButton = screen.getByRole("button", { name: /Gần tôi/ });
    expect(nearbyButton).toBeInTheDocument();
  });

  it("requests GPS on clicking 'Gần tôi', sends lat/lng when accuracy <= 1000m, and renders distance badge", async () => {
    mockGeolocation((success) => {
      success({
        coords: {
          latitude: 16.068,
          longitude: 108.221,
          accuracy: 50, // <= 1000m
          altitude: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
        } as unknown as GeolocationCoordinates,
        timestamp: Date.now(),
      } as unknown as GeolocationPosition);
    });

    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          ok: true,
          data: {
            intent: "EAT",
            locale: "vi",
            preference: "an_ngon",
            count: 1,
            places: [apiPlace(1)],
            meta: { source: "neon-postgres", limit: 3, ranking: "provisional-v1" },
          },
        }),
      } as Response)
      .mockResolvedValueOnce(
        mockNearbyResponse([
          { id: 10, name: "Quán Gần 1", distanceKm: 0.8 },
          { id: 11, name: "Quán Gần 2", distanceKm: 1.2 },
        ], 3, "EAT", "an_ngon")
      );

    render(<HomePage />);
    selectPreference("ĂN GÌ?", "Ăn ngon");
    await screen.findByText("API fixture 1");

    // Click "Gần tôi"
    fireEvent.click(screen.getByRole("button", { name: /Gần tôi/ }));

    await screen.findByText("Quán Gần 1");
    // Verify fetch was called with lat and lng
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("lat=16.068&lng=108.221"),
      expect.any(Object)
    );

    // Verify distance badges are rendered
    expect(screen.getByText("0,8 km")).toBeInTheDocument();
    expect(screen.getByText("1,2 km")).toBeInTheDocument();

    // Verify header indicates nearby count and radius
    expect(screen.getByText(/trong bán kính 3 km/)).toBeInTheDocument();
  });

  it("handles inaccurate GPS (>1000m): withholds lat/lng, falls back to citywide, and shows warning with retry", async () => {
    mockGeolocation((success) => {
      success({
        coords: {
          latitude: 16.068,
          longitude: 108.221,
          accuracy: 1500, // > 1000m inaccurate
          altitude: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
        } as unknown as GeolocationCoordinates,
        timestamp: Date.now(),
      } as unknown as GeolocationPosition);
    });

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        ok: true,
        data: {
          intent: "EAT",
          locale: "vi",
          preference: "an_ngon",
          count: 1,
          places: [apiPlace(1)],
          meta: { source: "neon-postgres", limit: 3, ranking: "provisional-v1" },
        },
      }),
    } as Response);

    render(<HomePage />);
    selectPreference("ĂN GÌ?", "Ăn ngon");
    await screen.findByText("API fixture 1");

    // Click "Gần tôi"
    fireEvent.click(screen.getByRole("button", { name: /Gần tôi/ }));

    // Warning banner appears
    await screen.findByText("Vị trí chưa đủ chính xác để tìm địa điểm gần bạn. Đang hiển thị gợi ý toàn thành phố.");
    expect(screen.getByRole("button", { name: "Thử lại" })).toBeInTheDocument();

    // The fetch calls should NOT have lat or lng
    const calls = vi.mocked(fetch).mock.calls;
    for (const call of calls) {
      expect(call[0]).not.toContain("lat=");
      expect(call[0]).not.toContain("lng=");
    }
  });

  it("handles GPS denied: falls back to citywide and displays warning message with retry", async () => {
    mockGeolocation((_success, error) => {
      error({
        code: 1, // PERMISSION_DENIED
        message: "User denied Geolocation",
        PERMISSION_DENIED: 1,
        POSITION_UNAVAILABLE: 2,
        TIMEOUT: 3,
      });
    });

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        ok: true,
        data: {
          intent: "EAT",
          locale: "vi",
          preference: "an_ngon",
          count: 1,
          places: [apiPlace(1)],
          meta: { source: "neon-postgres", limit: 3, ranking: "provisional-v1" },
        },
      }),
    } as Response);

    render(<HomePage />);
    selectPreference("ĂN GÌ?", "Ăn ngon");
    await screen.findByText("API fixture 1");

    fireEvent.click(screen.getByRole("button", { name: /Gần tôi/ }));

    await screen.findByText(/Bạn đã từ chối quyền vị trí/);
    expect(screen.getByRole("button", { name: "Thử lại" })).toBeInTheDocument();
  });

  it("handles GPS timeout: falls back to citywide and displays timeout warning with retry", async () => {
    mockGeolocation((_success, error) => {
      error({
        code: 3, // TIMEOUT
        message: "Timeout expired",
        PERMISSION_DENIED: 1,
        POSITION_UNAVAILABLE: 2,
        TIMEOUT: 3,
      });
    });

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        ok: true,
        data: {
          intent: "EAT",
          locale: "vi",
          preference: "an_ngon",
          count: 1,
          places: [apiPlace(1)],
          meta: { source: "neon-postgres", limit: 3, ranking: "provisional-v1" },
        },
      }),
    } as Response);

    render(<HomePage />);
    selectPreference("ĂN GÌ?", "Ăn ngon");
    await screen.findByText("API fixture 1");

    fireEvent.click(screen.getByRole("button", { name: /Gần tôi/ }));

    await screen.findByText(/Không nhận được phản hồi vị trí kịp thời/);
    expect(screen.getByRole("button", { name: "Thử lại" })).toBeInTheDocument();
  });

  it("renders dedicated Nearby empty state when 0 results within 5 km, and CTA 'Xem trên toàn Đà Nẵng' switches to citywide", async () => {
    mockGeolocation((success) => {
      success({
        coords: { latitude: 16.068, longitude: 108.221, accuracy: 20 },
      } as GeolocationPosition);
    });

    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          ok: true,
          data: {
            intent: "EAT",
            locale: "vi",
            preference: "an_ngon",
            count: 1,
            places: [apiPlace(1)],
            meta: { source: "neon-postgres", limit: 3, ranking: "provisional-v1" },
          },
        }),
      } as Response)
      .mockResolvedValueOnce(mockNearbyResponse([], 5, "EAT", "an_ngon"))
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          ok: true,
          data: {
            intent: "EAT",
            locale: "vi",
            preference: "an_ngon",
            count: 2,
            places: [apiPlace(1), apiPlace(2)],
            meta: { source: "neon-postgres", limit: 3, ranking: "provisional-v1" },
          },
        }),
      } as Response);

    render(<HomePage />);
    selectPreference("ĂN GÌ?", "Ăn ngon");
    await screen.findByText("API fixture 1");

    // Click "Gần tôi"
    fireEvent.click(screen.getByRole("button", { name: /Gần tôi/ }));

    // Empty state message within 5km appears
    await screen.findByText("Không tìm thấy địa điểm phù hợp trong 5 km.");
    const cta = screen.getByRole("button", { name: "Xem trên toàn Đà Nẵng" });
    expect(cta).toBeInTheDocument();

    // Click CTA "Xem trên toàn Đà Nẵng"
    fireEvent.click(cta);

    // Citywide results return
    await screen.findByText("API fixture 2");
    // Verify 3rd fetch call was citywide without lat/lng
    const lastCall = vi.mocked(fetch).mock.calls[2];
    expect(lastCall[0]).not.toContain("lat=");
    expect(lastCall[0]).not.toContain("lng=");
  });

  it("preserves race/stale protection: changing preference while GPS is requesting aborts or ignores stale response", async () => {
    let triggerSuccess!: (pos: GeolocationPosition) => void;
    mockGeolocation((success) => {
      triggerSuccess = success;
    });

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        ok: true,
        data: {
          intent: "EAT",
          locale: "vi",
          preference: "dac_san",
          count: 1,
          places: [apiPlace(99, "EAT")],
          meta: { source: "neon-postgres", limit: 3, ranking: "provisional-v1" },
        },
      }),
    } as Response);

    render(<HomePage />);
    selectPreference("ĂN GÌ?", "Ăn ngon");

    // Click "Gần tôi" -> in 'requesting' state
    const nearbyBtn = screen.getByRole("button", { name: /Gần tôi/ });
    fireEvent.click(nearbyBtn);

    // User immediately changes preference to "Đặc sản"
    fireEvent.click(screen.getByRole("button", { name: "Đổi lựa chọn" }));
    fireEvent.click(screen.getByRole("button", { name: "Đặc sản" }));

    // GPS callback resolves late
    if (triggerSuccess) {
      act(() => {
        triggerSuccess({
          coords: { latitude: 16.068, longitude: 108.221, accuracy: 10 },
        } as GeolocationPosition);
      });
    }

    // Should display Dac san heading and places cleanly
    await screen.findByRole("heading", { name: "ĂN GÌ? · Đặc sản" });
  });
});

describe("PlaceCard - Nearby distance badge vs Citywide", () => {
  it("renders distance badge only when distanceKm is present", () => {
    const nearbyPlace = {
      ...discoveryToCard(apiPlace(1)),
      distanceKm: 0.8,
    };
    render(<PlaceCard place={nearbyPlace} />);
    expect(screen.getByText("0,8 km")).toBeInTheDocument();
  });

  it("does NOT render distance badge when distanceKm is null or undefined (citywide)", () => {
    const citywidePlace = {
      ...discoveryToCard(apiPlace(1)),
      distanceKm: null,
    };
    render(<PlaceCard place={citywidePlace} />);
    expect(screen.queryByText(/km/)).not.toBeInTheDocument();
  });
});

describe("GO and STAY Nearby integration regression", () => {
  it("GO intent supports 'Gần tôi' action and renders nearby places", async () => {
    mockGeolocation((success) => {
      success({
        coords: { latitude: 16.068, longitude: 108.221, accuracy: 30 },
      } as GeolocationPosition);
    });

    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          ok: true,
          data: {
            intent: "GO",
            locale: "vi",
            preference: "thien_nhien",
            count: 1,
            places: [apiPlace(1, "GO")],
            meta: { source: "neon-postgres", limit: 3, ranking: "provisional-v1" },
          },
        }),
      } as Response)
      .mockResolvedValueOnce(
        mockNearbyResponse([{ id: 101, name: "Bán đảo Sơn Trà", section: "GO", distanceKm: 4.5 }], 5, "GO", "thien_nhien")
      );

    render(<HomePage />);
    selectPreference("ĐI ĐÂU?", "Thiên nhiên");
    await screen.findByText("API fixture 1");

    fireEvent.click(screen.getByRole("button", { name: /Gần tôi/ }));
    await screen.findByText("Bán đảo Sơn Trà");
    expect(screen.getByText("4,5 km")).toBeInTheDocument();
  });

  it("STAY intent supports 'Gần tôi' action and renders nearby places", async () => {
    mockGeolocation((success) => {
      success({
        coords: { latitude: 16.068, longitude: 108.221, accuracy: 30 },
      } as GeolocationPosition);
    });

    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          ok: true,
          data: {
            intent: "STAY",
            locale: "vi",
            preference: "gan_bien",
            count: 1,
            places: [apiPlace(1, "STAY")],
            meta: { source: "neon-postgres", limit: 3, ranking: "provisional-v1" },
          },
        }),
      } as Response)
      .mockResolvedValueOnce(
        mockNearbyResponse([{ id: 201, name: "Khách sạn Biển", section: "STAY", distanceKm: 0.5 }], 1, "STAY", "gan_bien")
      );

    render(<HomePage />);
    selectPreference("Ở ĐÂU?", "Gần biển");
    await screen.findByText("API fixture 1");

    fireEvent.click(screen.getByRole("button", { name: /Gần tôi/ }));
    await screen.findByText("Khách sạn Biển");
    expect(screen.getByText("0,5 km")).toBeInTheDocument();
  });
});
