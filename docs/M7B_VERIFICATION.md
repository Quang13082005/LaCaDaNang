# M7-B Runtime i18n Implementation & Verification Report

**Timestamp**: 2026-10-08T14:35:00+07:00
**Branch**: `phase-2a-deploy`
**Base Commit**: `9a6492eb6a7ca9a0ffbf0e93bc468ee1e68a285f` (docs: lock i18n runtime contract)
**Status**: **VERIFIED ALL PASS**

---

## 1. Executive Summary

Milestone **M7-B (VI / EN / KO RUNTIME I18N IMPLEMENTATION)** has delivered genuine multilingual runtime capabilities across Vietnamese (`vi`), English (`en`), and Korean (`ko`) for LA CÀ ĐÀ NẴNG without adding third-party i18n packages, while strictly preserving M6-B mobile one-hand ergonomics and M5-B Nearby discovery contracts.

Key deliverables verified:
1. **Runtime Locale Provider (`LocaleProvider.tsx`, `useLocale`)**:
   - Initial server & pre-hydration markup renders default `vi` matching `<html lang="vi">`, completely eliminating Next.js hydration warnings.
   - Client post-hydration resolution strictly follows contract precedence: `explicit manual localStorage > navigator.languages > navigator.language > vi`.
   - Persistence uses `localStorage` key `laca.ui-locale.v1` (`vi | en | ko`). Auto/device mode removes the key (`removeItem`). Wrapped in robust `try/catch` with memory fallback for private browsing.
   - Dynamically updates `document.documentElement.lang = activeLocale`.
   - Exposes `formatNumber(val, options)` utilizing `Intl.NumberFormat(activeLocale)` for locale-aware distance and metrics without altering underlying coordinates or data models.
2. **Language Selector UX (`LanguageSelector.tsx`)**:
   - Implemented as a mobile one-hand friendly secondary trigger button in the reachable zone below main Home content and within the results footer.
   - Tapping opens a compact bottom sheet / dialog in the lower viewport displaying 4 options (`Tiếng Việt`, `English`, `한국어`, `Theo thiết bị / Auto`).
   - Every interactive option maintains $\ge 48\text{px}$ touch height (`min-h-[48px]`), proper keyboard accessibility (Escape closes), dialog ARIA semantics (`aria-modal="true"`, `role="radiogroup"` / `role="radio"`).
   - Kept strictly out of the discovery `BottomActionBar` and header Hard Reach Zone.
3. **Dynamic Discovery API Locale**:
   - Removed hardcoded `locale=vi`. All discovery requests dynamically supply `locale=<activeLocale>`.
   - Switching language preserves `selectedIntent`, `selectedPreference`, Nearby/citywide mode, in-memory GPS coordinates, and scroll stability.
   - Triggers an immediate re-fetch to `/api/discovery?intent=...&locale=<newLocale>&preference=...`.
   - Protected by race-condition cancellation: in-flight stale requests from previous locales are aborted and discarded via `AbortController` and component active guards.
4. **Neon Database Translations Live**:
   - Dynamic locale requests to Neon PostgreSQL return translated `primary_type_label` (e.g. `vi: Quán ăn/Địa điểm` | `en: Place/Restaurant` | `ko: 장소/음식점`) and localized `tags` (e.g. `vi: Đi nhóm, Đi đêm, Phổ biến` | `en: Group, Night, Popular` | `ko: 단체, 야간, 인기`).
   - Authentic Da Nang venue names are preserved truthfully without machine translation.
5. **Full UI String Localization (`messages.ts`)**:
   - Expanded typed dictionary across `vi`, `en`, and `ko` covering Hero, Intents, Helper text, Category badges, Preference prompts and chips, Results titles and truthful count states, GPS warning notices, PlaceCard CTAs and metadata, Itinerary chrome, and Language selector options.
   - Brand name `LA CÀ ĐÀ NẴNG` remains untranslated.
   - Intent uppercase design system labels (`BÂY GIỜ LÀM GÌ?`, `ĂN GÌ?`, `ĐI ĐÂU?`, `Ở ĐÂU?`) are preserved in Vietnamese.
6. **M6-B One-Hand & M5-B Nearby Preservation**:
   - Stable intent DOM ordering `[NOW, EAT, GO, STAY]` unchanged.
   - Accordion opens in-place directly underneath selected intent.
   - `BottomActionBar` remains fixed at the bottom with safe-area padding.
   - Nearby 1 $\rightarrow$ 3 $\rightarrow$ 5 km escalation, accuracy $\le 1000\text{m}$, 0–3 truthful results, exact Maps URLs, and no venue images remain strictly intact.
   - CAFE remains inactive (400 `INTENT_NOT_AVAILABLE`); NOW remains sample/static.

---

## 2. Automated Test Verification

All 12 test suites and 221 unit/integration tests passed cleanly:

```bash
npx vitest run --exclude "**/curation.test.ts"
```

### Results Summary
- **Test Files**: 12 passed (12)
- **Tests**: 221 passed (221)
- **Duration**: ~11.7s
- **Exit Code**: 0

### Breakdown of Test Files:
1. `tests/runtime-i18n.test.tsx` (25 tests) — **PASS**:
   - Initial render `vi` & `document.documentElement.lang="vi"`
   - Auto-detection: `vi-VN` $\rightarrow$ `vi`, `en-US` $\rightarrow$ `en`, `en-GB` $\rightarrow$ `en`, `ko-KR` $\rightarrow$ `ko`, `ja-JP` $\rightarrow$ `vi` (unsupported fallback)
   - Precedence: `navigator.languages` over `navigator.language`
   - Manual selection: `vi`, `en`, `ko` sets `localStorage` and `lang`
   - Manual selection takes precedence over browser language
   - Auto mode clears `localStorage` (`removeItem`) and returns to browser language
   - Blocked storage resilience (`SecurityError` / quota exceeded)
   - Corrupt storage resilience
   - Number formatting per locale (`Intl.NumberFormat`)
   - LanguageSelector touch targets $\ge 44\text{px}$, modal dialog semantics, Escape key dismiss
   - Discovery re-fetch on locale change
   - Preservation of intent, preference, and Nearby GPS coordinates across switches
   - Stale old-locale responses dropped on race conditions
   - Discovery route parameter validation: 400 on unsupported locale `fr`, 200 on `vi`, `en`, `ko`
2. `tests/i18n.test.ts` (22 tests) — **PASS**: Standalone locale resolution & dictionary completeness
3. `tests/one-hand-ux.test.tsx` (13 tests) — **PASS**: M6-B one-hand ergonomic contracts
4. `tests/nearby-frontend.test.tsx` (11 tests) — **PASS**: M5-B Nearby discovery contracts
5. `tests/nearby.test.ts` (18 tests) — **PASS**: Nearby distance engine
6. `tests/geo.test.ts` (18 tests) — **PASS**: Haversine coordinates
7. `tests/discovery.test.ts` (48 tests) — **PASS**: Discovery contracts & Neon repository
8. `tests/go-stay-discovery.test.ts` (15 tests) — **PASS**: GO & STAY contracts
9. `tests/go-stay-frontend.test.tsx` (21 tests) — **PASS**: GO/STAY frontend
10. `tests/eat-frontend.test.tsx` (18 tests) — **PASS**: EAT real-data frontend
11. `tests/prototype.test.tsx` (10 tests) — **PASS**: UX hardening & $\le 3$-tap flow
12. `tests/shell.test.tsx` (2 tests) — **PASS**: Brand and primary intents

---

## 3. Lint, Typecheck, Build & Dataset Verification

```bash
npm run lint
# Output: ✔ No ESLint warnings or errors (Exit code: 0)

npm run typecheck
# Output: tsc --noEmit (Exit code: 0)

npm run build
# Output: Next.js 15.5.27 production build succeeded (Exit code: 0)

git diff HEAD -- src/data/curated/curated-places.json
# Output: Clean (0 lines changed)
```

---

## 4. Live Browser Verification & Visual Evidence

Real browser testing was conducted against the live Next.js application server (`http://localhost:3105`):
- **WebP Session Video Artifact**: `m7b_i18n_verification_1791444187141.webp`
- **Screenshots Captured**:
  - `viewport_320_check_1791444691472.png` (320x800 viewport: no horizontal scroll, clean accordion chips)
  - `results_320_check_1791444759317.png` (320x800 results: non-overlapping BottomActionBar, clean cards)
  - `viewport_430_check_1791444779912.png` (430x932 viewport: balanced touch targets, fixed bottom bar)

### Verification Steps Performed:
1. **Vietnamese Default**:
   - Hero: `LA CÀ ĐÀ NẴNG` / `Tìm chỗ ăn, chơi và nghỉ ở Đà NẴng.`
   - Intents: `BÂY GIỜ LÀM GÌ?`, `ĂN GÌ?`, `ĐI ĐÂU?`, `Ở ĐÂU?`
   - Footer Selector Trigger: `Ngôn ngữ: Tiếng Việt`
2. **Switch to English**:
   - Tapped Language trigger $\rightarrow$ Bottom sheet opened in lower viewport with 4 options ($\ge 48\text{px}$).
   - Selected `English` $\rightarrow$ modal closed, `document.documentElement.lang` became `"en"`.
   - Content immediately updated: `Find food, activities and places to stay in Da Nang.`, `What to do now?`, `What to eat?`, `Where to go?`, `Where to stay?`.
3. **English Discovery Flow**:
   - Tapped `What to eat?` $\rightarrow$ accordion expanded in-place with `😋 Delicious food`, `🍜 Specialties`, `❤️ Romantic`.
   - Tapped `Delicious food` $\rightarrow$ live API called `GET /api/discovery?intent=EAT&locale=en&preference=an_ngon`.
   - Context title: `What to eat? · Delicious food` (`There are 3 suggestions for this selection.`).
   - Cards rendered English DB data: `Place`, `Group`, `Night`, `Popular`, `Restaurant`, `Solo`, `View on Google Maps`.
   - BottomActionBar rendered: `Change selection` and `Near me` ($\ge 44\text{px}$, no overflow).
4. **Switch to Korean**:
   - Tapped footer Language trigger $\rightarrow$ Selected `한국어`.
   - Live API immediately called `GET /api/discovery?intent=EAT&locale=ko&preference=an_ngon`.
   - Context title: `무엇을 먹을까요? · 맛있는 음식` (`이 선택에 맞는 추천 장소가 3곳 있습니다.`).
   - Cards rendered Korean DB data: `장소`, `Google 평점 : 4.9 /5 17,886 개 리뷰`, `단체`, `야간`, `인기`, `음식점`, `혼자`, `Google 지도에서 보기`.
   - BottomActionBar rendered: `선택 변경` and `내 주변`.
   - Tapped `선택 변경` $\rightarrow$ returned smoothly to in-place Korean preference selection (`무엇을 먹을까요?` with `맛있는 음식`, `특산물`, `데이트`).
5. **Viewports Matrix (320px, 390px, 430px)**:
   - At 320x800: Zero horizontal scrollbar, no text clipping, buttons wrap comfortably.
   - At 390x844: One-hand ergonomics verified; controls sit directly under thumb.
   - At 430x932: Ample margins, stable BottomActionBar, responsive layout.

---

## 5. Scope & Regression Guardrails

- **EAT / GO / STAY $\rightarrow$ Neon**: Intact and verified live.
- **Nearby Algorithm**: 1 $\rightarrow$ 3 $\rightarrow$ 5 km escalation, accuracy $\le 1000\text{m}$, citywide fallback intact.
- **Truthful Results**: 0–3 places, no fake padding, exact Maps URLs, no venue images.
- **M6-B One-Hand UX**: BottomActionBar fixed, intent order `[NOW, EAT, GO, STAY]` stable, in-place accordion preserved.
- **CAFE**: Disabled (HTTP 400).
- **NOW**: Static sample timeline.
- **Database**: Zero mutations, read-only.
- **Dependencies**: Zero new packages installed.
