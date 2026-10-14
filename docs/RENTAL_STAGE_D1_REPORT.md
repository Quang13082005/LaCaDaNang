# LA CÀ ĐÀ NẴNG — RENTAL PROMOTION MODULE
## STAGE D1 PRODUCTION SCHEMA MIGRATION REPORT
**Thời gian thực thi:** 2026-10-14 10:29:25 UTC+7  
**Môi trường:** NEON PRODUCTION (`production` branch)  
**Trạng thái:** D1_PASS_COMPLETED  
**Phê duyệt bởi:** Product Owner (Chỉ thị: `"TÔI PHÊ DUYỆT D1 — CHỈ TẠO 4 BẢNG RENTAL TRỐNG TRÊN NEON PRODUCTION."`)  
**Cổng nghiệm thu tiếp theo:** OWNER & CHATGPT REVIEW GATE (DỪNG TRƯỚC STAGE D2)

---

## 1. Xác minh mục tiêu Production (Target Verification)

| Thuộc tính | Giá trị xác minh thực tế | Ghi chú |
| :--- | :--- | :--- |
| **Neon Project ID** | `flat-lake-94547160` | Khớp 100% dự án La Cà |
| **Neon Branch ID** | `br-shiny-band-b3mlezx7` | Nhánh `production` chính thức |
| **Endpoint Host** | `ep-old-tooth-b3gz7nsn.c-4.ap-southeast-1.aws.neon.tech` | Region Singapore |
| **Database** | `neondb` | Database sản xuất |
| **Schema** | `public` | Schema mặc định |
| **PostgreSQL User** | `neondb_owner` | Tài khoản migration có quyền DDL |
| **PostgreSQL Version**| `PostgreSQL 18.6` | Neon Serverless |

---

## 2. Xác minh tệp Migration DDL V2.1

- **Đường dẫn:** `scripts/rental/migrations/001_rental_schema_v2.1.sql`
- **SHA-256 Hash:** `bac9cc7555f607d4f4420698986679574c1390f977b58e691751327c9506dac6`
- **Khớp DDL Proposal V2.1:** YES (100% byte-for-byte match với khối SQL trong `docs/RENTAL_DATABASE_PROPOSAL.md`)
- **Số câu lệnh DDL:** Đúng 7 câu lệnh (4 `CREATE TABLE` + 3 `CREATE INDEX`). Không có bất kỳ lệnh `DROP`, `ALTER`, `INSERT`, `UPDATE`, `DELETE` hay phân quyền nào.

---

## 3. Quá trình thực thi giao dịch (Atomic Transaction)

Kịch bản `scripts/rental/d1-migrate.ts` đã kết nối phiên stateful qua giao thức WebSocket tới Neon Production và thực thi trong một transaction duy nhất:

```text
[1] Preflight Check: 0 rental tables confirmed before write.
[2] Executing Atomic Transaction (BEGIN -> DDL -> COMMIT)...
    TRANSACTION COMMITTED SUCCESSFULLY.
```

- Thời gian thực thi DDL và commit: **~52ms**.
- Không có lỗi, không kích hoạt ROLLBACK.

---

## 4. Bằng chứng kiểm tra sau Migration (Post-Migration Verification)

### A. Kiểm tra 4 bảng Rental mới tạo và số lượng bản ghi (Phải là 0)

| Tên bảng mới tạo | Số bản ghi hiện tại | Trạng thái rỗng | Giá trị mặc định cột `active` |
| :--- | :---: | :---: | :---: |
| `rental_vehicle_models` | **0** | PASS | `active boolean DEFAULT false` |
| `rental_vehicles` | **0** | PASS | `active boolean DEFAULT false` |
| `rental_vehicle_media` | **0** | PASS | `is_primary boolean DEFAULT false` |
| `rental_contact_settings` | **0** | PASS | `active boolean DEFAULT false` |

### B. Kiểm tra các Indexes đã tạo

Đã tạo và kiểm tra thành công đầy đủ 3 chỉ mục tối ưu hóa cùng các chỉ mục ràng buộc duy nhất / khóa chính:
1. `rental_vehicles_model_idx` ON `public.rental_vehicles (model_id)`
2. `rental_media_primary_idx` ON `public.rental_vehicle_media (vehicle_id) WHERE is_primary` (Partial Unique)
3. `rental_media_order_idx` ON `public.rental_vehicle_media (vehicle_id, sort_order, id)`
4. `rental_vehicle_models_brand_model_name_key` (UNIQUE `brand, model_name`)
5. `rental_vehicles_vehicle_code_key` (UNIQUE `vehicle_code`)
6. `rental_vehicles_public_id_key` (UNIQUE `public_id`)
7. `rental_vehicle_media_vehicle_id_image_url_key` (UNIQUE `vehicle_id, image_url`)
8. Khóa chính `pkey` trên cả 4 bảng (`id`).

### C. Kiểm tra bảo toàn 7 bảng dữ liệu cốt lõi của La Cà Đà Nẵng

Tất cả 7 bảng hiện có của dự án được đối chiếu số lượng bản ghi trước và sau khi commit:

| Tên bảng cốt lõi | Trước D1 | Sau D1 | Trạng thái bảo toàn |
| :--- | :---: | :---: | :---: |
| `administrative_units` | 94 | 94 | **MATCH (100% Unaffected)** |
| `tags` | 36 | 36 | **MATCH (100% Unaffected)** |
| `tag_translations` | 108 | 108 | **MATCH (100% Unaffected)** |
| `places` | 6,500 | 6,500 | **MATCH (100% Unaffected)** |
| `place_tags` | 12,516 | 12,516 | **MATCH (100% Unaffected)** |
| `place_translations` | 19,500 | 19,500 | **MATCH (100% Unaffected)** |
| `analytics_events` | 998 | 998 | **MATCH (100% Unaffected)** |

---

## 5. Xác nhận các nguyên tắc an toàn kiến trúc

1. **Không có thao tác xóa (No DROP):** Không có bảng nào bị DROP sau COMMIT. Cả 4 bảng rental mới đang ở trạng thái rỗng và hoàn toàn hợp lệ trên Neon Production.
2. **Không thay đổi ứng dụng (No Code/Runtime Drift):**
   - Không thay đổi Git branch (vẫn ở `phase-2a-deploy`).
   - Không thay đổi cấu hình Cloudflare Workers hoặc OpenNext.
   - Không thay đổi biến môi trường `DATABASE_URL` trên Production.
3. **Định vị sản phẩm nhất quán:**
   - La Cà Đà Nẵng tiếp tục là ứng dụng khám phá địa điểm (NOW/EAT/GO/STAY).
   - Module Rental Promotion chỉ là danh mục giới thiệu hỗ trợ, hoàn toàn không can thiệp vào logic xếp hạng, tìm kiếm hoặc trải nghiệm khám phá của người dùng.
4. **Không tự động triển khai Stage D2:**
   - Dữ liệu 21 xe và 8 models CHƯA ĐƯỢC INSERT vào Neon Production.
   - Mọi thao tác ghi tiếp theo bị chặn cho đến khi Product Owner và ChatGPT nghiệm thu xong Stage D1.
