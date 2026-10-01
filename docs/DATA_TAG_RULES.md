# DATA_TAG_RULES.md — Quy Tắc Xác Thực & Gán Nhãn Dữ Liệu (Tag Derivation Rules)

Ngày hiệu lực: 01/10/2026 (Phase 2A.2 — Curation Evidence Hardening)  
Mục đích: Xác định ranh giới tuyệt đối giữa **Dữ liệu Sự Thật (Source Fact)**, **Quy Tắc Xác Định (Deterministic Derivation)**, và **Dữ liệu Cần Đánh Giá Thủ Công (Manual Review Required)**. Loại bỏ hoàn toàn suy đoán chủ quan (AI intuition) khỏi dữ liệu sản xuất.

---

## 1. Phân loại mức độ tin cậy của trường dữ liệu (Data Provenance Levels)

Mọi trường dữ liệu trong `src/data/curated/curated-places.json` phải thuộc một trong 4 nhóm sau:
1. **A. SOURCE FACT (Sự thật từ nguồn):** Tồn tại trực tiếp trong Google Maps / raw candidate metadata (`id`, `name`, `section`, `primaryType`, `address`, `shortAddress`, `lat`, `lng`, `googleMapsUrl`, `rating`, `reviewCount`, `photoCount`, `priceLevel`, `distanceFromCenter`).
2. **B. DETERMINISTIC DERIVATION (Quy tắc xác định 100%):** Nhãn được suy luận qua điều kiện toán học, từ khóa định danh chính xác hoặc tọa độ địa lý đã được đo kiểm. Chỉ có 5 nhãn được phép gán tự động vào `curatedTags`.
3. **C. MANUAL CURATION (Đánh giá thủ công):** Các nhãn mang tính cảm xúc, trải nghiệm người dùng, bầu không khí. Được lưu trữ tại `manualReviewTags` và chờ con người phê duyệt trước khi chuyển sang `curatedTags`.
4. **D. UNKNOWN (Chưa có dữ liệu):** Để `null` hoặc danh sách rỗng `[]`, tuyệt đối không bịa đặt (ví dụ: `priceLevel: null`, `timeTags: []`, `typicalDurationMinutes: null`).

---

## 2. Danh mục 5 nhãn tự động xác thực (Safe Auto-Derived Tags)

Chỉ có đúng 5 nhãn sau đây được đưa vào mảng `curatedTags` của `PlaceRecord` nếu thỏa mãn điều kiện nghiêm ngặt:

### 2.1. `POPULAR` (Địa điểm nổi bật / Uy tín cao)
- **Cơ sở xác định:** Tín hiệu đánh giá và số lượng người dùng thực tế từ Google Maps.
- **Quy tắc toán học:**
  $$\text{rating} \ge 4.6 \quad \text{VÀ} \quad \text{reviewCount} \ge 1000$$
- **Không áp dụng:** Địa điểm có rating 5.0 nhưng ít lượt đánh giá (< 1000 reviews).

### 2.2. `CAFE` (Quán Cà Phê / Đồ Uống)
- **Cơ sở xác định:** Phân loại nghiệp vụ chuẩn hoặc tên thương hiệu chứa từ khóa định danh.
- **Quy tắc:**
  - `primaryType` là `cafe` hoặc `coffee_shop`, HOẶC
  - Tên cơ sở chứa từ khóa: `cà phê`, `cafe`, `coffee` (phân biệt ranh giới từ `\b`).

### 2.3. `SEAFOOD` (Nhà Hàng Hải Sản)
- **Cơ sở xác định:** Phân loại nghiệp vụ hải sản hoặc tên cơ sở chứa từ khóa định danh.
- **Quy tắc:**
  - `primaryType` là `seafood_restaurant`, HOẶC
  - Tên cơ sở chứa từ khóa: `hải sản`, `seafood`, `ốc` (có dấu cách sau từ).

### 2.4. `CENTRAL` (Khu Vực Trung Tâm Thành Phố)
- **Cơ sở xác định:** Địa giới hành chính quận trung tâm Hải Châu hoặc bán kính tính toán từ tâm thành phố.
- **Quy tắc:**
  - `address` hoặc `shortAddress` chứa `quận hải châu` / `hải châu`, HOẶC
  - `distanceFromCenter <= 3.0` km (Tọa độ mốc trung tâm: Cầu Rồng / Tòa thị chính Đà Nẵng tại `16.068, 108.224`).

### 2.5. `NEAR_BEACH` (Gần Biển / Ven Biển)
- **Cơ sở xác định:** Dải bờ biển vịnh Đà Nẵng và biển Mỹ Khê / Sơn Trà / Ngũ Hành Sơn.
- **Quy tắc địa lý:**
  - Kinh độ $\ge 108.240$ (vùng dải cát và đại lộ ven biển phía Đông của Đà Nẵng), HOẶC
  - Địa chỉ nằm trực tiếp trên các cung đường ven biển: `Võ Nguyên Giáp`, `Hoàng Sa`, `Trường Sa`, `Nguyễn Tất Thành`.

---

## 3. Danh mục nhãn chủ quan — KHÔNG được tự động gán vào Production (Subjective Tags)

Các nhãn sau đây bị **CẤM** tự động gán vào `curatedTags` của bản ghi:
- `DATE` (Hẹn hò / Cặp đôi)
- `QUIET` (Yên tĩnh)
- `LIVELY` (Nhộn nhịp / Sôi động)
- `FAMILY` (Gia đình)
- `GROUP` (Đi nhóm)
- `CHEAP` (Giá rẻ)
- `NIGHT` (Về đêm)
- `PHOTO` (Chụp ảnh đẹp)
- `SCENIC` (Ngắm cảnh đẹp)
- `NATURE` (Thiên nhiên)
- `SPECIALTY` (Đặc sản)
- `LOCAL_FOOD` (Món địa phương)

### Quy định xử lý:
1. **Đối với `CHEAP`:** Do toàn bộ dataset hiện tại có `priceLevel = null` (chưa có giá vé/thực đơn verified), nhãn `CHEAP` bị **GỠ BỎ 100%**. Không suy diễn quán bình dân từ các từ như "bánh mì", "phở", "bún", "quán cóc".
2. **Đối với `NIGHT`:** Do source data không có giờ mở cửa (opening hours) verified, nhãn `NIGHT` bị **GỠ BỎ 100%**.
3. **Đối với các nhãn còn lại:** Nếu dữ liệu heuristic trước đó đề xuất, chúng được chuyển sang mảng `manualReviewTags` và bản ghi được đánh dấu `curationStatus = "NEEDS_REVIEW"` để chờ người dùng duyệt trong hàng đợi `docs/MANUAL_CURATION_QUEUE.md`.

---

## 4. Quy tắc về Dữ liệu Thời Gian & Lịch Trình (Time Tags & Duration Rules)

1. **`timeTags`:** Đặt giá trị rỗng `[]` cho 100% địa điểm. Không suy diễn giờ mở cửa từ loại hình kinh doanh.
2. **`bestTimeOfDay`:** Đặt giá trị rỗng `[]` cho 100% địa điểm.
3. **`typicalDurationMinutes`:** Đặt `null` cho 100% địa điểm. Không mặc định 60 phút cho Ăn hoặc 90 phút cho Đi chơi khi chưa có quy tắc kinh doanh được phê duyệt.

---

## 5. Quy tắc tạo Lý do Khuyến nghị (Reasons Formulation Rules)

Tuyệt đối không sử dụng câu văn marketing mang tính suy đoán ("hải sản tươi sống", "phục vụ thân thiện", "không gian lãng mạn", "view triệu đô").  
Chỉ sử dụng 2 đến 3 câu khẳng định thuần túy sự thật (factual statements):

- **Câu 1 (Số liệu đánh giá):**  
  `"Đánh giá X.X⭐ từ N lượt đánh giá thực tế trên Google Maps"`
- **Câu 2 (Vị trí & Khoảng cách):**  
  `"Tọa lạc tại [Khu vực] (cách trung tâm khoảng D.D km)"`
- **Câu 3 (Phân loại hoặc hình ảnh nguồn):**  
  `"Phân loại cơ sở: [Tên loại]" ` HOẶC `"Hơn N hình ảnh được xác nhận trong dữ liệu nguồn"`
