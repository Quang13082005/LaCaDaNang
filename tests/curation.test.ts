import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { runSeedCuration } from "@/lib/data/build-curated-seed";
import {
  CuratedSeedSchema,
  PlaceSchema,
  CURATED_TAGS,
  TIME_TAGS,
} from "@/lib/data/place-schema";

describe("Phase 2A.2 Curation Evidence Hardening Suite", () => {
  const result = runSeedCuration();

  it("audits the candidate file and produces the curated seed", () => {
    expect(result.inputCount).toBe(300);
    expect(result.curatedCount).toBeGreaterThanOrEqual(80);
    expect(result.curatedCount).toBeLessThanOrEqual(120);

    // EAT target: 40-50
    expect(result.eatCount).toBe(50);
    // STAY target: 20-30
    expect(result.stayCount).toBe(30);
    // GO from candidate: genuine places only (6 places)
    expect(result.goCount).toBe(6);
  });

  it("strictly excludes Hội An, Điện Bàn, and Quảng Nam records", () => {
    expect(result.excludedHoiAnDienBan).toBeGreaterThan(0);

    for (const place of result.curatedPlaces) {
      const addr = (place.address || "").toLowerCase();
      const shortAddr = (place.shortAddress || "").toLowerCase();
      expect(addr).not.toContain("hội an");
      expect(shortAddr).not.toContain("hội an");
      expect(addr).not.toContain("điện bàn");
      expect(shortAddr).not.toContain("điện bàn");
    }
  });

  it("enforces default radius distance <= 15 km from Da Nang center", () => {
    for (const place of result.curatedPlaces) {
      if (!place.iconicException) {
        expect(place.distanceFromCenter).toBeLessThanOrEqual(15);
      }
    }
  });

  it("excludes non-discovery establishments and travel agencies", () => {
    expect(result.excludedNonDiscovery).toBeGreaterThan(0);
    for (const place of result.curatedPlaces) {
      expect(place.name.toLowerCase()).not.toContain("công ty cổ phần");
      expect(place.name.toLowerCase()).not.toContain("dịch vụ du lịch");
      expect(place.primaryType).not.toBe("tourist_information_center");
      expect(place.primaryType).not.toBe("golf_course");
    }
  });

  it("deduplicates chain branches to prevent single-chain monopolization", () => {
    expect(result.excludedDuplicateChains).toBeGreaterThan(0);

    const names = result.curatedPlaces.map((p) => p.name.toLowerCase());
    const eziCount = names.filter((n) => n.includes("ezi")).length;
    const goyuhanCount = names.filter((n) => n.includes("goyuhan")).length;

    expect(eziCount).toBeLessThanOrEqual(1);
    expect(goyuhanCount).toBeLessThanOrEqual(1);
  });

  it("strictly prohibits auto-assigning CHEAP when priceLevel is null", () => {
    for (const place of result.curatedPlaces) {
      expect(place.priceLevel).toBeNull();
      expect(place.curatedTags).not.toContain("CHEAP");
      if (place.manualReviewTags) {
        expect(place.manualReviewTags).not.toContain("CHEAP");
      }
    }
  });

  it("strictly prohibits auto-assigning NIGHT or unverified timeTags when opening hours are absent", () => {
    for (const place of result.curatedPlaces) {
      expect(place.curatedTags).not.toContain("NIGHT");
      expect(place.timeTags).toHaveLength(0);
      expect(place.bestTimeOfDay).toHaveLength(0);
    }
  });

  it("strictly restricts production curatedTags to the 5 Safe Auto-Derived Tags only", () => {
    const allowedSafeTags = new Set([
      "POPULAR",
      "CAFE",
      "SEAFOOD",
      "CENTRAL",
      "NEAR_BEACH",
    ]);

    const subjectiveTags = [
      "DATE",
      "QUIET",
      "LIVELY",
      "FAMILY",
      "GROUP",
      "CHEAP",
      "NIGHT",
      "PHOTO",
      "SCENIC",
      "NATURE",
      "SPECIALTY",
      "LOCAL_FOOD",
    ];

    for (const place of result.curatedPlaces) {
      for (const tag of place.curatedTags) {
        expect(allowedSafeTags.has(tag)).toBe(true);
        expect(subjectiveTags).not.toContain(tag);
      }
    }
  });

  it("enforces typicalDurationMinutes to be null in Phase 2A.2", () => {
    for (const place of result.curatedPlaces) {
      expect(place.typicalDurationMinutes).toBeNull();
    }
  });

  it("verifies that reasons are 100% factual and contain no unverified marketing claims", () => {
    const forbiddenFluff = [
      "tươi ngon",
      "thân thiện",
      "lãng mạn",
      "ấm cúng",
      "yên tĩnh",
      "view đẹp",
      "view triệu đô",
      "chu đáo",
      "hấp dẫn",
    ];

    for (const place of result.curatedPlaces) {
      expect(place.reasons.length).toBeGreaterThanOrEqual(1);
      expect(place.reasons.length).toBeLessThanOrEqual(4);

      for (const reason of place.reasons) {
        const lower = reason.toLowerCase();
        for (const fluff of forbiddenFluff) {
          expect(lower).not.toContain(fluff);
        }
      }
    }
  });

  it("verifies that every place preserves original source facts (ID, coords, Google Maps URL)", () => {
    for (const place of result.curatedPlaces) {
      expect(place.id).toBeTruthy();
      expect(place.name.length).toBeGreaterThanOrEqual(2);
      expect(place.googleMapsUrl).toMatch(
        /^https:\/\/(maps\.google\.com|(www\.)?google\.com\/maps)/
      );
      expect(place.lat).toBeGreaterThanOrEqual(15.9);
      expect(place.lat).toBeLessThanOrEqual(16.3);
      expect(place.lng).toBeGreaterThanOrEqual(108.0);
      expect(place.lng).toBeLessThanOrEqual(108.4);
    }
  });

  it("validates the entire final seed output against Zod schema without any errors", () => {
    const outputPath = path.join(
      process.cwd(),
      "src/data/curated/curated-places.json"
    );
    expect(fs.existsSync(outputPath)).toBe(true);

    const fileContent = JSON.parse(fs.readFileSync(outputPath, "utf8"));
    const parsed = CuratedSeedSchema.safeParse(fileContent);

    expect(parsed.success).toBe(true);
    if (!parsed.success) {
      console.error(parsed.error.format());
    }
  });

  it("rejects junk names, empty names, and invalid records in schema validation", () => {
    const invalidJunkPlace = {
      id: "test_junk",
      name: ".", // Junk name < 2 chars
      section: "EAT",
      primaryType: "restaurant",
      address: "123 Đường Trần Phú, Hải Châu, Đà Nẵng",
      lat: 16.07,
      lng: 108.22,
      googleMapsUrl: "https://maps.google.com/?cid=123",
      curatedTags: ["POPULAR"],
      reasons: ["Đánh giá 4.8 sao từ 1000 lượt khách"],
      timeTags: [],
      bestTimeOfDay: [],
      featured: false,
      distanceFromCenter: 2.5,
    };
    const parsedJunk = PlaceSchema.safeParse(invalidJunkPlace);
    expect(parsedJunk.success).toBe(false);

    const invalidUrlPlace = {
      ...invalidJunkPlace,
      name: "Quán Ăn Ngon Hợp Lệ",
      googleMapsUrl: "invalid-url",
    };
    const parsedUrl = PlaceSchema.safeParse(invalidUrlPlace);
    expect(parsedUrl.success).toBe(false);
  });

  it("handles missing optional fields without crashing or schema error", () => {
    const minimalPlace = {
      id: "place_minimal",
      name: "Địa Điểm Tối Giản",
      section: "EAT" as const,
      primaryType: "vietnamese_restaurant",
      address: "Số 10 Bạch Đằng, Hải Châu, Đà Nẵng",
      lat: 16.068,
      lng: 108.224,
      googleMapsUrl: "https://maps.google.com/?cid=9999",
      shortAddress: null,
      imageUrl: null,
      priceLevel: null,
      rating: undefined,
      reviewCount: undefined,
      photoCount: undefined,
      typicalDurationMinutes: null,
      curatedTags: ["POPULAR" as const],
      reasons: ["Địa điểm đã xác thực trên Google Maps"],
      timeTags: [],
      bestTimeOfDay: [],
      featured: false,
      distanceFromCenter: 1.2,
    };

    const parsed = PlaceSchema.safeParse(minimalPlace);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.imageUrl).toBeNull();
      expect(parsed.data.priceLevel).toBeNull();
      expect(parsed.data.rating).toBeUndefined();
    }
  });

  it("handles iconicException flag correctly for places beyond 15km", () => {
    const iconicPlace = {
      id: "place_bana",
      name: "Bà Nà Hills & Cầu Vàng",
      section: "GO" as const,
      primaryType: "amusement_park",
      address: "Thôn An Sơn, Hòa Ninh, Hòa Vang, Đà Nẵng",
      lat: 15.998,
      lng: 107.986,
      googleMapsUrl: "https://maps.google.com/?cid=8888",
      curatedTags: ["POPULAR" as const],
      reasons: ["Đánh giá 4.7 sao từ 50000 lượt khách"],
      timeTags: [],
      bestTimeOfDay: [],
      featured: true,
      distanceFromCenter: 25.4,
      iconicException: true,
    };

    const parsed = PlaceSchema.safeParse(iconicPlace);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.iconicException).toBe(true);
      expect(parsed.data.distanceFromCenter).toBeGreaterThan(15);
    }
  });
});
