# Phase A — Dragon Bridge Hero

2026-10-09. Base `8dde44ed4a4f99b87f76002575711b73b24719cd`, branch `phase-2a-deploy`, initial tree clean.

Owner supplied a 390×246 image with baked Vietnamese text, then explicitly corrected the accidental fixed-Vietnamese choice: Hero must support VI/EN/KO. Built-in imagegen edited a derivative to remove typography/underline and border, preserve Dragon Bridge/skyline/river/blue sky/sunset. This is an AI-edited illustration derived from the reference, not a claim of unchanged photographic pixels. Original attachment unchanged. No new venue imagery.

Prompt: remove only overlaid typography and yellow underline, fill with existing sky/mountains, preserve golden Dragon Bridge, skyline, reflections, blue sky, warm sunset, foreground plants and wide composition; no new text/logos/landmarks/UI. Output inspected. Existing sharp converted it to `public/images/hero/da-nang-dragon-bridge.webp` (1280×806, 175,762 bytes, quality 86). No package installation or hotlink.

Hero uses local Next Image/object-cover, rightward focal point to retain dragon head and towers in portrait. Localized UI text overlays the upper sky; brand remains LA CÀ / ĐÀ NẴNG. Removed dark lower scrims so bridge/reflections remain bright. VI/EN/KO alt text now describes bridge/river accurately. Header sizing, page, grid, footer and bottom sheet unchanged.

Focused tests: `node node_modules/vitest/vitest.mjs run tests/hero-artwork.test.tsx tests/one-hand-ux.test.tsx tests/runtime-i18n.test.tsx tests/shell.test.tsx` — 4 files, 52/52 PASS. Locale-route tests intentionally have no DATABASE_URL and are not live DB proof. Full regression/build deferred until later phases.

Browser evidence under `D:/Dự án tìm địa điểm ăn chơi/CONTINUATION_2026-10-09`:
- `phase-a-layout.json`, `phase-a-tests.log`.
- `phase_a_vi_320/360/375/390/393/412/430.png`, `phase_a_vi_430_settled.png`, `phase_a_ko_393.png`.
- Earlier files named `hero_vi_*.png` actually show auto-detected English; filenames are historical capture labels, not locale evidence. Their metrics are stored as `english` in JSON.

Required viewports: 320×800,360×800,375×812,390×844,393×852,412×915,430×932. All four cards remain within viewport, page height equals viewport height. Hero height ~367–460px; NOW/EAT start ~438–552px. 390px baseline and final geometry match exactly (Hero414px, grid485–767px, footer779–844px). Text wraps; dragon/river/towers remain visible. Korean and English UI copy verified with real language selector; no baked Vietnamese remains.

Actual source differs from old P1.2 report: grid→footer gap is ~12px at 320–393, ~25px at412 and ~33px at430 because existing Hero max-height caps at460. No large dead space; no page/layout adjustment made. Do not repeat the old “12px at every viewport” claim. Browser viewport evidence is not physical one-hand certification. IAB screenshots can be limited by capture surface at tall viewports; geometry records include full footer bounds.

DB mutations: zero. Dataset/API/Nearby/analytics/reminders/config/lockfile unchanged. No push/deploy. Next: Phase B read-only tag audit and real NOW contract; CAFE analytics enum gate remains to be handled before Phase C.
