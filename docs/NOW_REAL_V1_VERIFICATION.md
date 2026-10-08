# NOW real v1 — 2026-10-09

Status: READY_FOR_REVIEW — implementation, offline regression, live Neon smoke, Next and OpenNext builds verified. Branch `phase-2a-deploy`. Base Hero commit `bc6702a824ea245a5d11f94eb086059f286ee8f1`.

## Product and source contract

Home keeps four primary cards, same order and sizing. NOW now starts in one tap and returns to Home with the fixed lower Change selection action. The old companion/demo preference sheet is no longer used by NOW. EAT/GO/STAY keep their existing preference sheets and lifecycle. NOW footer reserves clearance for its action bar, so language selection remains reachable.

Old runtime: `getItineraryForPreference` / `DEMO_ITINERARIES`. New runtime: `GET /api/now?locale=vi|en|ko` -> existing read-only Neon executor -> existing PlaceRepository -> existing translation adapter -> NowData -> timeline/reused no-image PlaceCard. Legacy demo helpers remain for old tests/development; runtime NOW does not call them. Page still imports the legacy file's preference metadata for other sections, which is not a NOW result fallback.

Asia/Ho_Chi_Minh server clock determines slots. No public synthetic clock, GPS, preference or arbitrary query parameter accepted. Synthetic clock injection exists only in the service/test seam. Unknown/duplicate parameters return 400; DB failure returns sanitized 500. Dynamic Node/default runtime, no Edge export, no-store successful response.

- MORNING 06:00–10:59: CAFE general -> GO/NATURE.
- MIDDAY 11:00–13:59: EAT general -> GO/SCENIC.
- AFTERNOON 14:00–17:29: GO/PHOTO -> CAFE general.
- EVENING 17:30–21:59: EAT general -> GO/ENTERTAINMENT.
- NIGHT 22:00–05:59: EAT/NIGHT -> GO/NIGHT.

Two distinct legs, at most two places selected in v1 (within requested 2–3 maximum). Query up to three ranked candidates per leg, take the first valid adapted unused place in the required section. If tagged leg has no usable result, query general in the same section. If that is empty, omit the leg; 0/1 are valid, no fake padding or alternate-section substitution. Query failure fails the request, with no demo fallback.

Ranking remains existing `featured DESC, review_count DESC NULLS LAST, rating DESC NULLS LAST, id ASC`; no Math.random, weights or NULL-to-zero. Selection is deterministic for the same slot/locale/data state. This is an editorial citywide sequence, not geographic route optimization or verified availability. UI explicitly says opening hours are unverified and to check with the venue. Late-night heading is a reference suggestion. No automatic GPS, DB mutation or new analytics event. Existing intent_selected NOW remains; no conversion/result/Maps telemetry added for NOW. No reminder introduced on NOW cards.

## Read-only data evidence

`CONTINUATION_2026-10-09/now-tag-audit.json` records SELECT, timestamp and tag counts: CAFE general145; GO NATURE26, SCENIC19, PHOTO16, ENTERTAINMENT8, NIGHT6; EAT NIGHT4. No inferred tags or opening hours.

`now-live.json` records real service results at fixed +07:00 times, repeated deterministic calls, independent SELECT by IDs confirming active/OPERATIONAL/section/exact Maps URL, and actual HTTP responses in vi/en/ko:

- 08:00 MORNING: IDs214 (CAFE),218 (GO).
- 12:00 MIDDAY: IDs33 (EAT),218 (GO).
- 15:30 AFTERNOON: IDs218 (GO),214 (CAFE).
- 19:00 EVENING: IDs33 (EAT),218 (GO).
- 23:00 NIGHT: IDs33 (EAT),218 (GO).

ID33 is Bếp Cuốn Đà Nẵng; ID218 is Sun World Bà Nà Hills. Repeated Bà Nà selection is a real data/ranking limitation, not evidence of opening hours, proximity, practical late-night travel or itinerary quality. No claim that featured creates a difference. Owner should review relevance before release; no ranking/data alteration was authorized.

Actual API smoke: HTTP200, two unique places, all three locales; exact Maps links verified against independent SELECT. Test data are clearly fixture-only; real evidence uses IDs above. Query script loads DATABASE_URL privately and suppresses driver details. It executes only SELECT; dev browser telemetry is disabled by the existing client environment guard.

## Validation

- Focused initial NOW/prototype/one-hand: 3 suites60/60 PASS; later expanded by route/timeout/locale-race tests.
- Final non-curation regression: `node node_modules/vitest/vitest.mjs run --exclude "**/curation.test.ts"` ->18 suites340/340 PASS.
- `npm.cmd run lint`: exit0.
- `npm.cmd run typecheck`: first PASS; one later process exited -1073740791 with empty log; independent retry exit0. Cause not established; not an application error claim.
- `npm.cmd run build`: exit0, compile7.2s; dynamic `/api/now` emitted.
- `npm.cmd run build:worker`: exit0, OpenNext build complete; `.open-next/worker.js` exists. No deploy command.
- Curation suite excluded as explicitly requested, to avoid dataset rewrite. Curated JSON has zero Git diff. No package/lock/config/schema edits.

Coverage: all slot boundaries including midnight, all five policies through real repository parameter binding and adapter, same-section fallback, empty/one result/dedup/wrong section handling, propagated DB errors, API locale/unknown/duplicate query rejection, secret sanitization, no-store, UI loading/0/1/2/3 response/error/retry/timeout/unmount abort/locale stale response, real URL rendering, nullable metadata, no images, translations and one-tap Home/reset. Test3-card response verifies defensive UI maximum; service currently selects at most2.

An initial new API-test failure was in test cleanup: beforeEach accidentally returned the mock function, causing Vitest to invoke it as cleanup. Fixed with a void block; route error sanitization passes. No production workaround was introduced.

## Browser verification and evidence limits

Actual IAB dev server `127.0.0.1:3109`, GET->Neon, no mock network. NOW loading/success, locale switch, Maps hrefs, reset->Home verified. DOM checks cover VI320/390/393/430/768/1280, KO320, EN393. Screenshots visually inspected at VI320(top/bottom),430,768,1280; KO320(top/bottom); EN393(top/bottom). No clamp/ellipsis or text loss observed in inspected content; long address and Maps CTA wrap at320. Reset44px, existing Maps minimum44px. Language selector reachable above bottom bar. This is not a complete all-locale x all-size matrix or physical-device acceptance.

Evidence folder: `D:/Dự án tìm địa điểm ăn chơi/CONTINUATION_2026-10-09`.
- `now_vi_320_top.png`, `now_vi_320_bottom.png`, `now_vi_430_top.png`, `now_vi_768.png`, `now_vi_1280.png`.
- `now_ko_320_top.png`, `now_ko_320_bottom.png`, `now_en_393_top.png`, `now_en_393_bottom.png`.
- `now-responsive.json`: corrected CSS-property measurement, no detected clamp/overflow; visual screenshots remain the primary clipping check.
- Do NOT use `now_ko_320.png` as visual proof: IAB full-page stitching duplicated regions. Viewport screenshots replaced it.
- First DOM probe incorrectly read unsupported camelCase webkitLineClamp and flagged all text; replaced with getPropertyValue('-webkit-line-clamp'), rerun and saved. No source clipping bug inferred from that faulty probe.
- Tall screenshots can end at the IAB capture surface (~875px), while DOM viewport measurements include the requested full height. No claim that a partially captured bottom bar is visually verified in those images.
- Logs: phase-b-focused.log, regression.log, lint.log, typecheck-retry.log, next-build.log, opennext-build.log. SHA256 manifest validated-source-hashes.json includes curated JSON.

Calendar physical delivery: KNOWN FAILED PHYSICAL ACCEPTANCE — DEFERRED. Nearby sparsity deferred; 1→3→5 unchanged. No push/deploy. Full Phase D including CAFE cannot be marked complete while CAFE is blocked.
