> CURRENT_REFERENCE — 2026-10-06. Use docs/NEARBY_DISCOVERY.md as the canonical milestone specification. This document provides baseline/details; newer vocabulary/scope wins on conflict. Current authority: docs/CURRENT_STATE.md, docs/DECISIONS.md and docs/HANDOFF_CURRENT.md (paths relative to repository root). Original content retained below as evidence, not execution authorization.

# Nearby preparation — unconnected pure helpers

No geolocation prompt, network call, DB query, adapter, API or runtime recommendation wiring is added. Coordinate shape is a geometry DTO only; a caller-supplied selector adapts future place objects without changing their schema.

## Proposed flow after DB handoff

User explicitly selects “near me” → browser geolocation → validate finite coordinates, timestamp and accuracy → send only the current fix to an approved same-origin API/Worker → spatial candidate filter → exact radius → intent → supported preference/tag → approved quality/diversity ranking → at most 3 unique matches. Never send location to analytics. Do not persist raw fixes, URLs or request logs containing coordinates; require transport/body logging redaction before enabling the API. This is a design proposal, not a new endpoint/contract.

The server must obtain enough candidates to evaluate the radius and filters before limiting to 3. Do not select the first three DB rows and then compute distances. Query implementation, pagination, DB spatial index, score weights, tie-breaking by stable ID and candidate cap belong to the DB/recommendation owner. A finite partial candidate page must never be presented as proof that there are no nearby places.

## Pure utilities implemented

- `calculateDistanceKm(from,to)`: Haversine with mean Earth radius 6371.0088km. Returns null on invalid numbers/ranges. Accepts poles and ±180 longitude; clamps floating-point drift. This is straight-line great-circle distance, not walking/driving distance or ETA.
- `filterPlacesWithinRadius(items,origin,radius,coordinatesOf)`: generic selector; inclusive boundary; returns explicit invalid_origin/invalid_radius status, otherwise exact matches and invalidPlaceCount. Missing/invalid place coordinates are excluded, not interpreted as 0,0. Zero radius is allowed for co-located points. No mutation/padding/Top3 truncation.
- `sortPlacesByDistance(matches)`: copies and sorts ascending, retains input order for exact ties, excludes invalid/negative distances. Closeness alone is not “best”. It is a reusable helper, not the live ranking engine.

Selector must be a pure function and supply actual numbers (no coercing null/empty string to zero). Item references are preserved but never mutated. Invalid input types from a network payload must be parsed at the future boundary before using these typed helpers.

## Edge-case policy (proposed thresholds, requires product review)

- Denied: do not repeatedly prompt; explain once, allow normal non-location discovery. Never infer GPS from IP.
- Unsupported/insecure context: same fallback, no false “near you” claim.
- Timeout/unavailable: bounded attempt (suggested 10s), manual retry; no perpetual loading.
- Low accuracy: suggested accuracy >250m is insufficient for a 1km claim. Offer retry/non-location flow; an uncertainty circle crossing the radius boundary is not a guaranteed in-radius match. Show approximate straight-line distance only with an explicit accuracy qualifier if approved.
- Stale: suggested fix age >2 minutes requires a fresh fix; reject future timestamps beyond small clock tolerance. Never silently reuse stored location. Avoid background watchPosition.
- Invalid origin: show location unavailable; do not return an apparently valid empty recommendation. Invalid place coordinates: exclude, report sanitized data-quality count to the integration owner, no fabricated distance.
- Outside Đà Nẵng: valid geometry does not establish city membership. Future DB owner must supply an approved service-area polygon/geofence; ask whether the user wants Đà Nẵng discovery without nearby sorting. Do not guess city bounds or label a remote location nearby.
- 0/1/2 eligible places: truthful count, no duplicates or unrelated padding. Keep matched intent/preference context.
- Many places: candidate query must cover the requested radius; apply approved ranking/diversity before Top3. Do not equate nearest three with best three.

## Proposed 1 → 3 → 5km fallback

For the SAME valid fix and the SAME intent/preference: evaluate eligible unique matches at 1km; if fewer than three, offer/clearly disclose expansion to 3km; if still fewer, 5km. Radius is always relative to the original user fix, not relative to a found place. Deduplicate stable place IDs. Never expand beyond 5km automatically, never relax intent/tag filters secretly, and never fill to three using unrelated places. If 5km yields 0/1/2, return exactly that number and explain radius used. Do not combine stale requests after user changes preference; cancel/ignore old responses.

No backend fallback implementation exists in this pass. UI/API return metadata and wording must be agreed after DB integration. Distances shown later must come from the same validated fix used for filtering, labelled approximate straight-line km; don't round before radius filtering.

## Validation remaining after DB

Test denial/timeout/unavailable, inaccurate/stale/future fixes, in/out service area, boundary points, 0/1/2/large candidate sets, radius disclosure, partial pagination, duplicate IDs, request races and all locales. Geometry unit tests cover distance/range/boundary/antimeridian/poles/invalid inputs and stable sorting; they do not claim browser geolocation or DB integration is tested.
