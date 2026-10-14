# Rental Feature Checkpoint — Release Cleanup & Production Readiness

**Cập nhật:** 2026-10-14 16:30 (UTC+7)  
**Trạng thái:** **RELEASE_CLEANUP_COMPLETED — CODE_VERIFIED — READY_FOR_RELEASE_REVIEW**  
**Phạm vi:** Hoàn tất toàn bộ công việc Release Cleanup, dọn dẹp hệ thống QA nội bộ, củng cố Public API và Dynamic Pricing, loại bỏ hoàn toàn side-effect của curation test, kiểm thử toàn diện 490/490 tests PASS, xác minh Next.js Build và OpenNext Cloudflare Worker Build thành công.  
**Nguyên tắc cốt lõi:** LA CÀ ĐÀ NẴNG LÀ SẢN PHẨM CHÍNH. Rental Promotion chỉ là module giới thiệu/quảng bá bổ trợ. Không booking/payment/contract. Tuyệt đối không commit/push/deploy hoặc kích hoạt `active=true` khi chưa có phê duyệt riêng.

---

## 1. Dọn Dẹp Cơ Chế QA Nội Bộ (Release Cleanup Completed)

1. **Thu hồi và xóa Token QA:**
   - File token tạm thời `scratch/qa-token.txt` đã bị xóa vĩnh viễn khỏi hệ thống.
   - Không còn bất kỳ file token hoặc biến môi trường `RENTAL_LOCAL_QA_TOKEN` nào hoạt động.
2. **Dừng Background Dev Server:**
   - Tiến trình local dev server chạy nền trên port 3115 (`task-8220`) đã được hủy bỏ và kết thúc hoàn toàn.
3. **Loại bỏ triệt để các Route QA khỏi App Tree:**
   - Đã di chuyển toàn bộ các route thử nghiệm QA ra khỏi `src/app/` vào thư mục lưu trữ `scratch/`:
     - `src/app/dev/rentals-qa` $\rightarrow$ `scratch/_rentals-qa`
     - `src/app/dev/rentals-neon` $\rightarrow$ `scratch/_rentals-neon`
     - `src/app/dev/rentals` $\rightarrow$ `scratch/_rentals`
     - `src/app/api/dev` $\rightarrow$ `scratch/_api_dev`
     - Xóa `tests/rental-qa-auth.test.ts`.
   - Cây route Next.js hiện tại trong `src/app/api/` chỉ chứa 4 endpoint công khai: `[analytics, discovery, now, rentals]`.
   - Không dựa vào điều kiện `NODE_ENV === 'production'` để trả 404; các entrypoint QA hoàn toàn không tồn tại trong app tree khi đóng gói.
4. **Bảo mật Repository & Phân tách Fixtures:**
   - `src/lib/rental/repository.ts`: Loại bỏ hàm `readRentalQa` và tham số bypass `qa: boolean`. Repository 100% chỉ SELECT các bản ghi có `v.active=true AND m.active=true` và contact `active=true`.
   - `src/components/rental/RentalCatalog.tsx`: Gỡ bỏ việc import và bundle trực tiếp `vehicles.preview.json`. Catalog production nhận `vehicles` từ props (mặc định mảng rỗng).
   - Thư mục `scratch/` được cấu hình loại trừ (`exclude`) trong `tsconfig.json`.

---

## 2. Chuẩn Hóa Hành Trình Người Dùng Public & Giá Tham Khảo Động

1. **Bảo vệ Dark Launch (Real Production DB):**
   - Hiện tại tất cả 21 xe và contact trên Neon Production đều có `active = false`.
   - Khi chưa có xe active, Public API `/api/rentals` trả về `{ vehicles: [], contact: null }`.
   - `RentalSuggestion` tự động phát hiện `vehicles.length === 0` và trả về `null` (không hiển thị card quảng bá dẫn người dùng vào danh mục rỗng).
2. **Tính Giá Khởi Điểm Động (Dynamic Starting Price):**
   - Không hard-code mức giá 100.000đ làm giá khởi điểm Production.
   - Khi có dữ liệu xe active được công khai trong tương lai, `RentalSuggestion` tự động tính `minPrice = Math.min(...vehicles.map(v => v.dailyPriceVnd))` và hiển thị localized:
     - VI: `Từ {formatNumber(minPrice)}đ/ngày`
     - EN: `From {formatNumber(minPrice)} VND/day`
     - KO: `1일 {formatNumber(minPrice)} VND부터`
   - Cache in-memory 60 giây ở phía client (`client.ts`), tự động cập nhật khi dữ liệu trên Neon thay đổi mà không cần sửa code hay redeploy.
3. **Làm rõ Chính Sách Miễn Cọc:**
   - Đã cập nhật copy đa ngôn ngữ (VI/EN/KO) tại `src/lib/rental/messages.ts` nêu rõ: `"Để lại 2 CCCD (của 2 người khác nhau): không cọc tiền"` nhằm tránh hiểu nhầm một người để lại 2 giấy tờ tùy thân.
4. **Bảo toàn Business Rules:**
   - **GO:** Chỉ hiển thị khi có ít nhất 1 điểm trong kết quả cách người dùng $\ge 2.0\text{ km}$ (ưu tiên `distanceRawKm`). Fail-closed đối với cự ly làm tròn. Giữ nguyên Nearby 1/3/5 km.
   - **NOW:** Luôn gợi ý khi có lịch trình thực tế ($\ge 1$ điểm), không yêu cầu GPS, không yêu cầu ngưỡng km. Ẩn khi lịch trình rỗng.
   - **EAT / STAY:** Tuyệt đối không hiển thị RentalSuggestion. Đã dỡ bỏ thẻ gọi nhầm trong `Hero.tsx`.

---

## 3. Loại Bỏ Triệt Để Side-Effect Của Curation Test

- **Hiện tượng trước đó:** Chạy `tests/curation.test.ts` làm thay đổi timestamp `curatedAt` trong `src/data/curated/curated-places.json`.
- **Giải pháp:**
  - Cập nhật `src/lib/data/build-curated-seed.ts` hỗ trợ tùy chọn `options: { writeToFile?: boolean }` (mặc định `true` cho build script CLI).
  - Cập nhật `tests/curation.test.ts` gọi `runSeedCuration({ writeToFile: false })`.
- **Kiểm chứng thực tế:**
  - Chạy `npx vitest run tests/curation.test.ts` (15/15 tests PASS).
  - Đo `LastWriteTime` của `curated-places.json` trước và sau test: Giữ nguyên tuyệt đối, không có bất kỳ byte nào bị ghi đè.
  - File `src/data/curated/curated-places.json` được đưa vào danh sách **DO NOT COMMIT**.

---

## 4. Kết Quả Kiểm Thử & Xây Dựng (Full Verification Passed)

1. **Automated Unit & Integration Test Suite (`npm run test`):**
   - **30/30 test files PASS (490/490 tests)**.
   - Đã kiểm thử đầy đủ 2 kịch bản phát hành:
     - **Scenario A (Dark Launch / Real Neon DB):** 21 xe `active=false`, API trả rỗng, `RentalSuggestion` tự ẩn an toàn trên cả GO và NOW, Discovery hoạt động bình thường.
     - **Scenario B (Simulated Active Catalog):** Mô phỏng xe active, card hiển thị với đúng giá khởi điểm động, modal mở danh mục xe, bộ lọc phân loại hoạt động, số hotline/Zalo hiển thị đúng, hỗ trợ đầy đủ VI/EN/KO.
2. **TypeScript Compilation Check (`npm run typecheck`):**
   - Lệnh: `tsc --noEmit`
   - Kết quả: **Exit code 0, 0 lỗi**.
3. **ESLint Code Quality Check (`npm run lint`):**
   - Lệnh: `next lint`
   - Kết quả: **✔ No ESLint warnings or errors**.
4. **Git Formatting Check (`git diff --check`):**
   - Kết quả: **Exit code 0, 0 whitespace/conflict errors**.
5. **Next.js Production Build (`npm run build`):**
   - Lệnh: `next build`
   - Kết quả: **Compiled successfully in 15.7s, Exit code 0**.
   - Route Manifest: Hoàn toàn sạch, 0 route QA, chỉ chứa các public route hợp lệ.
6. **OpenNext Cloudflare Worker Build (`npm run build:worker`):**
   - Lệnh: `opennextjs-cloudflare build`
   - Kết quả: **Compiled successfully, Worker saved in `.open-next/worker.js`, Exit code 0**.
7. **Bundle Security Audit:**
   - Tìm kiếm `RENTAL_LOCAL_QA_TOKEN`, `readRentalQa`, `qaToken` trong `.next` và `.open-next`: **0 kết quả**.
   - Public DTO không lộ: `vehicle_code`, internal bigint IDs, raw database prices/deposits, Neon credentials.

---

## 5. Hiện Trạng Cơ Sở Dữ Liệu Neon Production (D2 Status)

- **Target:** Neon Production (`flat-lake-94547160`, branch `br-shiny-band-b3mlezx7`, `neondb/public`).
- **Dữ liệu Rental hiện tại:** 8 models, 21 vehicles, 1 contact settings, 0 media rows.
- **Trạng thái:** 100% bản ghi đều có `active = false`.
- **Bảo toàn:** 7 bảng dữ liệu cốt lõi La Cà không bị thay đổi bất kỳ bản ghi nào.
- **Quyền hạn Runtime DB:** Hiện tại kết nối qua `DATABASE_URL`. Đề xuất khuyến nghị bảo mật dài hạn: Tạo role Neon riêng biệt chỉ có quyền `SELECT` cho runtime public app để cô lập hoàn toàn quyền ghi.

---

## 6. Kế Hoạch Phát Hành & Cổng Phê Duyệt (Release Gates)

1. **Commit Allowlist:** Lập danh sách file chính xác cho commit phát hành, loại bỏ `curated-places.json`, `LA_CA_FINAL_IMPORT_5000_NO_IMAGE.json` và `scratch/`.
2. **Rủi ro Tự Động Triển Khai GitHub/Cloudflare:**
   - Không tìm thấy GitHub Actions workflow (`.github` không tồn tại).
   - Cloudflare Dashboard có thể đang liên kết Git repo: Đánh dấu **UNKNOWN**. Tuyệt đối không push branch `phase-2a-deploy` trước khi Owner xác nhận thiết lập trigger trên Cloudflare Dashboard.
3. **Kế hoạch Cloudflare Preview:** Sau khi Owner duyệt commit, triển khai lên môi trường Preview biệt lập qua `npm run deploy:preview` (worker `la-ca-da-nang-preview`).
4. **Kiểm thử GPS thật trên HTTPS:** Thực hiện trên URL HTTPS của bản Cloudflare Preview để có secure-context hợp lệ.
5. **Kế hoạch kích hoạt Rental:** Chỉ chạy lệnh kích hoạt `active = true` trên Neon sau khi Preview và GPS HTTPS được Owner nghiệm thu bằng một phê duyệt riêng.
6. **Kế hoạch Rollback:**
   - Cloudflare: Rollback tức thì qua Dashboard Deployments hoặc `wrangler rollback`.
   - Git: Revert commit local.
   - Database: Chuyển toàn bộ xe về `active = false`.


## 2026-10-14 — Rental UI polish deployed (LATEST CHECKPOINT)
Status DONE for authorized UI polish + Production code deployment; database activation PENDING.
Owner explicitly approved deployment including existing unrelated working-tree changes and confirmed production domain lacadanang.quangdev.id.vn. Only RentalCatalog.tsx and VehicleImage.tsx changed by this UI task, verified against source baseline. Temporary fixture route moved outside repo before build.
Validation: 475/475 safe regression + 15/15 non-mutating curation = 490/490; lint/typecheck/Next/OpenNext PASS. Local screenshots at 320/360/393/430/desktop and EN/KO320; no new physical-phone acceptance claimed.
Worker la-ca-da-nang: previous 8ad52349-db12-4350-9712-593097edb715 -> 565bf3eb-8323-4ae3-8456-e6a0e958b7f4, verified 100% traffic. Sequential live GET smoke 23/23 expected results. Public Rental remains empty/contact null and hidden; inactive bypass rejected; temporary/QA routes404.
No database writes/activation, Git commit/push, DNS/secrets/config edits. Branch phase-2a-deploy / HEAD f7e5f9ba2ba877304c52b4679d6f02123ac5aef7 unchanged; all unrelated work preserved.
Full result/limitations/rollback: RENTAL_UI_POLISH_RELEASE_REPORT.md. Evidence ../RENTAL_UI_POLISH_2026-10-14/. Old local preview server stopped; do not point Owner to stale localhost preview.
EXACT NEXT: STOP for Owner review. Separate explicit approval and fresh read-only preflight required before any Rental activation. Do not re-import D2, clean worktree or optimize NOW.
