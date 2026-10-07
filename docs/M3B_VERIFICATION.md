# M3-B — EAT frontend verification
Verified 2026-10-07T12:12:54+07:00. Parent checkpoint38c237a2c3976f60452227f28a01f6270f6fbdb4, branch phase-2a-deploy. Scope only EAT frontend + text-first no-image PlaceCard; no backend/schema/data/config/package changes. M3-A not restarted.

## Audit and implementation
Before: Home called getPlacesForSelection for EAT/GO/STAY; preference chips already listed an_ngon/dac_san/hen_ho. ResultList and PlaceCard required DemoPlace, whose imageUrl was required; PlaceCard rendered next/image banner/scrim. No API loading/error lifecycle. Legacy src/types/place.ts also requires imageUrl but is not the card/API contract.
After: EAT mounts EatDiscoveryResults keyed by preference; calls GET /api/discovery?intent=EAT&locale=vi&preference=<existing id>, cache:no-store. No call to demo result helper on EAT, including failures. Idle before selection, loading, success, empty and error distinguished. Count0/1/2/3 accepted; malformed/error responses show generic retryable error without raw server message. A new request renders no old cards. Keyed mounting + AbortController + active guard prevent late old responses from updating current selection, including transports ignoring abort.15-second abort timeout ends stalled requests. Retry clears previous state. Loading reserves320px result area; header/reset stay available. No artificial3-place padding or image-shaped placeholders.
PlaceCardModel is independent of DemoPlace and has no image field. discoveryToCard passes API name/typeLabel/area/address/nullable ratings/reviews/tags/description/exact Maps URL. Null optional blocks omitted, zero preserved when genuinely supplied. No invented reasons/descriptions. Tags are existing API labels, including GROUP/NIGHT/etc when stored in DB, not newly inferred preference mappings or opening-hours claims. No images, scrim, replacement logos or scraping in result cards. Static Home/intent artwork unchanged.
GO/STAY still use existing demo lookup through demoToCard, retaining hidden unverified ratings/reasons. Shared card now renders those existing demo results without images; no GO/STAY DB integration or preference/ranking changes. NOW itinerary unchanged. Legacy image-required types remain outside new card boundary; no forced expansion into dataset/type cleanup.

## Files
Source: src/app/page.tsx; src/components/results/PlaceCard.tsx,ResultList.tsx,EatDiscoveryResults.tsx; src/lib/data/place-card-model.ts.
Tests: tests/prototype.test.tsx (EAT assertions now await mocked API; other flows retained), tests/eat-frontend.test.tsx (18 new cases), tests/discovery-fixtures.ts (offline fixture only, never bundled into app).
Docs: CURRENT_STATE,DECISIONS,HANDOFF_CURRENT,AGENT_TASK_QUEUE and this report.
No changes to backend M3-A files, .env.local, package/lockfiles, curated dataset, demo data, global styles/fonts, Home intent ordering, Cloudflare/OpenNext, schema/import scripts, analytics/GPS/i18n/notifications.

## Fresh automated validation
npm.cmd run lint -> exit0, no lint warnings/errors (framework deprecation notice only).
npm.cmd run typecheck -> exit0.
npm.cmd test -> exit0,7 suites133/133 PASS, including48 backend discovery,18 new frontend cases and existing regressions. Run in sibling M3B_EVIDENCE_2026-10-07/test-copy with source/tests/config copied and node_modules junction. Curation rewrote only copied JSON; original preserved by hash.
npm.cmd run build -> exit0,23.773s, compile3.5s. Home16.1kB/first load119kB; /api/discovery dynamic. Existing Edge static generation warning only. Network-enabled execution used as established by M3-A recovery; no cache/source isolation required this turn.
19 generated client files scanned for actual configured DATABASE_URL/password:0 matches. API raw responses also checked without printing credentials.
Initial new test failure was test harness restoreAllMocks clearing matchMedia implementation; beforeEach restored browser mock. Final133 PASS. No application failures suppressed.

## Live end-to-end
Dev command npm.cmd run dev -- --hostname127.0.0.1 --port3103 (actual argument spaces in dev.log); Ready2s. Browser Home -> EAT -> preference -> loading -> ResultList/PlaceCard. Independent live Neon SELECT matched API IDs and Maps URLs:
- an_ngon -> [33,167,34],3 cards.
- dac_san -> [129,215,226],3 cards.
- hen_ho -> [2,13],2 cards (Nhà hàng Làn Gió; BUZZ BBQ & BEER), no padding.
For each preference, browser-rendered names and href attributes matched API exactly. No image descendants, duplicates or raw secrets. Console error inventory empty. No DB writes/import/migration. Maps URLs verified as href values; did not open external Google pages.
Live DB currently returns2/3 for allowed filters;0/1/error/timeout/null and race cases verified with explicit offline fixtures, not falsely claimed live DB outcomes. No DB changes to manufacture them.

## Responsive and screenshots
Result DOM metrics at320,360,375,393,412,430,440,480,768,1280: no detected clamp/ellipsis/hidden-overflow clipping;0 card images;3 cards;all inspected main actions>=44px.390 checked separately with DOM geometry and screenshot. Visual representative inspection at320 (top+bottom),390,768,1280 shows complete names/addresses/tags/Maps labels, including long names wrapping and Korean text. Not merely an overflow check. No physical-device certification or full one-thumb PASS claim.
Home/selected/reset screenshots at320,360,390,430,768,1280; selection metrics no clamp, preference buttons44px, other actions>=49px. Existing active-intent reorder behavior unchanged.
Evidence directory D:/Dự án tìm địa điểm ăn chơi/M3B_EVIDENCE_2026-10-07. Authoritative images are *-viewport.png and eat-results-320-bottom.png. Early fullPage screenshots had browser stitching artifacts; not used as visual evidence. Suggested review: hen_ho-390-viewport.png, eat-results-320-viewport.png, eat-results-320-bottom.png, eat-results-768-viewport.png, selected-320-viewport.png.
JSON: live-api.json,live-ui.json,responsive-results.json,responsive-selection.json,client-secret-check.json. Logs: dev,lint,typecheck,tests,build/build-result. Scripts are outside repo. A preliminary UI comparison incorrectly compared JSON key ordering; corrected field-value comparisons all3 true in live-ui.json.

## Git and stopping point
Initial16 staged renames +15 modified tracked +7 untracked preserved by backup/hash. Selective local checkpoint13-path allowlist, message feat: connect EAT frontend to Neon discovery. Use commit --only to retain unrelated staged renames. No stage-all/reset/clean/push/merge/deploy. Final hash recorded in HANDOFF_CURRENT after commit. Dev stopped after browser verification; viewport reset and temporary tab closed.
STOP after M3-B. Exact M4 first step after explicit user authorization: read canonical docs and verify Git, then audit existing CAFE/GO/STAY DB tags/preferences and decide evidence-backed mappings before enabling any additional section. Do not reuse demo labels as inferred database tags. No GPS/nearby or other runtime work implied.
