export type Section = "EAT" | "GO" | "STAY";

export type CuratedTag =
  | "an_ngon"
  | "it_tien"
  | "hen_ho"
  | "gia_dinh"
  | "di_nhom"
  | "yen_tinh"
  | "nhon_nhip"
  | "dac_san"
  | "an_dem"
  | "bien_ngam_canh"
  | "chup_anh_dep"
  | "thien_nhien"
  | "vui_choi"
  | "di_buoi_toi"
  | "gia_re"
  | "gan_bien"
  | "gan_trung_tam"
  | "cap_doi"
  | "nguoi_yeu"
  | "ban_be"
  | "mot_minh"
  | "thu_gian"
  | "chup_anh"
  | "an_uong"
  | "tiet_kiem"
  | "chon_giup_toi";

export type TimeTag = "morning" | "afternoon" | "evening" | "late_night";

export type PriceLevel = 1 | 2 | 3;

export interface Place {
  id: string;
  name: string;
  section: Section;
  primaryType: string;
  address: string;
  shortAddress?: string;
  lat: number;
  lng: number;
  googleMapsUrl: string;
  rating: number;
  reviewCount: number;
  photoCount: number;
  imageUrl: string;
  priceLevel?: PriceLevel;
  curatedTags: CuratedTag[];
  reasons: string[];
  timeTags: TimeTag[];
  typicalDurationMinutes?: number;
  bestTimeOfDay?: TimeTag[];
  featured: boolean;
  distanceFromCenter: number;
}
