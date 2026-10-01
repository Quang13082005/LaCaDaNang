import fs from "fs";
import path from "path";
import {
  CuratedSeedSchema,
  Place,
  CuratedTag,
  CurationStatus,
} from "@/lib/data/place-schema";

interface RawCandidate {
  id: string;
  name: string;
  section: "EAT" | "GO" | "STAY";
  primaryType: string;
  address: string;
  shortAddress: string | null;
  lat: number;
  lng: number;
  googleMapsUrl: string;
  rating?: number;
  reviewCount?: number;
  photoCount?: number;
  imageUrl?: string | null;
  priceLevel?: string | null;
  distanceFromCenter?: number;
  businessStatus?: string;
}

interface RawData {
  _meta: Record<string, unknown>;
  places: RawCandidate[];
}

function getFriendlyTypeName(type: string, section: "EAT" | "GO" | "STAY"): string {
  const map: Record<string, string> = {
    restaurant: "Nhà hàng ẩm thực",
    vietnamese_restaurant: "Nhà hàng món Việt",
    seafood_restaurant: "Nhà hàng hải sản",
    cafe: "Quán cà phê",
    coffee_shop: "Quán cà phê",
    bar: "Quầy bar / Lounge",
    pub: "Pub đồ uống",
    bakery: "Tiệm bánh ngọt",
    hotel: "Khách sạn nghỉ dưỡng",
    resort_hotel: "Khu nghỉ dưỡng (Resort)",
    motel: "Khách sạn / Nhà nghỉ",
    tourist_attraction: "Điểm tham quan du lịch",
    water_park: "Công viên nước",
    church: "Công trình kiến trúc tôn giáo",
    point_of_interest: "Địa điểm tham quan nổi bật",
  };
  return map[type] || (section === "EAT" ? "Địa điểm ẩm thực" : section === "STAY" ? "Cơ sở lưu trú" : "Điểm tham quan");
}

export function runSeedCuration() {
  const rootDir = process.cwd();
  const candidatePath = path.join(rootDir, "danang_mvp_candidates_v2.json");

  if (!fs.existsSync(candidatePath)) {
    throw new Error(`Candidate file not found at ${candidatePath}`);
  }

  const raw: RawData = JSON.parse(fs.readFileSync(candidatePath, "utf8"));
  const inputCount = raw.places.length;

  let excludedHoiAnDienBan = 0;
  let excludedDistanceOver15 = 0;
  let excludedNonDiscovery = 0;
  let excludedDuplicateChains = 0;
  let excludedInvalid = 0;

  const validEAT: Place[] = [];
  const validGO: Place[] = [];
  const validSTAY: Place[] = [];

  // Track seen chain names to prevent duplicate branches
  const seenChainNames = new Set<string>();

  for (const rawPlace of raw.places) {
    const name = (rawPlace.name || "").trim();
    const address = (rawPlace.address || "").toLowerCase();
    const shortAddress = (rawPlace.shortAddress || "").toLowerCase();

    // 1. Check basic validity (Source fact verification)
    if (!name || name.length <= 2 || !rawPlace.googleMapsUrl) {
      excludedInvalid++;
      continue;
    }

    // 2. Exclude Hội An, Điện Bàn, Quảng Nam (strictly Da Nang only)
    if (
      address.includes("hội an") ||
      shortAddress.includes("hội an") ||
      address.includes("điện bàn") ||
      shortAddress.includes("điện bàn") ||
      address.includes("quảng nam") ||
      name.toLowerCase().includes("hội an")
    ) {
      excludedHoiAnDienBan++;
      continue;
    }

    // 3. Exclude distance > 15km
    const dist = rawPlace.distanceFromCenter ?? 0;
    if (dist > 15) {
      excludedDistanceOver15++;
      continue;
    }

    // 4. Exclude travel agencies, transport, non-discovery service providers
    const type = rawPlace.primaryType || "";
    if (
      type === "tourist_information_center" ||
      type === "travel_agency" ||
      type === "golf_course" ||
      name.toLowerCase().includes("công ty cổ phần") ||
      name.toLowerCase().includes("dịch vụ du lịch")
    ) {
      excludedNonDiscovery++;
      continue;
    }

    // 5. Deduplicate chain branches (keep flagship/first branch)
    const normalizedBrand = name
      .toLowerCase()
      .replace(/\s*(đà nẵng|cơ sở|chi nhánh|\d+|quán|tiệm|nhà hàng).*/g, "")
      .trim();

    if (normalizedBrand.length > 4) {
      if (seenChainNames.has(normalizedBrand)) {
        excludedDuplicateChains++;
        continue;
      }
      seenChainNames.add(normalizedBrand);
    }

    // 6. Section classification adjustments:
    // "Công Viên Nước Mikazuki 365" was misclassified under STAY in raw crawl; re-classify as GO
    let section = rawPlace.section;
    if (type === "water_park" || name.includes("Công Viên Nước")) {
      section = "GO";
    }

    // 7. DETERMINISTIC TAG DERIVATION (Strictly limited to 5 Safe Auto-Derived Tags)
    // Documented in docs/DATA_TAG_RULES.md
    const autoTags: CuratedTag[] = [];
    const manualReviewTags: CuratedTag[] = [];
    const lowerName = name.toLowerCase();

    const rating = rawPlace.rating ?? 4.0;
    const reviewCount = rawPlace.reviewCount ?? 0;
    const lng = rawPlace.lng;

    // Rule 1: POPULAR (rating >= 4.6 and reviewCount >= 1000)
    if (rating >= 4.6 && reviewCount >= 1000) {
      autoTags.push("POPULAR");
    }

    // Rule 2: CAFE (primaryType or name contains cafe/cà phê/coffee)
    if (
      type === "cafe" ||
      type === "coffee_shop" ||
      /\b(cà phê|cafe|coffee)\b/i.test(name)
    ) {
      autoTags.push("CAFE");
    }

    // Rule 3: SEAFOOD (primaryType or name contains hải sản/seafood/ốc)
    if (
      type === "seafood_restaurant" ||
      /\b(hải sản|seafood|ốc)\b/i.test(name)
    ) {
      autoTags.push("SEAFOOD");
    }

    // Rule 4: CENTRAL (Hải Châu district or distance <= 3.0km)
    if (
      address.includes("hải châu") ||
      shortAddress.includes("hải châu") ||
      dist <= 3.0
    ) {
      autoTags.push("CENTRAL");
    }

    // Rule 5: NEAR_BEACH (Beach longitude band >= 108.240 or coastal streets)
    if (
      lng >= 108.240 ||
      /võ nguyên giáp|hoàng sa|trường sa|nguyễn tất thành|mỹ khê/i.test(
        address + " " + shortAddress
      )
    ) {
      autoTags.push("NEAR_BEACH");
    }

    // 8. SUBJECTIVE TAGS FOR MANUAL REVIEW QUEUE (NOT in production curatedTags)
    // Gather hints to queue into docs/MANUAL_CURATION_QUEUE.md
    if (section === "EAT") {
      if (
        /bánh cuốn|mì quảng|bánh xèo|bún|phở|bánh mì|cơm|đặc sản/i.test(lowerName) ||
        type.includes("vietnamese")
      ) {
        manualReviewTags.push("LOCAL_FOOD", "SPECIALTY");
      }
      if (/bistro|steak|chay|ấm cúng|bếp cuốn|michelin/i.test(lowerName)) {
        manualReviewTags.push("DATE");
      }
      if (/nướng|lẩu|bbq|goyuhan|mộc quán|hải sản/i.test(lowerName)) {
        manualReviewTags.push("GROUP");
      }
      if (autoTags.includes("CAFE")) {
        manualReviewTags.push("QUIET");
      }
      if (reviewCount > 2500) {
        manualReviewTags.push("FAMILY");
      }
    } else if (section === "STAY") {
      if (/resort|villa|boutique|spa/i.test(lowerName)) {
        manualReviewTags.push("DATE", "QUIET");
      } else {
        manualReviewTags.push("FAMILY", "GROUP");
      }
    } else if (section === "GO") {
      if (/vọng cảnh|sơn trà/i.test(lowerName)) {
        manualReviewTags.push("SCENIC", "NATURE", "PHOTO");
      } else if (/cầu vượt|mikazuki/i.test(lowerName)) {
        manualReviewTags.push("PHOTO", "SCENIC");
      } else if (/công viên nước/i.test(lowerName)) {
        manualReviewTags.push("FAMILY", "GROUP");
      } else if (/nhà thờ|nhà cổ/i.test(lowerName)) {
        manualReviewTags.push("PHOTO");
      } else if (/nam ô/i.test(lowerName)) {
        manualReviewTags.push("NATURE", "SCENIC");
      }
    }

    // Deduplicate autoTags and manualReviewTags
    const finalAutoTags = Array.from(new Set(autoTags));
    const finalManualTags = Array.from(
      new Set(manualReviewTags.filter((t) => !finalAutoTags.includes(t)))
    );

    // Curation provenance status
    const curationStatus: CurationStatus =
      finalManualTags.length > 0 ? "NEEDS_REVIEW" : "AUTO_VERIFIED";

    // 9. PURE FACTUAL REASONS (No marketing fluff or ungrounded claims)
    const reasons: string[] = [];
    if (rating > 0 && reviewCount > 0) {
      reasons.push(
        `Đánh giá ${rating.toFixed(1)}⭐ từ ${reviewCount.toLocaleString(
          "vi-VN"
        )} lượt đánh giá trên Google Maps`
      );
    } else {
      reasons.push("Địa điểm đã được xác thực tọa độ trên Google Maps");
    }

    reasons.push(
      `Tọa lạc tại ${rawPlace.shortAddress || "Đà Nẵng"} (cách trung tâm khoảng ${dist.toFixed(1)} km)`
    );

    if (rawPlace.photoCount && rawPlace.photoCount > 0) {
      reasons.push(
        `Hơn ${rawPlace.photoCount} hình ảnh được xác nhận trong dữ liệu nguồn`
      );
    } else {
      reasons.push(`Phân loại cơ sở: ${getFriendlyTypeName(type, section)}`);
    }

    // 10. TIME TAGS & DURATION: STRICTLY EMPTY / NULL IN PHASE 2A.2
    const timeTags: Place["timeTags"] = [];
    const bestTimeOfDay: Place["bestTimeOfDay"] = [];
    const typicalDurationMinutes = null;

    const placeRecord: Place = {
      id: rawPlace.id,
      name,
      section,
      primaryType: rawPlace.primaryType || "establishment",
      address: rawPlace.address || "Đà Nẵng, Việt Nam",
      shortAddress: rawPlace.shortAddress || "Đà Nẵng",
      lat: rawPlace.lat,
      lng: rawPlace.lng,
      googleMapsUrl: rawPlace.googleMapsUrl,
      rating: rawPlace.rating,
      reviewCount: rawPlace.reviewCount,
      photoCount: rawPlace.photoCount,
      imageUrl: null, // Strictly null pending owned/licensed photography
      priceLevel: null, // Strictly null as source has no verified price level
      curatedTags: finalAutoTags,
      manualReviewTags: finalManualTags,
      curationStatus,
      reasons,
      timeTags,
      typicalDurationMinutes,
      bestTimeOfDay,
      featured: rating >= 4.8 && reviewCount >= 3000,
      distanceFromCenter: dist,
      iconicException: false,
    };

    if (section === "EAT") validEAT.push(placeRecord);
    else if (section === "GO") validGO.push(placeRecord);
    else if (section === "STAY") validSTAY.push(placeRecord);
  }

  // Rank and select balanced Top subsets:
  // EAT: Top 50 highest quality/confidence
  const sortedEAT = validEAT
    .sort((a, b) => {
      const scoreA = (a.rating || 4.0) * 20 + Math.log10(Math.max(a.reviewCount || 1, 1)) * 15;
      const scoreB = (b.rating || 4.0) * 20 + Math.log10(Math.max(b.reviewCount || 1, 1)) * 15;
      return scoreB - scoreA;
    })
    .slice(0, 50);

  // STAY: Top 30 highest quality/confidence
  const sortedSTAY = validSTAY
    .sort((a, b) => {
      const scoreA = (a.rating || 4.0) * 20 + Math.log10(Math.max(a.reviewCount || 1, 1)) * 15;
      const scoreB = (b.rating || 4.0) * 20 + Math.log10(Math.max(b.reviewCount || 1, 1)) * 15;
      return scoreB - scoreA;
    })
    .slice(0, 30);

  // GO: All genuine verified places from candidate file (DO NOT invent fake places!)
  const sortedGO = validGO.sort(
    (a, b) => (b.reviewCount || 0) - (a.reviewCount || 0)
  );

  const curatedPlaces = [...sortedEAT, ...sortedGO, ...sortedSTAY];

  const curatedSeedData = {
    _meta: {
      dataset: "LaCaDaNang Curated MVP Seed",
      version: "2.1.0-phase2a.2-hardened",
      curatedAt: new Date().toISOString(),
      totalPlaces: curatedPlaces.length,
      counts: {
        EAT: sortedEAT.length,
        GO: sortedGO.length,
        STAY: sortedSTAY.length,
      },
      rulesApplied: [
        "Phase 2A.2 Curation Evidence Hardening",
        "distanceFromCenter <= 15km",
        "strictly exclude Hội An / Quảng Nam / Điện Bàn",
        "exclude travel agencies / service providers / irrelevant golf & beach clubs outside Da Nang",
        "deduplicate chain branches",
        "strictly 5 safe auto-derived tags (POPULAR, CAFE, SEAFOOD, CENTRAL, NEAR_BEACH)",
        "remove all unverified CHEAP tags (priceLevel is null)",
        "remove all unverified NIGHT tags (no opening hours data)",
        "subjective tags moved to manualReviewTags queue for human review",
        "timeTags and bestTimeOfDay set to empty []",
        "typicalDurationMinutes set to null",
        "reasons contain purely factual statements (rating, location, category, photos)",
        "imageUrl set to null pending licensed photography",
      ],
      notes:
        "Curation evidence hardened. Subjective tags are in manual review queue. GO gap documented in docs/GO_DATA_GAPS.md.",
    },
    places: curatedPlaces,
  };

  // Validate entire output with Zod
  const validatedSeed = CuratedSeedSchema.parse(curatedSeedData);

  // Save to src/data/curated/curated-places.json
  const outputDir = path.join(rootDir, "src/data/curated");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, "curated-places.json");
  fs.writeFileSync(outputPath, JSON.stringify(validatedSeed, null, 2), "utf8");

  return {
    inputCount,
    curatedCount: curatedPlaces.length,
    eatCount: sortedEAT.length,
    goCount: sortedGO.length,
    stayCount: sortedSTAY.length,
    excludedHoiAnDienBan,
    excludedDistanceOver15,
    excludedNonDiscovery,
    excludedDuplicateChains,
    excludedInvalid,
    curatedPlaces,
  };
}
