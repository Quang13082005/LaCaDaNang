# NOW location-aware V2 verification

2026-10-09. Implementation and local verification complete; release gates and preview recorded in FINAL_RELEASE_CANDIDATE_VERIFICATION.md.

## Contract and reuse

- NOW V1 remains the explicit citywide, real Neon, Da Nang time-slot policy. NOW V2 adds opt-in location and one selected radius of 1, 3 or 5 km.
- No GPS on Home load or NOW component mount. NOW tap opens the location choice; Allow location initiates browser permission. Citywide requires a separate explicit tap, including after denied/unavailable/timeout/inaccurate GPS.
- Shared request-location.ts is used by ordinary discovery and NOW: <=1000m accuracy, 8-second timeout, coordinate validation, cancellation and late-callback protection. Invalid/nonfinite accuracy fails safely. Coordinates exist only in memory/request flow; no storage, origin response echo or analytics payload.
- Existing Nearby full-precision candidate evaluation was extracted unchanged. Haversine formula, ordinary Nearby radius/count semantics and ranking remain unchanged. NOW has its own itinerary composition policy over the shared evaluated pool, not a second distance engine.
- NOW evaluates complete eligible EAT/CAFE/GO pools within each radius. It stops at 1 or 3 only with three distinct sections, so three cafes do not cause an early count-only success. At 5 km it returns the best available 0–3 unique valid stops, even if diversity is limited, with compositionDiverse metadata and a shortfall reason when count<3. No hidden citywide fallback or fake padding.
- Each leg: verified preferred tag/section, same section general, unused allowed section, remaining real pool. NIGHT first avoids NATURE/amusement_park/water_park when other candidates exist. Within each suitability tier: raw distance ASC, featured DESC, review_count DESC NULLS LAST, rating DESC NULLS LAST, id ASC. Distances are rounded only for display; no randomization or citywide slot-offset selection in nearby mode.
- Timezone Asia/Ho_Chi_Minh; MORNING06:00–10:59, MIDDAY11:00–13:59, AFTERNOON14:00–17:29, EVENING17:30–21:59, NIGHT22:00–05:59. Composition CAFE/EAT/GO, EAT/CAFE/GO, GO/CAFE/EAT, EAT/GO/CAFE, EAT/CAFE/GO respectively. Existing verified BAR preference retained for night GO. These are suggestions, never verified opening hours.
- API validates locale and paired lat/lng through the existing discovery parser; unknown/duplicate/empty/nonfinite/out-of-range input rejected. Maps URL required and stored URL preserved. No schema/config/package/data changes.
- UI retains timeline/no-image cards, nullable rating/reviews, distance and Maps for every real stop. Shows selected radius or explicit citywide copy. Fewer than3 are displayed truthfully with a message and citywide choice; no extra tap needed to reveal the available nearby stops.

## Local validation

- Focused seven files94 tests passed before final added route regression; final full suite23 files392 tests passed, curation excluded. Lint/typecheck passed. Full build results in final release report.
- Covers1/3/5, three cafes at1km versus diverse3km,0/1/2 stops, allfive slots, night relevance, exact Maps, deterministic ranking, invalid Maps, explicit GPS, accepted coords reused on retry, denied/unavailable/inaccurate, timeout/latecallback, response origin not echoed. Existing Nearby and EAT/GO/STAY regressions pass.
- Live local28 HTTP cases pass, including V2 allthree locales at1/3/5, empty5km, CAFEcitywide/nearby/zero, EAT/GO/STAY generalnearby. Every returned ID/section/active/OPERATIONAL/exactMaps independently SELECT verified. Public catalog origins only; no owner's home coordinates.
- Browser dev fixture /dev/now-location mocks browserGPS at real public venues, calls real Neon API. It is explicitly labeled and returns404 in production. Cases1/3/5/empty/denied/inaccurate captured at320x800,390x844,393x852,430x932. DOM checks no core text clamp/ellipsis/overflow, actions44–48px. Representative screenshots visually reviewed; not a physical-device certificate. VI390 andKO393 real nearby flow and explicit citywide transition verified; all strings and APIlocale behavior automated.
- Screenshot implementation has occasional viewport/scroll capture inconsistency in IAB; old now_en_*_bottom/end_verified captures do not prove third-stop visibility. Use v2_* snapshots + DOM and reviewed current captures. Do not claim all old captures visually certify every stop.

## Real public-origin nearby examples (morning)

### 1 km — simulated origin at public place ID136: CÔNG VIÊN ADB
- Stop1: ID119 | Tana Cafe | CAFE | 0.7km | exact Maps: https://www.google.com/maps/search/?api=1&query=Tana+Cafe&query_place_id=ChIJk-I3awDdaTERJXDI2vThd28
- Stop2: ID135 | Nhà Hàng Dê Núi Lam Sơn | EAT | 0.6km | exact Maps: https://www.google.com/maps/search/?api=1&query=Nh%C3%A0+H%C3%A0ng+D%C3%AA+N%C3%BAi+Lam+S%C6%A1n&query_place_id=ChIJB7krRwLdaTERwmLScJYEc9Q
- Stop3: ID136 | CÔNG VIÊN ADB | GO | 0km | exact Maps: https://www.google.com/maps/search/?api=1&query=C%C3%94NG+VI%C3%8AN+ADB&query_place_id=ChIJxyk3mqTdaTER5nI-pIHCmLI

### 3 km — simulated origin at public place ID5: New Phương Đông Club
- Stop1: ID22 | Tiệm Cà Phê La Cà | CAFE | 1.8km | exact Maps: https://www.google.com/maps/search/?api=1&query=Ti%E1%BB%87m+C%C3%A0+Ph%C3%AA+La+C%C3%A0&query_place_id=ChIJn_5UWlAZQjERICPeMkugq5M
- Stop2: ID4 | CHÚ BI quán nướng | EAT | 0.8km | exact Maps: https://www.google.com/maps/search/?api=1&query=CH%C3%9A+BI+qu%C3%A1n+n%C6%B0%E1%BB%9Bng&query_place_id=ChIJNcPfRBYZQjERUk2d0LOhtrk
- Stop3: ID5 | New Phương Đông Club | GO | 0km | exact Maps: https://www.google.com/maps/search/?api=1&query=New+Ph%C6%B0%C6%A1ng+%C4%90%C3%B4ng+Club&query_place_id=ChIJu557PTwYQjERu1jlhJR4LEU

### 5 km — simulated origin at public place ID35: Malibu Beach Club - Seaside Chill & Cocktails
- Stop1: ID22 | Tiệm Cà Phê La Cà | CAFE | 3.9km | exact Maps: https://www.google.com/maps/search/?api=1&query=Ti%E1%BB%87m+C%C3%A0+Ph%C3%AA+La+C%C3%A0&query_place_id=ChIJn_5UWlAZQjERICPeMkugq5M
- Stop2: ID37 | Nhà hàng Phước Thái | EAT | 0.8km | exact Maps: https://www.google.com/maps/search/?api=1&query=Nh%C3%A0+h%C3%A0ng+Ph%C6%B0%E1%BB%9Bc+Th%C3%A1i&query_place_id=ChIJx8JV8YsXQjER26oCdd8Oy1Y
- Stop3: ID35 | Malibu Beach Club - Seaside Chill & Cocktails | GO | 0km | exact Maps: https://www.google.com/maps/search/?api=1&query=Malibu+Beach+Club+-+Seaside+Chill+%26+Cocktails&query_place_id=ChIJG1WCi2UXQjER9CxEvEOoEpw

## Refreshed citywide five-slot preservation

### 08:00 MORNING
- Stop1: ID214 | Starbucks Ba Na Hills | CAFE | exact Maps: https://www.google.com/maps/search/?api=1&query=Starbucks+Ba+Na+Hills&query_place_id=ChIJFwYDlSP3QTERr4HT9DMZQA0
- Stop2: ID33 | Bếp Cuốn Đà Nẵng | EAT | exact Maps: https://maps.google.com/?cid=15858543023798826021
- Stop3: ID218 | Sun World Bà Nà Hills | GO | exact Maps: https://www.google.com/maps/search/?api=1&query=Sun+World+B%C3%A0+N%C3%A0+Hills&query_place_id=ChIJyUQ4aw72QTERCXl5YV-4U1w

### 12:00 MIDDAY
- Stop1: ID167 | MẸT Hội An - Vietnamese restaurant & Vegetarian Food 6 | EAT | exact Maps: https://www.google.com/maps/search/?api=1&query=M%E1%BA%B8T+H%E1%BB%99i+An+-+Vietnamese+restaurant+%26+Vegetarian+Food+6&query_place_id=ChIJYfxcGAAPQjER1HyrlhEZ6WE
- Stop2: ID188 | XLIII Specialty Coffee | CAFE | exact Maps: https://www.google.com/maps/search/?api=1&query=XLIII+Specialty+Coffee&query_place_id=ChIJpb6yBAMPQjERp-vXXJFt2hk
- Stop3: ID49 | Chùa Linh Ứng – Sơn Trà | GO | exact Maps: https://www.google.com/maps/search/?api=1&query=Ch%C3%B9a%20Linh%20%E1%BB%A8ng%20S%C6%A1n%20Tr%C3%A0%20%C4%90%C3%A0%20N%E1%BA%B5ng&query_place_id=ChIJHZakNa8ZQjERWNFToM16eB4

### 15:30 AFTERNOON
- Stop1: ID205 | Công viên Suối khoáng nóng Núi Thần Tài Đà Nẵng | GO | exact Maps: https://www.google.com/maps/search/?api=1&query=C%C3%B4ng+vi%C3%AAn+Su%E1%BB%91i+kho%C3%A1ng+n%C3%B3ng+N%C3%BAi+Th%E1%BA%A7n+T%C3%A0i+%C4%90%C3%A0+N%E1%BA%B5ng&query_place_id=ChIJwbfPdZX3QTERj8sw7f5uZPA
- Stop2: ID66 | Starbucks Ba Na Main Gate | CAFE | exact Maps: https://www.google.com/maps/search/?api=1&query=Starbucks+Ba+Na+Main+Gate&query_place_id=ChIJT2YLRbb3QTERCWRWcCqqPGI
- Stop3: ID34 | Burger House Da Nang(햄버거) | EAT | exact Maps: https://www.google.com/maps/search/?api=1&query=Burger+House+Da+Nang%28%ED%96%84%EB%B2%84%EA%B1%B0%29&query_place_id=ChIJkf2tQIAZQjERG_-hbl_EKv4

### 19:00 EVENING
- Stop1: ID33 | Bếp Cuốn Đà Nẵng | EAT | exact Maps: https://maps.google.com/?cid=15858543023798826021
- Stop2: ID218 | Sun World Bà Nà Hills | GO | exact Maps: https://www.google.com/maps/search/?api=1&query=Sun+World+B%C3%A0+N%C3%A0+Hills&query_place_id=ChIJyUQ4aw72QTERCXl5YV-4U1w
- Stop3: ID214 | Starbucks Ba Na Hills | CAFE | exact Maps: https://www.google.com/maps/search/?api=1&query=Starbucks+Ba+Na+Hills&query_place_id=ChIJFwYDlSP3QTERr4HT9DMZQA0

### 23:00 NIGHT
- Stop1: ID2 | Nhà hàng Làn Gió | EAT | exact Maps: https://maps.google.com/?cid=6319912934061843350
- Stop2: ID188 | XLIII Specialty Coffee | CAFE | exact Maps: https://www.google.com/maps/search/?api=1&query=XLIII+Specialty+Coffee&query_place_id=ChIJpb6yBAMPQjERp-vXXJFt2hk
- Stop3: ID35 | Malibu Beach Club - Seaside Chill & Cocktails | GO | exact Maps: https://www.google.com/maps/search/?api=1&query=Malibu+Beach+Club+-+Seaside+Chill+%26+Cocktails&query_place_id=ChIJG1WCi2UXQjER9CxEvEOoEpw

23:00 remains IDs2/188/35, no Bà Nà preferred result. No demo fallback, no open-now claim. Physical GPS/distances/Maps/one-hand acceptance NOT VERIFIED. Evidence: sibling MASTER_CONTINUATION_2026-10-09, now-v2-public-origins.json, v2-live-api.json, v2-responsive.json and screenshots.
