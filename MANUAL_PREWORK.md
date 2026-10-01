# MANUAL_PREWORK.md — Những việc bạn cần tự làm trước/giữa các phase

Tài liệu này chỉ liệt kê những phần AI coding agent không nên tự quyết định thay bạn.

## 1. Curate final dataset (~100 places) — phải làm trước Phase 2

File `danang_mvp_candidates_v2.json` chỉ là **300 candidate để review**, KHÔNG phải dữ liệu production.

### Cách làm
1. Mở file candidate.
2. Chọn khoảng:
   - 40-50 EAT
   - 20-30 GO
   - 20-30 STAY
3. Với mỗi place giữ lại, điền:
   - `imageUrl`
   - `curatedTags` (2-5 tags)
   - `reasons` (2-4 lý do ngắn, đúng dữ liệu)
   - `timeTags`
   - `priceLevel` nếu bạn có nguồn đáng tin
   - `typicalDurationMinutes` nếu place được dùng trong itinerary
   - `bestTimeOfDay` nếu place được dùng trong itinerary
   - `featured`
4. Đổi `curationStatus` thành `APPROVED` khi bạn đã kiểm tra.
5. Xuất final file tên `curated_places.json` và chỉ đưa file này cho Gemini ở Phase 2.

## 2. GO data đang thiếu — bắt buộc bổ sung thủ công

Sau filter chặt, candidate V2 chỉ còn rất ít GO phù hợp. Điều này là bình thường vì source ban đầu crawl category chưa tốt.

Bạn cần tự tìm/verify thêm khoảng 15-25 điểm tham quan Đà Nẵng thật sự phù hợp, ví dụ các nhóm:
- biển / ngắm cảnh
- cầu / landmark
- bán đảo / thiên nhiên
- núi / chùa
- bảo tàng / văn hóa
- công viên / vui chơi
- điểm chụp ảnh
- hoạt động buổi tối

Với địa điểm xa trung tâm nhưng vẫn là biểu tượng Đà Nẵng (ví dụ khu Bà Nà), nếu giữ thì phải đánh dấu là **iconic exception** và hiển thị khoảng cách rõ. Không trộn Hội An vào MVP Đà Nẵng.

## 3. Ảnh — AI không thể tự quyết license giúp bạn

Mục tiêu là mỗi final place có 1 ảnh đẹp.

Ưu tiên:
1. ảnh bạn tự chụp;
2. ảnh venue cấp quyền cho bạn;
3. ảnh có license cho phép sử dụng;
4. branded fallback nếu chưa có ảnh.

Không nên:
- tải đại ảnh Google Maps/Facebook rồi đưa vào production;
- hotlink URL ảnh có thể hết hạn;
- dùng một ảnh stock generic rồi nói đó là ảnh thật của venue.

Cấu trúc gợi ý:
```
public/images/demo/      # Phase 1
public/images/places/    # Phase 2+
```

## 4. Vercel — bạn phải authorize tài khoản

Phase 0 yêu cầu first preview deploy. Gemini có thể chuẩn bị project/command nhưng bạn cần:
1. đăng nhập Vercel;
2. authorize Git repository/project khi Vercel hỏi;
3. chọn project/team của bạn;
4. nếu có env vars sau này, tự thêm vào Vercel Settings theo hướng dẫn của Gemini.

Không đưa password/token bí mật vào chat hay commit Git.

## 5. Phase 1 — bạn phải tự duyệt UI trên điện thoại thật

Sau khi Gemini gửi Vercel preview:
1. mở bằng điện thoại của bạn;
2. thử 360/390/430 bằng DevTools và ít nhất 1 máy thật;
3. kiểm tra Home có hiểu trong 3 giây không;
4. bấm đủ 4 intent;
5. kiểm tra tap target, font tiếng Việt, hình ảnh, khoảng trắng;
6. nếu nhìn còn giống project demo/admin dashboard: KHÔNG approve Phase 1.

## 6. Checklist trước khi cho Gemini bắt đầu Phase 0

- [ ] `AGENTS.md` ở root
- [ ] `GEMINI.md` ở root
- [ ] `docs/PHASES.md`
- [ ] `docs/PROJECT_STATE.md`
- [ ] Bạn đồng ý design tokens hiện tại (sky + orange + Be Vietnam Pro)
- [ ] Bạn đồng ý deploy target Vercel
- [ ] Bạn hiểu candidate JSON chưa phải final seed
- [ ] Bạn sẽ curate data song song khi Gemini làm Phase 0-1

## 7. Prompt readiness đầu tiên cho Gemini

```text
Bạn sắp bắt đầu code một dự án mới. KHÔNG CODE NGAY.

1. Đọc theo thứ tự:
   - AGENTS.md
   - GEMINI.md
   - docs/PHASES.md
   - docs/PROJECT_STATE.md

2. Sau khi đọc, KHÔNG CODE. Hãy trả lời:
   a) Project này là gì và mục tiêu cốt lõi là gì?
   b) Current phase + status?
   c) Deliverables chính xác của Phase 0?
   d) Acceptance criteria chính xác của Phase 0?
   e) File/folder bạn dự định tạo/sửa?
   f) npm packages bạn dự định cài + lý do từng package?
   g) Những gì bạn KHÔNG được làm trong Phase 0?
   h) Xác nhận bạn sẽ STOP sau Phase 0 và chờ tôi review?

3. Nếu requirement nào chưa rõ: hỏi trước, không đoán.
4. Chờ tôi xác nhận kế hoạch trước khi code.
```

Sau khi Gemini trả lời đúng, bạn mới gửi:

`Kế hoạch đúng. Bắt đầu Phase 0.`
