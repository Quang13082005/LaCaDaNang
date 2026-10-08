// Product UI metadata, independent of legacy venue/demo objects.
export interface IntentConfig {
  id: "EAT" | "GO" | "NOW" | "STAY";
  label: string;
  sublabel: string;
  emoji: string;
  categoryBadge: string;
  thumbnailUrl: string;
  isFeatured?: boolean;
}

export interface PreferenceChipConfig {
  id: string;
  label: string;
  emoji: string;
}

export const PRIMARY_INTENTS: IntentConfig[] = [
  {
    id: "NOW",
    label: "BÂY GIỜ LÀM GÌ?",
    sublabel: "Lịch trình mẫu nhanh",
    emoji: "⚡",
    categoryBadge: "Lịch trình mẫu",
    thumbnailUrl: "/images/demo/dragon-bridge.svg",
    isFeatured: true,
  },
  {
    id: "EAT",
    label: "ĂN GÌ?",
    sublabel: "Quán ăn & món ngon",
    emoji: "🍜",
    categoryBadge: "Ẩm thực địa phương",
    thumbnailUrl: "/images/demo/bep-cuon.svg",
  },
  {
    id: "GO",
    label: "ĐI ĐÂU?",
    sublabel: "Điểm đến & trải nghiệm",
    emoji: "📍",
    categoryBadge: "Điểm đến & Trải nghiệm",
    thumbnailUrl: "/images/demo/my-khe-beach.svg",
  },
  {
    id: "STAY",
    label: "Ở ĐÂU?",
    sublabel: "Tìm chỗ nghỉ",
    emoji: "🛏️",
    categoryBadge: "Lưu trú hợp gu",
    thumbnailUrl: "/images/demo/sala-danang.svg",
  },
];

export const PREFERENCES_BY_INTENT: Record<string, PreferenceChipConfig[]> = {
  EAT: [
    { id: "an_ngon", label: "Ăn ngon", emoji: "😋" },
    { id: "dac_san", label: "Đặc sản", emoji: "🍜" },
    { id: "hen_ho", label: "Hẹn hò", emoji: "❤️" },
  ],
  GO: [
    { id: "bien_ngam_canh", label: "Biển / ngắm cảnh", emoji: "🌊" },
    { id: "chup_anh_dep", label: "Chụp ảnh đẹp", emoji: "📸" },
    { id: "thien_nhien", label: "Thiên nhiên", emoji: "🌿" },
    { id: "vui_choi", label: "Vui chơi", emoji: "🎡" },
    { id: "cafe", label: "Đi cafe", emoji: "☕" },
  ],
  NOW: [
    { id: "nguoi_yeu", label: "Đi cùng người yêu", emoji: "❤️" },
    { id: "ban_be", label: "Đi cùng bạn bè", emoji: "👥" },
    { id: "mot_minh", label: "Đi một mình", emoji: "🚶" },
    { id: "chon_giup_toi", label: "Chọn giúp tôi", emoji: "🎲" },
  ],
  STAY: [
    { id: "gan_bien", label: "Gần biển", emoji: "🌊" },
    { id: "gan_trung_tam", label: "Trung tâm", emoji: "🏙️" },
    { id: "cap_doi", label: "Hẹn hò", emoji: "❤️" },
    { id: "yen_tinh", label: "Yên tĩnh", emoji: "🌿" },
  ],
};

