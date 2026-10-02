export interface DemoPlace {
  id: string;
  name: string;
  intent: "EAT" | "GO" | "STAY";
  primaryType: string;
  area: string;
  rating: number;
  reviewCount: number;
  priceNote?: string;
  imageUrl: string;
  reasons: string[];
  googleMapsUrl: string;
  tags: string[];
}

export interface DemoItineraryStop {
  id: string;
  time: string;
  title: string;
  placeName: string;
  area: string;
  category: string;
  reason: string;
  googleMapsUrl: string;
}

export interface DemoItinerary {
  id: string;
  preferenceId: string;
  title: string;
  subtitle: string;
  stops: DemoItineraryStop[];
}

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
    sublabel: "Xem một lịch trình mẫu nhanh",
    emoji: "⚡",
    categoryBadge: "Lịch trình mẫu",
    thumbnailUrl: "/images/demo/dragon-bridge.svg",
    isFeatured: true,
  },
  {
    id: "EAT",
    label: "ĂN GÌ?",
    sublabel: "Quán ngon, đặc sản & cafe chill",
    emoji: "🍜",
    categoryBadge: "Ẩm thực địa phương",
    thumbnailUrl: "/images/demo/bep-cuon.svg",
  },
  {
    id: "GO",
    label: "ĐI ĐÂU?",
    sublabel: "Check-in, ngắm cảnh & khám phá",
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
  ],
  NOW: [
    { id: "nguoi_yeu", label: "Đi cùng người yêu", emoji: "❤️" },
    { id: "ban_be", label: "Đi cùng bạn bè", emoji: "👥" },
    { id: "mot_minh", label: "Đi một mình", emoji: "🚶" },
    { id: "chon_giup_toi", label: "Chọn giúp tôi", emoji: "🎲" },
  ],
  STAY: [
    { id: "gan_bien", label: "Gần biển", emoji: "🌊" },
    { id: "gan_trung_tam", label: "Gần trung tâm", emoji: "🏙️" },
    { id: "cap_doi", label: "Cặp đôi", emoji: "❤️" },
    { id: "yen_tinh", label: "Yên tĩnh", emoji: "🌿" },
  ],
};

export const DEMO_PLACES: DemoPlace[] = [
  // EAT PLACES
  {
    id: "eat-1",
    name: "Bếp Cuốn Đà Nẵng",
    intent: "EAT",
    primaryType: "Ẩm thực miền Trung",
    area: "Ngũ Hành Sơn",
    rating: 4.9,
    reviewCount: 17886,
    imageUrl: "/images/demo/bep-cuon.svg",
    reasons: [
      "Bánh tráng cuốn thịt heo hai đầu da chuẩn vị",
      "Không gian ấm cúng, phù hợp hẹn hò hoặc tiếp khách",
    ],
    googleMapsUrl: "https://maps.google.com/?cid=15858543023798826021",
    tags: ["an_ngon", "hen_ho", "dac_san"],
  },
  {
    id: "eat-2",
    name: "Mì Quảng Bà Mua",
    intent: "EAT",
    primaryType: "Mì Quảng truyền thống",
    area: "Hải Châu",
    rating: 4.7,
    reviewCount: 8420,
    imageUrl: "/images/demo/mi-quang.svg",
    reasons: [
      "Nước nhưỡng mì đậm đà, sợi mì vàng tươi dai ngon",
      "Rau sống tươi sạch 9 loại vị quê thanh mát",
    ],
    googleMapsUrl: "",
    tags: ["an_ngon", "dac_san"],
  },
  {
    id: "eat-3",
    name: "Cà Phê Trình — Bơ Cà Phê",
    intent: "EAT",
    primaryType: "Cà phê & Đồ uống",
    area: "Hải Châu",
    rating: 4.8,
    reviewCount: 3120,
    imageUrl: "/images/demo/trinh-cafe.svg",
    reasons: [
      "Món cà phê bơ đặc sản béo ngậy độc đáo",
      "Sân vườn nhiều cây xanh, yên tĩnh và thoáng mát",
    ],
    googleMapsUrl: "",
    tags: ["hen_ho", "an_ngon"],
  },
  {
    id: "eat-4",
    name: "Hải Sản Năm Đảnh",
    intent: "EAT",
    primaryType: "Hải sản tươi sống",
    area: "Sơn Trà",
    rating: 4.6,
    reviewCount: 15400,
    imageUrl: "/images/demo/bep-cuon.svg",
    reasons: [
      "Hải sản tươi sống đồng giá cực kỳ hợp túi tiền",
      "Không khí nhộn nhịp, rất phù hợp đi nhóm bạn",
    ],
    googleMapsUrl: "",
    tags: ["an_ngon"],
  },

  // GO PLACES
  {
    id: "go-1",
    name: "Bãi Biển Mỹ Khê",
    intent: "GO",
    primaryType: "Bãi biển tự nhiên",
    area: "Sơn Trà",
    rating: 4.8,
    reviewCount: 24500,
    imageUrl: "/images/demo/my-khe-beach.svg",
    reasons: [
      "Bãi cát trắng mịn thoai thoải, nước biển trong xanh",
      "Ngắm bình minh rực rỡ và hoàng hôn lãng mạn",
    ],
    googleMapsUrl: "",
    tags: ["bien_ngam_canh", "chup_anh_dep", "thien_nhien"],
  },
  {
    id: "go-2",
    name: "Cầu Rồng & Bờ Sông Hàn",
    intent: "GO",
    primaryType: "Biểu tượng thành phố",
    area: "Hải Châu - Sơn Trà",
    rating: 4.9,
    reviewCount: 32000,
    imageUrl: "/images/demo/dragon-bridge.svg",
    reasons: [
      "Cây cầu biểu tượng nổi tiếng thế giới của Đà Nẵng",
      "Khu phố đi bộ dọc bờ sông Hàn mát mẻ, lộng gió",
    ],
    googleMapsUrl: "",
    tags: ["bien_ngam_canh", "chup_anh_dep", "vui_choi"],
  },
  {
    id: "go-3",
    name: "Bán Đảo Sơn Trà & Chùa Linh Ứng",
    intent: "GO",
    primaryType: "Danh lam thắng cảnh",
    area: "Sơn Trà",
    rating: 4.8,
    reviewCount: 19800,
    imageUrl: "/images/demo/son-tra.svg",
    reasons: [
      "Tượng Phật Bà Quan Âm cao 67m hướng ra biển Đông",
      "Toàn cảnh thành phố và vịnh Đà Nẵng từ trên cao",
    ],
    googleMapsUrl: "",
    tags: ["thien_nhien", "bien_ngam_canh", "chup_anh_dep"],
  },
  {
    id: "go-4",
    name: "Chợ Đêm Helio & Phố Đi Bộ",
    intent: "GO",
    primaryType: "Khu vui chơi & ẩm thực đêm",
    area: "Hải Châu",
    rating: 4.7,
    reviewCount: 14200,
    imageUrl: "/images/demo/helio-night.svg",
    reasons: [
      "Thiên đường ẩm thực đường phố và nhạc sống sôi động",
      "Không gian đèn lồng nhiều màu sắc rực rỡ",
    ],
    googleMapsUrl: "",
    tags: ["vui_choi"],
  },

  // STAY PLACES
  {
    id: "stay-1",
    name: "Sala Danang Beach Hotel",
    intent: "STAY",
    primaryType: "Khách sạn view biển",
    area: "Sơn Trà (Bãi Mỹ Khê)",
    rating: 4.8,
    reviewCount: 4600,
    imageUrl: "/images/demo/sala-danang.svg",
    reasons: [
      "Bể bơi vô cực tầng thượng view trọn biển Mỹ Khê",
      "Phòng hiện đại đón ánh sáng tự nhiên",
    ],
    googleMapsUrl: "",
    tags: ["gan_bien", "cap_doi"],
  },
  {
    id: "stay-2",
    name: "Haian Riverfront Hotel",
    intent: "STAY",
    primaryType: "Khách sạn ven sông Hàn",
    area: "Hải Châu (Bạch Đằng)",
    rating: 4.7,
    reviewCount: 3800,
    imageUrl: "/images/demo/dragon-bridge.svg",
    reasons: [
      "Nằm ngay đường Bạch Đằng ngắm trọn sông Hàn",
      "Thiết kế trẻ trung, hiện đại và tiện nghi",
    ],
    googleMapsUrl: "",
    tags: ["gan_trung_tam", "cap_doi"],
  },
  {
    id: "stay-3",
    name: "An Thuong Tropical Villa",
    intent: "STAY",
    primaryType: "Boutique Villa & Homestay",
    area: "Ngũ Hành Sơn (Khu phố Tây)",
    rating: 4.9,
    reviewCount: 980,
    imageUrl: "/images/demo/trinh-cafe.svg",
    reasons: [
      "Không gian xanh nhiệt đới yên bình, tách biệt ồn ào",
      "Gần khu phố nhiều quán cafe chill",
    ],
    googleMapsUrl: "",
    tags: ["yen_tinh", "gan_bien", "cap_doi"],
  },
];

export const DEMO_ITINERARIES: Record<string, DemoItinerary> = {
  nguoi_yeu: {
    id: "itin-nguoi-yeu",
    preferenceId: "nguoi_yeu",
    title: "Lịch trình mẫu: Hẹn hò lãng mạn",
    subtitle: "Một lịch trình tham khảo để bạn bắt đầu nhanh.",
    stops: [
      {
        id: "stop-1",
        time: "Chặng 1",
        title: "Ăn tối ấm cúng",
        placeName: "Bếp Cuốn Đà Nẵng",
        area: "Ngũ Hành Sơn",
        category: "Ăn uống",
        reason: "Không gian đèn vàng ấm áp, món cuốn thanh nhẹ dễ trò chuyện",
        googleMapsUrl: "https://maps.google.com/?cid=15858543023798826021",
      },
      {
        id: "stop-2",
        time: "Chặng 2",
        title: "Dạo mát & ngắm phố",
        placeName: "Cầu Rồng & Bờ Đông Sông Hàn",
        area: "Sơn Trà",
        category: "Ngắm cảnh",
        reason: "Gió sông mát rượi, ngắm ánh đèn cầu rồng lung linh bên người yêu",
        googleMapsUrl: "",
      },
      {
        id: "stop-3",
        time: "Chặng 3",
        title: "Cà phê chill",
        placeName: "Cà Phê Trình — Bơ Cà Phê",
        area: "Hải Châu",
        category: "Cà phê",
        reason: "Thưởng thức ly bơ cà phê ngọt bùi trong góc vườn yên tĩnh",
        googleMapsUrl: "",
      },
    ],
  },
  ban_be: {
    id: "itin-ban-be",
    preferenceId: "ban_be",
    title: "Lịch trình mẫu: Đi cùng bạn bè",
    subtitle: "Một lịch trình tham khảo để bạn bắt đầu nhanh.",
    stops: [
      {
        id: "stop-b1",
        time: "Chặng 1",
        title: "Hải sản tươi sống",
        placeName: "Hải Sản Năm Đảnh",
        area: "Sơn Trà",
        category: "Ăn uống",
        reason: "Món ngon đồng giá, rôm rả trò chuyện cùng bạn bè",
        googleMapsUrl: "",
      },
      {
        id: "stop-b2",
        time: "Chặng 2",
        title: "Vui chơi & check-in",
        placeName: "Chợ Đêm Helio & Phố Đi Bộ",
        area: "Hải Châu",
        category: "Vui chơi",
        reason: "Không gian nhộn nhịp, nhiều món ăn vặt và chụp ảnh kỷ niệm",
        googleMapsUrl: "",
      },
      {
        id: "stop-b3",
        time: "Chặng 3",
        title: "Trà chanh gió sông",
        placeName: "Bờ Sông Hàn — Cầu Tình Yêu",
        area: "Sơn Trà",
        category: "La cà",
        reason: "Ngồi hóng gió sông mát mẻ, trò chuyện thoải mái",
        googleMapsUrl: "",
      },
    ],
  },
  mot_minh: {
    id: "itin-mot-minh",
    preferenceId: "mot_minh",
    title: "Lịch trình mẫu: Đi một mình",
    subtitle: "Một lịch trình tham khảo để bạn bắt đầu nhanh.",
    stops: [
      {
        id: "stop-m1",
        time: "Chặng 1",
        title: "Đón gió biển",
        placeName: "Bãi Biển Mỹ Khê",
        area: "Sơn Trà",
        category: "Thư giãn",
        reason: "Đi dạo trên cát mịn, hít thở vị mặn của biển giúp thư thái",
        googleMapsUrl: "",
      },
      {
        id: "stop-m2",
        time: "Chặng 2",
        title: "Mì Quảng ấm bụng",
        placeName: "Mì Quảng Bà Mua",
        area: "Hải Châu",
        category: "Ăn uống",
        reason: "Bữa ăn nhanh gọn nhưng tròn vị đặc sản quê hương",
        googleMapsUrl: "",
      },
      {
        id: "stop-m3",
        time: "Chặng 3",
        title: "Góc yên tĩnh nghe nhạc",
        placeName: "Cà Phê Trình — Sân Vườn",
        area: "Hải Châu",
        category: "Cà phê",
        reason: "Một góc bàn gỗ dưới tán cây, thoải mái đọc sách và suy ngẫm",
        googleMapsUrl: "",
      },
    ],
  },
};

// Fallback generator for other itinerary preferences / "Chọn giúp tôi"
export function getItineraryForPreference(preferenceId: string): DemoItinerary {
  if (DEMO_ITINERARIES[preferenceId]) {
    return DEMO_ITINERARIES[preferenceId];
  }
  // Default truthful fallback itinerary ("Chọn giúp tôi" — mẫu tham khảo tổng hợp)
  return {
    id: `itin-${preferenceId}`,
    preferenceId,
    title: "Lịch trình mẫu",
    subtitle: "Một lịch trình tham khảo để bạn bắt đầu nhanh.",
    stops: [
      {
        id: "stop-d1",
        time: "Chặng 1",
        title: "Bữa ăn chuẩn vị",
        placeName: "Bếp Cuốn Đà Nẵng",
        area: "Ngũ Hành Sơn",
        category: "Ăn uống",
        reason: "Khởi đầu với các món cuốn miền Trung tươi ngon",
        googleMapsUrl: "https://maps.google.com/?cid=15858543023798826021",
      },
      {
        id: "stop-d2",
        time: "Chặng 2",
        title: "Dạo mát ngắm thành phố",
        placeName: "Cầu Rồng & Bờ Sông Hàn",
        area: "Hải Châu",
        category: "Ngắm cảnh",
        reason: "Không gian gió lộng mát mẻ, ngắm thành phố lên đèn",
        googleMapsUrl: "",
      },
      {
        id: "stop-d3",
        time: "Chặng 3",
        title: "Thưởng thức cà phê",
        placeName: "Cà Phê Trình",
        area: "Hải Châu",
        category: "Cà phê",
        reason: "Thưởng thức cà phê đặc sản, kết thúc một ngày thư thái",
        googleMapsUrl: "",
      },
    ],
  };
}

export function getPlacesForSelection(
  intent: "EAT" | "GO" | "STAY",
  preferenceId?: string
): DemoPlace[] {
  const intentPlaces = DEMO_PLACES.filter((p) => p.intent === intent);
  if (!preferenceId) {
    return intentPlaces.slice(0, 3);
  }
  const matched = intentPlaces.filter((p) => p.tags.includes(preferenceId));
  // P0.1: No non-matching fallback padding! Return true matches only (up to 3).
  return matched.slice(0, 3);
}
