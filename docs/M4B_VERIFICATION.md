# M4-B — GO & STAY Real Discovery Verification

Verified: 2026-10-07.
Parent commit: `e39c7de65fc413f6561e0069642ba58f6bb95f0e`, branch: `phase-2a-deploy`.
Scope: Connect GO and STAY flows to Neon discovery API; generalize discovery results component; update STAY preference labels; preserve EAT Neon flow; keep CAFE disabled. No UI redesign, no package upgrades, no database schema/data writes, no push/deploy.

---

## 1. Audit and Implementation Summary

### Preference Mappings (Neon Stored Tags)
Based on the live database audit documented in `docs/M4A_REAL_MAPPING_AUDIT.md`:
- **GO mappings** (`src/lib/data/preference-map.ts`):
  - `chup_anh_dep` → `PHOTO` (16 eligible places in Neon)
  - `thien_nhien` → `NATURE` (26 eligible places in Neon)
  - `vui_choi` → `ENTERTAINMENT` (8 eligible places in Neon)
  - `bien_ngam_canh` → `BEACH` OR `SCENIC` (3 BEACH, 19 SCENIC, 2 overlapping, 20 distinct eligible places in Neon)
- **STAY mappings** (`src/lib/data/preference-map.ts`):
  - `gan_bien` → `NEAR_BEACH` (19 eligible places in Neon)
  - `yen_tinh` → `QUIET` (8 eligible places in Neon)
  - `gan_trung_tam` → `CENTRAL` (16 eligible places in Neon) — preference ID preserved; UI label updated to "Trung tâm"
  - `cap_doi` → `DATE` (10 eligible places in Neon) — preference ID preserved; UI label updated to "Hẹn hò"
- **CAFE**: Remains disabled. Requests return HTTP 400 `INTENT_NOT_AVAILABLE`. No UI chips added.
- **EAT**: Preserved without modification (`an_ngon` → general, `dac_san` → `SPECIALTY`, `hen_ho` → `DATE`).

### Component Generalization
- Replaced `EatDiscoveryResults.tsx` with generalized `DiscoveryResults.tsx`:
  - Accepts `intent: "EAT" | "GO" | "STAY"`, `preference`, `intentLabel`, `preferenceLabel`, `onResetPreference`.
  - Maintains complete lifecycle: `idle`, `loading`, `success`, `empty`, `error`.
  - Enforces `15s` timeout with `AbortController`.
  - Keyed mounting (`${selectedIntent}:${selectedPreference}`) and active request guards prevent stale or crossed responses.
  - On network/API errors, presents retry state with "Thử lại"; **never falls back to demo data**.
- Updated `src/app/page.tsx`:
  - Unified `(selectedIntent === "EAT" || selectedIntent === "GO" || selectedIntent === "STAY")` to mount `<DiscoveryResults />`.
  - Removed demo fallback `currentPlaces` and `getPlacesForSelection` for GO and STAY.
- Updated `src/data/demo-places.ts`:
  - STAY chips updated: `gan_trung_tam` label is "Trung tâm", `cap_doi` label is "Hẹn hò".
- Updated `src/lib/data/discovery-contract.ts`:
  - `ENABLED_DISCOVERY_SECTIONS: readonly DiscoverySection[] = ["EAT", "GO", "STAY"]`.

---

## 2. Automated Validation Evidence

### Lint
- Command: `npm run lint`
- Result: **PASS** (0 errors, 0 warnings).

### Typecheck
- Command: `npm run typecheck` (`tsc --noEmit`)
- Result: **PASS** (exit code 0).

### Test Suite
- Command: `npm test` (`vitest run`)
- Result: **169 / 169 PASS** across 9 test files:
  - `tests/eat-discovery.test.ts` (48 tests) — PASS
  - `tests/eat-frontend.test.tsx` (18 tests) — PASS
  - `tests/go-stay-discovery.test.ts` (7 tests) — PASS
  - `tests/go-stay-frontend.test.tsx` (21 tests) — PASS
  - `tests/prototype.test.tsx` — PASS
  - All existing geo/i18n and curation regression tests — PASS

### Production Build
- Command: `npm run build` (`next build`)
- Result: **PASS** (Compiled in 6.9s, route `/` 14.8 kB, First Load JS 118 kB, Edge runtime `/api/discovery` dynamic).

---

## 3. Live Database Smoke & E2E Evidence

Smoke test run against live Neon database (`neondb` on Singapore region) via local server `http://127.0.0.1:3103`:
1. **8 GO & STAY Live Flows**:
   - `GET /api/discovery?intent=GO&locale=vi&preference=chup_anh_dep` → HTTP 200, 3 places, matches Neon `PHOTO`.
   - `GET /api/discovery?intent=GO&locale=vi&preference=thien_nhien` → HTTP 200, 3 places, matches Neon `NATURE`.
   - `GET /api/discovery?intent=GO&locale=vi&preference=vui_choi` → HTTP 200, 3 places, matches Neon `ENTERTAINMENT`.
   - `GET /api/discovery?intent=GO&locale=vi&preference=bien_ngam_canh` → HTTP 200, 3 places, matches Neon `BEACH | SCENIC` union (20 eligible).
   - `GET /api/discovery?intent=STAY&locale=vi&preference=gan_bien` → HTTP 200, 3 places, matches Neon `NEAR_BEACH`.
   - `GET /api/discovery?intent=STAY&locale=vi&preference=yen_tinh` → HTTP 200, 3 places, matches Neon `QUIET`.
   - `GET /api/discovery?intent=STAY&locale=vi&preference=gan_trung_tam` → HTTP 200, 3 places, matches Neon `CENTRAL`.
   - `GET /api/discovery?intent=STAY&locale=vi&preference=cap_doi` → HTTP 200, 3 places, matches Neon `DATE`.
2. **EAT Regression**:
   - `an_ngon` → HTTP 200, 3 places, matches Neon general.
   - `dac_san` → HTTP 200, 3 places, matches Neon `SPECIALTY`.
   - `hen_ho` → HTTP 200, 2 places, matches Neon `DATE` (truthful count preserved, no padding).
3. **Independent Neon Query Match**:
   - Every returned place ID, name, Google Maps URL, and tag set matched independent SELECT queries directly against Neon `places`, `place_tags`, `tags`, `place_translations`.
4. **Negative and Edge Cases**:
   - `GET /api/discovery?intent=CAFE` → HTTP 400 `INTENT_NOT_AVAILABLE`.
   - `GET /api/discovery?intent=GO&preference=family` → HTTP 400 `INVALID_PARAMETER`.
   - `GET /api/discovery?intent=STAY&preference=popular` → HTTP 400 `INVALID_PARAMETER`.
5. **Security**:
   - Zero credential or database URL leaks detected across 8 client output bundles.

---

## 4. Responsive & Visual Inspection

Verified via browser across viewports: 320px, 360px, 390px, 393px, 430px, 768px, 1280px:
- **Long venue names**:
  - Vietnamese: "Công viên Suối khoáng nóng Núi Thần Tài Đà Nẵng" wraps naturally across lines without ellipsis or clipping at 320px (`go_long_name_320.png`).
  - English: "Hacoconut Coconut Basket Boat Tour Hoi An Coconut Village" wraps cleanly at 320px, 390px, 393px (`go_long_english_390.png`).
- **Tags**: Wrap cleanly in pill format with readable contrast; no horizontal scrolling or container breakout.
- **CTAs**: "Xem trên Google Maps", "Đổi lựa chọn", "Thử lại" all satisfy `>= 44px` touch target requirement.
- **Labels**: "Trung tâm" and "Hẹn hò" rendered clearly in STAY chips and result header (`stay_labels_390.png`, `stay_central_393_verified.png`, `stay_date_320.png`).
- **No Images**: PlaceCard strictly text-first with 0 image tags or scrims rendered.

---

## 5. Scope Boundaries & Next Steps

- **Completed**: M4-B GO and STAY connected to live Neon discovery; EAT preserved; labels updated; regression verified.
- **Not Done / Protected Scope**:
  - CAFE: Untouched (requires UI design and product decision).
  - NOW: Remains curated itinerary sample.
  - GPS / Nearby / i18n runtime / Analytics runtime / Notifications / Cloudflare deploy: NOT STARTED.
