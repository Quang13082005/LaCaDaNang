# LA CÀ ĐÀ NẴNG — Final release candidate status

Updated 2026-10-09. RELEASE CANDIDATE READY: YES for owner preview acceptance, within the verified scope below. PRODUCTION READY: NO — owner physical acceptance pending. STOP; no new feature or production deployment.

## Git and recovery

- Branch: phase-2a-deploy.
- Latest takeover HEAD: bebdc5176306b1c8564894bba8b70c1f0901a387.
- Initial tree: one agent-owned unfinished Calendar test fixture typing correction; corrected typeLabel/area to strings. No unrelated work discarded.
- NOW V2 source commit: 4a0a1704b02c97ad908fe777d3fa43da9732e203.
- Deployed source/docs HEAD: 0cae0db7b94ce018941ef0f8d9623becf74d95bf; normal branch push verified against remote before deployment.
- This final documentation-only checkpoint follows that deployment. Its final local/remote hash and clean status are recorded after commit in the external evidence file FINAL_GIT_RESULT.json and the final chat response; a commit cannot contain its own hash.
- Preserved Hero, four-card Home, NOW citywide, GO+cafe, Calendar commit 2b624b2 and Nearby recovery commit bebdc51. No project restart.

## NOW location-aware V2

- Asia/Ho_Chi_Minh: morning 06:00–10:59, midday 11:00–13:59, afternoon 14:00–17:29, evening 17:30–21:59, night 22:00–05:59.
- Preferred composition respectively CAFE/EAT/GO; EAT/CAFE/GO; GO/CAFE/EAT; EAT/GO/CAFE; EAT/CAFE/GO. Night prioritizes relevant alternatives before daytime nature attractions; no opening-hours claims.
- Home load and NOW mount do not request GPS. NOW opens a choice; Allow location initiates permission. Shared existing accuracy <=1000m, 8-second timeout and coordinate validation; accepted location reused in memory only. No raw GPS persistence, origin echo or analytics payload.
- Shared full-precision geo evaluator/Haversine; ordinary Nearby behavior preserved. NOW selects one radius 1/3/5 km. Early stop at 1/3 requires three distinct sections, not just three rows/cafes. At 5 km returns truthful 0–3 unique real stops, even if diversity is limited; metadata describes radius/diversity/shortfall.
- Suitability tier then raw distance ASC, featured DESC, review_count DESC NULLS LAST, rating DESC NULLS LAST, id ASC. No randomization or fabricated padding.
- Denied/unavailable/timeout/inaccurate states: explicit retry/citywide choice. No silent citywide fallback. Fewer than three nearby stops remain visible; user may explicitly choose citywide.
- Tests cover all five slots, 1/3/5 escalation, count-only false success, 0/1/2 results, GPS error/cancellation/stale response and exact Maps links. No demo/open-now claims.
- Preview morning cases in each VI/EN/KO: radius1 IDs119/135/136; radius3 IDs22/4/5; radius5 IDs22/37/35. Empty public test origin returns0 at5km. Every stop independently SELECT-verified active/OPERATIONAL, section and exact stored Maps URL. Displayed distances stay within selected radius. Public catalog origins simulate GPS; no owner GPS used.
- Full policy, exact Maps URLs and five fixed-time citywide cases: [NOW verification](NOW_LOCATION_AWARE_V2_VERIFICATION.md).

## GO + cafe and ordinary discovery

- Product intent GO, preference cafe, database section CAFE. Taxonomy unchanged; citywide/nearby/zero cases pass in VI/EN/KO. EAT/GO/STAY real API and general Nearby pass.
- Analytics remains 11 canonical events, four primary intents NOW/EAT/GO/STAY; GO/cafe telemetry contract and schema unchanged. No new event or location payload.
- Exact stored Maps URLs, null-safe no-image PlaceCard, no demo fallback retained.

## Calendar and Nearby recovery

- Primary Google Calendar action uses https://calendar.google.com/calendar/render with encoded title, exact visit UTC instant, Asia/Ho_Chi_Minh, details/exact Maps and trusted address when present. Equal start/end endpoints avoid fabricated duration; user reviews time/duration/notification before saving. Copy does not claim a configured 30-minute reminder.
- Secondary ICS remains RFC5545/CRLF/UTF-8 with UID/DTSTAMP/DTSTART, no invented DTEND, exact Maps, DISPLAY VALARM TRIGGER:-PT30M. Original ICS generator unchanged.
- Local browser verified actions and localized sheet; unauthenticated Google tab redirected to product landing. Authenticated draft prefill, device import and actual reminder delivery NOT VERIFIED.
- Ordinary Nearby retains 1→3→5 km. Empty recovery is explicit: citywide keeps original intent/preference; general Nearby uses same GPS/category and removes narrow filter. GO+cafe remains CAFE. EAT/GO/STAY general recovery covered. No silent broadening.
- Local zero-result fixture is labeled; it proves UI/recovery callbacks, not real physical home-location coverage.

## Local quality and visual evidence

- npm.cmd run lint: PASS.
- npm.cmd run typecheck: PASS.
- npx vitest run --exclude "**/curation.test.ts": PASS, 23 files / 392 tests. Mutating curation tests excluded as requested.
- npm.cmd run build: PASS.
- npx opennextjs-cloudflare build: PASS; .open-next/worker.js exists. Canonical preview command subsequently rebuilt successfully.
- git diff --check: PASS. Curated dataset zero diff against takeover. Packages/lockfile/Cloudflare/OpenNext config unchanged. No DB mutations, migrations or imports.
- Home/Hero four-card layout preserved and locally reviewed. NOW browser scenarios 1/3/5/empty/denied/inaccurate at 320x800,390x844,393x852,430x932; VI390/KO393 also checked. Calendar and Nearby zero VI widths320/360/375/390/393/412/430/440/480/768/1280 plus documented EN/KO samples.
- Checks include core-text clamp/ellipsis/overflow, touch targets >=44px and representative visual screenshots. No-overflow alone is not treated as PASS. These are browser emulations, not physical one-hand certification.
- IAB occasionally captured inconsistent scroll state: old now_en_*_bottom/end_verified images are not proof of third-stop visibility. Current v2_* screenshots plus DOM evidence are the usable set; do not overstate every screenshot.

## Push, preview and read-only live smoke

- Normal push origin phase-2a-deploy: PASS; no force push/main/master/merge.
- Deploy: npm.cmd run deploy:preview, existing OpenNext build/deploy --env preview: PASS.
- Worker: la-ca-da-nang-preview.
- Version: 9ba8635f-c3b3-4d78-acfb-69f4d2f851be.
- URL: https://la-ca-da-nang-preview.quang24101977.workers.dev
- 28 live GET API cases PASS with independent Neon SELECT. Covers NOW citywide and nearby1/3/5 in all locales, NOW empty, GO+cafe citywide/nearby/zero, EAT/GO/STAY and general Nearby. 0–3 unique real records; exact Maps/section/active/OPERATIONAL checked.
- Home GET200, exactly4 primary cards in HTML; Hero referenced through encoded image URL and asset HEAD200. All11 referenced scripts fetched successfully. VI/EN/KO NOW strings, Calendar template action and ICS present in bundle. Minifier Unicode/hex escapes decoded as text only; no script execution.
- Invalid NOW coordinate GET400; analytics GET405; development fixture routes both404.
- LIVE HERO VISUAL / locale switching / NOW location UI interactions / Calendar interaction: NOT VERIFIED on preview. Asset/bundle presence is not interactive browser proof. Local browser evidence covers documented behavior.
- ANALYTICS LIVE INGESTION: NOT RUN. Owner explicitly required read-only and no analytics writes. No preview Home JavaScript executed, no analytics POST sent. Static contract tests pass; this is not live ingestion acceptance.
- Cloudflare secret-list result was empty, but actual Neon APIs succeeded; no unsupported credential/root-cause conclusion and no configuration changes made.

## Evidence, limitations and exact next step

Evidence directory: D:/Dự án tìm địa điểm ăn chơi/MASTER_CONTINUATION_2026-10-09.
Files: v2-lint.log, v2-typecheck.log, v2-tests.log, v2-build.log, v2-opennext.log, preview-deploy.log, preview-live-api.json, preview-static-smoke.json, v2-responsive.json, now-v2-browser.json, v2_* screenshots and Calendar/Nearby/Home screenshots/DOM records. The API evidence includes public venue coordinates, never owner GPS or credentials.

No engineering blocker found in completed gates. Remaining acceptance: live interactive/analytics ingestion intentionally unverified under owner read-only constraint; physical GPS/distances/Maps/one-hand, Google draft/import/notification and Korean human review not certified. No claim of physical PASS.

Exact owner next step: review [10-test physical checklist](OWNER_PHYSICAL_ACCEPTANCE_CHECKLIST.md) and report PASS/FAIL with device/browser and failing step. Opening the existing preview interactively uses its existing analytics behavior; this agent has not opened it under the no-write instruction. If that restriction must also apply to owner testing, resolve the test environment/analytics policy before interactive acceptance. Do not silently disable or alter production telemetry.

STOP — RELEASE CANDIDATE WAITING FOR OWNER PHYSICAL ACCEPTANCE. No production deployment or new feature.
