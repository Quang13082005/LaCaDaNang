import type { DiscoveryLocale, DiscoverySection } from "@/lib/data/discovery-contract";
import { siteOrigin, placePath } from "./site";

// Static, crawlable directory of public places. Not a recommendation surface: no ranking claims.
export const BROWSE_SLUGS = { eat: "EAT", cafe: "CAFE", go: "GO", stay: "STAY" } as const;
export type BrowseSlug = keyof typeof BROWSE_SLUGS;
export const BROWSE_PAGE_SIZE = 100;
export const RELATED_PER_GROUP = 4;

export function parseBrowseSlug(value: string): BrowseSlug | null {
  return Object.prototype.hasOwnProperty.call(BROWSE_SLUGS, value) ? (value as BrowseSlug) : null;
}
export function slugOf(section: DiscoverySection): BrowseSlug {
  return section.toLowerCase() as BrowseSlug;
}
export function parseBrowsePage(value: string | undefined): number | null {
  if (value === undefined) return 1;
  if (!/^[1-9]\d{0,3}$/.test(value)) return null;
  return Number(value);
}
export function hubPath(slug: BrowseSlug, page = 1, locale: DiscoveryLocale = "vi"): string {
  const query = [locale === "vi" ? "" : `locale=${locale}`, page > 1 ? `page=${page}` : ""].filter(Boolean).join("&");
  return `/browse/${slug}${query ? `?${query}` : ""}`;
}

type Copy = {
  sections: Record<DiscoverySection, string>;
  navLabel: string;
  back: string;
  title: (section: string, page: number) => string;
  heading: (section: string) => string;
  description: (section: string, total: number) => string;
  intro: Record<DiscoverySection, string>;
  count: (total: number) => string;
  pageOf: (page: number, pages: number) => string;
  pagination: string;
  related: (area: string) => string;
};

export const BROWSE_COPY: Record<DiscoveryLocale, Copy> = {
  vi: {
    sections: { EAT: "Ăn uống", CAFE: "Cà phê", GO: "Vui chơi", STAY: "Lưu trú" },
    navLabel: "Danh sách địa điểm", back: "← La Cà Đà Nẵng",
    title: (s, p) => `${s} ở Đà Nẵng${p > 1 ? ` — trang ${p}` : ""} | La Cà Đà Nẵng`,
    heading: s => `${s} ở Đà Nẵng`,
    description: (s, n) => `Danh sách ${n} địa điểm ${s.toLowerCase()} ở Đà Nẵng với địa chỉ và liên kết Google Maps.`,
    intro: {
      EAT: "Danh bạ ẩm thực Đà Nẵng với đầy đủ quán ăn ngon, ẩm thực địa phương và các địa chỉ ăn uống đặc sản trải dài khắp các quận Hải Châu, Sơn Trà, Ngũ Hành Sơn, Thanh Khê. Cung cấp địa chỉ rõ ràng, số lượt đánh giá thực tế từ Google và liên kết chỉ đường Google Maps nhanh chóng.",
      GO: "Tổng hợp các địa điểm tham quan, vui chơi, danh lam thắng cảnh và bãi biển đẹp tại Đà Nẵng cùng khu vực lân cận (bán đảo Sơn Trà, Ngũ Hành Sơn, Bà Nà, Hội An). Tra cứu địa chỉ chính xác và vị trí bản đồ cho chuyến du lịch của bạn.",
      CAFE: "Danh bạ quán cà phê Đà Nẵng tổng hợp từ dữ liệu công khai, từ các tuyến phố trung tâm Hải Châu đến ven biển Ngũ Hành Sơn, Sơn Trà. Dễ dàng xem địa chỉ chuẩn xác, đánh giá cộng đồng và mở bản đồ tức thì.",
      STAY: "Danh bạ khách sạn, homestay và cơ sở lưu trú tại Đà Nẵng và vùng phụ cận, phân bố từ trung tâm thành phố đến khu vực gần biển và phố cổ. Cung cấp địa chỉ minh bạch giúp bạn thuận tiện lên kế hoạch nơi ở.",
    },
    count: n => `${n} địa điểm`, pageOf: (p, n) => `Trang ${p}/${n}`, pagination: "Phân trang",
    related: a => `Địa điểm khác ở ${a}`,
  },
  en: {
    sections: { EAT: "Eat & drink", CAFE: "Cafés", GO: "Things to do", STAY: "Stay" },
    navLabel: "Place directory", back: "← La Cà Đà Nẵng",
    title: (s, p) => `${s} in Da Nang${p > 1 ? ` — page ${p}` : ""} | La Cà Đà Nẵng`,
    heading: s => `${s} in Da Nang`,
    description: (s, n) => `Directory of ${n} places for "${s}" in Da Nang with addresses and Google Maps links.`,
    intro: {
      EAT: "Da Nang food directory featuring local eateries, restaurants, and regional specialties across Hai Chau, Son Tra, Ngu Hanh Son, and Thanh Khe. Check verified addresses, Google review counts, and direct Google Maps directions.",
      GO: "Sightseeing spots, attractions, landmarks, and beaches across Da Nang and neighboring areas (Son Tra Peninsula, Marble Mountains, Ba Na Hills, Hoi An). Look up exact locations for your trip.",
      CAFE: "Da Nang café directory compiled from public records, spanning downtown streets to coastal avenues. Easily check verified addresses, community ratings, and open directions instantly.",
      STAY: "Directory of hotels, homestays, and accommodations in Da Nang and nearby areas, spanning city center, beachfront, and ancient town areas. Transparent address details to help plan your stay.",
    },
    count: n => `${n} places`, pageOf: (p, n) => `Page ${p} of ${n}`, pagination: "Pagination",
    related: a => `More places in ${a}`,
  },
  ko: {
    sections: { EAT: "먹거리", CAFE: "카페", GO: "즐길 거리", STAY: "숙박" },
    navLabel: "장소 목록", back: "← La Cà Đà Nẵng",
    title: (s, p) => `다낭 ${s}${p > 1 ? ` — ${p}페이지` : ""} | La Cà Đà Nẵng`,
    heading: s => `다낭 ${s}`,
    description: (s, n) => `주소와 Google 지도 링크가 있는 다낭 ${s} 장소 ${n}곳의 목록입니다.`,
    intro: {
      EAT: "하이쩌우, 손짜, 응우하인손, 타잉케 등 다낭 전역의 맛집, 로컬 식당, 대표 먹거리를 모은 디렉터리입니다. 실제 주소와 Google 리뷰 수를 확인하고 Google 지도 길찾기로 바로 이동할 수 있습니다.",
      GO: "손짜 반도, 오행산, 바나힐, 호이안 등 다낭 및 인근 지역의 관광 명소, 즐길 거리, 해변 정보입니다. 여행 중 가볼 만한 곳의 위치를 손쉽게 찾아보세요.",
      CAFE: "도심부터 해변가까지 다낭 전역의 카페를 정리한 디렉터리입니다. 정확한 주소와 방문자 리뷰를 확인하고 Google 지도로 편리하게 찾아가세요.",
      STAY: "다낭 시내 중심가부터 해변 인근 및 고대 도시 지역까지 다양한 호텔, 홈스테이, 숙박 시설 목록입니다. 투명한 위치 정보를 바탕으로 여행 일정을 계획해보세요.",
    },
    count: n => `${n}곳`, pageOf: (p, n) => `${p}/${n} 페이지`, pagination: "페이지 이동",
    related: a => `${a}의 다른 장소`,
  },
};

export function browseItemListJsonLd(
  slug: BrowseSlug,
  page: number,
  places: { id: number; name: string; address: string }[],
  total: number,
  locale: DiscoveryLocale = "vi"
) {
  const origin = siteOrigin();
  const copy = BROWSE_COPY[locale];
  const sectionName = copy.sections[BROWSE_SLUGS[slug]];
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: copy.heading(sectionName),
    url: origin + hubPath(slug, page, locale),
    numberOfItems: places.length,
    itemListElement: places.map((place, idx) => ({
      "@type": "ListItem",
      position: (page - 1) * BROWSE_PAGE_SIZE + idx + 1,
      item: {
        "@type": "Place",
        name: place.name,
        address: place.address,
        url: origin + placePath(place.id, locale),
      },
    })),
  };
}
