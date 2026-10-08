# M5-B Verification Report — Nearby Discovery Implementation
**Timestamp**: 2026-10-08T11:05:00+07:00
**Branch**: `phase-2a-deploy`
**Contract Baseline**: `8378b22e3b54ad243cd4c6fb8636a043f23062c9` (`docs: lock nearby discovery contract`)
**Scope Status**: IMPLEMENTATION & VERIFICATION COMPLETE (STOP FOR USER REVIEW)

---

## 1. Executive Summary
Milestone M5-B implements Nearby Discovery for EAT, GO, and STAY intents connected to live Neon PostgreSQL data, while preserving 100% of the citywide discovery experience when coordinates are not provided or geolocation is not granted/accurate.

Key achievements:
1. **API Location Contract**: `GET /api/discovery` accepts optional `lat` and `lng`. Both required together; single, non-numeric, or out-of-range values return HTTP 400 `INVALID_PARAMETER`. Omitting both maintains existing citywide query behavior. No coordinate echo in API response.
2. **Candidate Retrieval**: Bypasses pre-geo `LIMIT 3` in Neon repository for Nearby mode via `findNearbyCandidateRows()`, retrieving all active & operational section + tag candidates before distance processing.
3. **Pure Geo Engine (`nearby-engine.ts`)**:
   - Strict radius escalation: evaluates `<= 1.0 km` (if `>= 3` -> `R = 1`); else evaluates `<= 3.0 km` (if `>= 3` -> `R = 3`); else evaluates `<= 5.0 km` (`R = 5`). Never stops early at 3 km with < 3 results.
   - Full float precision for radius boundary comparison and sorting (`distanceRawKm`).
   - Locked ranking tie-breaking: `distanceRawKm ASC, featured DESC, review_count DESC NULLS LAST, rating DESC NULLS LAST, id ASC`.
   - Formats `distanceKm` to 1 decimal place only for final selected 0–3 places.
   - Deduplicates candidate IDs to prevent double counting or duplicate cards.
4. **Browser Geolocation UX**:
   - Geolocation is NEVER triggered on page load. User explicitly clicks "Gần tôi" (`min-h-[44px]`).
   - Accuracy guard: `coords.accuracy <= 1000m` enables Nearby; `> 1000m` withholds coordinates, falls back to citywide discovery, displays friendly explanation, and offers "Thử lại".
   - 8-second timeout guard with fallback to citywide and retry option.
   - Error states (`denied`, `unavailable`, `timeout`, `inaccurate`) fall back to citywide discovery gracefully without blocking the user.
   - Empty state within 5 km renders `"Không tìm thấy địa điểm phù hợp trong 5 km."` with CTA `"Xem trên toàn Đà Nẵng"` which re-runs discovery for the same intent & preference without coordinates.
5. **No Regressions**: EAT, GO, STAY citywide discovery remain 100% functional. CAFE remains inactive (HTTP 400). NOW remains sample itinerary. 0 venue images rendered.

---

## 2. File Changes & Architecture

### Modified Source Files:
- `src/lib/data/discovery-contract.ts`:
  - Added `DISCOVERY_NEARBY_RANKING_RULE = "nearby-provisional-v1"`.
  - Added `location: { lat: number; lng: number } | null` to `DiscoveryQuery`.
  - Added coupled lat/lng validation to `parseDiscoveryQuery` (rejects single parameter, out-of-range lat `[-90, 90]`, out-of-range lng `[-180, 180]`, duplicate params).
  - Added `distanceKm?: number; featured?: boolean;` to `DiscoveryPlace`.
  - Added `meta.radiusKm: 1 | 3 | 5` and `meta.nearby: boolean` to `DiscoveryMeta`.
- `src/lib/geo/nearby-engine.ts` (NEW):
  - Pure TypeScript evaluator `evaluateNearbyDiscovery(candidates, origin)` implementing exact 1 -> 3 -> 5 km escalation, tie-breaking, float precision, and candidate ID deduplication.
- `src/lib/data/place-repository.ts`:
  - Added `NEARBY_CANDIDATES_SQL` and `findNearbyCandidateRows()` retrieving all operational candidates matching section and tag filters without pre-geo `LIMIT 3`.
  - Added `r.featured` to outer SELECT of both queries.
- `src/lib/data/place-adapter.ts`:
  - Added `featured: Boolean(row.featured)` mapping.
- `src/app/api/discovery/route.ts`:
  - Added conditional routing: if `query.location !== null`, calls `findNearbyCandidateRows` + `evaluateNearbyDiscovery`; if `query.location === null`, keeps original `findDiscoveryRows` (`LIMIT 3`).
- `src/lib/data/place-card-model.ts`:
  - Added `distanceKm?: number | null;` to `PlaceCardModel` and mapped in `discoveryToCard`.
- `src/components/results/PlaceCard.tsx`:
  - Added distance badge (`place.distanceKm.toLocaleString("vi-VN", ...) km`) when present; omitted when null (citywide).
- `src/components/results/ResultList.tsx`:
  - Added Geolocation controls: "Gần tôi" toggle button (`min-h-[44px]`), status banners for `denied`, `unavailable`, `timeout`, `inaccurate` with retry action, and dedicated Nearby empty state (`"Không tìm thấy địa điểm phù hợp trong 5 km."` + CTA `"Xem trên toàn Đà Nẵng"`).
- `src/components/results/DiscoveryResults.tsx`:
  - Added geolocation state machine (`idle`, `requesting`, `granted`, `denied`, `unavailable`, `timeout`, `inaccurate`).
  - Added `requestLocation()` with 8s timer and `accuracy <= 1000m` guard.
  - Attached `lat` and `lng` query params to fetch request when `userCoords` is active.
  - Added `handleToggleNearby()`, `handleRetryNearby()`, and `handleResetNearby()`.

### Test Files Added:
- `tests/nearby.test.ts`:
  - 18 unit tests covering paired lat/lng validation, out-of-range lat/lng, radius escalation (1 -> 3 -> 5), float boundary precision (e.g., 1.04 km > 1.0 km), tie-breaking, truthful 0/1/2/3 counts, and candidate ID deduplication.
- `tests/nearby-frontend.test.tsx`:
  - 11 integration tests covering Geolocation UI lifecycle: button click, granted GPS with accuracy <= 1000m, inaccurate GPS > 1000m warning and citywide fallback, denied warning, timeout warning, empty 5 km state with CTA "Xem trên toàn Đà Nẵng", stale request protection, PlaceCard distance badge presence/absence, and GO/STAY nearby regression.

---

## 3. Validation Suite Results

### 3.1. Linting
```bash
npm run lint
```
**Result**: `✔ No ESLint warnings or errors` (0 warnings, 0 errors).

### 3.2. Typecheck
```bash
npm run typecheck
```
**Result**: `tsc --noEmit` exited with code 0 (0 type errors).

### 3.3. Test Suite (Non-mutating tests)
```bash
npx vitest run --exclude "**/curation.test.ts"
```
**Result**: **10 passed files (10), 183 passed tests (183), 0 failures**:
- `tests/nearby.test.ts`: 18/18 PASS
- `tests/nearby-frontend.test.tsx`: 11/11 PASS
- `tests/geo.test.ts`: 18/18 PASS
- `tests/discovery.test.ts`: 48/48 PASS
- `tests/eat-frontend.test.tsx`: 18/18 PASS
- `tests/go-stay-discovery.test.ts`: 15/15 PASS
- `tests/go-stay-frontend.test.tsx`: 21/21 PASS
- `tests/i18n.test.ts`: 22/22 PASS
- `tests/prototype.test.tsx`: 10/10 PASS
- `tests/shell.test.tsx`: 2/2 PASS

### 3.4. Production Build
```bash
npm run build
```
**Result**: Next.js 15.5.27 compiled successfully in 21.5s with zero route or build errors.
Routes compiled:
- `/` (Static)
- `/_not-found` (Static)
- `/api/discovery` (Dynamic, Edge)
- `/dev/design-system` (Static)

---

## 4. Live Verification Evidence against Neon PostgreSQL

Executed live HTTP queries against dev server (`http://localhost:3103`) backed by live Neon PostgreSQL database:

| Test Case | Request URL | HTTP Status | Count | Radius | Nearby Meta | Top Result |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1. Hải Châu: EAT an_ngon** | `/api/discovery?intent=EAT&preference=an_ngon&lat=16.068&lng=108.221&locale=vi` | 200 | 3 | 1 km | `true` | ID 1: Nhà hàng Nhà Gỗ Việt Đà Nẵng (0.2 km, rating 4.9, 6710 reviews) |
| **2. Hải Châu: EAT dac_san** | `/api/discovery?intent=EAT&preference=dac_san&lat=16.068&lng=108.221&locale=vi` | 200 | 1 | 5 km | `true` | ID 30: Bánh canh Bún chả cá Nhà Gấu (4.7 km, rating 4.7, 34 reviews) |
| **3. Hải Châu: GO thien_nhien** | `/api/discovery?intent=GO&preference=thien_nhien&lat=16.068&lng=108.221&locale=vi` | 200 | 0 | 5 km | `true` | `[]` (truthful 0 results, no fake padding) |
| **4. Hải Châu: STAY gan_trung_tam**| `/api/discovery?intent=STAY&preference=gan_trung_tam&lat=16.068&lng=108.221&locale=vi` | 200 | 3 | 1 km | `true` | ID 6: M Village Hotel Đà Nẵng Centre (0.4 km, rating 4.9, 1419 reviews) |
| **5. Mỹ Khê: STAY gan_bien** | `/api/discovery?intent=STAY&preference=gan_bien&lat=16.059&lng=108.243&locale=vi` | 200 | 3 | 3 km | `true` | ID 42: Sala Danang Beach Hotel (0.4 km, rating 4.7, 3751 reviews) |
| **6. Citywide EAT an_ngon** | `/api/discovery?intent=EAT&preference=an_ngon&locale=vi` | 200 | 3 | undefined | undefined | ID 33: Bếp Cuốn Đà Nẵng (no distance, citywide ranking) |
| **7. Missing `lng`** | `/api/discovery?intent=EAT&preference=an_ngon&lat=16.068&locale=vi` | 400 | - | - | - | `INVALID_PARAMETER` ("Both lat and lng must be provided together") |
| **8. CAFE inactive** | `/api/discovery?intent=CAFE&locale=vi` | 400 | - | - | - | `INTENT_NOT_AVAILABLE` ("Section CAFE is not yet available") |

### Independent SQL Verification
The live API outputs precisely match the independent candidate evaluations from the M5-A audit simulation:
- Hải Châu `EAT an_ngon`: >= 3 candidates within 1 km -> Selected Radius = 1 km, returned IDs [1, 2, 3].
- Hải Châu `EAT dac_san`: 0 candidates at 1 km, 0 candidates at 3 km, 1 candidate at 5 km -> Selected Radius = 5 km, returned ID [30].
- Hải Châu `GO thien_nhien`: 0 candidates within 5 km -> Selected Radius = 5 km, returned 0 results.
- Mỹ Khê `STAY gan_bien`: 2 candidates at 1 km, 3 candidates at 3 km -> Selected Radius = 3 km, returned IDs [42, 41, 43].

---

## 5. Responsive & Visual Verification

Automated browser subagent verified the UI across standard viewports:
- **320x640 (Narrow Mobile)**: Header and "Gần tôi" action button wrap cleanly without overflow. No horizontal scrollbar.
- **390x844 (Standard Mobile)**: "Gần tôi" button, status banners, distance badges (`0,8 km`), and cards render with high visual clarity. Primary touch targets satisfy `>=44px`.
- **430x932 (Large Mobile)**: Layout expands smoothly with consistent padding.
- **768x1024 (Tablet)**: Multi-column grid displays cleanly with correct alignment.

---

## 6. Non-Negotiables & Boundary Checklist

| Boundary / Requirement | Status | Evidence |
| :--- | :--- | :--- |
| **No GPS on page load** | PASS | User interaction required ("Gần tôi" click) |
| **Accuracy threshold <= 1000m** | PASS | Handled in `requestLocation()`; fallback to citywide with warning |
| **Radius expansion 1 -> 3 -> 5 km** | PASS | Strict escalation in `nearby-engine.ts`; tested in unit and live API |
| **No premature rounding** | PASS | Haversine raw distance used for all comparisons; 1-decimal display format |
| **Truthful 0–3 results (no fake padding)** | PASS | Returns exact matched count (0, 1, 2, or 3) |
| **No coordinate echo / privacy** | PASS | Coordinates never echoed in API response, DB, or storage |
| **No DB mutations** | PASS | Neon PostgreSQL schema and data completely untouched |
| **No new GIS packages** | PASS | Pure TS implementation reusing existing `src/lib/geo/distance.ts` |
| **CAFE remains inactive** | PASS | Returns HTTP 400 `INTENT_NOT_AVAILABLE` |
| **NOW remains sample** | PASS | Unchanged |
| **No venue images in MVP** | PASS | PlaceCard remains text-first without image elements |
| **Citywide regression** | PASS | Omitting lat/lng preserves identical query, ranking, and response |

---

## 7. Status & Next Step
- **M5-B Status**: DONE.
- **Exact Next Step**: STOP for user review. No further milestones authorized.
