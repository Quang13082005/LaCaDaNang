import type { DiscoveryLocale, DiscoverySection } from "@/lib/data/discovery-contract";

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
    count: n => `${n} địa điểm`, pageOf: (p, n) => `Trang ${p}/${n}`, pagination: "Phân trang",
    related: a => `Địa điểm khác ở ${a}`,
  },
  en: {
    sections: { EAT: "Eat & drink", CAFE: "Cafés", GO: "Things to do", STAY: "Stay" },
    navLabel: "Place directory", back: "← La Cà Đà Nẵng",
    title: (s, p) => `${s} in Da Nang${p > 1 ? ` — page ${p}` : ""} | La Cà Đà Nẵng`,
    heading: s => `${s} in Da Nang`,
    description: (s, n) => `Directory of ${n} places for "${s}" in Da Nang with addresses and Google Maps links.`,
    count: n => `${n} places`, pageOf: (p, n) => `Page ${p} of ${n}`, pagination: "Pagination",
    related: a => `More places in ${a}`,
  },
  ko: {
    sections: { EAT: "먹거리", CAFE: "카페", GO: "즐길 거리", STAY: "숙박" },
    navLabel: "장소 목록", back: "← La Cà Đà Nẵng",
    title: (s, p) => `다낭 ${s}${p > 1 ? ` — ${p}페이지` : ""} | La Cà Đà Nẵng`,
    heading: s => `다낭 ${s}`,
    description: (s, n) => `주소와 Google 지도 링크가 있는 다낭 ${s} 장소 ${n}곳의 목록입니다.`,
    count: n => `${n}곳`, pageOf: (p, n) => `${p}/${n} 페이지`, pagination: "페이지 이동",
    related: a => `${a}의 다른 장소`,
  },
};
