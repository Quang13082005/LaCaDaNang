# Post-import SEO / GA4 verification

Takeover 2026-10-09: branch phase-2a-deploy, HEAD450530dcba2bb41f8d332315a2ca920a732a4cf8. Tracked tree clean; owner LA_CA_NEW_1000_DB_READY_NO_IMAGE.json untracked and preserved. Workbook artifacts untouched. Calendar/ICS removal is already committed, not repeated. Prior interrupted removal handoff was absent; this report supersedes that pending scope.

## Verified content baseline (fresh SELECT)
1500 places, all active/OPERATIONAL. EAT384/CAFE425/GO414/STAY277. Administrative units94; translations4500 (1500 each VI/EN/KO); place_tags3076; tags36; tag_translations108. Unique Google IDs1500; duplicates0; orphan translations/tags0; missing tags/admin0; invalid coordinates/sections0. MAX(id)=2500; sequence public.places_id_seq last_value2500/is_calledtrue, default nextval('places_id_seq'::regclass). IDs1–500 and1501–2500 intentionally preserved. No sequence reset/reimport/content mutation.

Old500 fingerprint matches 901e99c2739956b4252cf3e959280dbc7084fd43a257417071e8f89c64325642. This fingerprint covers id/google_place_id/section/active/business_status exactly as the prior audit; it does not prove every column unchanged historically.

## Backups
Pre-import JSON and SQL copied byte-for-byte from Gemini scratch; never executed restore SQL. Post-import six-content-table JSON exported in one SELECT snapshot. No analytics rows or credentials exported. Local backup only; not committed. JSON is a logical content snapshot, not a full pg_dump of schema/roles. Restore rehearsal NOT RUN.

- Path: D:/Dự án tìm địa điểm ăn chơi/LaCaDaNang/backups/pre-1500-import-2026-10-09/backup_pre_1500_import_20261009.json
  SHA-256: 46d924bed39dd4ef6777cd246ed4c404829c8cb7164c474a5f2efe33be592fe1

- Path: D:/Dự án tìm địa điểm ăn chơi/LaCaDaNang/backups/pre-1500-import-2026-10-09/backup_pre_1500_import_20261009.sql
  SHA-256: 81b341132d4b55edab057db94110de0b18a29915f684abface66c33f6f269ce1

- Path: D:/Dự án tìm địa điểm ăn chơi/LaCaDaNang/backups/post-1500-import-2026-10-09/content-1791530372666.json
  SHA-256: c2c15f9de3e4f36b4491644d58130a756d21ac8f526fc30d26a02f6b05402d31

## Schema reproducibility
Historical001 remains unchanged. Added002 forward migration creates owned integer sequence at MAX(id)+1 only when no sequence is already owned; refuses ambiguous pre-existing unowned sequence. Existing sequence is never rewound. SQL artifact is for future fresh DB setup, NOT executed on live Neon. Static regression tests only; fresh PostgreSQL migration execution NOT VERIFIED.

## Routing / SEO
Stable /places/<numeric-id>; no slug DB column and no rename-dependent URL. VI canonical has no query; EN/KO use ?locale=en/ko with self-canonical and reciprocal hreflang. Invalid IDs/missing place return404; invalid/redundant locale/query redirects to canonical. Dynamic server rendering reads real Neon through existing parameterized SELECT projection/adapter with Vietnamese fallback. No invented descriptions/hours/images. Existing card name opens detail; exact Maps action remains separate.
Unique title/description from name/type/address/real description, canonical/OG; conservative schema.org Place JSON-LD with actual address/public venue geo/Maps. No fabricated ratings markup, image, price or hours. JSON escaped against script closing injection.
Sitemap one lightweight IDs SELECT: Home1 +1500 place entries; locale alternates nested, no duplicate loc/API/dev URLs. Dynamic generation avoids stale imported catalog; no N+1. Detail lookup uses primary-key index, one projected query; React request cache deduplicates metadata/page query. No global data cache, no new index. EXPLAIN confirms places_pkey Index Scan for ID lookup. At1500 IDs sitemap is about706KB; no all-detail prefetch.
Robots allows public pages, excludes /api/ and /dev/, references sitemap. Exclusion is crawler guidance, not security. Public origin SITE_URL validated HTTPS origin; defaults to existing configured Preview. Production domain can change via config without code edits. No production deployment.

## Analytics boundary and actions
Existing11 first-party events/database schema retained. Central dispatch mirrors those11 to optional GA4. Failure in GA is caught before first-party transport and cannot block Maps/product actions. No real event injection during validation. Development/test disabled unless existing first-party test override; GA remains production-only and requires valid NEXT_PUBLIC_GA_MEASUREMENT_ID. No ID means no script, no crash. Bounded in-memory queue preserves early safe events before script initialization.
GA uses explicit parameter allowlist; no raw lat/lng/accuracy, session/journey IDs, arbitrary query/referrer/PII. Automatic pageview disabled; no automatic GPS URL propagation. Owner must disable Enhanced Measurement (especially history/form/outbound-link measurement) in GA property, because account-side automatic collection is outside code's event allowlist.
Action inventory:
- Home/session, NOW/EAT/GO/STAY, preference chips including GO+cafe: existing first-party events mirrored to GA.
- Discovery results, Nearby request/resolved/failed, citywide/general recovery, Maps and locale selection: existing first-party events mirrored to GA where those controls already emit.
- NOW accepted GPS/radius controls preserve existing tracking scope: no new GPS event; intent_selected remains tracked. No invented claim all NOW state changes emit first-party events.
- Card detail navigation: GA-only place_detail_opened. Detail visit: GA-only place_detail_viewed. Detail Maps: GA-only place_detail_maps_clicked (no fabricated discovery preference/session). Detail language links: GA language_changed. These do NOT add a12th DB event.
- Back/change-selection, close/cancel/decorative elements: not independently tracked; existing journey reset semantics preserved, no noisy events.
GA4 CODE READY — OWNER CONFIG REQUIRED; live ingestion NOT VERIFIED. GSC CODE READY — OWNER ACTION REQUIRED.

## Validation and remaining work
Local lint/typecheck PASS;24 suites406 non-curation tests PASS (baseline371 after removal plus35 new SEO/GA tests). Earlier removal baseline392 minus33 Calendar/ICS plus12 Maps tests=371. Tests adapted for extra detail link while preserving exact Maps assertions; no hidden failure suppression. Curation15 previously verified in isolated copy; not rerun against canonical dataset.
Local GET place VI/EN/KO200, missing404, sitemap1501locs/200, robots200. Browser real place1501 across KO320/375/390/393/430/768/1280; VI/EN390 and locale navigation verified. Screenshots/DOM in sibling POST_IMPORT_2026-10-09. No physical-device certification. Builds/final smoke/push/deploy pending final checkpoint below.

## Owner Search Console / GA4 steps
1. For this Preview use URL-prefix property https://la-ca-da-nang-preview.quang24101977.workers.dev/ in Search Console; workers.dev parent DNS is not your domain. For future owned custom domain, prefer DNS Domain verification and set SITE_URL to that final origin before indexing.
2. Choose HTML tag verification; copy only content token into GOOGLE_SITE_VERIFICATION in the approved build/runtime environment, then rebuild/redeploy Preview. Do not fabricate token or commit .env.local. Root metadata emits google-site-verification when configured.
3. Owner clicks Verify in Search Console. Submit https://la-ca-da-nang-preview.quang24101977.workers.dev/sitemap.xml (or future canonical domain /sitemap.xml). Indexing is Google's decision, not guaranteed by200.
4. In GA4 create/select Web stream, supply real G-... as NEXT_PUBLIC_GA_MEASUREMENT_ID, rebuild/redeploy. Disable Enhanced Measurement auto events before controlled verification; code's meaningful events still work. Owner confirms disclosure/consent requirements for their audience before enabling collection.
5. Check Realtime/DebugView with owner-authorized traffic; configure desired key events/custom dimensions in property. No account access or live ingestion verified by this agent.
Official references: https://nextjs.org/docs/app/api-reference/functions/generate-metadata ; https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap ; https://developers.google.com/analytics/devguides/collection/ga4/reference/config ; https://developers.google.com/analytics/devguides/collection/ga4/views ; https://support.google.com/webmasters/answer/9008080 .


Final local gate: lint/typecheck/24files406tests/Next/OpenNext PASS; worker.js exists. Preview baseline28GET+independentSELECT PASS on1500 data. Source diff reviewed; protected dataset/schema001/packages/config unchanged. Ready for selective source commit, normal branch push and Preview deployment; final live SEO smoke pending. Owner untracked JSON must remain untracked.
