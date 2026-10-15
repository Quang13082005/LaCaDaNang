import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { PlaceCard } from "@/components/results/PlaceCard";
import { ItineraryStop } from "@/components/itinerary/ItineraryStop";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import { LOCALE_STORAGE_KEY } from "@/lib/i18n/locales";
import { trackMapsClicked } from "@/lib/analytics/client";
import { sendGaEvent } from "@/lib/analytics/ga4";
import type { DiscoveryPlace } from "@/lib/data/discovery-contract";
import { apiPlace } from "./discovery-fixtures";

vi.mock("@/lib/analytics/client", () => ({ trackMapsClicked: vi.fn() }));
vi.mock("@/lib/analytics/ga4", () => ({ sendGaEvent: vi.fn(), isGaActive: vi.fn() }));

afterEach(() => { cleanup(); localStorage.clear(); vi.clearAllMocks(); });

describe("Dual CTA and Maps place actions across all intents", () => {
  const detailLabel = {
    vi: "Xem chi tiết địa điểm",
    en: "View place details",
    ko: "장소 상세 보기",
  };

  for (const locale of ["vi", "en", "ko"] as const) {
    it.each(["NOW", "EAT", "GO", "STAY"] as const)(
      `${locale} %s renders Primary Maps CTA and Secondary View Details CTA`,
      (intent) => {
        localStorage.setItem(LOCALE_STORAGE_KEY, locale);
        const url = "https://maps.google.com/?cid=15858543023798826021";
        render(
          <LocaleProvider>
            <PlaceCard
              place={{
                id: 33,
                name: "Verified place",
                typeLabel: "Cafe",
                area: "Hai Chau",
                googleMapsUrl: url,
                rating: null,
                reviewCount: null,
              }}
              intent={intent}
              preference="general"
            />
          </LocaleProvider>
        );

        // 1. Title heading link: no decoration-sky-200, clean typography
        const titleLink = screen.getByRole("link", { name: "Verified place" });
        const expectedDetailHref = `/places/33${locale === "vi" ? "" : `?locale=${locale}`}`;
        expect(titleLink).toHaveAttribute("href", expectedDetailHref);

        // 2. Primary CTA: Google Maps (opens external in new tab)
        const mapsLink = screen.getAllByRole("link").find((l) => l.getAttribute("href") === url)!;
        expect(mapsLink).toBeDefined();
        expect(mapsLink).toHaveAttribute("target", "_blank");
        expect(mapsLink).toHaveAttribute("rel", "noopener noreferrer");

        // 3. Secondary CTA: View Details (opens internal detail page)
        const detailLink = screen.getByRole("link", { name: new RegExp(detailLabel[locale], "i") });
        expect(detailLink).toHaveAttribute("href", expectedDetailHref);

        // Test Primary CTA click tracking
        fireEvent.click(mapsLink);
        expect(trackMapsClicked).toHaveBeenCalledWith(
          33,
          1,
          intent,
          "general",
          locale,
          "manual",
          undefined,
          undefined
        );

        // Test Secondary CTA click tracking (fires place_detail_opened)
        fireEvent.click(detailLink);
        expect(sendGaEvent).toHaveBeenCalledWith("place_detail_opened", {
          place_id: 33,
          locale,
        });

        // Ensure no interactive popup/dialog/calendar buttons remain
        expect(screen.queryAllByRole("button")).toHaveLength(0);
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
        expect(document.body.textContent).not.toMatch(/Calendar|\.ics|Nhắc tôi|Remind me|알림 받기/i);
      }
    );
  }

  it("NOW intent gracefully falls back to time_slot preference when omitted", () => {
    localStorage.setItem(LOCALE_STORAGE_KEY, "vi");
    const url = "https://maps.google.com/?cid=999";
    render(
      <LocaleProvider>
        <PlaceCard
          place={{
            id: 99,
            name: "Fallback Place",
            typeLabel: "",
            area: "",
            googleMapsUrl: url,
            rating: null,
            reviewCount: null,
          }}
          intent="NOW"
          position={2}
          // preference intentionally omitted to test fallback defense
        />
      </LocaleProvider>
    );

    const mapsLink = screen.getAllByRole("link").find((l) => l.getAttribute("href") === url)!;
    fireEvent.click(mapsLink);

    expect(trackMapsClicked).toHaveBeenCalledWith(
      99,
      2,
      "NOW",
      "time_slot",
      "vi",
      "manual",
      undefined,
      undefined
    );
  });

  it("omits Secondary CTA and renders plain text title when place.id is missing or non-positive", () => {
    localStorage.setItem(LOCALE_STORAGE_KEY, "vi");
    const url = "https://maps.google.com/?cid=555";
    render(
      <LocaleProvider>
        <PlaceCard
          place={{
            id: 0, // non-positive ID
            name: "Unregistered Place",
            typeLabel: "",
            area: "",
            googleMapsUrl: url,
            rating: null,
            reviewCount: null,
          }}
          intent="EAT"
          preference="an_vat"
        />
      </LocaleProvider>
    );

    // Title is plain text, not a link
    expect(screen.queryByRole("link", { name: "Unregistered Place" })).toBeNull();
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent("Unregistered Place");

    // Detail button is not rendered
    expect(screen.queryByRole("link", { name: /Xem chi tiết địa điểm/i })).toBeNull();

    // Primary Maps link still works
    const mapsLink = screen.getByRole("link", { name: /Xem trên Google Maps/i });
    expect(mapsLink).toHaveAttribute("href", url);
  });
});

describe("ItineraryStop NOW integration", () => {
  it("renders PlaceCard with intent NOW, preference time_slot, and correct 1-based position", () => {
    localStorage.setItem(LOCALE_STORAGE_KEY, "vi");
    const mockStop: DiscoveryPlace = {
      ...apiPlace(77, "CAFE"),
      name: "Now Stop Cafe",
      googleMapsUrl: "https://maps.google.com/?cid=77",
    };

    render(
      <LocaleProvider>
        <ItineraryStop stop={mockStop} index={1} isLast={false} />
      </LocaleProvider>
    );

    const mapsLink = screen.getAllByRole("link").find((l) => l.getAttribute("href") === mockStop.googleMapsUrl)!;
    fireEvent.click(mapsLink);

    expect(trackMapsClicked).toHaveBeenCalledWith(
      77,
      2, // index 1 -> position 2
      "NOW",
      "time_slot",
      "vi",
      "manual",
      undefined,
      undefined
    );

    // Also verify detail link opens /places/77
    const detailLink = screen.getByRole("link", { name: /Xem chi tiết địa điểm/i });
    expect(detailLink).toHaveAttribute("href", "/places/77");
    fireEvent.click(detailLink);
    expect(sendGaEvent).toHaveBeenCalledWith("place_detail_opened", {
      place_id: 77,
      locale: "vi",
    });
  });
});
