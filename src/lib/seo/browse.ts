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

const viCopy: Copy = {
  sections: { EAT: "Ăn uống", CAFE: "Cà phê", GO: "Vui chơi", STAY: "Lưu trú" },
  navLabel: "Danh sách địa điểm", back: "← La Cà Đà Nẵng",
  title: (s, p) => `${s} ở Đà Nẵng${p > 1 ? ` — trang ${p}` : ""} | La Cà Đà Nẵng`,
  heading: s => `${s} ở Đà Nẵng`,
  description: (s, n) => `Danh sách ${n} địa điểm ${s.toLowerCase()} ở Đà Nẵng với địa chỉ và liên kết Google Maps.`,
  intro: {
    EAT: "Khám phá ẩm thực Đà Nẵng qua danh mục quán ăn, món ăn địa phương và các địa điểm ăn uống tại các quận Hải Châu, Sơn Trà, Ngũ Hành Sơn, Thanh Khê. Bạn có thể theo dõi tên cơ sở, địa chỉ theo khu vực và xem vị trí địa điểm trên Google Maps để chủ động chọn điểm đến.",
    GO: "Khám phá các điểm tham quan, vui chơi, ngắm cảnh và trải nghiệm văn hóa tại Đà Nẵng cùng khu vực lân cận như bán đảo Sơn Trà, Ngũ Hành Sơn, Bà Nà và Hội An. Danh bạ cung cấp tên điểm đến cùng địa chỉ cụ thể giúp bạn dễ dàng tra cứu vị trí trên bản đồ cho hành trình du lịch.",
    CAFE: "Khám phá các quán cà phê tại Đà Nẵng theo thông tin và khu vực thực tế, từ các trục đường trung tâm quận Hải Châu đến các tuyến phố ven biển Sơn Trà, Ngũ Hành Sơn. Tra cứu nhanh tên quán, vị trí và xem vị trí trên Google Maps phục vụ nhu cầu gặp gỡ, làm việc hay thư giãn.",
    STAY: "Tìm kiếm và so sánh địa điểm lưu trú tại Đà Nẵng dựa trên thông tin khách sạn, homestay và nhà nghỉ được phân bố từ trung tâm thành phố đến khu vực ven biển và lân cận. Tra cứu tên cơ sở và địa chỉ niêm yết để chủ động lựa chọn nơi ở phù hợp với lịch trình di chuyển.",
  },
  count: n => `${n} địa điểm`, pageOf: (p, n) => `Trang ${p}/${n}`, pagination: "Phân trang",
  related: a => `Địa điểm khác ở ${a}`,
};

const enCopy: Copy = {
  sections: { EAT: "Eat & drink", CAFE: "Cafés", GO: "Things to do", STAY: "Stay" },
  navLabel: "Place directory", back: "← La Cà Đà Nẵng",
  title: (s, p) => `${s} in Da Nang${p > 1 ? ` — page ${p}` : ""} | La Cà Đà Nẵng`,
  heading: s => `${s} in Da Nang`,
  description: (s, n) => `Directory of ${n} places for "${s}" in Da Nang with addresses and Google Maps links.`,
  intro: {
    EAT: "Explore Da Nang dining options, local eateries, and food spots across Hai Chau, Son Tra, Ngu Hanh Son, and Thanh Khe districts. Browse listed venue names and neighborhood addresses, then view places on Google Maps to plan your food journey.",
    GO: "Discover sightseeing spots, entertainment areas, scenic viewpoints, and cultural experiences across Da Nang and nearby destinations including Son Tra Peninsula, Marble Mountains, Ba Na Hills, and Hoi An. Check listed addresses to plan your travel routes.",
    CAFE: "Explore cafés across Da Nang organized by listed locations, spanning downtown Hai Chau streets to coastal avenues in Son Tra and Ngu Hanh Son. Look up café names and district addresses, and view locations on Google Maps for casual meetups, remote work, or relaxation.",
    STAY: "Find and compare accommodations in Da Nang using listed hotel and homestay information distributed across downtown, beachfront, and surrounding areas. Review property names and addresses to choose lodging suited to your travel schedule.",
  },
  count: n => `${n} places`, pageOf: (p, n) => `Page ${p} of ${n}`, pagination: "Pagination",
  related: a => `More places in ${a}`,
};

const koCopy: Copy = {
  sections: { EAT: "먹거리", CAFE: "카페", GO: "즐길 거리", STAY: "숙박" },
  navLabel: "장소 목록", back: "← La Cà Đà Nẵng",
  title: (s, p) => `다낭 ${s}${p > 1 ? ` — ${p}페이지` : ""} | La Cà Đà Nẵng`,
  heading: s => `다낭 ${s}`,
  description: (s, n) => `주소와 Google 지도 링크가 있는 다낭 ${s} 장소 ${n}곳의 목록입니다.`,
  intro: {
    EAT: "하이쩌우, 손짜, 응우하인손, 타잉케 등 다낭 전역의 식당, 로컬 음식점 및 식음료 장소를 탐색할 수 있습니다. 상호명과 지역별 등록 주소를 확인하고 Google 지도에서 위치를 확인하여 여행 동선에 맞는 식사 장소를 계획해보세요.",
    GO: "손짜 반도, 오행산, 바나힐, 호이안 등 다낭 및 인근 지역의 관광 명소, 즐길 거리, 전망 지점과 문화 체험 공간을 탐색해보세요. 등록된 상호와 주소를 통해 지도 위치를 확인하고 편리하게 여행 일정을 세울 수 있습니다.",
    CAFE: "하이쩌우 중심가부터 손짜, 응우하인손 해변 도로까지 등록된 위치 정보를 바탕으로 다낭 카페를 탐색해보세요. 등록된 상호명과 행정구역 주소를 확인하고 모임이나 휴식을 위해 Google 지도에서 장소 위치를 확인할 수 있습니다.",
    STAY: "다낭 도심부터 해변가 및 주변 지역까지 등록된 호텔과 홈스테이 정보를 바탕으로 숙소를 찾고 비교해보세요. 숙소명과 주소를 확인하여 여행 일정과 이동 경로에 알맞은 숙소를 선택할 수 있습니다.",
  },
  count: n => `${n}곳`, pageOf: (p, n) => `${p}/${n} 페이지`, pagination: "페이지 이동",
  related: a => `${a}의 다른 장소`,
};

const ruCopy: Copy = {
  sections: { EAT: "Еда и напитки", CAFE: "Кафе", GO: "Развлечения", STAY: "Жилье" },
  navLabel: "Каталог мест", back: "← La Cà Đà Nẵng",
  title: (s, p) => `${s} в Дананге${p > 1 ? ` — страница ${p}` : ""} | La Cà Đà Nẵng`,
  heading: s => `${s} в Дананге`,
  description: (s, n) => `Каталог из ${n} мест в категории «${s}» в Дананге с адресами и ссылками на Google Maps.`,
  intro: {
    EAT: "Познакомьтесь с гастрономией Дананга через подборку ресторанов, местных заведений и традиционных блюд в районах Хайтяу, Шонтра, Нгуханьшон и Тханькхе. Вы можете узнать названия заведений, адреса по районам и посмотреть расположение на Google Maps для удобного планирования трапезы.",
    GO: "Откройте для себя достопримечательности, развлечения, смотровые площадки и культурные места Дананга и окрестностей, включая полуостров Шонтра, Мраморные горы, Бана Хиллс и Хойан. В каталоге указаны точные адреса для удобного поиска на карте и планирования маршрутов.",
    CAFE: "Исследуйте кофейни Дананга по районам города — от центральных улиц района Хайтяу до прибрежных проспектов Шонтра и Нгуханьшон. Узнавайте названия заведений, адреса и проверяйте их расположение на Google Maps для встреч, работы или приятного отдыха.",
    STAY: "Ищите и сравнивайте варианты размещения в Дананге на основе актуальной информации об отелях, гостевых домах и хостелах в центре, у моря и в окрестностях. Проверяйте названия и адреса, чтобы выбрать подходящее жилье под ваш маршрут.",
  },
  count: n => `${n} мест`, pageOf: (p, n) => `Страница ${p}/${n}`, pagination: "Навигация по страницам",
  related: a => `Другие места в районе ${a}`,
};

const zhCopy: Copy = {
  sections: { EAT: "美食餐饮", CAFE: "特色咖啡", GO: "休闲游玩", STAY: "住宿推荐" },
  navLabel: "地点目录", back: "← La Cà Đà Nẵng",
  title: (s, p) => `岘港${s}${p > 1 ? ` — 第 ${p} 页` : ""} | La Cà Đà Nẵng`,
  heading: s => `岘港${s}`,
  description: (s, n) => `汇集岘港 ${n} 处${s}地点，包含详细地址与 Google 地图位置链接。`,
  intro: {
    EAT: "探索岘港丰富的美食文化，汇集海洲、山茶、五行山、清溪等主要区域的餐馆、特色风味小吃与地道美食。您可以查看商户名称、区域地址，并在 Google 地图上确认位置，便捷规划美食之旅。",
    GO: "探索岘港及其周边的观光胜地、游乐休闲、观景好去处与人文体验，涵盖山茶半岛、五行山、巴拿山与会安等地。目录提供地点名称与详细地址，便于在地图上查阅位置并合理安排旅行路线。",
    CAFE: "按实际街区探索岘港咖啡厅，从海洲区繁华市中心街道延伸至山茶与五行山的沿海大道。快速查阅咖啡馆名称、街区位置并在 Google 地图上查看，满足朋友聚会、远程办公或休闲放松的需求。",
    STAY: "基于岘港市内酒店、民宿与客栈信息，轻松对比市中心、滨海及周边区域的住宿选择。查看商户名称与登记地址，根据行程路线挑选最契合的下榻之所。",
  },
  count: n => `${n} 处地点`, pageOf: (p, n) => `第 ${p}/${n} 页`, pagination: "分页导航",
  related: a => `${a}的其他地点`,
};

export const BROWSE_COPY: Record<DiscoveryLocale, Copy> = {
  vi: viCopy,
  en: enCopy,
  ko: koCopy,
  ru: ruCopy,
  zh: zhCopy,
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
