> HISTORICAL_EVIDENCE — 2026-10-06. Checkpoint describes the dated session; current state/authorization is in the canonical documents. Current authority: docs/CURRENT_STATE.md, docs/DECISIONS.md and docs/HANDOFF_CURRENT.md (paths relative to repository root). Original content retained below as evidence, not execution authorization.

# Checkpoint UX/product độc lập — 2026-10-04

> Cập nhật mới nhất: xem `UX_PRODUCT_CHECKPOINT_2026-10-05.md`. Ngày 05/10, người dùng xác nhận DB còn làm/chỉ làm độc lập; đã thêm i18n library +22 tests và production build thành công trên bản sao mới. Kết quả build FAIL/BLOCKED bên dưới là lịch sử ngày 04/10, không phải trạng thái kiểm thử mới nhất.

## Trạng thái và pre-change

- Repo: Quang13082005/LaCaDaNang, checkout `D:/Dự án tìm địa điểm ăn chơi/LaCaDaNang/danang_revised_pack`.
- Branch: `phase-2a-deploy`.
- HEAD trước phiên: `a7494666e786f0b968484ea142cc221ddaf38050` (`fix: finalize progressive mobile UX`). Không tạo commit mới.
- Ban đầu tracked tree sạch; file untracked có sẵn `GEMINI_3_8_UX_HARDENING_IMPLEMENTATION.md` không sửa/stage.
- Đã đọc toàn bộ yêu cầu pasted của người dùng, AGENTS.md, GEMINI.md, PROJECT_STATE.md, PHASES.md; đã đọc Home/Intent/Preference/Results/Itinerary/shared UI và recommendation flow.
- Data runtime hiện vẫn từ `src/data/demo-places.ts`; lọc intent/tag + slice(0,3), itinerary sample. Không có DB integration đang hiện diện trong checkout này; điều đó KHÔNG chứng minh phiên AI khác không đang sửa những file này ở nơi khác.

## Completed

1. Audit source và browser về one-thumb: tìm thấy intent đổi vị trí, panel bắt buộc nằm cao, reset ở result/itinerary lệch vị trí. Ghi phép đo ở 360/390/430/768/1280. **Chưa sửa UI, chưa PASS one-thumb.**
2. Analytics spec đủ 8 event: mục tiêu/trigger/required/optional/example/funnel/growth/UX/privacy; quy tắc dedup, consent, denominator metrics; không provider/SDK.
3. Geo thuần: Haversine, validation, generic coordinate selector, filter radius inclusive, stable non-mutating distance sort. 18 unit tests mới. Không nối DB/API/UI.
4. Nearby spec: flow dự kiến, 1→3→5km, permission/timeout/accuracy/staleness/empty/many/out-of-area/race cases; không giả khoảng cách.
5. I18n architecture VI/EN/KO: detection/manual precedence/fallback vi/hydration/storage/typed dictionaries; phân tách UI với DB translation. **Chưa implement switch runtime** vì entry/components có nguy cơ conflict.
6. Notification spec: 5 nhóm, trigger/template/deep link/cap/dedup/consent/privacy/fallback; không xin quyền, không gửi thông báo.

## Files changed / New files

Không sửa file tracked có sẵn. Chỉ tạo 9 file mới, chưa stage:

- `docs/ONE_THUMB_UX_AUDIT.md`
- `docs/ANALYTICS_SPEC.md`
- `docs/NEARBY_ENGINE_PREPARATION.md`
- `docs/I18N_ARCHITECTURE.md`
- `docs/NOTIFICATION_SPEC.md`
- `docs/UX_PRODUCT_CHECKPOINT_2026-10-04.md` (file này)
- `src/lib/geo/distance.ts`
- `src/lib/geo/filter-nearby.ts`
- `tests/geo.test.ts`

## Tests

Chạy trong `D:/Dự án tìm địa điểm ăn chơi/UX_PRODUCT_2026-10-04/test-copy`: copy source/tests/config/docs/public + candidate; junction đến node_modules hiện có, không cài package. Cách này tránh curation.test ghi đè curated dataset gốc và tránh giẫm build .next của phiên DB. Không copy .env.

Máy có wrapper npm lỗi, lệnh tương đương: `node "C:/Program Files/nodejs/node_modules/npm/bin/npm-cli.js" run <script>`.

- `npm run lint`: PASS, không ESLint errors/warnings; có cảnh báo `next lint` deprecated.
- `npm run typecheck`: PASS.
- `npm run test`: PASS 45/45, 4 suites (geo18 + curation15 + prototype10 + shell2).
- `npm run build`: lần sandbox FAIL vì EACCES khi tải Be Vietnam Pro từ Google Fonts. Không sửa font/config để giấu lỗi. Lần network retry bị treo trước compile, đã dừng tiến trình của riêng lần chạy đó. Kết quả lần cuối được cập nhật dưới đây.
- Không có Playwright test suite/package hiện hữu. Browser audit là baseline, không gọi nó là post-fix acceptance. Không có kiểm chứng cầm máy thật một tay.

Logs nằm ngoài repo: `UX_PRODUCT_2026-10-04/{lint,typecheck,test,build,build-network,build-retry}.log`.

## Diff safety / Database safety

- Đã chạy `git diff --stat`, `git diff`, `git diff --check`; tracked diff rỗng. File mới không xuất hiện trong git diff thường nên đã đọc trực tiếp source/tests/spec và tạo manifest riêng `UX_PRODUCT_2026-10-04/new-file-manifest.json`.
- Không sửa schema/migration/Supabase client/config/connection/adapter/API/model/mapping/production data. Không đổi routes, dependencies, global CSS, token hoặc recommendation engine. Không mở `.env`.
- Curated seed SHA256 trước/sau: `CDBC44AA0CF9EBB19B07BC3FB8DBFD11A625E1C31E082EE6B3434F5E155457BD`.
- Giữ nguyên cả `docs/PROJECT_STATE.md` vì đây là file trạng thái dùng chung với DB session; checkpoint riêng này thay việc cập nhật nó trong khi quyền sở hữu chưa rõ. Đây là ngoại lệ có chủ đích theo yêu cầu không chồng sửa của người dùng.
- Không commit/push/merge/deploy. Không revert/discard thay đổi của người dùng hoặc phiên khác.

## Pending work / TODO AFTER DB

- Đang chờ danh sách file phiên DB giữ: Home page, IntentGrid/PreferencePanel, ResultList/PlaceCard, Itinerary và PROJECT_STATE là các điểm nguy cơ chồng sửa. Câu hỏi đã gửi người dùng trong phiên.
- Khi xác nhận ownership mới sửa layout one-thumb nhỏ nhất; giữ slot intent ổn định, đưa quyết định chính xuống vùng dưới, reset nhất quán, không thêm tap; kiểm tra toàn bộ matrix và người dùng cầm máy thật. Hiện **UX CHƯA ĐẠT tiêu chí one-thumb mới**.
- Query place thật và map result: phiên DB sở hữu, không làm ở đây.
- Nearby Worker/API: chỉ nối utility sau khi DB contract, geofence, accuracy/radius policy được duyệt; không dùng demo coordinates giả.
- Locale DB translation: chờ adapter/contract ổn định; không tự dịch venue/tag/type data. Runtime frontend locale switch và toàn bộ UI dictionary còn chờ tích hợp.
- Real data ranking/diversity: chờ engine/coverage; không coi distance-only sort là “best places”.
- Analytics provider/consent implementation, Web Push/scheduler/deep links chỉ làm khi người dùng duyệt riêng.

## Known limitations

Chỉ hoàn tất các phần độc lập được phép. Không đồng nhất “tests PASS” với “UX PASS” hoặc “DB ready”. Geometry không kiểm chứng quyền GPS/browser/network/DB. I18n và notification là thiết kế, không tính năng đang chạy; Korean cần native review. Analytics không chứng minh exact unique humans. Tài liệu cũ Vercel/realtime giữ nguyên theo scope.

## Next step — duy nhất

Nhận manifest file ownership từ phiên Database Integration để phân định chính xác file UI được sửa, rồi tiếp tục Task 1 one-thumb. Dừng tại checkpoint, chờ người dùng review; không phát hành.

## Kết quả cuối của lần kiểm tra build
- Lần network thứ hai với NEXT_TELEMETRY_DISABLED=1 vẫn không có tiến triển sau banner Next.js trong hơn 2 phút; đã chủ động dừng, exit 1. Nguyên nhân treo chưa xác định; không khẳng định do telemetry hoặc do code geo.
- Build tổng thể: BLOCKED / CHƯA PASS. Giữ nguyên log failed/retry; không sửa dependency/config/font hoặc dùng mock font để báo PASS.
- Không còn tiến trình test/build được giữ chạy bởi phiên này. HEAD cuối vẫn a749466; chỉ 9 file mới của task (và file untracked có sẵn của người dùng), tracked diff rỗng.
