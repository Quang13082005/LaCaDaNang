# DATA_CURATION_REPORT.md — Báo Cáo Kiểm Toán & Tinh Tuyển Dữ Liệu MVP (Phase 2A.2 Hardened)

Ngày cập nhật: 01/10/2026 (Phase 2A.2 — Curation Evidence Hardening)  
Mục đích: Loại bỏ triệt để các suy đoán thiếu căn cứ (AI heuristics) và nhãn chủ quan không có bằng chứng trực tiếp từ source. Thiết lập ranh giới dữ liệu chuẩn xác, phân lập giữa nhãn tự động xác thực (`AUTO_VERIFIED`) và hàng đợi duyệt thủ công (`NEEDS_REVIEW`).

---

## 1. Tổng quan số lượng & Trạng thái dữ liệu (Dataset Overview)

| Chỉ số | Số lượng | Ghi chú |
| :--- | :--- | :--- |
| **Tổng số ứng viên đầu vào (Candidates)** | **300** | 180 EAT, 115 STAY, 5 GO (+ 1 Mikazuki water park) |
| **Tổng số địa điểm tinh tuyển (Final Curated)** | **86** | 50 EAT, 6 GO, 30 STAY |
| • Nhãn tự động xác thực (`AUTO_VERIFIED`) | **12 địa điểm** | Chỉ mang các nhãn xác định 100% từ quy tắc |
| • Chờ duyệt nhãn chủ quan (`NEEDS_REVIEW`) | **74 địa điểm** | Mang nhãn chủ quan trong `manualReviewTags`, chờ user duyệt |
| **Loại bỏ do ngoài Đà Nẵng (Hội An / Điện Bàn)** | **6** | Lạc Long Quân Điện Bàn, Hội An, Quảng Nam |
| **Loại bỏ dịch vụ không hợp lệ (Non-discovery)** | **2** | Cty du lịch lữ hành, CLB Golf Montgomerie Links |
| **Loại bỏ chi nhánh trùng lặp (Duplicate Chains)** | **2** | GOYUHAN cơ sở 2, EZI cơ sở 2 (chỉ giữ 1 cơ sở chính) |
| **Số lượng thiếu ảnh có bản quyền (Missing images)** | **86 (100%)** | `imageUrl: null` (dùng branded fallback của Phase 1) |
| **Số lượng thiếu mức giá xác thực (Missing price)** | **86 (100%)** | `priceLevel: null` (gỡ bỏ hoàn toàn nhãn `CHEAP`) |
| **Số lượng thiếu giờ mở cửa xác thực (Missing hours)** | **86 (100%)** | `timeTags: []`, `bestTimeOfDay: []`, gỡ bỏ hoàn toàn `NIGHT` |
| **Thời lượng trải nghiệm (Typical Duration)** | **86 (100%)** | `typicalDurationMinutes: null` (không áp heuristic 60/90p) |

---

## 2. Báo cáo phân loại nhãn (Tag Provenance Audit)

### 2.1. AUTO VERIFIED TAGS (5 Nhãn Tự Động Xác Thực)
Chỉ được gán vào `curatedTags` của địa điểm khi thỏa mãn quy tắc toán học / địa lý tại [docs/DATA_TAG_RULES.md](file:///d:/D%E1%BB%B1%20%C3%A1n%20t%C3%ACm%20%C4%91%E1%BB%8Ba%20%C4%91i%E1%BB%83m%20%C4%83n%20ch%C6%A1i/LaCaDaNang/danang_revised_pack/docs/DATA_TAG_RULES.md):
- `POPULAR`: **78 địa điểm** (rating >= 4.6 VÀ reviewCount >= 1000).
- `NEAR_BEACH`: **58 địa điểm** (kinh độ >= 108.240 hoặc đường ven biển Võ Nguyên Giáp, Hoàng Sa, Trường Sa, Nguyễn Tất Thành).
- `CENTRAL`: **16 địa điểm** (quận Hải Châu hoặc khoảng cách từ tâm <= 3.0 km).
- `CAFE`: **7 địa điểm** (primaryType hoặc tên chứa cafe, cà phê, coffee).
- `SEAFOOD`: **5 địa điểm** (primaryType hoặc tên chứa hải sản, seafood, ốc).

### 2.2. MANUAL REVIEW TAGS (Hàng Đợi Duyệt Chủ Quan)
Các nhãn phản ánh phong cách, nhóm đối tượng hoặc trải nghiệm không thể suy luận 100% từ crawler, đã được tách vào `manualReviewTags` và xếp vào [docs/MANUAL_CURATION_QUEUE.md](file:///d:/D%E1%BB%B1%20%C3%A1n%20t%C3%ACm%20%C4%91%E1%BB%8Ba%20%C4%91i%E1%BB%83m%20%C4%83n%20ch%C6%A1i/LaCaDaNang/danang_revised_pack/docs/MANUAL_CURATION_QUEUE.md):
- `FAMILY`: 51 địa điểm đề xuất
- `GROUP`: 27 địa điểm đề xuất
- `QUIET`: 18 địa điểm đề xuất
- `DATE`: 14 địa điểm đề xuất
- `PHOTO`: 5 địa điểm đề xuất
- `SCENIC`: 4 địa điểm đề xuất
- `LOCAL_FOOD`: 4 địa điểm đề xuất
- `SPECIALTY`: 4 địa điểm đề xuất
- `NATURE`: 2 địa điểm đề xuất

### 2.3. REMOVED UNSUPPORTED TAGS (Nhãn Đã Gỡ Bỏ Hoàn Toàn)
- ❌ **`CHEAP` (Đã gỡ 100%):** Loại bỏ toàn bộ nhãn `CHEAP` khỏi EAT và STAY vì source data có `priceLevel = null`. Không suy diễn giá rẻ từ tiệm bánh mì hay quán phở.
- ❌ **`NIGHT` (Đã gỡ 100%):** Loại bỏ toàn bộ nhãn `NIGHT` vì source data không có giờ mở cửa verified. Không suy diễn quán bar/pub hoạt động đêm muộn mà không có dữ liệu giờ thực tế.

### 2.4. TIME DATA STATUS (Hiện Trạng Dữ Liệu Thời Gian)
- `timeTags = []`: 100% rỗng. Không gán nhãn `MORNING`, `AFTERNOON`, `EVENING`, `LATE_NIGHT` cho đến khi có dữ liệu opening hours hoặc người dùng duyệt lịch trình.
- `bestTimeOfDay = []`: 100% rỗng.
- Tránh việc Phase mini-itinerary sau này hiểu lầm đây là giờ mở cửa thực tế.

### 2.5. PRICE DATA STATUS (Hiện Trạng Dữ Liệu Mức Giá)
- `priceLevel = null`: 100% địa điểm.
- Toàn bộ các tiêu chí phụ thuộc vào giá (EAT "Ít tiền", STAY "Giá rẻ") chuyển sang trạng thái `BLOCKED — NEED PRICE CURATION`.

---

## 3. Bảng độ phủ tiêu chí tính lại (Recalculated Preference Coverage)

Dưới nguyên tắc: **Chấp nhận độ phủ giảm thực tế, tuyệt đối không giữ fake tags chỉ để bảng số liệu đẹp.**

### 3.1. Nhánh ĂN GÌ? (EAT — 50 địa điểm)

| Tiêu chí (Preference) | Controlled Tags | Khả dụng (Curated) | Pending (Review Queue) | Trạng thái (Status) | Ghi chú & Đánh giá |
| :--- | :--- | :---: | :---: | :---: | :--- |
| 😋 **Ăn ngon** | `POPULAR` | **50** | 0 | **READY** | Toàn bộ 50 quán đều đạt chuẩn rating cao & nhiều review |
| 💸 **Ít tiền** | `CHEAP` | **0** | 0 | **BLOCKED** | ⚠️ Thiếu dữ liệu giá (priceLevel = null). Cần nạp bảng giá |
| ❤️ **Hẹn hò** | `DATE` | **0** | 5 | **NEEDS MANUAL CURATION** | 5 quán trong hàng đợi (Bếp Cuốn, Trình Cà Phê, v.v.) |
| 👨‍👩‍👧 **Gia đình** | `FAMILY` | **0** | 32 | **NEEDS MANUAL CURATION** | 32 quán trong hàng đợi, chờ duyệt không gian |
| 👥 **Đi nhóm** | `GROUP` | **0** | 8 | **NEEDS MANUAL CURATION** | 8 quán nướng/lẩu/hải sản trong hàng đợi |
| 🌿 **Yên tĩnh** | `QUIET` | **0** | 7 | **NEEDS MANUAL CURATION** | 7 quán cà phê trong hàng đợi |
| 🔥 **Nhộn nhịp** | `LIVELY` | **0** | 0 | **NEEDS MANUAL CURATION** | Chưa có quán nào được duyệt nhãn sôi động |
| 🍜 **Đặc sản** | `LOCAL_FOOD`, `SPECIALTY` | **0** | 4 | **NEEDS MANUAL CURATION** | 4 quán mì Quảng, bánh cuốn, phở bò trong hàng đợi |
| 🌙 **Ăn đêm** | `NIGHT` | **0** | 0 | **BLOCKED** | ⚠️ Thiếu giờ mở cửa verified. Cần nạp giờ mở sau 22h |

---

### 3.2. Nhánh Ở ĐÂU? (STAY — 30 địa điểm)

| Tiêu chí (Preference) | Controlled Tags | Khả dụng (Curated) | Pending (Review Queue) | Trạng thái (Status) | Ghi chú & Đánh giá |
| :--- | :--- | :---: | :---: | :---: | :--- |
| 🌊 **Gần biển** | `NEAR_BEACH` | **24** | 0 | **READY** | Đã xác thực qua tọa độ ven biển (Mỹ Khê, Sơn Trà) |
| 🏙️ **Gần trung tâm** | `CENTRAL` | **6** | 0 | **READY** | Đã xác thực theo địa giới Hải Châu & cự ly <= 3km |
| 💸 **Giá rẻ** | `CHEAP` | **0** | 0 | **BLOCKED** | ⚠️ Thiếu dữ liệu giá phòng verified |
| ❤️ **Cặp đôi** | `DATE` | **0** | 9 | **NEEDS MANUAL CURATION** | 9 resort / boutique trong hàng đợi |
| 👨‍👩‍👧 **Gia đình** | `FAMILY` | **0** | 19 | **NEEDS MANUAL CURATION** | 19 khách sạn trong hàng đợi |
| 👥 **Nhóm bạn** | `GROUP` | **0** | 19 | **NEEDS MANUAL CURATION** | 19 khách sạn trong hàng đợi |
| 🌿 **Yên tĩnh** | `QUIET` | **0** | 11 | **NEEDS MANUAL CURATION** | 11 resort nghỉ dưỡng trong hàng đợi |
| 🔥 **Nhộn nhịp** | `LIVELY` | **0** | 0 | **BLOCKED** | ⚠️ Khách sạn không mang bản chất ồn ào; đề xuất đổi sang "Gần khu sôi động" |

---

### 3.3. Nhánh ĐI ĐÂU? (GO — 6 địa điểm)

| Tiêu chí (Preference) | Controlled Tags | Khả dụng (Curated) | Pending (Review Queue) | Trạng thái (Status) | Ghi chú & Đánh giá |
| :--- | :--- | :---: | :---: | :---: | :--- |
| 🌊 **Biển / ngắm cảnh** | `NEAR_BEACH` / `SCENIC` | **2** | 2 | **NEEDS MANUAL CURATION** | Cầu vượt Mikazuki, KDL Nam Ô (cần thêm 1 điểm) |
| 📸 **Chụp ảnh đẹp** | `PHOTO` | **0** | 5 | **NEEDS MANUAL CURATION** | 5 điểm trong hàng đợi |
| ❤️ **Hẹn hò** | `DATE` | **0** | 0 | **NEEDS MANUAL CURATION** | Cần bổ sung Cầu Tình Yêu, Cầu Rồng... |
| 👥 **Đi nhóm** | `GROUP` | **0** | 1 | **NEEDS MANUAL CURATION** | Công viên nước Mikazuki 365 (cần thêm 2 điểm) |
| 👨‍👩‍👧 **Gia đình** | `FAMILY` | **0** | 1 | **NEEDS MANUAL CURATION** | Công viên nước Mikazuki 365 (cần thêm 2 điểm) |
| 🌿 **Thiên nhiên** | `NATURE` | **0** | 2 | **NEEDS MANUAL CURATION** | KDL Nam Ô, Nhà Vọng Cảnh |
| 🎡 **Vui chơi** | `LIVELY` | **0** | 0 | **NEEDS MANUAL CURATION** | Cần bổ sung Asia Park, Helio... |
| 🌙 **Đi buổi tối** | `NIGHT` | **0** | 0 | **BLOCKED** | ⚠️ Thiếu giờ hoạt động đêm verified |

---

## 4. Lý do khuyến nghị thuần sự thật (Factual Reasons Standard)

Toàn bộ 86 địa điểm được sinh tự động 2-3 câu lý do hoàn toàn dựa trên sự kiện có trong source:
1. Số liệu đánh giá thực tế: `"Đánh giá X.X⭐ từ N lượt đánh giá trên Google Maps"`
2. Khoảng cách & Vị trí thực tế: `"Tọa lạc tại [Khu vực] (cách trung tâm khoảng D.D km)"`
3. Phân loại hoặc số lượng ảnh nguồn: `"Hơn N hình ảnh được xác nhận trong dữ liệu nguồn"` HOẶC `"Phân loại cơ sở: [Loại]"`

Không chứa bất kỳ từ ngữ quảng cáo chủ quan nào như "tươi ngon", "thân thiện", "lãng mạn", "ấm cúng", "yên tĩnh", "view đẹp", "view triệu đô".
