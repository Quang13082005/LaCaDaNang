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
    sublabel: "Tạo lịch trình 3 chặng liền mạch từ thời gian hiện tại",
    emoji: "⚡",
    categoryBadge: "Lịch trình tức thì",
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
    sublabel: "Khách sạn, villa & homestay gần biển",
    emoji: "🛏️",
    categoryBadge: "Lưu trú hợp gu",
    thumbnailUrl: "/images/demo/sala-danang.svg",
  },
];

export const PREFERENCES_BY_INTENT: Record<string, PreferenceChipConfig[]> = {
  EAT: [
    { id: "an_ngon", label: "Ăn ngon", emoji: "😋" },
    { id: "hen_ho", label: "Hẹn hò", emoji: "❤️" },
    { id: "dac_san", label: "Đặc sản", emoji: "🍜" },
    { id: "it_tien", label: "Ít tiền", emoji: "💸" },
    { id: "di_nhom", label: "Đi nhóm", emoji: "👥" },
    { id: "gia_dinh", label: "Gia đình", emoji: "👨‍👩‍👧" },
    { id: "yen_tinh", label: "Yên tĩnh", emoji: "🌿" },
    { id: "nhon_nhip", label: "Nhộn nhịp", emoji: "🔥" },
    { id: "an_dem", label: "Ăn đêm", emoji: "🌙" },
  ],
  GO: [
    { id: "bien_ngam_canh", label: "Biển / ngắm cảnh", emoji: "🌊" },
    { id: "chup_anh_dep", label: "Chụp ảnh đẹp", emoji: "📸" },
    { id: "hen_ho", label: "Hẹn hò", emoji: "❤️" },
    { id: "thien_nhien", label: "Thiên nhiên", emoji: "🌿" },
    { id: "vui_choi", label: "Vui chơi", emoji: "🎡" },
    { id: "di_buoi_toi", label: "Đi buổi tối", emoji: "🌙" },
    { id: "di_nhom", label: "Đi nhóm", emoji: "👥" },
    { id: "gia_dinh", label: "Gia đình", emoji: "👨‍👩‍👧" },
  ],
  NOW: [
    { id: "nguoi_yeu", label: "Người yêu", emoji: "❤️" },
    { id: "ban_be", label: "Bạn bè", emoji: "👥" },
    { id: "gia_dinh", label: "Gia đình", emoji: "👨‍👩‍👧" },
    { id: "mot_minh", label: "Một mình", emoji: "🚶" },
    { id: "thu_gian", label: "Thư giãn", emoji: "🌿" },
    { id: "nhon_nhip", label: "Nhộn nhịp", emoji: "🔥" },
    { id: "chup_anh", label: "Chụp ảnh", emoji: "📸" },
    { id: "an_uong", label: "Ăn uống", emoji: "🍜" },
    { id: "tiet_kiem", label: "Tiết kiệm", emoji: "💸" },
    { id: "chon_giup_toi", label: "Chọn giúp tôi", emoji: "🎲" },
  ],
  STAY: [
    { id: "gan_bien", label: "Gần biển", emoji: "🌊" },
    { id: "gan_trung_tam", label: "Gần trung tâm", emoji: "🏙️" },
    { id: "cap_doi", label: "Cặp đôi", emoji: "❤️" },
    { id: "gia_re", label: "Giá rẻ", emoji: "💸" },
    { id: "gia_dinh", label: "Gia đình", emoji: "👨‍👩‍👧" },
    { id: "nhom_ban", label: "Nhóm bạn", emoji: "👥" },
    { id: "yen_tinh", label: "Yên tĩnh", emoji: "🌿" },
    { id: "nhon_nhip", label: "Nhộn nhịp", emoji: "🔥" },
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
    priceNote: "80k – 150k / người",
    imageUrl: "/images/demo/bep-cuon.svg",
    reasons: [
      "Bánh tráng cuốn thịt heo hai đầu da chuẩn vị",
      "Không gian ấm cúng, phù hợp hẹn hò hoặc tiếp khách",
      "Phục vụ chu đáo, mắm nêm đậm đà thơm ngát",
    ],
    googleMapsUrl: "https://maps.google.com/?cid=12345678901",
    tags: ["an_ngon", "hen_ho", "dac_san", "gia_dinh"],
  },
  {
    id: "eat-2",
    name: "Mì Quảng Bà Mua",
    intent: "EAT",
    primaryType: "Mì Quảng truyền thống",
    area: "Hải Châu",
    rating: 4.7,
    reviewCount: 8420,
    priceNote: "40k – 65k / phần",
    imageUrl: "/images/demo/mi-quang.svg",
    reasons: [
      "Nước nhưỡng mì đậm đà, sợi mì vàng tươi dai ngon",
      "Rau sống tươi sạch 9 loại vị quê thanh mát",
      "Mức giá bình dân, ăn no nê",
    ],
    googleMapsUrl: "https://maps.google.com/?cid=12345678902",
    tags: ["an_ngon", "dac_san", "it_tien", "gia_dinh"],
  },
  {
    id: "eat-3",
    name: "Cà Phê Trình — Bơ Cà Phê",
    intent: "EAT",
    primaryType: "Cà phê & Đồ uống",
    area: "Hải Châu",
    rating: 4.8,
    reviewCount: 3120,
    priceNote: "35k – 55k / người",
    imageUrl: "/images/demo/trinh-cafe.svg",
    reasons: [
      "Món cà phê bơ đặc sản béo ngậy độc đáo",
      "Sân vườn nhiều cây xanh, yên tĩnh và thoáng mát",
      "Góc ngồi riêng tư rất hợp trò chuyện đôi",
    ],
    googleMapsUrl: "https://maps.google.com/?cid=12345678903",
    tags: ["hen_ho", "yen_tinh", "an_ngon", "it_tien"],
  },
  {
    id: "eat-4",
    name: "Hải Sản Năm Đảnh",
    intent: "EAT",
    primaryType: "Hải sản tươi sống",
    area: "Sơn Trà",
    rating: 4.6,
    reviewCount: 15400,
    priceNote: "120k – 220k / người",
    imageUrl: "/images/demo/bep-cuon.svg",
    reasons: [
      "Hải sản tươi sống đồng giá cực kỳ hợp túi tiền",
      "Không khí nhộn nhịp, rất phù hợp đi nhóm bạn",
      "Nước chấm muối ớt xanh gia truyền đặc sắc",
    ],
    googleMapsUrl: "https://maps.google.com/?cid=12345678904",
    tags: ["di_nhom", "nhon_nhip", "an_ngon", "an_dem"],
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
    priceNote: "Miễn phí",
    imageUrl: "/images/demo/my-khe-beach.svg",
    reasons: [
      "Bãi cát trắng mịn thoai thoải, nước biển trong xanh",
      "Ngắm bình minh rực rỡ và hoàng hôn lãng mạn",
      "Nhiều góc check-in hàng dừa và ghế dù thư giãn",
    ],
    googleMapsUrl: "https://maps.google.com/?cid=12345678905",
    tags: ["bien_ngam_canh", "chup_anh_dep", "hen_ho", "thien_nhien"],
  },
  {
    id: "go-2",
    name: "Cầu Rồng & Bờ Sông Hàn",
    intent: "GO",
    primaryType: "Biểu tượng thành phố",
    area: "Hải Châu - Sơn Trà",
    rating: 4.9,
    reviewCount: 32000,
    priceNote: "Miễn phí",
    imageUrl: "/images/demo/dragon-bridge.svg",
    reasons: [
      "Cây cầu biểu tượng nổi tiếng thế giới của Đà Nẵng",
      "Phun lửa và phun nước vào 21:00 cuối tuần",
      "Khu phố đi bộ dọc bờ sông Hàn mát mẻ, lộng gió",
    ],
    googleMapsUrl: "https://maps.google.com/?cid=12345678906",
    tags: ["bien_ngam_canh", "di_buoi_toi", "chup_anh_dep", "vui_choi"],
  },
  {
    id: "go-3",
    name: "Bán Đảo Sơn Trà & Chùa Linh Ứng",
    intent: "GO",
    primaryType: "Danh lam thắng cảnh",
    area: "Sơn Trà",
    rating: 4.8,
    reviewCount: 19800,
    priceNote: "Miễn phí",
    imageUrl: "/images/demo/son-tra.svg",
    reasons: [
      "Tượng Phật Bà Quan Âm cao 67m hướng ra biển Đông",
      "Toàn cảnh thành phố và vịnh Đà Nẵng từ trên cao",
      "Không khí trong lành, cây rừng nguyên sinh yên bình",
    ],
    googleMapsUrl: "https://maps.google.com/?cid=12345678907",
    tags: ["thien_nhien", "bien_ngam_canh", "chup_anh_dep", "gia_dinh"],
  },
  {
    id: "go-4",
    name: "Chợ Đêm Helio & Phố Đi Bộ",
    intent: "GO",
    primaryType: "Khu vui chơi & ẩm thực đêm",
    area: "Hải Châu",
    rating: 4.7,
    reviewCount: 14200,
    priceNote: "Vào cửa tự do",
    imageUrl: "/images/demo/helio-night.svg",
    reasons: [
      "Thiên đường ẩm thực đường phố và nhạc sống sôi động",
      "Không gian đèn lồng nhiều màu sắc rực rỡ",
      "Rất đông vui vào buổi tối, phù hợp hội bạn trẻ",
    ],
    googleMapsUrl: "https://maps.google.com/?cid=12345678908",
    tags: ["vui_choi", "di_buoi_toi", "di_nhom", "nhon_nhip"],
  },

  // STAY PLACES
  {
    id: "stay-1",
    name: "Sala Danang Beach Hotel",
    intent: "STAY",
    primaryType: "Khách sạn 4 sao view biển",
    area: "Sơn Trà (Bãi Mỹ Khê)",
    rating: 4.8,
    reviewCount: 4600,
    priceNote: "Từ 1.100.000đ / đêm",
    imageUrl: "/images/demo/sala-danang.svg",
    reasons: [
      "Bể bơi vô cực tầng thượng view trọn biển Mỹ Khê",
      "Đi bộ chỉ 2 phút ra bãi tắm chính",
      "Phòng hiện đại đón ánh sáng tự nhiên",
    ],
    googleMapsUrl: "https://maps.google.com/?cid=12345678909",
    tags: ["gan_bien", "cap_doi", "nhon_nhip", "gia_dinh"],
  },
  {
    id: "stay-2",
    name: "Haian Riverfront Hotel",
    intent: "STAY",
    primaryType: "Khách sạn ven sông Hàn",
    area: "Hải Châu (Bạch Đằng)",
    rating: 4.7,
    reviewCount: 3800,
    priceNote: "Từ 950.000đ / đêm",
    imageUrl: "/images/demo/dragon-bridge.svg",
    reasons: [
      "Nằm ngay đường Bạch Đằng ngắm trọn sông Hàn",
      "Đi bộ ra Cầu Rồng và chợ đêm Bạch Đằng dễ dàng",
      "Thiết kế trẻ trung, hiện đại và tiện nghi",
    ],
    googleMapsUrl: "https://maps.google.com/?cid=12345678910",
    tags: ["gan_trung_tam", "cap_doi", "nhon_nhip"],
  },
  {
    id: "stay-3",
    name: "An Thuong Tropical Villa",
    intent: "STAY",
    primaryType: "Boutique Villa & Homestay",
    area: "Ngũ Hành Sơn (Khu phố Tây)",
    rating: 4.9,
    reviewCount: 980,
    priceNote: "Từ 650.000đ / đêm",
    imageUrl: "/images/demo/trinh-cafe.svg",
    reasons: [
      "Không gian xanh nhiệt đới yên bình, tách biệt ồn ào",
      "Cách bãi biển chỉ 300m, quanh khu nhiều quán cafe chill",
      "Phù hợp nghỉ dưỡng cặp đôi hoặc du lịch một mình",
    ],
    googleMapsUrl: "https://maps.google.com/?cid=12345678911",
    tags: ["yen_tinh", "gan_bien", "gia_re", "cap_doi"],
  },
];

export const DEMO_ITINERARIES: Record<string, DemoItinerary> = {
  nguoi_yeu: {
    id: "itin-nguoi-yeu",
    preferenceId: "nguoi_yeu",
    title: "Buổi tối hẹn hò lãng mạn",
    subtitle: "3 điểm đến liền mạch, ngắm sông và thưởng thức món ngon",
    stops: [
      {
        id: "stop-1",
        time: "18:45",
        title: "Ăn tối ấm cúng",
        placeName: "Bếp Cuốn Đà Nẵng",
        area: "Ngũ Hành Sơn",
        category: "Ăn uống",
        reason: "Không gian đèn vàng ấm áp, món cuốn thanh nhẹ dễ trò chuyện",
        googleMapsUrl: "https://maps.google.com/?cid=12345678901",
      },
      {
        id: "stop-2",
        time: "20:00",
        title: "Dạo mát & ngắm phố",
        placeName: "Cầu Rồng & Bờ Đông Sông Hàn",
        area: "Sơn Trà",
        category: "Ngắm cảnh",
        reason: "Gió sông mát rượi, ngắm ánh đèn cầu rồng lung linh bên người yêu",
        googleMapsUrl: "https://maps.google.com/?cid=12345678906",
      },
      {
        id: "stop-3",
        time: "21:15",
        title: "Cà phê chill đêm",
        placeName: "Cà Phê Trình — Bơ Cà Phê",
        area: "Hải Châu",
        category: "Cà phê",
        reason: "Thưởng thức ly bơ cà phê ngọt bùi trong góc vườn yên tĩnh",
        googleMapsUrl: "https://maps.google.com/?cid=12345678903",
      },
    ],
  },
  ban_be: {
    id: "itin-ban-be",
    preferenceId: "ban_be",
    title: "Tối 'quẩy' hết mình cùng hội bạn",
    subtitle: "Ăn hải sản tưng bừng, dạo chợ đêm và la cà trà chanh",
    stops: [
      {
        id: "stop-b1",
        time: "18:15",
        title: "Hải sản tươi sống no nê",
        placeName: "Hải Sản Năm Đảnh",
        area: "Sơn Trà",
        category: "Ăn uống",
        reason: "Món ngon đồng giá, rôm rả chém gió không lo về giá",
        googleMapsUrl: "https://maps.google.com/?cid=12345678904",
      },
      {
        id: "stop-b2",
        time: "20:00",
        title: "Vui chơi & check-in",
        placeName: "Chợ Đêm Helio & Phố Đi Bộ",
        area: "Hải Châu",
        category: "Vui chơi",
        reason: "Nghe nhạc acoustic, thử đồ ăn vặt và chụp ảnh kỷ niệm",
        googleMapsUrl: "https://maps.google.com/?cid=12345678908",
      },
      {
        id: "stop-b3",
        time: "21:45",
        title: "Trà chanh gió sông",
        placeName: "Bờ Sông Hàn — Cầu Tình Yêu",
        area: "Sơn Trà",
        category: "La cà",
        reason: "Ngồi ghế cóc hóng gió sông về khuya cực chill",
        googleMapsUrl: "https://maps.google.com/?cid=12345678906",
      },
    ],
  },
  mot_minh: {
    id: "itin-mot-minh",
    preferenceId: "mot_minh",
    title: "Buổi chiều thư thả một mình",
    subtitle: "Đón gió biển, ăn tô mì ấm bụng và tĩnh lặng đọc sách",
    stops: [
      {
        id: "stop-m1",
        time: "16:45",
        title: "Đón gió biển chiều",
        placeName: "Bãi Biển Mỹ Khê",
        area: "Sơn Trà",
        category: "Thư giãn",
        reason: "Đi dạo trên cát mịn, hít thở vị mặn của biển giúp xả stress",
        googleMapsUrl: "https://maps.google.com/?cid=12345678905",
      },
      {
        id: "stop-m2",
        time: "18:30",
        title: "Mì Quảng ấm bụng",
        placeName: "Mì Quảng Bà Mua",
        area: "Hải Châu",
        category: "Ăn uống",
        reason: "Bữa tối nhanh gọn nhưng tròn vị đặc sản quê hương",
        googleMapsUrl: "https://maps.google.com/?cid=12345678902",
      },
      {
        id: "stop-m3",
        time: "19:45",
        title: "Góc yên tĩnh nghe nhạc",
        placeName: "Cà Phê Trình — Sân Vườn",
        area: "Hải Châu",
        category: "Cà phê",
        reason: "Một góc bàn gỗ dưới tán cây, thoải mái đọc sách và suy ngẫm",
        googleMapsUrl: "https://maps.google.com/?cid=12345678903",
      },
    ],
  },
};

// Fallback generator for other itinerary preferences
export function getItineraryForPreference(preferenceId: string): DemoItinerary {
  if (DEMO_ITINERARIES[preferenceId]) {
    return DEMO_ITINERARIES[preferenceId];
  }
  // Default fallback itinerary
  return {
    id: `itin-${preferenceId}`,
    preferenceId,
    title: "Lịch trình gợi ý ngay lúc này",
    subtitle: "3 điểm đến đã chọn lọc hoàn hảo cho buổi tối Đà Nẵng",
    stops: [
      {
        id: "stop-d1",
        time: "18:30",
        title: "Bữa tối chuẩn vị",
        placeName: "Bếp Cuốn Đà Nẵng",
        area: "Ngũ Hành Sơn",
        category: "Ăn uống",
        reason: "Khởi đầu buổi tối với các món cuốn miền Trung tươi ngon",
        googleMapsUrl: "https://maps.google.com/?cid=12345678901",
      },
      {
        id: "stop-d2",
        time: "20:00",
        title: "Dạo mát ngắm thành phố",
        placeName: "Cầu Rồng & Bờ Sông Hàn",
        area: "Hải Châu",
        category: "Ngắm cảnh",
        reason: "Không gian gió lộng mát mẻ, ngắm thành phố lên đèn",
        googleMapsUrl: "https://maps.google.com/?cid=12345678906",
      },
      {
        id: "stop-d3",
        time: "21:15",
        title: "Thưởng thức cà phê",
        placeName: "Cà Phê Trình",
        area: "Hải Châu",
        category: "Cà phê",
        reason: "Thưởng thức cà phê đặc sản, kết thúc một ngày thư thái",
        googleMapsUrl: "https://maps.google.com/?cid=12345678903",
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
  if (matched.length >= 3) {
    return matched.slice(0, 3);
  }
  // If matched fewer than 3, complete with top places from the same intent for a solid 3-card presentation
  const remaining = intentPlaces.filter((p) => !matched.includes(p));
  return [...matched, ...remaining].slice(0, 3);
}
