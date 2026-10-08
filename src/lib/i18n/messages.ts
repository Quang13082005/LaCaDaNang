import type { SupportedLocale } from "./locales";

// UI chrome only. Place names, descriptions, types and data-backed tags belong to the DB adapter.
const vi = {
  // Intents
  "intent.eat": "ĂN GÌ?",
  "intent.go": "ĐI ĐÂU?",
  "intent.now": "BÂY GIỜ LÀM GÌ?",
  "intent.stay": "Ở ĐÂU?",
  "intent.eat.helper": "Quán ăn & cafe",
  "intent.go.helper": "Điểm đến & trải nghiệm",
  "intent.now.helper": "Gợi ý theo thời điểm",
  "intent.stay.helper": "Tìm chỗ nghỉ",
  "intent.eat.badge": "Ẩm thực địa phương",
  "intent.go.badge": "Điểm đến & Trải nghiệm",
  "intent.now.badge": "Theo giờ Đà Nẵng",
  "intent.stay.badge": "Lưu trú hợp gu",

  // Home Quick Select
  "home.quickSelect.title": "Chọn nhanh",
  "home.quickSelect.subtitle": "Khám phá Đà Nẵng theo nhu cầu của bạn",

  // Preferences
  "preference.sheetTitle": "Chọn sở thích",
  "preference.close": "Đóng",
  "preference.prompt": "Bạn muốn tìm chỗ thế nào?",
  "preference.companionPrompt": "Đi cùng ai:",
  "pref.an_ngon": "Ăn ngon",
  "pref.dac_san": "Đặc sản",
  "pref.hen_ho": "Hẹn hò",
  "pref.bien_ngam_canh": "Biển / ngắm cảnh",
  "pref.chup_anh_dep": "Chụp ảnh đẹp",
  "pref.thien_nhien": "Thiên nhiên",
  "pref.vui_choi": "Vui chơi",
  "pref.gan_bien": "Gần biển",
  "pref.gan_trung_tam": "Trung tâm",
  "pref.cap_doi": "Hẹn hò",
  "pref.yen_tinh": "Yên tĩnh",
  "pref.nguoi_yeu": "Đi cùng người yêu",
  "pref.ban_be": "Đi cùng bạn bè",
  "pref.mot_minh": "Đi một mình",
  "pref.chon_giup_toi": "Chọn giúp tôi",

  // Actions
  "action.maps": "Xem trên Google Maps",
  "action.changeSelection": "Đổi lựa chọn",
  "action.explore": "Khám phá",
  "action.selected": "Đang chọn",
  "action.nearby": "Gần tôi",
  "action.citywide": "Toàn Đà Nẵng",
  "action.retry": "Thử lại",
  "action.viewCitywide": "Xem toàn Đà Nẵng",
  "action.locating": "Đang định vị…",
  "action.navAria": "Thao tác khám phá",

  // Hero
  "hero.description": "Tìm chỗ ăn, chơi và nghỉ ở Đà Nẵng.",
  "hero.imageAlt": "Cầu Rồng và sông Hàn lúc hoàng hôn ở Đà Nẵng",

  // Results & Counts
  "results.title": "Gợi ý địa điểm",
  "results.region": "Kết quả gợi ý",
  "results.zero": "Chưa có gợi ý cho lựa chọn này.",
  "results.one": "Có 1 gợi ý cho lựa chọn này.",
  "results.two": "Có 2 gợi ý cho lựa chọn này.",
  "results.count": "Có {count} gợi ý cho lựa chọn này.",
  "results.nearbyCount": "Có {count} gợi ý gần bạn (trong bán kính {radiusKm} km).",
  "results.nearbyZero": "Không tìm thấy gợi ý gần bạn trong 5 km.",
  "results.loading": "Đang tìm địa điểm…",
  "results.error.title": "Chưa tải được địa điểm.",
  "results.error.message": "Hãy thử lại hoặc đổi lựa chọn.",

  // Nearby Empty
  "nearby.empty.title": "Không tìm thấy địa điểm phù hợp trong 5 km.",
  "nearby.empty.message": "Hãy thử mở rộng tìm kiếm trên toàn thành phố hoặc đổi lựa chọn khác.",

  // Empty Generic
  "empty.title": "Chưa có gợi ý phù hợp tiêu chí này.",
  "empty.message": "Hãy thử chọn một lựa chọn khác để nhận gợi ý phù hợp.",

  // GPS Warnings
  "gps.warning.inaccurate": "Vị trí chưa đủ chính xác để tìm địa điểm gần bạn. Đang hiển thị gợi ý toàn thành phố.",
  "gps.warning.denied": "Bạn đã từ chối quyền vị trí. Đang hiển thị gợi ý toàn thành phố.",
  "gps.warning.timeout": "Không nhận được phản hồi vị trí kịp thời. Đang hiển thị gợi ý toàn thành phố.",
  "gps.warning.unavailable": "Thiết bị không thể xác định vị trí hiện tại. Đang hiển thị gợi ý toàn thành phố.",

  // Place Card
  "card.googleRating": "Điểm Google",
  "card.reviews": "đánh giá",
  "card.tagsAria": "Đặc điểm địa điểm",

  // Itinerary
  "itinerary.sample": "Lịch trình mẫu",
  "now.MORNING": "Gợi ý cho buổi sáng",
  "now.section.EAT": "Ăn uống",
  "now.section.CAFE": "Cà phê",
  "now.section.GO": "Khám phá",
  "now.section.STAY": "Lưu trú",

  "now.MIDDAY": "Gợi ý cho buổi trưa",
  "now.AFTERNOON": "Gợi ý cho buổi chiều",
  "now.EVENING": "Gợi ý cho buổi tối",
  "now.NIGHT": "Gợi ý tham khảo cho tối muộn",
  "now.basedOn": "Dựa trên thời điểm hiện tại tại Đà Nẵng.",
  "now.hours": "Chưa xác minh giờ mở cửa. Hãy kiểm tra với địa điểm trước khi đến.",
  "now.citywide": "Gợi ý toàn thành phố; thứ tự không tối ưu quãng đường.",

  "intent.region": "Mục đích khám phá",

    // Language Controls
  "language.label": "Ngôn ngữ",
  "language.auto": "Theo thiết bị",
  "language.selectTitle": "Chọn ngôn ngữ",
  "language.close": "Đóng",
  "language.vi": "Tiếng Việt",
  "language.en": "English",
  "language.ko": "한국어",
  "language.autoDesc": "Tự động theo ngôn ngữ thiết bị",

  // Reminder (Calendar Export)
  "action.remind": "Nhắc tôi",
  "action.remindAria": "Đặt nhắc nhở ghé thăm {name}",
  "reminder.title": "Nhắc tôi ghé thăm",
  "reminder.prompt": "Bạn muốn đến đây lúc nào?",
  "reminder.preset1h": "1 giờ nữa",
  "reminder.preset2h": "2 giờ nữa",
  "reminder.preset4h": "4 giờ nữa",
  "reminder.customTime": "Chọn ngày & giờ",
  "reminder.leadNotice": "⏱ Nhắc trước 30 phút (Giờ Đà Nẵng, GMT+7)",
  "reminder.addToCalendar": "📅 Thêm vào lịch",
  "reminder.close": "Đóng",
  "reminder.minTimeWarning": "Vui lòng chọn thời gian cách hiện tại ít nhất 30 phút.",
  "reminder.exportSuccess": "Đã tạo file lịch nhắc. Hãy mở và lưu sự kiện trong ứng dụng Lịch của bạn.",
  "reminder.exportError": "Không thể tạo file lịch. Vui lòng thử lại.",
  "reminder.badge": "Đã lên lịch",
  "reminder.icsSummary": "Ghé thăm {name} (La Cà Đà Nẵng)",
  "reminder.icsDescPrefix": "Nhắc nhở ghé thăm {name}.",
  "reminder.icsAddress": "Địa chỉ: {address}",
  "reminder.icsMaps": "Xem đường đi trên Google Maps: {mapsUrl}",
  "reminder.icsAlarmDesc": "Sắp đến giờ ghé thăm {name}! Hãy chuẩn bị xuất phát.",
} as const;

export type MessageKey = keyof typeof vi;
type Dictionary = { readonly [Key in MessageKey]: string };

export const UI_MESSAGES = {
  vi,
  en: {
    // Intents
    "intent.eat": "What to eat?",
    "intent.go": "Where to go?",
    "intent.now": "What to do now?",
    "intent.stay": "Where to stay?",
    "intent.eat.helper": "Food & cafés",
    "intent.go.helper": "Places & experiences",
    "intent.now.helper": "Ideas for this time of day",
    "intent.stay.helper": "Find a place to stay",
    "intent.eat.badge": "Local food",
    "intent.go.badge": "Destinations & Activities",
    "intent.now.badge": "Da Nang time",
    "intent.stay.badge": "Curated stays",

    // Home Quick Select
    "home.quickSelect.title": "Quick Select",
    "home.quickSelect.subtitle": "Discover Da Nang tailored to your needs",

    // Preferences
    "preference.sheetTitle": "Choose preference",
    "preference.close": "Close",
    "preference.prompt": "What kind of place are you looking for?",
    "preference.companionPrompt": "Who are you going with?",
    "pref.an_ngon": "Delicious food",
    "pref.dac_san": "Specialties",
    "pref.hen_ho": "Romantic",
    "pref.bien_ngam_canh": "Beach / Scenic",
    "pref.chup_anh_dep": "Photo spots",
    "pref.thien_nhien": "Nature",
    "pref.vui_choi": "Entertainment",
    "pref.gan_bien": "Near the beach",
    "pref.gan_trung_tam": "City center",
    "pref.cap_doi": "Romantic",
    "pref.yen_tinh": "Quiet",
    "pref.nguoi_yeu": "With partner",
    "pref.ban_be": "With friends",
    "pref.mot_minh": "Solo",
    "pref.chon_giup_toi": "Surprise me",

    // Actions
    "action.maps": "View on Google Maps",
    "action.changeSelection": "Change selection",
    "action.explore": "Explore",
    "action.selected": "Selected",
    "action.nearby": "Near me",
    "action.citywide": "All Da Nang",
    "action.retry": "Retry",
    "action.viewCitywide": "View all Da Nang",
    "action.locating": "Locating…",
    "action.navAria": "Discovery actions",

    // Hero
    "hero.description": "Find food, activities and places to stay in Da Nang.",
    "hero.imageAlt": "Dragon Bridge and the Han River at sunset in Da Nang",

    // Results & Counts
    "results.title": "Suggested places",
    "results.region": "Suggestions",
    "results.zero": "No suggestions for this selection yet.",
    "results.one": "There is 1 suggestion for this selection.",
    "results.two": "There are 2 suggestions for this selection.",
    "results.count": "There are {count} suggestions for this selection.",
    "results.nearbyCount": "Found {count} suggestions near you (within {radiusKm} km).",
    "results.nearbyZero": "No suggestions found near you within 5 km.",
    "results.loading": "Finding places…",
    "results.error.title": "Unable to load places.",
    "results.error.message": "Please try again or change selection.",

    // Nearby Empty
    "nearby.empty.title": "No matching places found within 5 km.",
    "nearby.empty.message": "Try expanding your search citywide or choose another option.",

    // Empty Generic
    "empty.title": "No suggestions match these criteria yet.",
    "empty.message": "Try another selection to find suitable suggestions.",

    // GPS Warnings
    "gps.warning.inaccurate": "Location is not accurate enough to find nearby places. Showing citywide suggestions.",
    "gps.warning.denied": "Location permission denied. Showing citywide suggestions.",
    "gps.warning.timeout": "Location request timed out. Showing citywide suggestions.",
    "gps.warning.unavailable": "Unable to determine current location. Showing citywide suggestions.",

    // Place Card
    "card.googleRating": "Google rating",
    "card.reviews": "reviews",
    "card.tagsAria": "Place features",

    // Itinerary
    "itinerary.sample": "Sample itinerary",
  "now.MORNING": "Morning suggestions",
  "now.section.EAT": "Food",
  "now.section.CAFE": "Cafes",
  "now.section.GO": "Explore",
  "now.section.STAY": "Stays",

  "now.MIDDAY": "Midday suggestions",
  "now.AFTERNOON": "Afternoon suggestions",
  "now.EVENING": "Evening suggestions",
  "now.NIGHT": "Late-night ideas to consider",
  "now.basedOn": "Based on the current time in Da Nang.",
  "now.hours": "Opening hours are unverified. Check with each venue before visiting.",
  "now.citywide": "Citywide suggestions; stop order is not optimized for distance.",

    "intent.region": "Choose what to explore",

    // Language Controls
    "language.label": "Language",
    "language.auto": "Device language",
    "language.selectTitle": "Select language",
    "language.close": "Close",
    "language.vi": "Tiếng Việt",
    "language.en": "English",
    "language.ko": "한국어",
    "language.autoDesc": "Match device language automatically",

    // Reminder (Calendar Export)
    "action.remind": "Remind me",
    "action.remindAria": "Set visit reminder for {name}",
    "reminder.title": "Remind my visit",
    "reminder.prompt": "When do you plan to visit?",
    "reminder.preset1h": "In 1 hour",
    "reminder.preset2h": "In 2 hours",
    "reminder.preset4h": "In 4 hours",
    "reminder.customTime": "Choose date & time",
    "reminder.leadNotice": "⏱ Remind 30m before (Da Nang time, GMT+7)",
    "reminder.addToCalendar": "📅 Add to calendar",
    "reminder.close": "Close",
    "reminder.minTimeWarning": "Please choose a time at least 30 minutes from now.",
    "reminder.exportSuccess": "Calendar reminder created. Open and save the event in your Calendar app.",
    "reminder.exportError": "Could not create calendar event. Please try again.",
    "reminder.badge": "Scheduled",
    "reminder.icsSummary": "Visit {name} (La Ca Da Nang)",
    "reminder.icsDescPrefix": "Reminder to visit {name}.",
    "reminder.icsAddress": "Address: {address}",
    "reminder.icsMaps": "Open in Google Maps: {mapsUrl}",
    "reminder.icsAlarmDesc": "Time to visit {name}! Get ready to head out.",
  },
  ko: {
    // Intents
    "intent.eat": "무엇을 먹을까요?",
    "intent.go": "어디로 갈까요?",
    "intent.now": "지금 무엇을 할까요?",
    "intent.stay": "어디서 묵을까요?",
    "intent.eat.helper": "음식점과 카페",
    "intent.go.helper": "장소와 체험",
    "intent.now.helper": "시간대별 추천",
    "intent.stay.helper": "숙소 찾기",
    "intent.eat.badge": "현지 음식",
    "intent.go.badge": "여행지 및 체험",
    "intent.now.badge": "다낭 시간 기준",
    "intent.stay.badge": "맞춤 숙소",

    // Home Quick Select
    "home.quickSelect.title": "빠른 선택",
    "home.quickSelect.subtitle": "원하는 방식으로 다낭을 둘러보세요",

    // Preferences
    "preference.sheetTitle": "선호도 선택",
    "preference.close": "닫기",
    "preference.prompt": "어떤 곳을 찾으시나요?",
    "preference.companionPrompt": "누구와 함께 가시나요?",
    "pref.an_ngon": "맛있는 음식",
    "pref.dac_san": "특산물",
    "pref.hen_ho": "데이트",
    "pref.bien_ngam_canh": "해변 / 전망",
    "pref.chup_anh_dep": "사진 명소",
    "pref.thien_nhien": "자연",
    "pref.vui_choi": "즐길 거리",
    "pref.gan_bien": "해변 근처",
    "pref.gan_trung_tam": "도심",
    "pref.cap_doi": "데이트",
    "pref.yen_tinh": "조용한",
    "pref.nguoi_yeu": "연인과 함께",
    "pref.ban_be": "친구와 함께",
    "pref.mot_minh": "혼자서",
    "pref.chon_giup_toi": "랜덤 추천",

    // Actions
    "action.maps": "Google 지도에서 보기",
    "action.changeSelection": "선택 변경",
    "action.explore": "둘러보기",
    "action.selected": "선택됨",
    "action.nearby": "내 주변",
    "action.citywide": "다낭 전체",
    "action.retry": "다시 시도",
    "action.viewCitywide": "다낭 전체 보기",
    "action.locating": "위치 확인 중…",
    "action.navAria": "탐색 작업",

    // Hero
    "hero.description": "다낭의 맛집, 즐길 거리와 숙소를 찾아보세요.",
    "hero.imageAlt": "다낭의 석양 속 용다리와 한강",

    // Results & Counts
    "results.title": "추천 장소",
    "results.region": "추천 결과",
    "results.zero": "이 선택에 맞는 추천 장소가 아직 없습니다.",
    "results.one": "이 선택에 맞는 추천 장소가 1곳 있습니다.",
    "results.two": "이 선택에 맞는 추천 장소가 2곳 있습니다.",
    "results.count": "이 선택에 맞는 추천 장소가 {count}곳 있습니다.",
    "results.nearbyCount": "내 주변 {radiusKm}km 이내 추천 장소 {count}곳이 있습니다.",
    "results.nearbyZero": "5km 이내에 추천 장소를 찾을 수 없습니다.",
    "results.loading": "장소 찾는 중…",
    "results.error.title": "장소를 불러올 수 없습니다.",
    "results.error.message": "다시 시도하거나 선택을 변경해 보세요.",

    // Nearby Empty
    "nearby.empty.title": "5km 이내에 일치하는 장소가 없습니다.",
    "nearby.empty.message": "도시 전체로 검색을 확장하거나 다른 옵션을 선택해 보세요.",

    // Empty Generic
    "empty.title": "이 조건에 맞는 추천 장소가 아직 없습니다.",
    "empty.message": "다른 항목을 선택하여 알맞은 추천 장소를 찾아보세요.",

    // GPS Warnings
    "gps.warning.inaccurate": "주변 장소를 찾기에 위치 정확도가 부족합니다. 도시 전체 추천을 표시합니다.",
    "gps.warning.denied": "위치 권한이 거부되었습니다. 도시 전체 추천을 표시합니다.",
    "gps.warning.timeout": "위치 확인 시간이 초과되었습니다. 도시 전체 추천을 표시합니다.",
    "gps.warning.unavailable": "현재 위치를 확인할 수 없습니다. 도시 전체 추천을 표시합니다.",

    // Place Card
    "card.googleRating": "Google 평점",
    "card.reviews": "개 리뷰",
    "card.tagsAria": "장소 특징",

    // Itinerary
    "itinerary.sample": "예시 일정",
  "now.MORNING": "아침 추천",
  "now.section.EAT": "음식",
  "now.section.CAFE": "카페",
  "now.section.GO": "명소",
  "now.section.STAY": "숙소",

  "now.MIDDAY": "점심 추천",
  "now.AFTERNOON": "오후 추천",
  "now.EVENING": "저녁 추천",
  "now.NIGHT": "늦은 밤에 참고할 장소",
  "now.basedOn": "현재 다낭 시간을 기준으로 추천합니다.",
  "now.hours": "영업시간은 확인되지 않았습니다. 방문 전에 장소에 확인해 주세요.",
  "now.citywide": "도시 전체 추천이며, 이동 거리에 최적화된 순서는 아닙니다.",

    "intent.region": "원하는 활동 선택",

    // Language Controls
    "language.label": "언어",
    "language.auto": "기기 언어",
    "language.selectTitle": "언어 선택",
    "language.close": "닫기",
    "language.vi": "Tiếng Việt",
    "language.en": "English",
    "language.ko": "한국어",
    "language.autoDesc": "기기 언어 설정에 맞추기",

    // Reminder (Calendar Export)
    "action.remind": "알림 받기",
    "action.remindAria": "{name} 방문 알림 설정",
    "reminder.title": "방문 알림 설정",
    "reminder.prompt": "언제 방문하시겠어요?",
    "reminder.preset1h": "1시간 후",
    "reminder.preset2h": "2시간 후",
    "reminder.preset4h": "4시간 후",
    "reminder.customTime": "날짜 및 시간 선택",
    "reminder.leadNotice": "⏱ 30분 전 알림 (다낭 시간, GMT+7)",
    "reminder.addToCalendar": "📅 캘린더에 추가",
    "reminder.close": "닫기",
    "reminder.minTimeWarning": "현재 시간보다 최소 30분 이후의 시간을 선택해주세요.",
    "reminder.exportSuccess": "캘린더 알림 파일이 생성되었습니다. 캘린더 앱에서 일정을 열고 저장해 주세요.",
    "reminder.exportError": "캘린더 일정을 생성할 수 없습니다. 다시 시도해 주세요.",
    "reminder.badge": "예약됨",
    "reminder.icsSummary": "{name} 방문 (라카 다낭)",
    "reminder.icsDescPrefix": "{name} 방문 알림.",
    "reminder.icsAddress": "주소: {address}",
    "reminder.icsMaps": "Google Maps에서 길찾기: {mapsUrl}",
    "reminder.icsAlarmDesc": "{name} 방문 시간이 다가왔습니다! 출발 준비를 하세요.",
  },
} as const satisfies Record<SupportedLocale, Dictionary>;

export function translate(
  locale: SupportedLocale,
  key: MessageKey,
  params?: Record<string, string | number>
): string {
  let text: string = (UI_MESSAGES[locale] && UI_MESSAGES[locale][key]) || UI_MESSAGES.vi[key] || key;
  if (params) {
    for (const [pKey, pVal] of Object.entries(params)) {
      text = text.replaceAll(`{${pKey}}`, String(pVal));
    }
  }
  return text;
}
