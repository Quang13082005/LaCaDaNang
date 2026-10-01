# GO_DATA_GAPS.md — Báo Cáo Lỗ Hổng Dữ Liệu Điểm Đến (GO Data Gap Report)

Ngày lập: 01/10/2026  
Mục đích: Tuân thủ nghiêm ngặt **Quy tắc 13 (Không bịa đặt dữ liệu)**. Phân tích hiện trạng dữ liệu điểm đến (GO) từ file `danang_mvp_candidates_v2.json`, ghi nhận các khoảng trống dữ liệu và đề xuất danh mục các địa điểm biểu trưng (iconic places) của Đà Nẵng để xác thực thủ công trước khi đưa vào sản xuất.

---

## 1. Hiện trạng dữ liệu GO trong nguồn ứng viên

Trong tập dữ liệu gốc `danang_mvp_candidates_v2.json` (300 ứng viên):
- **Tổng số record ban đầu gắn nhãn GO:** Chỉ có **5** record.
- **Record tái phân loại:** **1** record (`ChIJKZ-b48sZQjER96d1zWj6_mQ` — Công Viên Nước Mikazuki 365, ban đầu bị gán nhầm sang STAY trong dữ liệu thô dù bản chất là tổ hợp vui chơi/công viên nước).
- **Tổng số địa điểm GO khả dụng sau kiểm toán:** **6 địa điểm**.

### Danh sách 6 địa điểm GO hiện có trong Curated Seed:
1. **Nhà Vọng Cảnh** (Bán đảo Sơn Trà) — Điểm ngắm cảnh thiên nhiên, chụp ảnh panorama.
2. **Cầu vượt Mikazuki** (Nguyễn Tất Thành) — Cầu đi bộ phong cách Nhật Bản, ngắm vịnh Đà Nẵng, chụp ảnh check-in.
3. **Công Viên Nước Trong Nhà & Ngoài Trời Mikazuki 365** (Nguyễn Tất Thành) — Khu vui chơi giải trí nước, suối khoáng nóng onsen cho gia đình.
4. **Nhà Thờ Giáo Xứ An Ngãi** (Hòa Vang) — Công trình kiến trúc tôn giáo, lịch sử, chụp ảnh.
5. **Khu Du Lịch Sinh Thái Rạn Nam Ô** (Liên Chiểu) — Bãi đá rêu, biển hoang sơ, ẩm thực gỏi cá.
6. **Nhà Cổ Tích Thiện Đường** (Thanh Khê) — Điểm check-in, trải nghiệm phong cách cổ tích.

---

## 2. Các khoảng trống dữ liệu (Data Gaps Analysis)

### 2.1. Phân loại còn thiếu (Missing Categories)
Source candidate ban đầu hoàn toàn thiếu các nhóm trọng yếu bậc nhất của du lịch Đà Nẵng:
- ❌ **Biển biểu trưng (Iconic Beaches):** Không có Bãi biển Mỹ Khê, Bãi biển Phạm Văn Đồng, Bãi Non Nước.
- ❌ **Cầu biểu tượng (Iconic Bridges):** Không có Cầu Rồng, Cầu Sông Hàn, Cầu Thuận Phước, Cầu Trần Thị Lý.
- ❌ **Bảo tàng & Di sản (Museums & Culture):** Không có Bảo tàng Điêu khắc Chăm, Bảo tàng Đà Nẵng, Di tích Chùa Linh Ứng (Bãi Bụt), Di tích Danh thắng Ngũ Hành Sơn.
- ❌ **Chợ đêm & Hoạt động về đêm (Night & Entertainment):** Không có Chợ đêm Sơn Trà, Chợ đêm Helio, Phố đi bộ Bạch Đằng.
- ❌ **Công viên công cộng & Điểm check-in trung tâm:** Không có Công viên APEC, Công viên Biển Đông.

### 2.2. Tiêu chí lựa chọn chưa thể phục vụ (Unsatisfied Preferences)
Để đảm bảo trải nghiệm **"Trong tối đa 3 tap có 3 kết quả xuất sắc"**, mỗi tiêu chí cần tối thiểu **3 địa điểm**. Hiện trạng:

| Tiêu chí ĐI ĐÂU? | Số lượng hiện có | Cần thêm tối thiểu | Trạng thái |
| :--- | :---: | :---: | :--- |
| 🌊 **Biển / ngắm cảnh** | 4 | 0 | **Đạt** (tuy nhiên thiếu các bãi biển trung tâm nổi tiếng) |
| 📸 **Chụp ảnh đẹp** | 5 | 0 | **Đạt** |
| ❤️ **Hẹn hò** | 0 | 3 | ⚠️ **Thiếu dữ liệu hoàn toàn (0/3)** |
| 👥 **Đi nhóm** | 0 | 3 | ⚠️ **Thiếu dữ liệu hoàn toàn (0/3)** |
| 👨‍👩‍👧 **Gia đình** | 2 | 1 | ⚠️ **Chưa đủ 3 (2/3)** |
| 🌿 **Thiên nhiên** | 2 | 1 | ⚠️ **Chưa đủ 3 (2/3)** |
| 🎡 **Vui chơi** | 0 | 3 | ⚠️ **Thiếu dữ liệu hoàn toàn (0/3)** |
| 🌙 **Đi buổi tối** | 0 | 3 | ⚠️ **Thiếu dữ liệu hoàn toàn (0/3)** |

**Số lượng địa điểm GO cần bổ sung thêm:** Tối thiểu **14 – 24 địa điểm** chọn lọc để đạt mục tiêu target: **20 – 30 địa điểm GO chất lượng cao**.

---

## 3. Đề xuất danh sách các địa điểm biểu trưng Đà Nẵng (Iconic Places Proposal)

Tuân thủ quy định: **KHÔNG tự động tạo fake ID, fake rating, fake URL để đưa vào seed.**  
Dưới đây là danh sách đề xuất các danh lam, điểm tham quan cốt lõi của Đà Nẵng để người dùng/nhóm phát triển xác thực dữ liệu nguồn (Google Maps URL, tọa độ chuẩn, rating, review thực tế) trước khi tích hợp vào Phase 2B:

### Nhóm 1: Bãi biển & Điểm ngắm cảnh biểu trưng (Biển / Ngắm cảnh, Chụp ảnh)
1. **Bãi biển Mỹ Khê** (Sơn Trà / Ngũ Hành Sơn) — Top bãi biển quyến rũ nhất hành tinh, cát mịn, tắm biển, thể thao nước.
2. **Bãi biển Phạm Văn Đồng / Công viên Biển Đông** (Sơn Trà) — Không gian công cộng, bồ câu hòa bình, lễ hội ngoài trời.
3. **Bãi Rạng / Bãi Bụt** (Bán đảo Sơn Trà) — Vùng biển hoang sơ ven chân núi Sơn Trà, rạn san hô, lặn ngắm cảnh.

### Nhóm 2: Cầu & Điểm check-in trung tâm (Đi buổi tối, Hẹn hò, Chụp ảnh)
4. **Cầu Rồng** (Hải Châu - Sơn Trà) — Biểu tượng Đà Nẵng, trình diễn phun lửa & nước vào cuối tuần (21:00).
5. **Cầu Sông Hàn** (Hải Châu - Sơn Trà) — Cầu quay độc nhất vô nhị của Việt Nam, gắn liền với ký ức Đà Nẵng.
6. **Cầu Tình Yêu & Tượng Cá Chép Hóa Rồng** (Đường Trần Hưng Đạo, Sơn Trà) — Điểm hẹn hò kinh điển ven sông Hàn cho cặp đôi.
7. **Công viên APEC** (Đường Bạch Đằng kéo dài, Bình Hiên, Hải Châu) — Kiến trúc "Cánh diều bay cao", điểm chụp ảnh hiện đại.
8. **Phố đi bộ Bạch Đằng** (Bạch Đằng, Hải Châu) — Trục cảnh quan ven sông Hàn về đêm, dạo mát, biểu diễn đường phố.

### Nhóm 3: Văn hóa, Di sản & Tâm linh (Thiên nhiên, Gia đình, Đi nhóm)
9. **Danh thắng Ngũ Hành Sơn (Chùa Tam Thai, Động Huyền Không)** (Hòa Hải, Ngũ Hành Sơn) — Di tích quốc gia đặc biệt, 5 ngọn núi đá vôi kỳ vĩ, hang động tâm linh.
10. **Chùa Linh Ứng Bãi Bụt** (Bán đảo Sơn Trà) — Tượng Phật Bà Quan Âm cao 67m hướng ra biển, không gian thanh tịnh.
11. **Bảo tàng Điêu khắc Chăm Đà Nẵng** (Số 02 2 Tháng 9, Hải Châu) — Bộ sưu tập hiện vật Chămpa lớn nhất thế giới, kiến trúc Pháp cổ kính.
12. **Bảo tàng Mỹ thuật Đà Nẵng** (78 Lê Duẩn, Thạch Thang, Hải Châu) — Không gian nghệ thuật đương đại và truyền thống.

### Nhóm 4: Bán đảo Sơn Trà & Sinh thái hoang sơ (Thiên nhiên, Khám phá)
13. **Đỉnh Bàn Cờ** (Bán đảo Sơn Trà, cao gần 700m) — Điểm ngắm toàn cảnh thành phố và biển mây hùng vĩ.
14. **Cây Đa Ngàn Năm Sơn Trà** (Bán đảo Sơn Trà) — Di sản thiên nhiên sinh thái đặc hữu.
15. **Hồ Hòa Trung** (Hòa Vang) — Đồng cỏ thảo nguyên hồ nước, cắm trại, chèo kayak dã ngoại.

### Nhóm 5: Vui chơi giải trí & Chợ đêm (Vui chơi, Đi nhóm, Đi buổi tối)
16. **Chợ đêm Helio** (Đường 2 Tháng 9, Hải Châu) — Thiên đường ẩm thực đêm, âm nhạc acoustic sôi động cho giới trẻ.
17. **Chợ đêm Sơn Trà** (Mai Hắc Đế, An Hải Trung, Sơn Trà) — Mua sắm quà lưu niệm, hải sản đường phố ngay chân cầu Rồng.
18. **Asia Park — Công viên Châu Á / Vòng quay Sun Wheel** (1 Phan Đăng Lưu, Hải Châu) — Tổ hợp vui chơi giải trí ngoài trời, ngắm thành phố từ trên cao.

### Nhóm 6: Địa điểm ngoài 15km đề xuất xem xét là Ngoại lệ Biểu Trưng (Iconic Exception)
19. **Quần thể Du lịch Bà Nà Hills / Cầu Vàng** (~25km từ trung tâm Đà Nẵng) — Biểu tượng du lịch quốc tế của Đà Nẵng (Cần gắn cờ `iconicException: true` kèm thông tin khoảng cách rõ ràng).
20. **Suối Khoáng Nóng Núi Thần Tài** (~28km từ trung tâm) — Khu sinh thái nghỉ dưỡng suối khoáng nóng tự nhiên.

---

## 4. Kế hoạch hành động kế tiếp (Next Steps for User / Phase 2B)

1. **Người dùng xem xét danh sách đề xuất trên.**
2. **Cung cấp hoặc duyệt danh sách Google Maps URLs chính xác** cho khoảng 15–20 địa điểm chọn lọc thuộc các nhóm trên.
3. Khi đã có dữ liệu thực tế được verify, script pipeline sẽ trích xuất tọa độ chuẩn, địa chỉ và gắn các controlled tags (`DATE`, `GROUP`, `NIGHT`, `LIVELY`, `NATURE`, `BEACH`) để hoàn thiện 100% độ phủ cho nhánh **ĐI ĐÂU?**.
