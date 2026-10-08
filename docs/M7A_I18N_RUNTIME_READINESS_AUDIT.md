# M7-A: i18n Runtime Readiness Technical Audit

> **Status:** AUDIT ONLY — COMPLETED
> **Date:** 2026-10-08
> **Checkpoint:** `phase-2a-deploy` @ `f725524f4bcac1481e277ba6cb5bd4d5c13d5789` (M6-B verified)
> **Scope:** Full repository and runtime audit for internationalization (Vietnamese, English, Korean) covering source files, Neon database translations, Discovery API contract, hardcoded frontend UI strings, browser auto-detection, manual language switcher UX, SSR hydration safety, and regression guardrails.
> **Constraints:** Zero changes to application source (`src/`), zero changes to tests (`tests/`), zero database mutations (READ-ONLY verification only), no deployment, no Git push.

---

## 1. Executive Summary & Audit Status

Milestone **M7-A** conducts an exhaustive audit of the internationalization (i18n) readiness for *La Cà Đà Nẵng*. The requirement from mentor is:
- Support **Vietnamese (`vi`)**, **English (`en`)**, and **Korean (`ko`)**.
- Auto-detect based on device/browser language preference.
- Provide manual language switcher with persistence.
- Zero regression on M6-B one-hand mobile UX, zero fake data, and zero image dependency.

### Summary Table

| Domain | Status | Key Audit Findings |
| :--- | :--- | :--- |
| **Existing i18n Code** | FOUNDATION READY | Pure resolver in `src/lib/i18n/locales.ts` and 27 typed keys in `src/lib/i18n/messages.ts`. 22 unit tests passing in `tests/i18n.test.ts`. **Zero runtime integration** in UI components. |
| **Neon Database** | 100% COVERAGE | 500 places with 1,500 translation rows (`vi`, `en`, `ko`). 36 tags with 108 translation rows (`vi`, `en`, `ko`). Note: Venue proper names are identical across locales (intentional text-first authenticity); category labels and tags are fully translated. |
| **Discovery API** | READY | `GET /api/discovery` accepts `locale` (`vi`, `en`, `ko`, default: `vi`). Invalid locales return 400. Neon queries join requested locale with Vietnamese fallback. |
| **Frontend Call Site** | HARDCODED `vi` | `DiscoveryResults.tsx` hardcodes `locale: "vi"` in query params and response checks. |
| **Frontend UI Strings** | HIGH DENSITY VI | 45+ hardcoded Vietnamese strings across Home, Hero, IntentGrid, PreferencePanel, ResultList, BottomActionBar, PlaceCard, and Itinerary. |
| **HTML `lang`** | STATIC | `src/app/layout.tsx` hardcodes static `<html lang="vi">`. No dynamic update mechanism. |
| **One-Hand UX Impact** | LOW RISK IF TOP | Language switcher must NOT be placed in the bottom thumb zone (reserved for `BottomActionBar`). Must live in top utility bar or footer with $\ge 44\text{px}$ targets. |
| **SSR / Hydration** | ARCHITECTED | Server must render default `vi` to match static HTML; browser language resolved client-side in effect to avoid React hydration mismatch. |

---

## 2. Existing i18n Source Code Audit

### 2.1 File & Function Inventory

All existing i18n foundation code resides in `src/lib/i18n/`:

#### A. `src/lib/i18n/locales.ts` (42 lines)
- **Constants**:
  - `SUPPORTED_LOCALES = ["vi", "en", "ko"] as const`: canonical list of supported languages.
  - `DEFAULT_LOCALE: SupportedLocale = "vi"`: default fallback language.
  - `LOCALE_STORAGE_KEY = "laca.ui-locale.v1"`: versioned key for localStorage.
- **Type**:
  - `SupportedLocale = "vi" | "en" | "ko"`.
- **Functions**:
  - `isSupportedLocale(value: unknown): value is SupportedLocale`: type guard.
  - `localeFromLanguageTag(value: unknown): SupportedLocale | null`:
    - Normalizes BCP-47 language tags using `Intl.getCanonicalLocales()`.
    - Extracts primary language subtag (e.g. `en-US` -> `en`, `ko-KR` -> `ko`, `vi-VN` -> `vi`).
    - Returns `SupportedLocale` or `null` for unsupported tags (e.g. `de-DE`, `ja-JP`).
  - `resolveLocale({ manual, languages, language }: LocalePreferences): SupportedLocale`:
    - Pure function without browser globals.
    - Precedence: valid `manual` -> first match in `languages` array -> `language` -> `DEFAULT_LOCALE` (`"vi"`).

#### B. `src/lib/i18n/messages.ts` (102 lines)
- **Dictionaries**:
  - `vi`, `en`, `ko` dictionary objects with 27 typed keys.
  - Strict parity enforced by TypeScript: `Record<SupportedLocale, Dictionary>`.
- **Keys Defined (27 total)**:
  - Intents: `intent.eat`, `intent.go`, `intent.now`, `intent.stay`
  - Helpers: `intent.eat.helper`, `intent.go.helper`, `intent.now.helper`, `intent.stay.helper`
  - Actions: `action.maps`, `action.changeSelection`, `action.explore`, `action.selected`
  - Hero: `hero.description`, `hero.imageAlt`
  - Preferences: `preference.prompt`, `preference.companionPrompt`
  - Results counts: `results.title`, `results.region`, `results.zero`, `results.one`, `results.two`
  - Empty states: `empty.title`, `empty.message`
  - Itinerary: `itinerary.sample`
  - Shell / Accessibility: `intent.region`, `language.label`, `language.auto`
- **Function**:
  - `translate(locale: SupportedLocale, key: MessageKey): string`: typed synchronous dictionary lookup.

### 2.2 Current Runtime Usage in Application
A search across all source files in `src/` shows:
- **`src/lib/data/discovery-contract.ts`**: Imports `DEFAULT_LOCALE`, `SUPPORTED_LOCALES`, and `SupportedLocale`.
- **Zero Frontend Components** currently import or use `locales.ts`, `messages.ts`, `translate()`, or `resolveLocale()`.
- **`navigator.language` / `navigator.languages`**: Zero references in the active codebase.
- **`document.documentElement.lang`**: Zero dynamic manipulation. `src/app/layout.tsx` hardcodes static `<html lang="vi">`.

### 2.3 Current Test Coverage
`tests/i18n.test.ts` contains 22 passing tests covering:
- BCP-47 tag normalization (`vi-VN` -> `vi`, `en-US` -> `en`, `ko-KR` -> `ko`, etc.).
- Malformed and unsupported tag rejection.
- Manual preference precedence over browser language.
- Ordered preference scanning (`["fr-FR", "ko-KR", "en-US"]` -> `ko`).
- Corrupt storage value recovery.
- Reversion to automatic mode when manual is cleared.
- Defaulting to Vietnamese when inputs are missing.
- Dictionary parity across `vi`, `en`, `ko`.

---

## 3. Database Translation Audit (Neon PostgreSQL)

Direct SELECT-only inspection of the live Neon database (`neondb`) reveals the following data coverage:

### 3.1 `place_translations` Table Coverage

| Metric | Vietnamese (`vi`) | English (`en`) | Korean (`ko`) | Total |
| :--- | :--- | :--- | :--- | :--- |
| **Total Places** | 500 | 500 | 500 | **500** |
| **Translation Rows** | 500 | 500 | 500 | **1,500** |
| **Coverage (%)** | **100%** | **100%** | **100%** | **100%** |
| **Non-Null `display_name`** | 500 (100%) | 500 (100%) | 500 (100%) | 1,500 (100%) |
| **Non-Null `primary_type_label`** | 500 (100%) | 500 (100%) | 500 (100%) | 1,500 (100%) |
| **Non-Null `short_description`** | 0 (0%) | 0 (0%) | 0 (0%) | 0 (0%) |

#### Critical Finding on Place Names:
In `place_translations`, the `display_name` values for `en` and `ko` are **identical to the source Vietnamese proper names**.
- Example (Place ID 1):
  - `vi`: Name = `"Nhà hàng Nhà Gỗ Việt Đà Nẵng"`, Type = `"Nhà hàng hải sản"`
  - `en`: Name = `"Nhà hàng Nhà Gỗ Việt Đà Nẵng"`, Type = `"Seafood restaurant"`
  - `ko`: Name = `"Nhà hàng Nhà Gỗ Việt Đà Nẵng"`, Type = `"해산물 레스토랑"`
- Example (Place ID 43):
  - `vi`: Name = `"Bếp Cuốn Đà Nẵng"`, Type = `"Nhà hàng Việt Nam"`
  - `en`: Name = `"Bếp Cuốn Đà Nẵng"`, Type = `"Vietnamese restaurant"`
  - `ko`: Name = `"Bếp Cuốn Đà Nẵng"`, Type = `"베트남 음식점"`

*Rationale:* This aligns strictly with [NON_NEGOTIABLES.md](docs/NON_NEGOTIABLES.md): *"Do not invent translated venue names."* Local venue proper names in Da Nang are authentic geographical and commercial entities. However, their **`primary_type_label`** is cleanly translated into English and Korean.

### 3.2 `tag_translations` Table Coverage

| Metric | Vietnamese (`vi`) | English (`en`) | Korean (`ko`) | Total |
| :--- | :--- | :--- | :--- | :--- |
| **Total Tags** | 36 | 36 | 36 | **36** |
| **Translation Rows** | 36 | 36 | 36 | **108** |
| **Coverage (%)** | **100%** | **100%** | **100%** | **100%** |
| **Non-Null `label`** | 36 (100%) | 36 (100%) | 36 (100%) | 108 (100%) |

#### Sample Tag Translations Across Languages:
- `PHOTO`: `vi`: "Chụp ảnh đẹp" | `en`: "Photo spot" | `ko`: "사진 명소"
- `NATURE`: `vi`: "Thiên nhiên" | `en`: "Nature" | `ko`: "자연"
- `SPECIALTY`: `vi`: "Đặc sản" | `en`: "Specialty" | `ko`: "특산물"
- `NEAR_BEACH`: `vi`: "Gần biển" | `en`: "Near the beach" | `ko`: "해변 근처"
- `DATE`: `vi`: "Hẹn hò" | `en`: "Romantic" | `ko`: "데이트"
- `QUIET`: `vi`: "Yên tĩnh" | `en`: "Quiet" | `ko`: "조용한"
- `CENTRAL`: `vi`: "Trung tâm" | `en`: "Central" | `ko`: "도심"

---

## 4. Discovery API Locale Support Audit

### 4.1 Route & Parameter Contract
- **Endpoint**: `GET /api/discovery`
- **Query Parameter**: `locale`
  - Optional query parameter.
  - Accepted values: `"vi"`, `"en"`, `"ko"` (defined in `DISCOVERY_LOCALES`).
  - Default value: `"vi"` (defined in `DISCOVERY_DEFAULT_LOCALE`).
  - Invalid locale behavior: returns HTTP 400 `INVALID_PARAMETER` with `{ field: "locale", message: "Unsupported locale. Allowed: vi|en|ko." }`.

### 4.2 SQL Joining & Repository Translation Selection
In `src/lib/data/place-repository.ts` (`DISCOVERY_SQL` and `NEARBY_CANDIDATES_SQL`):
```sql
LEFT JOIN place_translations req
  ON req.place_id = p.id AND req.locale = $2
LEFT JOIN place_translations fb
  ON fb.place_id = p.id AND fb.locale = 'vi'
LEFT JOIN tag_translations tt_req
  ON tt_req.tag_id = t.id AND tt_req.locale = $2
LEFT JOIN tag_translations tt_fb
  ON tt_fb.tag_id = t.id AND tt_fb.locale = 'vi'
```
Where `$2` is the requested `locale` parameter.

### 4.3 Adapter Mapping & Fallback Behavior
In `src/lib/data/place-adapter.ts`:
- **Place Name**: `req.display_name ?? fb.display_name ?? p.name`
- **Primary Type Label**: `req.primary_type_label ?? fb.primary_type_label ?? p.primary_type`
- **Short Description**: `req.short_description ?? fb.short_description ?? p.description`
- **Tags**: `tt_req.label ?? tt_fb.label ?? t.display_name`
- **`translationFallback` Flag**: set to `true` if `req.display_name` is null.

### 4.4 Current Frontend Disconnect
In `src/components/results/DiscoveryResults.tsx`:
- Line 104: `const params = new URLSearchParams({ intent, locale: "vi", preference });`
- Line 116: `body.data.locale !== "vi"`
The frontend currently hardcodes `locale: "vi"`, bypassing the multilingual API capability.

---

## 5. Comprehensive Frontend Hardcoded Strings Inventory

An audit of all UI components reveals 45+ user-facing strings currently hardcoded in Vietnamese:

| Category | File | Hardcoded Vietnamese String | Needs Translation | Proposed Key / Source |
| :--- | :--- | :--- | :---: | :--- |
| **GLOBAL / SHELL** | `src/app/layout.tsx` | `<html lang="vi">` | YES | Dynamic attribute via state |
| **GLOBAL / SHELL** | `src/app/page.tsx` | `"LA CÀ ĐÀ NẴNG"` | NO | Brand Identity (Keep unchanged) |
| **HERO** | `Hero.tsx` | `"Tìm chỗ ăn, chơi và nghỉ ở Đà Nẵng."` | YES | `hero.description` (exists) |
| **HERO** | `Hero.tsx` | `"Toàn cảnh thành phố và biển Đà Nẵng"` | YES | `hero.imageAlt` (exists) |
| **HERO** | `Hero.tsx` | `"Khám phá ngay"` | YES | `action.explore` (exists) |
| **HERO** | `Hero.tsx` | `"Đà Nẵng"` | NO | Proper geographical noun |
| **INTENTS** | `demo-places.ts` | `"BÂY GIỜ LÀM GÌ?"` | YES | `intent.now` (exists) |
| **INTENTS** | `demo-places.ts` | `"ĂN GÌ?"` | YES | `intent.eat` (exists) |
| **INTENTS** | `demo-places.ts` | `"ĐI ĐÂU?"` | YES | `intent.go` (exists) |
| **INTENTS** | `demo-places.ts` | `"Ở ĐÂU?"` | YES | `intent.stay` (exists) |
| **INTENTS** | `demo-places.ts` | `"Lịch trình mẫu nhanh"` | YES | `intent.now.helper` (exists) |
| **INTENTS** | `demo-places.ts` | `"Quán ăn & cafe"` | YES | `intent.eat.helper` (exists) |
| **INTENTS** | `demo-places.ts` | `"Điểm đến & trải nghiệm"` | YES | `intent.go.helper` (exists) |
| **INTENTS** | `demo-places.ts` | `"Tìm chỗ nghỉ"` | YES | `intent.stay.helper` (exists) |
| **INTENTS** | `demo-places.ts` | `"Gợi ý tức thì"`, `"Ẩm thực"`, `"Khám phá"`, `"Lưu trú"` | YES | New keys `intent.*.badge` |
| **PREFERENCES** | `PreferencePanel.tsx` | `"Bạn muốn tìm chỗ thế nào?"` | YES | `preference.prompt` (exists) |
| **PREFERENCES** | `PreferencePanel.tsx` | `"Đi cùng ai:"` | YES | `preference.companionPrompt` (exists) |
| **PREFERENCES** | `demo-places.ts` | EAT: `"Ăn ngon"`, `"Đặc sản"`, `"Hẹn hò"` | YES | Tag / Preference translation |
| **PREFERENCES** | `demo-places.ts` | GO: `"Biển / ngắm cảnh"`, `"Chụp ảnh đẹp"`, `"Thiên nhiên"`, `"Vui chơi"` | YES | Tag / Preference translation |
| **PREFERENCES** | `demo-places.ts` | STAY: `"Gần biển"`, `"Yên tĩnh"`, `"Trung tâm"`, `"Hẹn hò"` | YES | Tag / Preference translation |
| **PREFERENCES** | `demo-places.ts` | NOW: `"Đi cùng người yêu"`, `"Đi cùng bạn bè"` | YES | Preference translation |
| **RESULTS** | `ResultList.tsx` | `"Gợi ý địa điểm"` | YES | `results.title` (exists) |
| **RESULTS** | `ResultList.tsx` | `"Chưa có gợi ý cho lựa chọn này."` | YES | `results.zero` (exists) |
| **RESULTS** | `ResultList.tsx` | `"Có 1 gợi ý cho lựa chọn này."` | YES | `results.one` (exists) |
| **RESULTS** | `ResultList.tsx` | `"Có 2 gợi ý cho lựa chọn này."` | YES | `results.two` (exists) |
| **RESULTS** | `ResultList.tsx` | `"Có 3 gợi ý cho lựa chọn này."` | YES | New key `results.three` / template |
| **RESULTS** | `ResultList.tsx` | `"Có {count} gợi ý gần bạn (trong bán kính {radiusKm} km)."` | YES | New key `results.nearbyCount` |
| **RESULTS** | `ResultList.tsx` | `"Không tìm thấy gợi ý gần bạn trong 5 km."` | YES | New key `results.nearbyZero` |
| **GPS WARNINGS** | `ResultList.tsx` | `"Vị trí chưa đủ chính xác để tìm địa điểm gần bạn. Đang hiển thị gợi ý toàn thành phố."` | YES | New key `gps.warning.inaccurate` |
| **GPS WARNINGS** | `ResultList.tsx` | `"Bạn đã từ chối quyền vị trí. Đang hiển thị gợi ý toàn thành phố."` | YES | New key `gps.warning.denied` |
| **GPS WARNINGS** | `ResultList.tsx` | `"Không nhận được phản hồi vị trí kịp thời. Đang hiển thị gợi ý toàn thành phố."` | YES | New key `gps.warning.timeout` |
| **GPS WARNINGS** | `ResultList.tsx` | `"Thiết bị không thể xác định vị trí hiện tại. Đang hiển thị gợi ý toàn thành phố."` | YES | New key `gps.warning.unavailable` |
| **ERROR STATES** | `ResultList.tsx` | `"Chưa tải được địa điểm."` | YES | New key `results.error.title` |
| **ERROR STATES** | `ResultList.tsx` | `"Hãy thử lại hoặc đổi lựa chọn."` | YES | New key `results.error.message` |
| **EMPTY NEARBY** | `ResultList.tsx` | `"Không tìm thấy địa điểm phù hợp trong 5 km."` | YES | New key `nearby.empty.title` |
| **EMPTY NEARBY** | `ResultList.tsx` | `"Hãy thử mở rộng tìm kiếm trên toàn thành phố hoặc đổi lựa chọn khác."` | YES | New key `nearby.empty.message` |
| **BOTTOM ACTION BAR** | `BottomActionBar.tsx` | `"Gần tôi"` | YES | New key `action.nearby` |
| **BOTTOM ACTION BAR** | `BottomActionBar.tsx` | `"Toàn Đà Nẵng"` | YES | New key `action.citywide` |
| **BOTTOM ACTION BAR** | `BottomActionBar.tsx` | `"Thử lại"` | YES | New key `action.retry` |
| **BOTTOM ACTION BAR** | `BottomActionBar.tsx` | `"Xem toàn Đà Nẵng"` | YES | New key `action.viewCitywide` |
| **BOTTOM ACTION BAR** | `BottomActionBar.tsx` | `"Đang định vị…"` | YES | New key `action.locating` |
| **BOTTOM ACTION BAR** | `BottomActionBar.tsx` | `"Đổi lựa chọn"` | YES | `action.changeSelection` (exists) |
| **PLACE CARD** | `PlaceCard.tsx` | `"Xem trên Google Maps"` | YES | `action.maps` (exists) |
| **PLACE CARD** | `PlaceCard.tsx` | `"Điểm Google: {rating}/5"` | YES | New key `card.rating` |
| **PLACE CARD** | `PlaceCard.tsx` | `"{count} đánh giá"` | YES | New key `card.reviews` |
| **PLACE CARD** | `PlaceCard.tsx` | `"{distance} km"` | PARTIAL | `km` metric symbol stays universal; number formatting depends on locale |
| **NOW TIMELINE** | `ItineraryTimeline.tsx`| `"Lịch trình mẫu"` | YES | `itinerary.sample` (exists) |
| **NOW TIMELINE** | `ItineraryTimeline.tsx`| `"Đổi lựa chọn"` | YES | `action.changeSelection` (exists) |

---

## 6. Proposed Locale Contract & Fallback Architecture

### 6.1 Supported Locales
- `vi`: Vietnamese (Tiếng Việt) — Canonical default.
- `en`: English (English).
- `ko`: Korean (한국어).

### 6.2 Normalization & Mapping Rules
The locale parser in `src/lib/i18n/locales.ts` uses `Intl.getCanonicalLocales` to extract the primary language subtag:
- `vi-VN`, `vi` $\rightarrow$ `vi`
- `en-US`, `en-GB`, `en-AU`, `en` $\rightarrow$ `en`
- `ko-KR`, `ko` $\rightarrow$ `ko`
- Unsupported languages (e.g. `ja-JP`, `zh-CN`, `fr-FR`, `de-DE`) $\rightarrow$ fallback to `vi`.

---

## 7. Auto Language Behavior & State Precedence

### 7.1 Precedence Chain
```text
[1] User Manual Choice (localStorage 'laca.ui-locale.v1')
       ↓ (if not set or corrupt)
[2] Browser Language List (navigator.languages)
       ↓ (first matching supported locale)
[3] Single Browser Language (navigator.language)
       ↓ (if supported)
[4] Default Fallback ('vi')
```

### 7.2 Storage Persistence Policy
- **Key**: `laca.ui-locale.v1` stored in `window.localStorage`.
- **Value**: Exact string `"vi" | "en" | "ko"`.
- **Reset to Auto**: When user selects "Theo thiết bị" (Auto), key is removed via `localStorage.removeItem(LOCALE_STORAGE_KEY)`.
- **Storage Resilience**: If `localStorage` access is blocked (e.g. Safari private browsing, restricted iframe), wrap in `try/catch` and gracefully retain user selection in React in-memory state.

### 7.3 SSR & Hydration Mismatch Safety
- **Risk**: Next.js server does not have access to client `navigator.languages` or `localStorage` during initial server render. Rendering English on server while client renders Vietnamese causes fatal React hydration mismatch errors.
- **Solution**:
  1. Server always renders initial HTML in default `vi` (`<html lang="vi">`).
  2. A lightweight client-side `LocaleProvider` initializes with `vi` and resolves browser/stored preference in a `useEffect` hook immediately following client hydration.
  3. Locale switch dynamically updates React state and document language.
  4. Zero hydration warnings, zero flash of unstyled content.

---

## 8. HTML `lang` Attribute Policy

- **Current State**: Static `<html lang="vi">` in `src/app/layout.tsx`.
- **Proposed Runtime Mechanism**:
  Inside the client locale context/hook, synchronize the root HTML tag:
  ```typescript
  useEffect(() => {
    document.documentElement.lang = currentLocale;
  }, [currentLocale]);
  ```
- **Accessibility & SEO**: Screen readers and translation tools receive real-time updates of the active document language.

---

## 9. Manual Language Switcher UX Audit & Placement (Updated in M7-A.1)

### 9.1 Placement Ergonomics & Contract Lock
- **Revision to initial M7-A suggestion**: Placing language controls in the top header/utility bar forces users to reach into the Hard Reach Zone ($y < 100\text{px}$) with one hand. Language switching is a secondary setting and must be designed for mobile one-hand ergonomics.
- **BottomActionBar Protection Rule**: The language switcher MUST NOT be placed inside the discovery `BottomActionBar` (`BottomActionBar` is strictly dedicated to primary discovery actions: `Nearby / Citywide / Retry / Change selection`).
- **Locked UX Pattern for M7-B**:
  - Home features a dedicated secondary "Ngôn ngữ / Language" trigger button situated in the easily reachable thumb zone below the primary intent content.
  - Tapping this trigger opens a compact one-hand friendly bottom sheet or selector modal presenting:
    ```text
    [ VI - Tiếng Việt ]
    [ EN - English ]
    [ KO - 한국어 ]
    [ Theo thiết bị / Device Language ]
    ```
  - All touch targets must be $\ge 44\text{px}$ with adequate vertical spacing.
  - Avoids cluttering Home with 4 permanent large buttons while guaranteeing 100% one-thumb reachability.

---

## 10. Translation Source of Truth Boundary

| Content Type | Source of Truth | Mechanism |
| :--- | :--- | :--- |
| **Venue Proper Names** | Neon `place_translations.display_name` | API `GET /api/discovery?locale=...` (Preserves authentic Da Nang names; no fake English/Korean names). |
| **Venue Primary Types** | Neon `place_translations.primary_type_label` | Translated in database (`"Nhà hàng hải sản"`, `"Seafood restaurant"`, `"해산물 레스토랑"`). |
| **Curated Tags** | Neon `tag_translations.label` | Translated in database (`"Đặc sản"`, `"Specialty"`, `"특산물"`). |
| **Application Chrome & Shell** | Frontend Dictionary (`src/lib/i18n/messages.ts`) | Synchronous `translate(locale, key)` lookup for buttons, headers, warnings, prompts. |

---

## 11. Missing Translation Fallback Policy

1. **Database Fallback (Deterministic)**:
   - If requested locale row is missing in Neon: fall back to `vi` row.
   - If `vi` row is missing: fall back to source canonical `places.name`.
   - Never display empty strings or `undefined`.
   - Never invoke external translation APIs at runtime.
2. **UI Dictionary Fallback**:
   - TypeScript guarantees 100% dictionary key parity at compile time via `Record<SupportedLocale, Dictionary>`.
   - In event of runtime missing key: fall back to Vietnamese string dictionary.

---

## 12. Nearby Discovery & i18n Interaction

1. **Distance Metric (`km`)**:
   - `km` is the international standard symbol for kilometer and remains `"km"` across VI, EN, and KO.
2. **Number Formatting**:
   - Use `new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 })`.
   - Vietnamese (`vi`): `"0,8 km"` (comma decimal separator).
   - English (`en`): `"0.8 km"` (period decimal separator).
   - Korean (`ko`): `"0.8 km"` (period decimal separator).
3. **Nearby Result Banners**:
   - `vi`: `"Có {count} gợi ý gần bạn (trong bán kính {radiusKm} km)."`
   - `en`: `"{count} suggestion(s) near you (within {radiusKm} km)."`
   - `ko`: `"내 주변 {radiusKm}km 이내 추천 장소 {count}곳"`
4. **GPS Error Banners**:
   - Localized messages for `INACCURATE`, `DENIED`, `TIMEOUT`, and `UNAVAILABLE`.

---

## 13. Mobile One-Hand & Product Regression Contracts

### 13.1 One-Hand UX Regression Contract for M7-B
- `BottomActionBar` remains fixed at `fixed bottom-0` with `pb-[calc(7rem+env(safe-area-inset-bottom,0px))]`.
- Intent card positions permanently maintain DOM and visual order (`[NOW, EAT, GO, STAY]`).
- PreferencePanel in-place accordion expansion remains completely intact.
- Language switcher touch targets must be $\ge 44\text{px}$.
- Switching languages MUST NOT cause layout jump, scroll jump, or unmount discovery state.

### 13.2 Product Regression Contract for M7-B
- EAT, GO, STAY connect to live Neon discovery.
- Nearby radius expansion (1 $\rightarrow$ 3 $\rightarrow$ 5 km) remains strictly intact.
- GPS accuracy threshold ($\le 1000\text{m}$) remains active.
- 0–3 truthful results, zero fake padding, exact Google Maps URLs, zero venue images.
- CAFE remains inactive (HTTP 400 `INTENT_NOT_AVAILABLE`).
- NOW remains sample timeline.

---

## 14. Comprehensive Test Plan for M7-B

### Unit & Contract Tests
1. **Locale Resolver Tests (`tests/i18n.test.ts`)**:
   - Test `resolveLocale` with Vietnamese browser (`vi`, `vi-VN`).
   - Test `resolveLocale` with English browser (`en`, `en-US`, `en-GB`).
   - Test `resolveLocale` with Korean browser (`ko`, `ko-KR`).
   - Test fallback to `vi` for unsupported languages (`ja-JP`, `fr-FR`).
   - Test manual preference override (`manual: "en"` overrides Korean browser).
   - Test localStorage read/write resilience.
2. **Dictionary Parity Tests**:
   - Verify every key exists and has non-empty text in `vi`, `en`, and `ko`.
3. **API Integration Tests (`tests/api-discovery.test.ts`)**:
   - `GET /api/discovery?intent=eat&preference=an_ngon&locale=vi` returns Vietnamese types & tags.
   - `GET /api/discovery?intent=eat&preference=an_ngon&locale=en` returns English types & tags.
   - `GET /api/discovery?intent=eat&preference=an_ngon&locale=ko` returns Korean types & tags.
   - Invalid locale returns 400 `INVALID_PARAMETER`.

### Frontend Component & Integration Tests
1. **Language Switcher Component**:
   - Renders 3 buttons (VI, EN, KO) with $\ge 44\text{px}$ touch targets.
   - Clicking switches active locale and persists to `localStorage`.
   - `document.documentElement.lang` updates.
2. **Discovery Re-fetch on Locale Change**:
   - Changing locale triggers API re-query with new `locale` while preserving active `intent` and `preference`.
3. **One-Hand Ergonomics Preservation**:
   - Verify `BottomActionBar` buttons render localized text without clipping or overflow.
   - Verify layout height and clearance remain intact across viewports.

---

## 15. Browser Visual Audit & String Expansion Risks

### 15.1 Text Length Comparison Across Viewports (320px, 390px, 393px, 430px)

| Element / Button | Vietnamese (`vi`) | English (`en`) | Korean (`ko`) | Expansion Risk |
| :--- | :--- | :--- | :--- | :--- |
| **Nearby CTA** | `"Gần tôi"` (7 chars) | `"Near me"` (7 chars) | `"내 주변"` (5 chars) | LOW |
| **Citywide CTA** | `"Toàn Đà Nẵng"` (13 chars) | `"All Da Nang"` (11 chars) | `"다낭 전체"` (6 chars) | LOW |
| **Change Selection** | `"Đổi lựa chọn"` (12 chars) | `"Change selection"` (16 chars) | `"선택 변경"` (5 chars) | **MEDIUM** at 320px in English |
| **View Citywide CTA**| `"Xem toàn Đà Nẵng"` (17 chars) | `"View all Da Nang"` (16 chars) | `"다낭 전체 보기"` (8 chars) | **HIGH** at 320px in BottomActionBar |
| **Google Maps CTA** | `"Xem trên Google Maps"` (21 chars) | `"View on Google Maps"` (19 chars) | `"Google 지도에서 보기"` (14 chars) | LOW |
| **Empty 5km Message**| `"Không tìm thấy địa điểm phù hợp trong 5 km."` (46 chars) | `"No matching places found within 5 km."` (38 chars) | `"5km 이내에 일치하는 장소가 없습니다."` (22 chars) | LOW (wraps naturally) |

### 15.2 Critical Risk Areas Identified
1. **`BottomActionBar` at 320px viewport**:
   - When button states show `"Xem toàn Đà Nẵng"` and `"Đổi lựa chọn"`, in English this becomes `"View all Da Nang"` + `"Change selection"`.
   - On a 320px device (with 16px horizontal padding = 288px usable width), two buttons side by side might wrap or squeeze text.
   - *Mitigation for M7-B*: ensure `BottomActionBar` flex container uses `flex-1 min-w-0`, `text-center`, `truncate`, or responsive font sizing `text-xs sm:text-sm` so text remains legible and buttons never exceed viewport bounds.
2. **Preference Chips in `PreferencePanel`**:
   - Chip labels in English like `"Beach / Scenic"` or Korean `"해변 / 전망"` are slightly different in width.
   - The flex-wrap layout in `PreferencePanel` handles variable chip widths gracefully.

---

## 16. Audit Conclusion & Next Steps

Milestone **M7-A** confirms that the repository is **technically and architecturally ready** for runtime multilingual integration:
- Database translation tables are 100% complete across 500 places and 36 tags.
- Discovery API already supports `locale` parameter with dual-table joins.
- Standalone BCP-47 resolver and core UI dictionary exist with 22 passing tests.
- High-risk areas (one-hand bottom zone, SSR hydration, 320px text expansion) have clear, locked mitigation strategies.

**RECOMMENDED M7-B IMPLEMENTATION SCOPE:**
1. Expand `src/lib/i18n/messages.ts` with newly inventoried UI keys (GPS banners, BottomActionBar, error messages, card metrics).
2. Create client-side `LocaleProvider.tsx` and `LanguageSwitcher.tsx` placed in the top utility area.
3. Wire `DiscoveryResults.tsx` to pass the active locale into `/api/discovery`.
4. Connect dynamic `<html lang="...">` synchronization.
5. Add unit and visual tests for VI/EN/KO across 320–768px viewports.

**STOP HERE. AWAIT USER AUTHORIZATION BEFORE M7-B IMPLEMENTATION.**
---

## 17. M7-A.1 Locked Runtime & UX Contract (Decisions 1–12)

The following 12 contract decisions are formally locked for Milestone **M7-B**:

1. **Locale Precedence:** `explicit manual locale > navigator.languages > navigator.language > vi`. Supported: `vi`, `en`, `ko`. Mapping: `vi-* -> vi`, `en-* -> en`, `ko-* -> ko`, unsupported -> `vi`.
2. **Persistence:** `localStorage` key `laca.ui-locale.v1` (`vi | en | ko`). Auto mode removes key. Wrapped in `try/catch` with memory fallback. No DB/cookie persistence in M7-B.
3. **Language Switcher UX:** Not in top header. Secondary setting situated in reachable zone below main Home content, opening bottom sheet / compact selector (`VI / EN / 한국어 / Theo thiết bị`). Never inside discovery `BottomActionBar`. Touch target $\ge 44\text{px}$.
4. **State Preservation on Switch:** Preserves `selectedIntent`, `selectedPreference`, nearby/citywide mode, in-memory GPS coordinates, and scroll position. Re-fetches `/api/discovery?...&locale=<newLocale>`. No mock fallback.
5. **Layout Stability Definition:** No unrealistic "0px layout shift" claim. Contract enforces: no intent reordering, no state reset, no forced scroll jumps, `BottomActionBar` fixed, no horizontal overflow, no clipping, no inaccessible actions. Natural vertical reflow permitted.
6. **Hydration & Initial Locale:** Server renders base `vi`. Client resolves browser/manual choice in `useEffect`. Zero hydration warnings, zero broken intermediate UI. Initial brief VI -> EN/KO first load switch is acknowledged MVP behavior (not claimed as zero-flash). No full-page blocking loaders.
7. **HTML lang Synchronization:** Base `<html lang="vi">`. Updated via `document.documentElement.lang = activeLocale` on client resolution and manual switch.
8. **Translation Boundary:** Venue/tag content from Neon DB translations. UI chrome/labels from frontend typed dictionary (`messages.ts`). No invented venue names.
9. **Database Fallback:** Deterministic chain: `requested locale -> vi translation -> raw/source`. No empty/undefined strings.
10. **Formatting:** `Intl.NumberFormat(activeLocale)` for metrics without changing raw numeric values (e.g. `vi: 0,8 km`, `en: 0.8 km`, `ko: 0.8 km`).
11. **NOW Scope:** Chrome/labels localized if shared in UI dictionary. Business logic and timeline data remain static sample.
12. **Acceptance Testing:** Visual checks on `320px`, `390px`, `430px` for `vi`, `en`, `ko`. Truncation that destroys actionable meaning is prohibited.
