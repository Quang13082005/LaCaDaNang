import type { SupportedLocale } from "./locales";

// UI chrome only. Place names, descriptions, types and data-backed tags belong to the DB adapter.
const vi = {
  // Intents
  "intent.eat": "ĂN GÌ?",
  "intent.go": "ĐI ĐÂU?",
  "intent.now": "BÂY GIỜ LÀM GÌ?",
  "intent.stay": "Ở ĐÂU?",
  "intent.eat.helper": "Quán ăn & món ngon",
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
  "pref.cafe": "Đi cafe",
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
  "action.viewDetails": "Xem chi tiết địa điểm",
  "action.back": "Quay lại",
  "action.viewCategory": "Xem danh mục",
  "action.home": "Trang chủ",
  "action.changeSelection": "Đổi lựa chọn",
  "action.explore": "Khám phá",
  "action.selected": "Đang chọn",
  "action.nearby": "Gần tôi",
  "action.citywide": "Toàn Đà Nẵng",
  "action.retry": "Thử lại",
  "action.viewCitywide": "Xem toàn Đà Nẵng",
  "action.generalNearby": "Xem tất cả gần tôi",
  "pref.general": "Tất cả địa điểm",
  "action.locating": "Đang định vị…",
  "action.navAria": "Thao tác khám phá",

  // Hero
  "hero.description": "Tìm chỗ ăn, chơi và nghỉ ở Đà Nẵng.",
  "hero.imageAlt": "Cầu Rồng và sông Hàn lúc hoàng hôn ở Đà Nẵng",

  // Home Intro (SEO & Guide)
  "home.intro.title": "Khám phá địa điểm Đà Nẵng cùng La Cà",
  "home.intro.description": "La Cà Đà Nẵng hỗ trợ bạn tìm nhanh nơi ăn uống, điểm vui chơi, quán cà phê và cơ sở lưu trú tại thành phố Đà Nẵng. Lựa chọn danh mục theo nhu cầu để nhận gợi ý phù hợp và xem vị trí địa điểm trên Google Maps.",
  "home.intro.guideTitle": "Cách khám phá địa điểm nhanh chóng",
  "home.intro.guideStep1": "1. Chọn nhu cầu: ĂN GÌ, ĐI ĐÂU, BÂY GIỜ LÀM GÌ hoặc Ở ĐÂU.",
  "home.intro.guideStep2": "2. Chọn sở thích phù hợp để nhận ngay các gợi ý sát nhu cầu.",
  "home.intro.guideStep3": "3. Xem chi tiết thông tin và xem vị trí địa điểm trên Google Maps khi cần.",

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
  "nearby.empty.title": "Chưa có địa điểm phù hợp với tiêu chí này trong 5 km.",
  "nearby.empty.message": "Giữ tiêu chí và xem toàn Đà Nẵng, hoặc bỏ tiêu chí hẹp để xem cùng loại địa điểm gần bạn.",

  // Empty Generic
  "empty.title": "Chưa có gợi ý phù hợp tiêu chí này.",
  "empty.message": "Hãy thử chọn một lựa chọn khác để nhận gợi ý phù hợp.",

  // GPS Warnings
  "gps.warning.inaccurate": "Vị trí chưa đủ chính xác để tìm địa điểm gần bạn. Đang hiển thị gợi ý toàn thành phố.",
  "now.gps.inaccurate": "Vị trí chưa đủ chính xác để tìm địa điểm gần bạn. Hãy thử lại hoặc chọn gợi ý toàn Đà Nẵng.",
  "gps.warning.denied": "Bạn đã từ chối quyền vị trí. Đang hiển thị gợi ý toàn thành phố.",
  "now.gps.denied": "Bạn đã từ chối quyền vị trí. Hãy thử lại hoặc chọn gợi ý toàn Đà Nẵng.",
  "gps.warning.timeout": "Không nhận được phản hồi vị trí kịp thời. Đang hiển thị gợi ý toàn thành phố.",
  "now.gps.timeout": "Không nhận được phản hồi vị trí kịp thời. Hãy thử lại hoặc chọn gợi ý toàn Đà Nẵng.",
  "gps.warning.unavailable": "Thiết bị không thể xác định vị trí hiện tại. Đang hiển thị gợi ý toàn thành phố.",
  "now.gps.unavailable": "Thiết bị không thể xác định vị trí hiện tại. Hãy thử lại hoặc chọn gợi ý toàn Đà Nẵng.",

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
  "now.locationPrompt": "Dùng vị trí của bạn để gợi ý lịch trình gần đây?",
  "now.allowLocation": "Cho phép vị trí",
  "now.showCitywide": "Xem gợi ý toàn Đà Nẵng",
  "now.nearbyRadius": "Trong {radius} km quanh bạn. Khoảng cách đường chim bay; thứ tự chưa tối ưu đường đi.",
  "now.insufficient": "Chưa đủ địa điểm phù hợp để tạo lịch trình 3 điểm trong 5 km. Các điểm hiện có được hiển thị bên dưới.",

  "intent.region": "Mục đích khám phá",

    // Language Controls
  "language.label": "Ngôn ngữ",
  "language.auto": "Theo thiết bị",
  "language.selectTitle": "Chọn ngôn ngữ",
  "language.close": "Đóng",
  "language.vi": "Tiếng Việt",
  "language.en": "English",
  "language.ko": "한국어",
  "language.ru": "Русский",
  "language.zh": "简体中文",
  "language.autoDesc": "Tự động theo ngôn ngữ thiết bị",

} as const;

export type MessageKey = keyof typeof vi;
type Dictionary = { readonly [Key in MessageKey]: string };

const en: Dictionary = {
    // Intents
    "intent.eat": "What to eat?",
    "intent.go": "Where to go?",
    "intent.now": "What to do now?",
    "intent.stay": "Where to stay?",
    "intent.eat.helper": "Food & local dishes",
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
    "pref.cafe": "Visit a cafe",
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
    "action.viewDetails": "View place details",
    "action.back": "Back",
    "action.viewCategory": "View category",
    "action.home": "Home",
    "action.changeSelection": "Change selection",
    "action.explore": "Explore",
    "action.selected": "Selected",
    "action.nearby": "Near me",
    "action.citywide": "All Da Nang",
    "action.retry": "Retry",
    "action.viewCitywide": "View all Da Nang",
  "action.generalNearby": "Show all nearby",
  "pref.general": "All places",
    "action.locating": "Locating…",
    "action.navAria": "Discovery actions",

    // Hero
    "hero.description": "Find food, activities and places to stay in Da Nang.",
    "hero.imageAlt": "Dragon Bridge and the Han River at sunset in Da Nang",

    // Home Intro (SEO & Guide)
    "home.intro.title": "Explore Da Nang with La Cà",
    "home.intro.description": "La Cà Da Nang helps you quickly find dining spots, attractions, cafés, and accommodations across Da Nang. Select your current need to get suitable suggestions and view places on Google Maps.",
    "home.intro.guideTitle": "Quick discovery guide",
    "home.intro.guideStep1": "1. Choose an intent: What to eat, Where to go, What to do now, or Where to stay.",
    "home.intro.guideStep2": "2. Select your preference to view targeted suggestions instantly.",
    "home.intro.guideStep3": "3. Check place details and view the place on Google Maps when needed.",

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
  "nearby.empty.title": "No places match this filter within 5 km.",
  "nearby.empty.message": "Keep this filter across Da Nang, or remove the narrow filter to see the same category nearby.",

    // Empty Generic
    "empty.title": "No suggestions match these criteria yet.",
    "empty.message": "Try another selection to find suitable suggestions.",

    // GPS Warnings
    "gps.warning.inaccurate": "Location is not accurate enough to find nearby places. Showing citywide suggestions.",
    "now.gps.inaccurate": "Location is not accurate enough to find nearby places. Retry location or choose citywide suggestions.",
    "gps.warning.denied": "Location permission denied. Showing citywide suggestions.",
    "now.gps.denied": "Location permission denied. Retry location or choose citywide suggestions.",
    "gps.warning.timeout": "Location request timed out. Showing citywide suggestions.",
    "now.gps.timeout": "Location request timed out. Retry location or choose citywide suggestions.",
    "gps.warning.unavailable": "Unable to determine current location. Showing citywide suggestions.",
    "now.gps.unavailable": "Unable to determine current location. Retry location or choose citywide suggestions.",

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
  "now.locationPrompt": "Use your location to suggest a nearby itinerary?",
  "now.allowLocation": "Allow location",
  "now.showCitywide": "Show citywide suggestions",
  "now.nearbyRadius": "Within {radius} km of you. Straight-line distances; stop order is not route-optimized.",
  "now.insufficient": "There are not enough places for a 3-stop itinerary within 5 km. Available stops are shown below.",

    "intent.region": "Choose what to explore",

    // Language Controls
    "language.label": "Language",
    "language.auto": "Device language",
    "language.selectTitle": "Select language",
    "language.close": "Close",
    "language.vi": "Tiếng Việt",
    "language.en": "English",
    "language.ko": "한국어",
    "language.ru": "Русский",
    "language.zh": "简体中文",
    "language.autoDesc": "Match device language automatically",

  };

const ko: Dictionary = {
    // Intents
    "intent.eat": "무엇을 먹을까요?",
    "intent.go": "어디로 갈까요?",
    "intent.now": "지금 무엇을 할까요?",
    "intent.stay": "어디서 묵을까요?",
    "intent.eat.helper": "음식점과 맛있는 요리",
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
    "pref.cafe": "카페 가기",
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
    "action.viewDetails": "장소 상세 보기",
    "action.back": "뒤로 가기",
    "action.viewCategory": "카테고리 보기",
    "action.home": "홈",
    "action.changeSelection": "선택 변경",
    "action.explore": "둘러보기",
    "action.selected": "선택됨",
    "action.nearby": "내 주변",
    "action.citywide": "다낭 전체",
    "action.retry": "다시 시도",
    "action.viewCitywide": "다낭 전체 보기",
  "action.generalNearby": "주변 전체 보기",
  "pref.general": "모든 장소",
    "action.locating": "위치 확인 중…",
    "action.navAria": "탐색 작업",

    // Hero
    "hero.description": "다낭의 맛집, 즐길 거리와 숙소를 찾아보세요.",
    "hero.imageAlt": "다낭의 석양 속 용다리와 한강",

    // Home Intro (SEO & Guide)
    "home.intro.title": "라카 다낭과 함께하는 다낭 장소 탐색",
    "home.intro.description": "라카 다낭은 다낭의 음식점, 즐길 거리, 카페, 숙소를 빠르게 찾을 수 있도록 도와줍니다. 원하는 카테고리를 선택해 알맞은 추천 장소를 확인하고 Google 지도에서 장소 위치를 확인해보세요.",
    "home.intro.guideTitle": "빠른 장소 탐색 방법",
    "home.intro.guideStep1": "1. 활동 선택: 먹거리, 명소, 지금 할 일, 또는 숙소 중 하나를 선택합니다.",
    "home.intro.guideStep2": "2. 원하는 테마를 선택하여 알맞은 추천 장소를 바로 확인합니다.",
    "home.intro.guideStep3": "3. 상세 정보를 확인하고 필요할 때 Google 지도에서 장소 위치를 확인하세요.",

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
  "nearby.empty.title": "5km 이내에 이 조건에 맞는 장소가 없습니다.",
  "nearby.empty.message": "다낭 전체에서 같은 조건으로 찾거나, 세부 조건을 해제하고 주변의 같은 종류의 장소를 확인하세요.",

    // Empty Generic
    "empty.title": "이 조건에 맞는 추천 장소가 아직 없습니다.",
    "empty.message": "다른 항목을 선택하여 알맞은 추천 장소를 찾아보세요.",

    // GPS Warnings
    "gps.warning.inaccurate": "주변 장소를 찾기에 위치 정확도가 부족합니다. 도시 전체 추천을 표시합니다.",
    "now.gps.inaccurate": "주변 장소를 찾기에 위치 정확도가 부족합니다. 위치를 다시 확인하거나 다낭 전체 추천을 선택하세요.",
    "gps.warning.denied": "위치 권한이 거부되었습니다. 도시 전체 추천을 표시합니다.",
    "now.gps.denied": "위치 권한이 거부되었습니다. 위치를 다시 확인하거나 다낭 전체 추천을 선택하세요.",
    "gps.warning.timeout": "위치 확인 시간이 초과되었습니다. 도시 전체 추천을 표시합니다.",
    "now.gps.timeout": "위치 확인 시간이 초과되었습니다. 위치를 다시 확인하거나 다낭 전체 추천을 선택하세요.",
    "gps.warning.unavailable": "현재 위치를 확인할 수 없습니다. 도시 전체 추천을 표시합니다.",
    "now.gps.unavailable": "현재 위치를 확인할 수 없습니다. 위치를 다시 확인하거나 다낭 전체 추천을 선택하세요.",

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
  "now.locationPrompt": "현재 위치를 사용해 주변 코스를 추천할까요?",
  "now.allowLocation": "위치 허용",
  "now.showCitywide": "다낭 전체 추천 보기",
  "now.nearbyRadius": "주변 {radius}km 이내입니다. 직선거리이며 방문 순서는 이동 경로에 최적화되지 않았습니다.",
  "now.insufficient": "5km 이내에 3곳 코스를 만들 장소가 부족합니다. 가능한 장소를 아래에 표시합니다.",

    "intent.region": "원하는 활동 선택",

    // Language Controls
    "language.label": "언어",
    "language.auto": "기기 언어",
    "language.selectTitle": "언어 선택",
    "language.close": "닫기",
    "language.vi": "Tiếng Việt",
    "language.en": "English",
    "language.ko": "한국어",
    "language.ru": "Русский",
    "language.zh": "简体中文",
    "language.autoDesc": "기기 언어 설정에 맞추기",

  };

const ru: Dictionary = {
  // Intents
  "intent.eat": "Где поесть?",
  "intent.go": "Куда сходить?",
  "intent.now": "Чем заняться сейчас?",
  "intent.stay": "Где остановиться?",
  "intent.eat.helper": "Кафе, рестораны и блюда",
  "intent.go.helper": "Достопримечательности и отдых",
  "intent.now.helper": "Идеи по времени суток",
  "intent.stay.helper": "Поиск жилья и отелей",
  "intent.eat.badge": "Местная кухня",
  "intent.go.badge": "Места и впечатления",
  "intent.now.badge": "По времени Дананга",
  "intent.stay.badge": "Удобное жилье",

  // Home Quick Select
  "home.quickSelect.title": "Быстрый выбор",
  "home.quickSelect.subtitle": "Откройте Дананг по вашим предпочтениям",

  // Preferences
  "preference.sheetTitle": "Выберите предпочтения",
  "preference.close": "Закрыть",
  "preference.prompt": "Какое место вы ищете?",
  "preference.companionPrompt": "С кем вы путешествуете?",
  "pref.an_ngon": "Вкусная еда",
  "pref.dac_san": "Фирменные блюда",
  "pref.hen_ho": "Романтика",
  "pref.bien_ngam_canh": "Пляж / красивый вид",
  "pref.chup_anh_dep": "Красивые фото",
  "pref.thien_nhien": "Природа",
  "pref.vui_choi": "Развлечения",
  "pref.cafe": "Пойти в кафе",
  "pref.gan_bien": "У моря",
  "pref.gan_trung_tam": "Центр города",
  "pref.cap_doi": "Для пар",
  "pref.yen_tinh": "Тихое место",
  "pref.nguoi_yeu": "С любимым человеком",
  "pref.ban_be": "С друзьями",
  "pref.mot_minh": "В одиночку",
  "pref.chon_giup_toi": "Случайный выбор",

  // Actions
  "action.maps": "Смотреть на Google Maps",
  "action.viewDetails": "Подробнее о месте",
  "action.back": "Назад",
  "action.viewCategory": "Смотреть категорию",
  "action.home": "Главная",
  "action.changeSelection": "Изменить выбор",
  "action.explore": "Исследовать",
  "action.selected": "Выбрано",
  "action.nearby": "Рядом со мной",
  "action.citywide": "Весь Дананг",
  "action.retry": "Повторить",
  "action.viewCitywide": "Посмотреть по всему Данангу",
  "action.generalNearby": "Все места рядом",
  "pref.general": "Все места",
  "action.locating": "Определение геопозиции…",
  "action.navAria": "Действия по поиску",

  // Hero
  "hero.description": "Найдите, где поесть, отдохнуть и остановиться в Дананге.",
  "hero.imageAlt": "Мост Дракона и река Хан на закате в Дананге",

  // Home Intro (SEO & Guide)
  "home.intro.title": "Исследуйте Дананг вместе с La Cà",
  "home.intro.description": "La Cà Đà Nẵng поможет вам быстро найти рестораны, достопримечательности, кафе и отели в городе Дананг. Выберите категорию по вашим потребностям, чтобы получить подходящие рекомендации и посмотреть расположение на Google Maps.",
  "home.intro.guideTitle": "Как быстро найти подходящее место",
  "home.intro.guideStep1": "1. Выберите цель: Где поесть, Куда сходить, Чем заняться сейчас или Где остановиться.",
  "home.intro.guideStep2": "2. Укажите ваши предпочтения, чтобы сразу получить точные варианты.",
  "home.intro.guideStep3": "3. Изучите информацию о месте и при необходимости посмотрите его на Google Maps.",

  // Results & Counts
  "results.title": "Рекомендованные места",
  "results.region": "Результаты подбора",
  "results.zero": "Пока нет рекомендаций для этого выбора.",
  "results.one": "Найдено 1 подходящее место.",
  "results.two": "Найдено 2 подходящих места.",
  "results.count": "Найдено {count} мест по вашему выбору.",
  "results.nearbyCount": "Найдено {count} мест рядом с вами (в радиусе {radiusKm} км).",
  "results.nearbyZero": "В радиусе 5 км мест не найдено.",
  "results.loading": "Поиск мест…",
  "results.error.title": "Не удалось загрузить места.",
  "results.error.message": "Попробуйте снова или измените параметры.",

  // Nearby Empty
  "nearby.empty.title": "В радиусе 5 км нет мест, точно подходящих под эти критерии.",
  "nearby.empty.message": "Посмотрите по всему Данангу или сбросьте фильтры, чтобы увидеть все места этой категории рядом.",

  // Empty Generic
  "empty.title": "Пока нет мест по данным критериям.",
  "empty.message": "Попробуйте выбрать другой вариант для получения рекомендаций.",

  // GPS Warnings
  "gps.warning.inaccurate": "Точность геопозиции недостаточна для поиска рядом. Показаны рекомендации по всему городу.",
  "now.gps.inaccurate": "Точность геопозиции недостаточна для поиска рядом. Попробуйте еще раз или выберите рекомендации по всему Данангу.",
  "gps.warning.denied": "Доступ к геопозиции отклонен. Показаны рекомендации по всему городу.",
  "now.gps.denied": "Доступ к геопозиции отклонен. Попробуйте еще раз или выберите рекомендации по всему Данангу.",
  "gps.warning.timeout": "Время ожидания геопозиции истекло. Показаны рекомендации по всему городу.",
  "now.gps.timeout": "Время ожидания геопозиции истекло. Попробуйте еще раз или выберите рекомендации по всему Данангу.",
  "gps.warning.unavailable": "Устройство не может определить текущую геопозицию. Показаны рекомендации по всему городу.",
  "now.gps.unavailable": "Устройство не может определить текущую геопозицию. Попробуйте еще раз или выберите рекомендации по всему Данангу.",

  // Place Card
  "card.googleRating": "Рейтинг Google",
  "card.reviews": "отзывов",
  "card.tagsAria": "Особенности места",

  // Itinerary
  "itinerary.sample": "Пример маршрута",
  "now.MORNING": "Идеи на утро",
  "now.section.EAT": "Еда",
  "now.section.CAFE": "Кафе",
  "now.section.GO": "Прогулка",
  "now.section.STAY": "Жилье",

  "now.MIDDAY": "Идеи на обед",
  "now.AFTERNOON": "Идеи на день",
  "now.EVENING": "Идеи на вечер",
  "now.NIGHT": "Варианты на поздний вечер",
  "now.basedOn": "Рекомендации сформированы с учетом текущего времени в Дананге.",
  "now.hours": "Часы работы не верифицированы. Уточняйте перед посещением.",
  "now.citywide": "Рекомендации по всему городу; порядок мест не оптимизирован по расстоянию.",
  "now.locationPrompt": "Использовать вашу геопозицию для составления маршрута поблизости?",
  "now.allowLocation": "Разрешить геолокацию",
  "now.showCitywide": "Смотреть по всему Данангу",
  "now.nearbyRadius": "В пределах {radius} км от вас. Расстояние по прямой; порядок остановок не оптимизирован по маршруту.",
  "now.insufficient": "Недостаточно мест в радиусе 5 км для полного маршрута из 3 точек. Доступные места показаны ниже.",

  "intent.region": "Цель поиска",

  // Language Controls
  "language.label": "Язык",
  "language.auto": "Как в устройстве",
  "language.selectTitle": "Выбор языка",
  "language.close": "Закрыть",
  "language.vi": "Tiếng Việt",
  "language.en": "English",
  "language.ko": "한국어",
  "language.ru": "Русский",
  "language.zh": "简体中文",
  "language.autoDesc": "Автоматически по языку системы",
};

const zh: Dictionary = {
  // Intents
  "intent.eat": "吃什么？",
  "intent.go": "去哪里？",
  "intent.now": "现在做什么？",
  "intent.stay": "住哪里？",
  "intent.eat.helper": "餐厅与特色美食",
  "intent.go.helper": "景点与游玩体验",
  "intent.now.helper": "根据当前时段推荐",
  "intent.stay.helper": "寻找住宿",
  "intent.eat.badge": "地道美食",
  "intent.go.badge": "目的地与体验",
  "intent.now.badge": "岘港当地时间",
  "intent.stay.badge": "精选住宿",

  // Home Quick Select
  "home.quickSelect.title": "快速选择",
  "home.quickSelect.subtitle": "根据您的需求探索岘港",

  // Preferences
  "preference.sheetTitle": "选择偏好",
  "preference.close": "关闭",
  "preference.prompt": "您想找什么样的地方？",
  "preference.companionPrompt": "与谁同行：",
  "pref.an_ngon": "美味佳肴",
  "pref.dac_san": "当地特产",
  "pref.hen_ho": "情侣约会",
  "pref.bien_ngam_canh": "海滩 / 观景",
  "pref.chup_anh_dep": "拍照出片",
  "pref.thien_nhien": "亲近自然",
  "pref.vui_choi": "娱乐游玩",
  "pref.cafe": "喝咖啡",
  "pref.gan_bien": "临近海滩",
  "pref.gan_trung_tam": "市中心",
  "pref.cap_doi": "浪漫约会",
  "pref.yen_tinh": "宁静惬意",
  "pref.nguoi_yeu": "与伴侣",
  "pref.ban_be": "与朋友",
  "pref.mot_minh": "独自一人",
  "pref.chon_giup_toi": "帮我挑选",

  // Actions
  "action.maps": "在 Google 地图上查看",
  "action.viewDetails": "查看地点详情",
  "action.back": "返回",
  "action.viewCategory": "查看分类",
  "action.home": "首页",
  "action.changeSelection": "更改选择",
  "action.explore": "探索",
  "action.selected": "已选择",
  "action.nearby": "我的附近",
  "action.citywide": "整个岘港",
  "action.retry": "重试",
  "action.viewCitywide": "查看整个岘港",
  "action.generalNearby": "查看附近所有地点",
  "pref.general": "所有地点",
  "action.locating": "正在定位…",
  "action.navAria": "探索操作",

  // Hero
  "hero.description": "寻找岘港的美食、游玩好去处与精选住宿。",
  "hero.imageAlt": "岘港日落时分的龙桥与汉江",

  // Home Intro (SEO & Guide)
  "home.intro.title": "与 La Cà 一起探索岘港精彩地点",
  "home.intro.description": "La Cà Đà Nẵng 帮助您快速查找岘港市内的餐饮美食、游玩景点、特色咖啡厅与住宿设施。根据需求选择分类，即可获取贴心建议并在 Google 地图上查看地点位置。",
  "home.intro.guideTitle": "快速探索指南",
  "home.intro.guideStep1": "1. 选择需求：吃什么、去哪里、现在做什么或住哪里。",
  "home.intro.guideStep2": "2. 选择符合的心仪偏好，立即获取精准推荐。",
  "home.intro.guideStep3": "3. 查看详细信息，需要时可在 Google 地图上查看具体位置。",

  // Results & Counts
  "results.title": "推荐地点",
  "results.region": "推荐结果",
  "results.zero": "当前选择暂无推荐。",
  "results.one": "找到 1 个符合推荐。",
  "results.two": "找到 2 个符合推荐。",
  "results.count": "当前选择共有 {count} 个推荐地点。",
  "results.nearbyCount": "在您附近找到 {count} 个推荐（半径 {radiusKm} 公里内）。",
  "results.nearbyZero": "在 5 公里范围内未找到附近推荐。",
  "results.loading": "正在寻找地点…",
  "results.error.title": "无法加载地点。",
  "results.error.message": "请重试或更改选择。",

  // Nearby Empty
  "nearby.empty.title": "在 5 公里范围内没有完全符合此条件的地点。",
  "nearby.empty.message": "保留条件查看全岘港推荐，或放宽筛选查看附近的同类地点。",

  // Empty Generic
  "empty.title": "暂无符合此条件的推荐。",
  "empty.message": "请尝试选择其他选项以获取合适推荐。",

  // GPS Warnings
  "gps.warning.inaccurate": "当前位置精度不足以查找附近地点，已为您展示全城推荐。",
  "now.gps.inaccurate": "位置精度不足以查找附近推荐，请重试或选择全岘港推荐。",
  "gps.warning.denied": "您已拒绝位置权限，已为您展示全城推荐。",
  "now.gps.denied": "您已拒绝位置权限，请重试或选择全岘港推荐。",
  "gps.warning.timeout": "获取位置超时，已为您展示全城推荐。",
  "now.gps.timeout": "获取位置超时，请重试或选择全岘港推荐。",
  "gps.warning.unavailable": "设备无法获取当前位置，已为您展示全城推荐。",
  "now.gps.unavailable": "设备无法获取当前位置，请重试或选择全岘港推荐。",

  // Place Card
  "card.googleRating": "Google 评分",
  "card.reviews": "条评价",
  "card.tagsAria": "地点特色",

  // Itinerary
  "itinerary.sample": "参考行程",
  "now.MORNING": "早间推荐",
  "now.section.EAT": "美食",
  "now.section.CAFE": "咖啡",
  "now.section.GO": "游玩",
  "now.section.STAY": "住宿",

  "now.MIDDAY": "午间推荐",
  "now.AFTERNOON": "午后推荐",
  "now.EVENING": "晚间推荐",
  "now.NIGHT": "深夜出行参考",
  "now.basedOn": "根据岘港当前时间推荐。",
  "now.hours": "营业时间未经核实，前往前请向地点确认。",
  "now.citywide": "全城推荐；地点顺序未针对行车距离优化。",
  "now.locationPrompt": "使用您的当前位置推荐附近的行程？",
  "now.allowLocation": "允许获取位置",
  "now.showCitywide": "查看全岘港推荐",
  "now.nearbyRadius": "在您周边 {radius} 公里内。为直线距离，行程顺序未针对路线做路径优化。",
  "now.insufficient": "5 公里内可用地点不足以生成 3 个地点的完整行程，现有可用地点已在下方展示。",

  "intent.region": "探索目的",

  // Language Controls
  "language.label": "语言",
  "language.auto": "跟随设备",
  "language.selectTitle": "选择语言",
  "language.close": "关闭",
  "language.vi": "Tiếng Việt",
  "language.en": "English",
  "language.ko": "한국어",
  "language.ru": "Русский",
  "language.zh": "简体中文",
  "language.autoDesc": "根据系统语言自动设置",
};

export const UI_MESSAGES = {
  vi,
  en,
  ko,
  ru,
  zh,
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
