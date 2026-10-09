# ASTRA 6 — SEO IMPLEMENTATION HANDOFF

Completed locally on 2026-10-10; audit began on 2026-10-09. **STOP: no commit, push or deployment.**

Branch: `phase-2a-deploy`. Local HEAD and the remote hash read during takeover: `9855faebe5e1857da65ca52f483ba6812174e0e5`. The initially untracked Owner dataset is preserved.

## Phase status

- Phase 0: takeover complete.
- Phase 1: Production and database audit complete.
- Phase 2: sitemap/robots origin repair complete locally.
- Phase 3: metadata review and minimal repair complete locally.
- Phase 4: quality gates complete.
- Phase 5: Search Console instructions ready. Account verification and submission belong to Owner.
- Release: not performed and not authorized.

## Changes

- `src/lib/seo/site.ts`: Production is the default canonical origin shared by robots, sitemap, detail metadata, JSON-LD and layout. Explicit `SITE_URL` remains supported for a public HTTPS origin. Preview/localhost values fail validation instead of silently publishing incorrect SEO. Request hostname does not determine canonical URLs.
- `src/app/layout.tsx`: add Home canonical and Open Graph metadata. GA4/Consent imports and component rendering are unchanged.
- `src/lib/seo/place.ts`: include the real address in title to distinguish eight groups of repeated venue names. Preserve real descriptions/type/address and conservative Place JSON-LD.
- `.env.example`: document the Production origin for both environments. No actual environment file or secret changed.
- `tests/seo-routes.test.tsx`: assert Production origin for sitemap entries and alternate links.
- `tests/seo-production.test.ts`: ten cases covering Preview-build canonical defaults, invalid origins, locales, public eligibility and same-name venues.
- Six SEO deliverables, README and four current handoff files record the new state.

No business logic, UI layout, repositories, ranking, GA4, Consent, database schema, dependencies or Cloudflare configuration changed.

## Quality and evidence

Evidence directory: `D:/Dự án tìm địa điểm ăn chơi/SEO_PRODUCTION_2026-10-09`.

- `npm.cmd run lint`: exit 0, no ESLint warnings/errors. Next lint deprecation notice only.
- `npm.cmd run typecheck`: exit 0.
- `node node_modules/vitest/vitest.mjs run --exclude '**/curation.test.ts' --maxWorkers=2`: 25 files, **424 tests passed**, exit 0, 29.25 seconds. Curation side-effect tests excluded.
- An earlier concurrent run had 423 passes and one GO frontend test timeout at 5000ms. Retained in `tests.log`. No timeout increase or test bypass; the final bounded-worker run passed all 424. Initial 423-test result preceded the extra title test and is not the final gate.
- `npm.cmd run build`: passed the initial patch. The final address-title change also passed Next build inside the OpenNext command, which invokes `npm run build`.
- `node node_modules/@opennextjs/cloudflare/dist/cli/index.js build`: exit 0. Next 15.5.27 and OpenNext build passed; `.open-next/worker.js` generated.
- Local Next server on port 3112 served the final build and was stopped afterward.
- 1500 VI place pages, 24 additional EN/KO pages and three invalid IDs checked using HTTP only: zero failures.
- Sitemap: 1501 loc entries, 4500 alternate links, 573780 bytes; no missing IDs, duplicates or wrong origins.
- 28 local discovery/NOW/Nearby API cases passed with independent SELECT comparison.
- Protected hashes match for analytics source/components, Owner JSON, package/lockfile and Wrangler configuration. Git diff reviewed and whitespace check passed.

No browser JavaScript, synthetic tracking event, Owner GPS position or database write was used. This metadata-only change does not claim new visual layout acceptance.

## Risks and release gates

Production still has the wrong-origin SEO until an approved release. `SITE_URL` must be absent or set to `https://lacadanang.quangdev.id.vn` in build and runtime environments. A stale workers.dev value now fails fast. Home/robots are prerendered, so rebuild is required after changing origin configuration.

Current Production Worker version was read as `2cdc57be-068e-4bb2-8ed8-c59a19f71b76`. Its exact Git SHA is not established by deployment metadata. Owner-confirmed GA4 acceptance is preserved, not re-certified by synthetic traffic in this task. GSC requires Owner login and verification.

All 4500 short descriptions are empty. We use truthful existing type/address content rather than inventing copy. Titles including addresses can be long; Google may rewrite or shorten snippets. No indexing/ranking guarantee. Existing locale architecture keeps root SSR html in VI with the detail main in its actual locale; human Korean review remains pending.

## Rollback and next step

Before an approved release, record the current Worker version and selective change set. If a regression appears, an Owner-authorized Worker rollback to the previous version restores the known baseline, including its known SEO-origin bug. Never restore the database or reset its sequence. No rollback was executed.

Owner next step: review the diff and reports, then explicitly authorize selective commit/push and the desired deployment environment. Recheck Git and `SITE_URL` before release; follow `SEO_RELEASE_CHECKLIST.md`. **STOP LOCAL.**


## Controlled Production release authorized — 2026-10-10

Owner has reviewed the local handoff and explicitly authorized selective commit, push and Production deployment, conditional on preflight gates. This supersedes the local-only stop above for this SEO release only. Source remains the six approved example/source/test files; no GA4/Consent, data/schema, domain or unrelated work is authorized.

Preflight: branch/remote HEAD `9855faebe5e1857da65ca52f483ba6812174e0e5`, no divergence or unexpected changes. Build and current Worker runtime SITE_URL are unset, using the Production default in the approved source. Worker bindings APP_ENV=production and ASSETS match the unchanged config; secret list empty. Existing live bundle GA Measurement ID matches the local configured ID and built assets (value deliberately omitted). Protected hashes unchanged. Fresh SELECT confirms1500 eligible places,4500 translations,sequence2500/is_called=true and unchanged historical500 fingerprint.

Rollback target captured: Production Worker `la-ca-da-nang`, version `2cdc57be-068e-4bb2-8ed8-c59a19f71b76`. No migration needed or permitted. Release command is existing `npm.cmd run deploy`, targeting root Worker config, NOT deploy:preview. Final deployment/live verification outcomes will be recorded in SEO_PRODUCTION_RELEASE_REPORT.md. Do not claim release success before HTTP/SELECT checks. No Google account access or Search Console submission authorized.
