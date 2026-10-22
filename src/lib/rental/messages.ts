import type { SupportedLocale } from "@/lib/i18n/locales";
 const vi = {
  title: "Thuê xe máy Đà Nẵng", intro: "Phương tiện hỗ trợ hành trình khám phá của bạn.",
  hero: "Có hỗ trợ thuê xe máy khi khám phá Đà Nẵng", suggestion: "Cần xe để khám phá thêm?", explore: "Xem xe máy",
  nowSuggestion: "Muốn chủ động khám phá nhiều địa điểm?", nowExplore: "Tham khảo xe máy thuê tại Đà Nẵng",
  suggestionBadge: "Gợi ý thuê xe máy",
  suggestionTitle: "Cần xe máy để khám phá Đà Nẵng?",
  suggestionDescription: "Xem các mẫu xe, giá thuê và thông tin liên hệ nếu bạn cần di chuyển thuận tiện hơn.",
  suggestionCta: "Xem xe & giá thuê",
  suggestionStartingPrice: "Từ 100.000đ/ngày",
  suggestionContextGo: "Gợi ý di chuyển · Điểm cách xa",
  suggestionTitleGo: "Điểm đến hơi xa? Chủ động khám phá bằng xe máy.",
  suggestionBenefitGo: "Linh hoạt lịch trình · Miễn cọc khi có 2 CCCD · Kèm mũ bảo hiểm",
  suggestionContextNow: "Lịch trình nhiều chặng",
  suggestionTitleNow: "Đi nhiều nơi, chủ động hơn! Tham khảo xe máy thuê để khám phá Đà Nẵng theo lịch trình.",
  suggestionBenefitNow: "Chủ động thời gian · Đầy đủ xe ga, xe số, xe côn · Kèm mũ bảo hiểm",
  preview: "Bản xem trước • Giá thuê đã được xác nhận", all: "Tất cả", scooter: "Xe ga", semi: "Xe số", manual: "Xe côn",
  back: "Quay lại", close: "Quay lại khám phá", color: "Màu xe", incomplete: "Màu xe chưa đầy đủ", capacity: "Dung tích", year: "Năm đăng ký", category: "Loại xe",
  price: "Giá thuê/ngày", pending: "Giá chưa xác nhận", deposit: "Tiền cọc", depositPending: "Điều kiện và mức cọc đang chờ xác nhận",
  noImage: "Hình ảnh xe đang được cập nhật", image: "Ảnh xe", chooseImage: "Xem ảnh", zalo: "Liên hệ Zalo", call: "Gọi điện",
  contactPending: "Thông tin liên hệ chưa được cấu hình", availability: "Liên hệ để xác nhận giá, điều kiện thuê và tình trạng xe. Năm đăng ký không phải năm sản xuất.", filters: "Lọc loại xe", code: "Mã tham khảo",
  terms: "Theo thông tin đơn vị cho thuê: cần ít nhất 1 CCCD. Để lại 2 CCCD (của 2 người khác nhau): không cọc tiền. Để lại 1 CCCD: áp dụng mức cọc theo loại xe. Có mũ bảo hiểm. Chi tiết giấy tờ và hợp đồng: liên hệ qua điện thoại hoặc Zalo. Không gửi giấy tờ qua website này.", depositCondition: "Tiền cọc khi để lại 1 CCCD (để lại 2 CCCD của 2 người khác nhau: miễn cọc)",
} as const;
type Copy = { [K in keyof typeof vi]: string };
const en: Copy = {
  title:"Motorbike rental in Da Nang",intro:"Transport to support your journey of discovery.",hero:"Motorbike rental support for exploring Da Nang",suggestion:"Need a bike to explore further?",explore:"View motorbikes",
  nowSuggestion:"Want to explore multiple places on your own?",nowExplore:"See motorbike rentals in Da Nang",
  suggestionBadge: "Motorbike rental",
  suggestionTitle: "Need a motorbike to explore Da Nang?",
  suggestionDescription: "Check available models, rental rates, and contact info if you need an easier way to get around.",
  suggestionCta: "View bikes & rates",
  suggestionStartingPrice: "From 100,000 VND/day",
  suggestionContextGo: "Travel tip · Further spot",
  suggestionTitleGo: "Destination a bit far? Explore freely by motorbike.",
  suggestionBenefitGo: "Flexible schedule · Zero deposit with 2 IDs · Helmets included",
  suggestionContextNow: "Multi-stop itinerary",
  suggestionTitleNow: "Multiple spots ahead? Move around at your own pace.",
  suggestionBenefitNow: "Save travel time · Scooters, semi-auto & manual bikes · Helmets included",
  preview:"Preview • Rental prices confirmed",all:"All",scooter:"Scooter",semi:"Semi-auto",manual:"Manual",back:"Back",close:"Back to exploring",color:"Colour",incomplete:"Colour details incomplete",capacity:"Engine capacity",year:"Registration year",category:"Type",
  price:"Daily rental price",pending:"Price awaiting confirmation",deposit:"Deposit",depositPending:"Deposit amount and terms awaiting confirmation",noImage:"Vehicle photos are being updated",image:"Vehicle photo",chooseImage:"View photo",zalo:"Contact on Zalo",call:"Call",contactPending:"Contact details are not configured",availability:"Contact the provider to confirm prices, rental terms and availability. Registration year is not manufacture year.",filters:"Filter vehicle type",code:"Reference code",
  terms:"Provider information: at least one Vietnamese citizen ID card (CCCD) is required. Leaving two CCCD cards (from two different persons): no cash deposit. Leaving one: the deposit shown for the vehicle type applies. Helmets are included. Contact by phone or Zalo for document and contract details. Do not send identity documents through this website.",depositCondition:"Deposit when leaving 1 CCCD (leaving 2 CCCD cards from 2 different persons: no cash deposit)",
};
const ko: Copy = {
  title:"다낭 오토바이 대여",intro:"여행과 탐방을 돕는 이동 수단입니다.",hero:"다낭 여행을 위한 오토바이 대여 안내",suggestion:"더 둘러볼 오토바이가 필요하세요?",explore:"오토바이 보기",
  nowSuggestion:"여러 장소를 자유롭게 둘러보고 싶으신가요?",nowExplore:"다낭 오토바이 대여 알아보기",
  suggestionBadge: "오토바이 대여",
  suggestionTitle: "다낭을 여행할 오토바이가 필요하신가요?",
  suggestionDescription: "더 편리하게 이동할 수 있도록 차량 모델, 대여 요금 및 연락처 정보를 확인해보세요.",
  suggestionCta: "차량 및 요금 보기",
  suggestionStartingPrice: "1일 100,000 VND부터",
  suggestionContextGo: "이동 팁 · 먼 목적지",
  suggestionTitleGo: "목적지가 조금 먼가요? 오토바이로 자유롭게 탐방해보세요.",
  suggestionBenefitGo: "자유로운 일정 · 신분증 2개 시 무보증금 · 헬멧 포함",
  suggestionContextNow: "다구간 여행 일정",
  suggestionTitleNow: "여러 곳을 더 편하게! 일정에 맞춰 자유롭게 이동하세요.",
  suggestionBenefitNow: "시간 절약 · 스쿠터, 반자동, 수동 바이크 구비 · 헬멧 포함",
  preview:"미리보기 • 대여 요금 확인 완료",all:"전체",scooter:"스쿠터",semi:"반자동",manual:"수동",back:"뒤로",close:"장소 탐색으로 돌아가기",color:"색상",incomplete:"색상 정보 미완성",capacity:"배기량",year:"등록 연도",category:"유형",
  price:"일일 대여료",pending:"요금 확인 대기 중",deposit:"보증금",depositPending:"보증금 금액 및 조건 확인 대기 중",noImage:"차량 사진을 업데이트하고 있습니다",image:"차량 사진",chooseImage:"사진 보기",zalo:"Zalo로 문의",call:"전화하기",contactPending:"연락처가 아직 등록되지 않았습니다",availability:"요금, 대여 조건 및 이용 가능 여부는 업체에 문의하세요. 등록 연도는 제조 연도가 아닙니다.",filters:"차량 유형 필터",code:"참조 코드",
  terms:"대여업체 안내: 베트남 시민 신분증(CCCD)이 최소 1개 필요합니다. 서로 다른 2명의 CCCD 2개를 맡기면 현금 보증금이 없으며, 1개를 맡기면 차량 유형별 표시된 보증금이 적용됩니다. 헬멧이 제공됩니다. 서류 및 계약 세부 사항은 전화 hoặc Zalo로 문의하세요. 이 웹사이트로 신분증을 보내지 마세요.",depositCondition:"CCCD 1개 맡길 때의 보증금 (2인 각각의 신분증 2개 맡길 시 보증금 면제)",
};

export function rentalCopy(locale: SupportedLocale): Copy {
  if (locale === "vi") return vi;
  if (locale === "ko") return ko;
  return en;
}

export const colorTranslations: Record<"en" | "ko", Record<string, string>> = {
 en: {
  "Trắng-Bạc-Đen": "White-Silver-Black",
  "Đen-Vàng": "Black-Yellow",
  "Đỏ-Đen": "Red-Black",
  "Xám-Đen": "Grey-Black",
  "Xanh-Đen": "Blue-Black",
  "Đỏ-Đen-Bạc": "Red-Black-Silver",
  "Đen": "Black",
  "Đen-Bạc": "Black-Silver",
  "Xanh-Bạc": "Blue-Silver",
  "Trắng-Đen": "White-Black",
  "Đỏ": "Red",
  "Đen-Đỏ": "Black-Red",
  "Đỏ-Nâu": "Red-Brown",
  "Đỏ-Đen-Xám": "Red-Black-Grey",
 },
 ko: {
  "Trắng-Bạc-Đen": "흰색-은색-검정",
  "Đen-Vàng": "검정-노랑",
  "Đỏ-Đen": "빨강-검정",
  "Xám-Đen": "회색-검정",
  "Xanh-Đen": "파랑-검정",
  "Đỏ-Đen-Bạc": "빨강-검정-은색",
  "Đen": "검정",
  "Đen-Bạc": "검정-은색",
  "Xanh-Bạc": "파랑-은색",
  "Trắng-Đen": "흰색-검정",
  "Đỏ": "빨강",
  "Đen-Đỏ": "검정-빨강",
  "Đỏ-Nâu": "빨강-갈색",
  "Đỏ-Đen-Xám": "빨강-검정-회색",
 },
};

export function formatVehicleColor(color: string, locale: SupportedLocale): string {
 if (color.includes("…")) {
  return rentalCopy(locale).incomplete;
 }
 if (locale === "vi") {
  return color;
 }
 return colorTranslations[locale as "en" | "ko"]?.[color] ?? color;
}

