# SEO release checklist

**LOCAL READY FOR REVIEW — NOT RELEASED.** User Section L forbids commit, push and deployment until approval.

## Completed locally

Takeover and fresh SELECT audit; 1500 eligible records; Production origin bug proven; central SEO origin/Home canonical/title repairs; GA4/Consent protection; lint/typecheck/424 tests/final Next/OpenNext passed; 1500 VI pages plus 24 EN/KO pages and three invalid IDs verified; 28 API regressions passed; diff review and protected hashes checked; six deliverables written.

## Owner approval and release steps

1. Review the six source/example/test files and documentation. Check for concurrent edits. Never stage Owner JSON, backups or environment secrets; use an exact allowlist.
2. Verify `SITE_URL=https://lacadanang.quangdev.id.vn` or the unset Production default in both build and runtime. Preview builds must also advertise Production canonical URLs. Do not change GA4 ID, hostname gate, Consent, Worker or domain routing.
3. Obtain explicit approval for commit, push and deployment target. Capture the current Worker version again. The audit baseline was `2cdc57be-068e-4bb2-8ed8-c59a19f71b76`.
4. Use the existing package deployment workflow for the approved environment only. Record exit code, version and URL. This task executed no deployment command.
5. Verify Production Home, robots and sitemap return 200. Robots must reference the Production sitemap. Current expected sitemap: 1501 locs, 4500 alternate links, no duplicate/missing/foreign-origin entries. Recompute expected counts by SELECT if the catalog changes.
6. Verify real place pages, VI/EN/KO, exact Maps, address-aware title, Production canonical/OG, truthful JSON-LD and no accidental noindex. Invalid IDs must return 404. Check EAT/GO/cafe/STAY/NOW/Nearby still return 0–3 truthful results. Do not send synthetic analytics without authorization.
7. Owner performs Search Console verification and submits only the Production sitemap. Inspect Google-selected canonical and indexing status separately from HTTP acceptance.

Do not mark Production fixed before actual post-deploy checks. Do not start notifications, images, recommendation changes or analytics implementation. Approval and Google account actions remain pending.


## Controlled Production release authorized — 2026-10-10

Owner has reviewed the local handoff and explicitly authorized selective commit, push and Production deployment, conditional on preflight gates. This supersedes the local-only stop above for this SEO release only. Source remains the six approved example/source/test files; no GA4/Consent, data/schema, domain or unrelated work is authorized.

Preflight: branch/remote HEAD `9855faebe5e1857da65ca52f483ba6812174e0e5`, no divergence or unexpected changes. Build and current Worker runtime SITE_URL are unset, using the Production default in the approved source. Worker bindings APP_ENV=production and ASSETS match the unchanged config; secret list empty. Existing live bundle GA Measurement ID matches the local configured ID and built assets (value deliberately omitted). Protected hashes unchanged. Fresh SELECT confirms1500 eligible places,4500 translations,sequence2500/is_called=true and unchanged historical500 fingerprint.

Rollback target captured: Production Worker `la-ca-da-nang`, version `2cdc57be-068e-4bb2-8ed8-c59a19f71b76`. No migration needed or permitted. Release command is existing `npm.cmd run deploy`, targeting root Worker config, NOT deploy:preview. Final deployment/live verification outcomes will be recorded in SEO_PRODUCTION_RELEASE_REPORT.md. Do not claim release success before HTTP/SELECT checks. No Google account access or Search Console submission authorized.
