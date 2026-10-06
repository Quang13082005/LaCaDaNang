> HISTORICAL_EVIDENCE — 2026-10-06. Checkpoint describes the dated session; current state/authorization is in the canonical documents. Current authority: docs/CURRENT_STATE.md, docs/DECISIONS.md and docs/HANDOFF_CURRENT.md (paths relative to repository root). Original content retained below as evidence, not execution authorization.

# Checkpoint tiếp tục phần độc lập — 2026-10-05

## Phạm vi đã xác nhận

Người dùng xác nhận: **“DB còn làm; chỉ tiếp tục phần độc lập.”** Vì vậy không sửa/nối Home, IntentGrid/PreferencePanel, ResultList/PlaceCard, Itinerary, data mapping, API, adapter, schema hoặc PROJECT_STATE dùng chung. Không commit/push/merge/deploy.

Branch trước/sau: `phase-2a-deploy`. HEAD trước/sau: `a7494666e786f0b968484ea142cc221ddaf38050`. Các file mới từ 04/10 vẫn được giữ; file untracked có sẵn của người dùng `GEMINI_3_8_UX_HARDENING_IMPLEMENTATION.md` không bị sửa.

## Completed lần này

- Tạo `src/lib/i18n/locales.ts`: VI/EN/KO, kiểm tra locale, chuẩn hóa BCP-47 với Intl, manual override → browser languages theo thứ tự → browser language → VI. Input được truyền vào, không đọc globals/storage/network. Không browser nào bị tự đổi ngôn ngữ.
- Tạo `src/lib/i18n/messages.ts`: 27 key UI, đủ VI/EN/KO, type-check thiếu/thừa key, hàm translate có typed key. Chỉ UI prompts/actions/helpers/counts; không dịch tên venue, DB tags/types hoặc mô tả địa điểm.
- Tạo `tests/i18n.test.ts`: 22 tests cho locale variants, input malformed/unsupported, manual override/clear, fallback, dictionary parity và sample/count semantics.
- Cập nhật `docs/I18N_ARCHITECTURE.md` để phân biệt phần library đã có và phần provider/switcher/runtime còn pending.
- Giải quyết blocker kiểm tra build bằng bản sao kiểm thử mới hoàn toàn, không tái dùng thư mục .next cũ. Không thay font/config/package/source ứng dụng.

## Files changed lần này

File mới: `src/lib/i18n/locales.ts`, `src/lib/i18n/messages.ts`, `tests/i18n.test.ts`, `docs/UX_PRODUCT_CHECKPOINT_2026-10-05.md`.

File do phiên trước tạo được cập nhật: `docs/I18N_ARCHITECTURE.md`, `docs/UX_PRODUCT_CHECKPOINT_2026-10-04.md` (thêm liên kết checkpoint mới).

Toàn bộ phần bổ sung từ 04–05/10: sáu spec/audit/checkpoint ngày 04, checkpoint ngày 05, hai geo utilities, hai i18n utilities, hai test files = 13 file mới so với HEAD. Không sửa file tracked có sẵn; git diff thường rỗng vì tất cả file task chưa được stage.

## Tests / build

Lệnh dùng npm CLI đã có: `node "C:/Program Files/nodejs/node_modules/npm/bin/npm-cli.js" run <script>` (wrapper npm trên máy có vấn đề).

- `npm run lint`: PASS — 0 ESLint errors/warnings; cảnh báo CLI next lint deprecated giữ nguyên.
- `npm run typecheck`: PASS.
- `npm run test`: PASS **67/67**, 5 suites: curation15, shell2, prototype10, geo18, i18n22.
- `npm run build`: PASS, exit 0, static pages 5/5, route `/` 15.2kB / first load JS 117kB.

Lint/typecheck/tests chạy tại `D:/Dự án tìm địa điểm ăn chơi/UX_PRODUCT_2026-10-04/test-copy` sau đồng bộ i18n source/tests. Logs `lint-2026-10-05.log`, `typecheck-2026-10-05.log`, `test-2026-10-05.log` ở thư mục cha.

Build chạy tại bản sao mới `D:/Dự án tìm địa điểm ăn chơi/UX_PRODUCT_2026-10-05/build-copy`, cùng source/tests/config/public, junction đến node_modules hiện có; không copy .env, không cài package. Log `UX_PRODUCT_2026-10-05/build-fresh.log`. Cho phép mạng để next/font tải Be Vietnam Pro; chỉ set PATH và NEXT_TELEMETRY_DISABLED cho process. Đã so SHA256 ba file i18n/test trong build-copy với repo: khớp.

Lần build đầu ngày 05 trong thư mục copy cũ vẫn treo sau banner Next.js và đã dừng; log `build-resume-2026-10-05.log` giữ nguyên. Source Next build có bước dọn dist trước compile; bản sao mới vượt qua và build thành công. Đây là bằng chứng workaround môi trường hiệu quả, **không phải xác nhận tuyệt đối nguyên nhân treo**. Không xóa .next/node_modules của repo dùng chung và không dừng process phiên DB.

## Database safety / diff review

Đã chạy git status, branch/log, git diff --stat, git diff, git diff --check; tracked diff rỗng. Đã đọc/review trực tiếp file mới vì git diff không hiển thị untracked. Libraries chỉ import nội bộ/type, không DB/Supabase/network. Không thay data/schema/migrations/API/connection/adapter/model, routes, dependency/lockfile, Cloudflare config, public assets/global styles. Curated SHA256 vẫn `CDBC44AA0CF9EBB19B07BC3FB8DBFD11A625E1C31E082EE6B3434F5E155457BD`.

Toàn bộ tests tiếp tục chạy ngoài repo vì curation suite có ghi dataset. PROJECT_STATE.md giữ nguyên theo yêu cầu không chồng công việc; hai checkpoint riêng này là báo cáo phiên. Không thao tác master. Không commit, push, merge, deploy.

## Pending / Known limitations

- **One-thumb UX chưa đạt/chưa sửa**; UI không đổi trong phiên này. Không chạy lại viewport matrix cho một UI không đổi rồi gọi đó là post-fix PASS. Audit baseline 360/390/430/768/1280 ở ONE_THUMB_UX_AUDIT.md vẫn có hiệu lực.
- I18n library chưa nối app; chưa có provider, manual switch/persistence, html lang update hoặc translated UI render. Những việc đó đợi DB ownership bàn giao. Unit tests không thay thế responsive và human language review; KO cần native review.
- Chưa query place thật, map DB result, nearby Worker/API, DB locale translation hoặc real ranking. Geo utilities không tự truy cập vị trí, tự query DB hay thay engine.
- Analytics và notification vẫn spec-only, chưa cài provider/tracking/Web Push. Không xin permissions hoặc gửi notification.
- Không còn test/build session do phiên này giữ chạy. Các bản sao kiểm thử và logs được giữ ngoài repo để bàn giao.

## Next step — duy nhất

Sau khi phiên Database Integration bàn giao file ownership/API mapping ổn định, thực hiện sửa UI one-thumb trên những file được nhường và xác minh lại các viewport. Dừng ở checkpoint chờ người dùng review; không tự phát hành.
