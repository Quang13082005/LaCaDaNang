# LA CÀ ĐÀ NẴNG — NON-NEGOTIABLE GUARDRAILS

> **TÀI LIỆU QUY CHUẨN CỐT LÕI (CORE GUARDRAILS)**
> Mọi AI agent, engineer và cộng tác viên bắt buộc phải đọc và tuân thủ tuyệt đối toàn bộ các nguyên tắc dưới đây trước khi lập kế hoạch hoặc can thiệp code trong repository này.

---

## 1. Product & Data Integrity

1. **Mobile-First UX**:
   - Thiết kế ưu tiên trải nghiệm một tay trên thiết bị di động (One-thumb UX).
   - Vị trí intent ổn định, nút thao tác chính nằm ở vùng ngón tay thuận tiện, touch target tối thiểu $\ge 44\text{px}$.
   - Ma trận hiển thị tối thiểu từ $320\text{px}$ đến $1280\text{px}$ (đặc biệt các breakpoint $320\text{px}, 360\text{px}, 390\text{px}, 393\text{px}, 430\text{px}, 768\text{px}$).
   - Không được cắt xén văn bản quan trọng (no hidden text clip, no arbitrary text-clamp/ellipsis làm mất ngữ nghĩa địa danh).

2. **Real Neon PostgreSQL Data Only**:
   - Mọi dữ liệu địa điểm hiển thị cho các section đã kích hoạt phải truy vấn trực tiếp từ cơ sở dữ liệu Neon PostgreSQL (`neondb`).
   - Server-side query thông qua `/api/discovery`. Không để lộ credentials hoặc connection string ra client-side.

3. **No Fake Fallback**:
   - Khi API gặp lỗi mạng hoặc không tìm thấy địa điểm, hiển thị trạng thái `empty` hoặc `error` rõ ràng kèm nút thử lại ("Thử lại").
   - **Tuyệt đối không tự động fallback về demo mock data** hoặc dữ liệu giả lập để tạo cảm giác thành công ảo.

4. **No Venue Images in Current MVP**:
   - Giao diện thẻ địa điểm (`PlaceCard`) tập trung vào thông tin văn bản trung thực (Text-First).
   - Không phụ thuộc vào `imageUrl`, không tính toán số lượng ảnh, không join bảng `place_media`, không cào ảnh (scraping) từ Google.
   - Chỉ giữ artwork minh họa tĩnh ở cấp Hero/Intent Header.

5. **0–3 Truthful Results — No Padding**:
   - Số lượng gợi ý trả về tối đa là 3 địa điểm ($0, 1, 2$ hoặc $3$).
   - Tuyệt đối không chèn địa điểm độn (padding) để đủ 3 thẻ khi dữ liệu thực tế chỉ có 0, 1 hoặc 2 địa điểm phù hợp tiêu chí.

6. **Exact Google Maps URL**:
   - Chỉ mở đường dẫn Google Maps (`google_maps_url`) thực tế được lưu trữ trong cơ sở dữ liệu.
   - Tuyệt đối không tự bịa đặt, suy đoán Google Maps URL hoặc CID.

7. **Nullable Data Remains Nullable**:
   - Các trường dữ liệu có thể null (như `rating`, `review_count`, `description`) khi null phải được giữ nguyên là null hoặc ẩn khối thông tin tương ứng.
   - Không bao giờ thay thế `rating = null` thành `0` hoặc điểm đánh giá mặc định.

8. **Section Activation Boundaries**:
   - **EAT, GO, STAY**: Đã kết nối Neon discovery API với tag mapping thực tế đã kiểm định.
   - **CAFE**: **CHƯA ĐƯỢC PHÉP IMPLEMENT** (hiện trả về HTTP 400 `INTENT_NOT_AVAILABLE`). Chỉ triển khai khi có thiết kế UI chips và quyết định phạm vi rõ ràng từ Product Owner.
   - **NOW**: Giữ nguyên lộ trình mẫu (sample itinerary) cho đến khi có cơ chế thời gian/vị trí thực tế được phê duyệt (M11).

9. **Regression Preservation**:
   - Bất kỳ milestone hoặc thay đổi mới nào đều **phải bảo toàn toàn vẹn** các luồng đã hoạt động trước đó (EAT, GO, STAY, contract Discovery, responsive layout).

---

## 2. Engineering & Safety Guardrails

1. **No Silent Database/Schema Changes**:
   - Không tự ý chạy migration, thay đổi cấu trúc bảng (DDL), xóa bảng hoặc ghi đè dữ liệu trên Neon nếu chưa có chỉ thị rõ ràng.
   - Mọi thao tác kiểm tra phải dùng `SELECT`-only.

2. **No Dependency or Framework Upgrades**:
   - Không nâng cấp package, không cài thêm thư viện ngoài danh mục cho phép, không thay đổi `package.json` hoặc lockfiles trừ khi milestone cụ thể yêu cầu.

3. **Strict Git Discipline — No `git add .`**:
   - **Tuyệt đối không dùng `git add .` hoặc `git add -A`**.
   - Chỉ stage và commit danh sách file thuộc quyền sở hữu (owned files) của milestone đang thực hiện.
   - Bảo toàn nguyên vẹn các file staged cũ và các thay đổi chưa commit của người dùng/milestone trước.

4. **No Destructive Git Commands**:
   - **Nghiêm cấm** chạy `git reset --hard`, `git clean -fd`, `git checkout .`, hoặc chuyển branch khi chưa có xác nhận an toàn từ Product Owner.

5. **No Production Deploy Without Authorization**:
   - Không tự ý deploy lên Cloudflare Workers / OpenNext hoặc môi trường production. Việc deploy chỉ thực hiện khi có lệnh và bằng chứng nghiệm thu đầy đủ.
