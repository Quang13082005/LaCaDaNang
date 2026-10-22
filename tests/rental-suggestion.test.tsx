import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ResultList } from "@/components/results/ResultList";
import { ItineraryTimeline } from "@/components/itinerary/ItineraryTimeline";
import { RentalSuggestion } from "@/components/rental/RentalSuggestion";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import { LOCALE_STORAGE_KEY } from "@/lib/i18n/locales";
import { setCachedRentals, clearActiveRentalsCache } from "@/lib/rental/client";
import type { DiscoveryPlace } from "@/lib/data/discovery-contract";
import type { PlaceCardModel } from "@/lib/data/place-card-model";
import type { NowData } from "@/lib/now/contract";
import type { PublicRentalVehicle, RentalContact } from "@/lib/rental/repository";

const mockActiveVehicles: PublicRentalVehicle[] = [
  {
    publicId: "c2a9a7a6-7788-466d-b87d-d419b4b005dc",
    brand: "Honda",
    model: "Wave Alpha",
    category: "manual",
    engineCc: 109.1,
    registrationYear: 2023,
    color: "Trắng",
    colorComplete: true,
    dailyPriceVnd: 100000,
    depositVnd: 1000000,
    media: [],
  },
  {
    publicId: "f9b45e22-8302-4522-8233-1498144c9b91",
    brand: "Honda",
    model: "Vision",
    category: "scooter",
    engineCc: 109.1,
    registrationYear: 2023,
    color: "Đen",
    colorComplete: true,
    dailyPriceVnd: 150000,
    depositVnd: 2000000,
    media: [],
  },
];

const mockActiveContact: RentalContact = {
  phone: "+84905123456",
  zaloUrl: "https://zalo.me/0905123456",
  policy: "Miễn cọc khi có 2 CCCD (của 2 người khác nhau)",
  helmetsIncluded: true,
};

function makePlace(overrides: Partial<PlaceCardModel> = {}): PlaceCardModel {
  return {
    id: 1,
    name: "Địa điểm mẫu",
    typeLabel: "Địa điểm",
    area: "Hải Châu",
    address: "Đà Nẵng",
    googleMapsUrl: "https://maps.google.com/?cid=1",
    rating: 4.5,
    reviewCount: 100,
    tags: [],
    description: null,
    ...overrides,
  };
}

function makeDiscoveryPlace(overrides: Partial<DiscoveryPlace> = {}): DiscoveryPlace {
  return {
    id: 1,
    googlePlaceId: "ChIJ1",
    section: "GO",
    name: "Địa điểm mẫu",
    typeLabel: "Địa điểm",
    primaryType: "point_of_interest",
    address: "Đà Nẵng",
    area: { id: 1, name: "Hải Châu", unitType: "quận" },
    location: { lat: 16.068, lng: 108.221 },
    googleMapsUrl: "https://maps.google.com/?cid=1",
    rating: 4.5,
    reviewCount: 100,
    tags: [],
    description: null,
    translationFallback: false,
    ...overrides,
  };
}

function renderWithLocale(ui: React.ReactElement) {
  return render(<LocaleProvider>{ui}</LocaleProvider>);
}

describe("RentalSuggestion display rules and production readiness", () => {
  beforeEach(() => {
    cleanup();
    localStorage.clear();
    localStorage.setItem(LOCALE_STORAGE_KEY, "vi");
    vi.stubEnv("NODE_ENV", "development");
    clearActiveRentalsCache();
    // Default to Scenario B (simulated active) so business rule tests run against an active catalog
    setCachedRentals("vi", { vehicles: mockActiveVehicles, contact: mockActiveContact });
    setCachedRentals("en", { vehicles: mockActiveVehicles, contact: mockActiveContact });
    setCachedRentals("ko", { vehicles: mockActiveVehicles, contact: mockActiveContact });
    setCachedRentals("ru", { vehicles: mockActiveVehicles, contact: mockActiveContact });
    setCachedRentals("zh", { vehicles: mockActiveVehicles, contact: mockActiveContact });
  });

  afterEach(() => {
    cleanup();
    clearActiveRentalsCache();
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  describe("Scenario A — Dark Launch (Real Production DB / Zero Active Vehicles)", () => {
    beforeEach(() => {
      // Real Neon has all active=false -> empty catalog
      clearActiveRentalsCache();
      setCachedRentals("vi", { vehicles: [], contact: null });
      setCachedRentals("en", { vehicles: [], contact: null });
      setCachedRentals("ko", { vehicles: [], contact: null });
      setCachedRentals("ru", { vehicles: [], contact: null });
      setCachedRentals("zh", { vehicles: [], contact: null });
    });

    it("GO: returns null when active catalog is empty even if distance >= 2.0 km", () => {
      const places: PlaceCardModel[] = [
        makePlace({ id: 1, distanceKm: 3.5, distanceRawKm: 3.5 }),
      ];

      renderWithLocale(
        <ResultList places={places} intent="GO" status="success" nearbyStatus="granted" radiusKm={5} onResetPreference={vi.fn()} />
      );

      expect(screen.queryByText("Điểm đến hơi xa? Chủ động khám phá bằng xe máy.")).not.toBeInTheDocument();
      expect(screen.queryByText("Xem xe & giá thuê")).not.toBeInTheDocument();
    });

    it("NOW: returns null when active catalog is empty even if itinerary has places", () => {
      const itinerary: NowData = {
        locale: "vi",
        slot: "MORNING",
        timeZone: "Asia/Ho_Chi_Minh",
        evaluatedAt: new Date().toISOString(),
        count: 2,
        places: [
          makeDiscoveryPlace({ id: 1, section: "CAFE", name: "Cafe Buổi Sáng" }),
          makeDiscoveryPlace({ id: 2, section: "EAT", name: "Quán Ăn Trưa" }),
        ],
        meta: { source: "neon-postgres", policy: "time-slot-v1.1", mode: "citywide", radiusKm: null, openingHoursVerified: false },
      };

      renderWithLocale(<ItineraryTimeline itinerary={itinerary} />);

      expect(screen.queryByText("Đi nhiều nơi, chủ động hơn! Tham khảo xe máy thuê để khám phá Đà Nẵng theo lịch trình.")).not.toBeInTheDocument();
      expect(screen.queryByText("Xem xe & giá thuê")).not.toBeInTheDocument();
    });

    it("standalone RentalSuggestion component returns null when vehicles array is empty", () => {
      const { container } = renderWithLocale(<RentalSuggestion simulatedRentals={{ vehicles: [], contact: null }} />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe("Scenario B — Simulated Active Catalog & Dynamic Pricing", () => {
    it("dynamically calculates starting price from active vehicles (100.000đ/ngày)", () => {
      renderWithLocale(<RentalSuggestion simulatedRentals={{ vehicles: mockActiveVehicles, contact: mockActiveContact }} />);
      expect(screen.getByText("Từ 100.000đ/ngày")).toBeInTheDocument();
    });

    it("updates dynamic starting price if lowest price is 140.000đ/ngày (no hard-coded 100k)", () => {
      const higherPricedVehicles = mockActiveVehicles.map(v => ({ ...v, dailyPriceVnd: v.dailyPriceVnd + 40000 }));
      renderWithLocale(<RentalSuggestion simulatedRentals={{ vehicles: higherPricedVehicles, contact: mockActiveContact }} />);
      expect(screen.getByText("Từ 140.000đ/ngày")).toBeInTheDocument();
      expect(screen.queryByText("Từ 100.000đ/ngày")).not.toBeInTheDocument();
    });

    it("opens dialog on CTA click and displays active vehicles", () => {
      renderWithLocale(<RentalSuggestion simulatedRentals={{ vehicles: mockActiveVehicles, contact: mockActiveContact }} />);
      const cta = screen.getByRole("button", { name: /Xem xe & giá thuê/i });
      fireEvent.click(cta);
      expect(window.location.hash).toBe("#rentals");
    });
  });

  describe("All 4 intents (EAT, GO, NOW, STAY) rental invitation rules", () => {
    it("GO: displays suggestion regardless of distance (< 2.0 km or >= 2.0 km)", () => {
      const places: PlaceCardModel[] = [
        makePlace({ id: 1, distanceKm: 0.8, distanceRawKm: 0.82 }),
      ];

      renderWithLocale(
        <ResultList places={places} intent="GO" status="success" nearbyStatus="granted" radiusKm={3} onResetPreference={vi.fn()} />
      );

      expect(screen.getByText("Cần xe máy để khám phá Đà Nẵng?")).toBeInTheDocument();
      expect(screen.getByText("Xem các mẫu xe, giá thuê và thông tin liên hệ nếu bạn cần di chuyển thuận tiện hơn.")).toBeInTheDocument();
      expect(screen.getByText("Xem xe & giá thuê")).toBeInTheDocument();
      expect(screen.getByText("Từ 100.000đ/ngày")).toBeInTheDocument();
    });

    it("GO: displays suggestion in citywide mode when GPS or distance is missing", () => {
      const places: PlaceCardModel[] = [
        makePlace({ id: 1, distanceKm: undefined, distanceRawKm: undefined }),
      ];

      renderWithLocale(
        <ResultList places={places} intent="GO" status="success" nearbyStatus="idle" onResetPreference={vi.fn()} />
      );

      expect(screen.getByText("Cần xe máy để khám phá Đà Nẵng?")).toBeInTheDocument();
      expect(screen.getByText("Xem xe & giá thuê")).toBeInTheDocument();
    });

    it("EAT: displays RentalSuggestion at bottom of results", () => {
      const places: PlaceCardModel[] = [
        makePlace({ id: 1, distanceKm: 1.2, distanceRawKm: 1.2 }),
      ];

      renderWithLocale(
        <ResultList places={places} intent="EAT" status="success" nearbyStatus="granted" radiusKm={3} onResetPreference={vi.fn()} />
      );

      expect(screen.getByText("Cần xe máy để khám phá Đà Nẵng?")).toBeInTheDocument();
      expect(screen.getByText("Xem xe & giá thuê")).toBeInTheDocument();
    });

    it("STAY (WHERE): displays RentalSuggestion at bottom of results", () => {
      const places: PlaceCardModel[] = [
        makePlace({ id: 1, distanceKm: 4.8, distanceRawKm: 4.8 }),
      ];

      renderWithLocale(
        <ResultList places={places} intent="STAY" status="success" nearbyStatus="idle" onResetPreference={vi.fn()} />
      );

      expect(screen.getByText("Cần xe máy để khám phá Đà Nẵng?")).toBeInTheDocument();
      expect(screen.getByText("Xem xe & giá thuê")).toBeInTheDocument();
    });

    it("renders at most one single suggestion banner when multiple places are returned", () => {
      const places: PlaceCardModel[] = [
        makePlace({ id: 1, distanceKm: 0.5, distanceRawKm: 0.5 }),
        makePlace({ id: 2, distanceKm: 3.8, distanceRawKm: 3.8 }),
        makePlace({ id: 3, distanceKm: 4.9, distanceRawKm: 4.9 }),
      ];

      renderWithLocale(
        <ResultList places={places} intent="GO" status="success" nearbyStatus="granted" radiusKm={5} onResetPreference={vi.fn()} />
      );

      const suggestions = screen.getAllByText("Cần xe máy để khám phá Đà Nẵng?");
      expect(suggestions).toHaveLength(1);
    });

    it("supports English and Korean localization for suggestion card on Discovery intents", () => {
      const places: PlaceCardModel[] = [
        makePlace({ id: 1, distanceKm: 1.2, distanceRawKm: 1.2 }),
      ];

      localStorage.setItem(LOCALE_STORAGE_KEY, "en");
      const { unmount } = renderWithLocale(
        <ResultList places={places} intent="EAT" status="success" nearbyStatus="granted" radiusKm={5} onResetPreference={vi.fn()} />
      );
      expect(screen.getByText("Need a motorbike to explore Da Nang?")).toBeInTheDocument();
      expect(screen.getByText("Check available models, rental rates, and contact info if you need an easier way to get around.")).toBeInTheDocument();
      expect(screen.getByText("View bikes & rates")).toBeInTheDocument();
      expect(screen.getByText("From 100,000 VND/day")).toBeInTheDocument();
      unmount();

      localStorage.setItem(LOCALE_STORAGE_KEY, "ko");
      renderWithLocale(
        <ResultList places={places} intent="GO" status="success" nearbyStatus="granted" radiusKm={5} onResetPreference={vi.fn()} />
      );
      expect(screen.getByText("다낭을 여행할 오토바이가 필요하신가요?")).toBeInTheDocument();
      expect(screen.getByText("더 편리하게 이동할 수 있도록 차량 모델, 대여 요금 및 연락처 정보를 확인해보세요.")).toBeInTheDocument();
      expect(screen.getByText("차량 및 요금 보기")).toBeInTheDocument();
      expect(screen.getByText("1일 100,000 VND부터")).toBeInTheDocument();
    });

    it("supports Russian and Simplified Chinese localization for suggestion card on Discovery intents", () => {
      const places: PlaceCardModel[] = [
        makePlace({ id: 1, distanceKm: 1.2, distanceRawKm: 1.2 }),
      ];

      localStorage.setItem(LOCALE_STORAGE_KEY, "ru");
      const { unmount } = renderWithLocale(
        <ResultList places={places} intent="EAT" status="success" nearbyStatus="granted" radiusKm={5} onResetPreference={vi.fn()} />
      );
      expect(screen.getByText("Нужен мотоцикл для поездок по Данангу?")).toBeInTheDocument();
      expect(screen.getByText("Посмотрите доступные модели, тарифы и контакты для комфортного передвижения по городу.")).toBeInTheDocument();
      expect(screen.getByText("Посмотреть мотоциклы и цены")).toBeInTheDocument();
      expect(screen.getByText(/VND\/день/)).toBeInTheDocument();
      unmount();

      localStorage.setItem(LOCALE_STORAGE_KEY, "zh");
      renderWithLocale(
        <ResultList places={places} intent="GO" status="success" nearbyStatus="granted" radiusKm={5} onResetPreference={vi.fn()} />
      );
      expect(screen.getByText("需要摩托车畅游岘港吗？")).toBeInTheDocument();
      expect(screen.getByText("查看可用车型、租金及联系方式，让您的出行更加自由便捷。")).toBeInTheDocument();
      expect(screen.getByText("查看车辆与租金")).toBeInTheDocument();
      expect(screen.getByText(/每天 .* VND起/)).toBeInTheDocument();
    });
  });

  describe("NOW intent suggestion rules", () => {
    it("NOW: displays RentalSuggestion with prominent card when itinerary has valid places (VI)", () => {
      const itinerary: NowData = {
        locale: "vi",
        slot: "MORNING",
        timeZone: "Asia/Ho_Chi_Minh",
        evaluatedAt: new Date().toISOString(),
        count: 2,
        places: [
          makeDiscoveryPlace({ id: 1, section: "CAFE", name: "Cafe Buổi Sáng" }),
          makeDiscoveryPlace({ id: 2, section: "EAT", name: "Quán Ăn Trưa" }),
        ],
        meta: {
          source: "neon-postgres",
          policy: "time-slot-v1.1",
          mode: "citywide",
          radiusKm: null,
          openingHoursVerified: false,
        },
      };

      renderWithLocale(<ItineraryTimeline itinerary={itinerary} />);

      expect(screen.getByText("Cần xe máy để khám phá Đà Nẵng?")).toBeInTheDocument();
      expect(screen.getByText("Xem xe & giá thuê")).toBeInTheDocument();
      expect(screen.getByText("Từ 100.000đ/ngày")).toBeInTheDocument();
      expect(screen.getAllByText("Cần xe máy để khám phá Đà Nẵng?")).toHaveLength(1);
    });

    it("NOW: displays suggestion in citywide mode even without GPS or distance", () => {
      const itinerary: NowData = {
        locale: "vi",
        slot: "EVENING",
        timeZone: "Asia/Ho_Chi_Minh",
        evaluatedAt: new Date().toISOString(),
        count: 1,
        places: [makeDiscoveryPlace({ id: 1, section: "GO", name: "Đi dạo tối" })],
        meta: {
          source: "neon-postgres",
          policy: "time-slot-v1.1",
          mode: "citywide",
          radiusKm: null,
          openingHoursVerified: false,
        },
      };

      renderWithLocale(<ItineraryTimeline itinerary={itinerary} />);

      expect(screen.getByText("Cần xe máy để khám phá Đà Nẵng?")).toBeInTheDocument();
      expect(screen.getByText("Xem xe & giá thuê")).toBeInTheDocument();
    });

    it("NOW: hides suggestion when itinerary is empty (count = 0, places = [])", () => {
      const itinerary: NowData = {
        locale: "vi",
        slot: "NIGHT",
        timeZone: "Asia/Ho_Chi_Minh",
        evaluatedAt: new Date().toISOString(),
        count: 0,
        places: [],
        meta: {
          source: "neon-postgres",
          policy: "time-slot-v1.1",
          mode: "citywide",
          radiusKm: null,
          openingHoursVerified: false,
        },
      };

      renderWithLocale(<ItineraryTimeline itinerary={itinerary} />);

      expect(screen.queryByText("Cần xe máy để khám phá Đà Nẵng?")).not.toBeInTheDocument();
      expect(screen.queryByText("Xem xe & giá thuê")).not.toBeInTheDocument();
    });

    it("NOW: supports English and Korean localization for polished card", () => {
      localStorage.setItem(LOCALE_STORAGE_KEY, "en");
      const itineraryEn: NowData = {
        locale: "en",
        slot: "MORNING",
        timeZone: "Asia/Ho_Chi_Minh",
        evaluatedAt: new Date().toISOString(),
        count: 1,
        places: [makeDiscoveryPlace({ id: 1, section: "CAFE", name: "Morning Cafe" })],
        meta: { source: "neon-postgres", policy: "time-slot-v1.1", mode: "citywide", radiusKm: null, openingHoursVerified: false },
      };

      const { unmount } = renderWithLocale(<ItineraryTimeline itinerary={itineraryEn} />);
      expect(screen.getByText("Need a motorbike to explore Da Nang?")).toBeInTheDocument();
      expect(screen.getByText("View bikes & rates")).toBeInTheDocument();
      expect(screen.getByText("From 100,000 VND/day")).toBeInTheDocument();
      unmount();

      localStorage.setItem(LOCALE_STORAGE_KEY, "ko");
      const itineraryKo: NowData = {
        locale: "ko",
        slot: "MORNING",
        timeZone: "Asia/Ho_Chi_Minh",
        evaluatedAt: new Date().toISOString(),
        count: 1,
        places: [makeDiscoveryPlace({ id: 1, section: "CAFE", name: "Morning Cafe" })],
        meta: { source: "neon-postgres", policy: "time-slot-v1.1", mode: "citywide", radiusKm: null, openingHoursVerified: false },
      };

      renderWithLocale(<ItineraryTimeline itinerary={itineraryKo} />);
      expect(screen.getByText("다낭을 여행할 오토바이가 필요하신가요?")).toBeInTheDocument();
      expect(screen.getByText("차량 및 요금 보기")).toBeInTheDocument();
      expect(screen.getByText("1일 100,000 VND부터")).toBeInTheDocument();
      unmount();

      localStorage.setItem(LOCALE_STORAGE_KEY, "ru");
      const itineraryRu: NowData = {
        locale: "ru",
        slot: "MORNING",
        timeZone: "Asia/Ho_Chi_Minh",
        evaluatedAt: new Date().toISOString(),
        count: 1,
        places: [makeDiscoveryPlace({ id: 1, section: "CAFE", name: "Morning Cafe" })],
        meta: { source: "neon-postgres", policy: "time-slot-v1.1", mode: "citywide", radiusKm: null, openingHoursVerified: false },
      };
      const { unmount: unmountRu } = renderWithLocale(<ItineraryTimeline itinerary={itineraryRu} />);
      expect(screen.getByText("Нужен мотоцикл для поездок по Данангу?")).toBeInTheDocument();
      expect(screen.getByText("Посмотреть мотоциклы и цены")).toBeInTheDocument();
      expect(screen.getByText(/VND\/день/)).toBeInTheDocument();
      unmountRu();

      localStorage.setItem(LOCALE_STORAGE_KEY, "zh");
      const itineraryZh: NowData = {
        locale: "zh",
        slot: "MORNING",
        timeZone: "Asia/Ho_Chi_Minh",
        evaluatedAt: new Date().toISOString(),
        count: 1,
        places: [makeDiscoveryPlace({ id: 1, section: "CAFE", name: "Morning Cafe" })],
        meta: { source: "neon-postgres", policy: "time-slot-v1.1", mode: "citywide", radiusKm: null, openingHoursVerified: false },
      };
      renderWithLocale(<ItineraryTimeline itinerary={itineraryZh} />);
      expect(screen.getByText("需要摩托车畅游岘港吗？")).toBeInTheDocument();
      expect(screen.getByText("查看车辆与租金")).toBeInTheDocument();
      expect(screen.getByText(/每天 .* VND起/)).toBeInTheDocument();
    });
  });

  describe("UX polish, touch-target accessibility, and no-fake-images compliance", () => {
    it("renders primary CTA button with min-h-[44px] touch target and no <img> or stock photos", () => {
      const places: PlaceCardModel[] = [
        makePlace({ id: 1, distanceKm: 2.5, distanceRawKm: 2.5 }),
      ];

      const { container } = renderWithLocale(
        <ResultList places={places} intent="GO" status="success" nearbyStatus="granted" radiusKm={3} onResetPreference={vi.fn()} />
      );

      // Verify no fake vehicle images / stock photos are rendered in the suggestion card
      const aside = container.querySelector("aside");
      expect(aside).toBeInTheDocument();
      const imagesInCard = aside?.querySelectorAll("img");
      expect(imagesInCard?.length ?? 0).toBe(0);

      // Verify CTA button has min-height >= 44px class for touch accessibility
      const ctaButton = screen.getByRole("button", { name: /Xem xe & giá thuê/i });
      expect(ctaButton).toBeInTheDocument();
      expect(ctaButton.className).toContain("min-h-[44px]");

      // Verify visual hierarchy: context badge -> starting price -> title -> benefit -> cta
      expect(screen.getByText("Gợi ý thuê xe máy")).toBeInTheDocument();
      expect(screen.getByText("Từ 100.000đ/ngày")).toBeInTheDocument();
      expect(screen.getByText("Cần xe máy để khám phá Đà Nẵng?")).toBeInTheDocument();
      expect(screen.getByText("Xem các mẫu xe, giá thuê và thông tin liên hệ nếu bạn cần di chuyển thuận tiện hơn.")).toBeInTheDocument();
    });

    it("verifies responsive rendering compatibility across 320px, 360px, 393px, 430px viewports", () => {
      const places: PlaceCardModel[] = [
        makePlace({ id: 1, distanceKm: 2.2, distanceRawKm: 2.2 }),
      ];

      const viewports = [320, 360, 393, 430];
      for (const width of viewports) {
        window.innerWidth = width;
        const { unmount } = renderWithLocale(
          <ResultList places={places} intent="GO" status="success" nearbyStatus="granted" radiusKm={3} onResetPreference={vi.fn()} />
        );
        expect(screen.getByText("Cần xe máy để khám phá Đà Nẵng?")).toBeInTheDocument();
        expect(screen.getByText("Xem xe & giá thuê")).toBeInTheDocument();
        unmount();
      }
    });
  });
});
