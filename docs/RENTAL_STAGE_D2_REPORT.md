# LA CÀ ĐÀ NẴNG — RENTAL PROMOTION MODULE
## STAGE D2 PRODUCTION DARK-IMPORT REPORT
**Thời gian thực thi:** 2026-10-14 12:08:41 UTC+7  
**Môi trường:** NEON PRODUCTION (`production` branch, `br-shiny-band-b3mlezx7`)  
**Database / Schema:** `neondb` / `public`  
**Trạng thái:** **`D2_PASS_COMMLETED`**  
**Phê duyệt bởi:** Product Owner (Chỉ thị trực tiếp: `"TÔI PHÊ DUYỆT D2 — CHẠY DUY NHẤT MỘT TRANSACTION IMPORT TRÊN NEON PRODUCTION."`)  
**Cổng nghiệm thu tiếp theo:** D3 INTEGRATION & LOCAL MOBILE QA (HOTSPOT)

---

## 1. Xác minh mục tiêu Production & Artifacts

| Thông số | Giá trị thực tế | Đối chiếu Handoff |
| :--- | :--- | :---: |
| **Neon Project ID** | `flat-lake-94547160` | Khớp 100% |
| **Neon Branch ID** | `br-shiny-band-b3mlezx7` (primary/default) | Khớp 100% |
| **Endpoint Host** | `ep-old-tooth-b3gz7nsn.c-4.ap-southeast-1.aws.neon.tech` | Khớp 100% |
| **Source Data** | `docs/RENTAL_IMPORT_PREVIEW.json` | SHA256: `029eb6139e640668bad3ec07024c800dc10cba5fdc0a4563501dbf7849af3e14` |
| **Importer Script** | `scripts/rental/d2-import.cjs` | SHA256: `db31c098fd3b9614d011fef9f9e442450638ba6661fc1c415034da7dca370aa0` |
| **DDL Schema** | `scripts/rental/migrations/001_rental_schema_v2.1.sql` | SHA256: `bac9cc7555f607d4f4420698986679574c1390f977b58e691751327c9506dac6` |

---

## 2. Quá trình thực thi giao dịch (Atomic Transaction)

Lệnh thực thi duy nhất được gọi qua:
```bash
cmd /c "set RENTAL_D2_OWNER_APPROVAL=APPROVED_ONE_ATOMIC_DARK_IMPORT&& node scripts/rental/d2-import.cjs --execute"
```
**Quy trình đã diễn ra trong transaction:**
1. Mở 1 kết nối stateful duy nhất tới Neon Production (`ep-old-tooth-b3gz7nsn...`).
2. Khóa độc quyền 4 bảng rental mới (`LOCK TABLE ... IN ACCESS EXCLUSIVE MODE`).
3. Kiểm tra lại số lượng bản ghi trước khi insert: xác nhận đúng 0 bản ghi ở cả 4 bảng.
4. Chèn 8 dòng xe (`rental_vehicle_models`) với `active = false`.
5. Chèn 21 xe vật lý (`rental_vehicles`) ánh xạ chính xác `model_id` vừa sinh, với `active = false`.
6. Chèn 1 bản ghi cấu hình liên hệ (`rental_contact_settings`) với `active = false`.
7. Không chèn bất kỳ bản ghi nào vào bảng media (`rental_vehicle_media`: 0 dòng).
8. Thực thi đầy đủ bộ assertions kiểm tra trường dữ liệu nguồn trước khi gửi `COMMIT`.
9. `COMMIT` thành công.

---

## 3. Bằng chứng kiểm tra sau Import (Post-Import SELECT Audit)

### A. Số lượng bản ghi nhập thực tế
- **Bảng `rental_vehicle_models`:** **8 dòng** (100% `active = false`).
- **Bảng `rental_vehicles`:** **21 dòng** (100% `active = false`).
- **Bảng `rental_contact_settings`:** **1 dòng** (`active = false`).
- **Bảng `rental_vehicle_media`:** **0 dòng** (không có ảnh nào được chèn).
- **Public Active Projection:** **0 dòng** (truy vấn `v.active = true AND m.active = true` trả về 0 kết quả — bảo vệ tối đa tính năng dark-import).

### B. Danh mục 8 dòng xe đã tạo (Tất cả `active = false`)
1. **Honda Air Blade** (scooter)
2. **Honda Lead** (scooter)
3. **Honda Vision** (scooter)
4. **Honda Wave** (semi)
5. **Yamaha Exciter** (manual)
6. **Yamaha Janus** (scooter)
7. **Yamaha Jupiter** (semi)
8. **Yamaha Sirius** (semi)

### C. Phân bổ và đặc tính 21 xe vật lý
- **Phân loại xe:** 10 xe ga (`scooter`), 10 xe số (`semi`), 1 xe côn tay (`manual`).
- **Mã quản lý nội bộ:** `XE001` đến `XE021` nguyên vẹn, không lộ ra ngoài public API.
- **Định danh công khai:** 21 `public_id` kiểu UUIDv4 tự sinh độc lập, phân biệt hoàn toàn.
- **Giá thuê:** Đúng công thức `raw_daily_price * 1000` (giá từ 100.000đ đến 180.000đ/ngày).
- **Tiền cọc 1 CCCD:** Đúng quy định đã chốt: Xe số: 1.000.000đ, Xe côn: 1.500.000đ, Xe ga: 2.000.000đ.
- **Trường hợp ngoại lệ được bảo toàn:**
  - `XE011` (Wave 2024): `color_source = 'Xám-…'`, `color_complete = false` (không tự ý bịa màu).
  - `XE017` (Sirius 2015): `engine_cc = 113.000` (giữ nguyên thông số workbook).

### D. Cấu hình liên hệ (Contact Settings)
- **Điện thoại:** `+84931981789`
- **Zalo:** `https://zalo.me/0931981789`
- **Mũ bảo hiểm đi kèm:** `helmets_included = true`
- **Cọc 2 CCCD:** `two_cccd_cash_deposit_vnd = 0` (miễn cọc tiền mặt khi để lại 2 CCCD).
- **Chính sách thuê xe:** Đầy đủ 3 thứ tiếng VI, EN, KO.
- **Trạng thái:** `active = false`.

### E. Bảo vệ tuyệt đối 7 bảng cốt lõi của La Cà Đà Nẵng
Đối chiếu độc lập qua script `scripts/rental/d2-production-audit.cjs after` xác nhận:
- `administrative_units`: 94/94 (**MATCH**)
- `tags`: 36/36 (**MATCH**)
- `tag_translations`: 108/108 (**MATCH**)
- `places`: 6,500/6,500 (**MATCH**)
- `place_tags`: 12,516/12,516 (**MATCH**)
- `place_translations`: 19,500/19,500 (**MATCH**)
- `analytics_events`: 998/998 (**MATCH**)
- **Biến động bảng cốt lõi:** `coreChanges: []` (hoàn toàn không có bất kỳ thay đổi nào).

---

## 4. Bằng chứng lưu trữ (Evidence Files)
- `../RENTAL_D2_PRODUCTION_2026-10-14/after.json`
- `../RENTAL_D2_2026-10-14/committed-1791954521336.json`
- `../RENTAL_D2_PRODUCTION_2026-10-14/before.json`
- `../RENTAL_D2_2026-10-14/preflight.json`
