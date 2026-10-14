# FINAL RENTAL ACTIVATION PREFLIGHT — 2026-10-14

Status: DATA_READY / OWNER_CONFIGURATION_REVIEW_REQUIRED. Activation NOT EXECUTED.

## Verified SELECT evidence
Target flat-lake-94547160 / br-shiny-band-b3mlezx7 / neondb/public. Control-plane identity checked using the existing authenticated Neon CLI. Audit query wrapper accepts SELECT only; importer main/transaction was not called.
- Exactly 8 models, 21 vehicles, 1 contact, 0 media; all inactive.
- 10 scooter / 10 semi / 1 manual.
- Each vehicle compared against the hash-locked approved import source: brand/model/category, price, deposit, color/completeness, registration year, engine capacity and active state. 21 unique valid UUIDs. No orphan vehicle; model mappings match.
- Source SHA256: 029eb6139e640668bad3ec07024c800dc10cba5fdc0a4563501dbf7849af3e14.
- Daily prices 100,000–180,000 VND; per-vehicle values retained.
- Deposits: semi 1,000,000 / scooter 2,000,000 / manual 1,500,000 VND. Two CCCDs from two different persons: zero cash deposit; helmets included; no document collection on site.
- Phone +84931981789 (same number as 0931981789); Zalo https://zalo.me/0931981789. Public UI derives tel: from the contact phone.
- Existing source exceptions, not new drift: XE011 color_source Xám-… / color_complete=false; XE017 engine_cc=113.000. No invented correction.

## Worker/API finding
Version 565bf3eb-8323-4ae3-8456-e6a0e958b7f4 remains at 100% traffic. GET https://lacadanang.quangdev.id.vn/api/rentals?locale=vi returned 200 with vehicles=[] and contact=null, consistent with the inactive data and actual repository SELECT behavior.
Cloudflare secret list returned []; both Worker settings and exact-version binding metadata contain only APP_ENV and ASSETS, no DATABASE_URL secret binding.
Local deployed-build artifact .open-next/cloudflare/next-env.mjs contains an authenticated DATABASE_URL targeting the expected Production host and neondb (verified without printing or copying the value). Therefore connectivity works, but its configuration source is bundled server environment, not the Worker secret required by the repository DB module's documented contract.
This is not evidence of public/client credential exposure. The earlier client scan found no targeted PostgreSQL URI; no secret values saved in this preflight evidence. Nevertheless secret-management acceptance is not clean, so unconditional READY_FOR_OWNER_RENTAL_ACTIVATION_APPROVAL is withheld pending explicit Owner review of this finding. No secret/config/deployment change made.

## Exact proposed changes — NOT EXECUTED
Only active false -> true on:
- public.rental_vehicle_models IDs 1–8: Honda Air Blade, Lead, Vision, Wave; Yamaha Exciter, Janus, Jupiter, Sirius.
- public.rental_vehicles IDs 1–21, vehicle_code XE001–XE021, exact public_id/model_id allowlist in evidence/exact-record-allowlist.json.
- public.rental_contact_settings ID 1.
No media, prices, deposits, translations, core tables, schema or sequences changed.

SQL previews: ../RENTAL_ACTIVATION_PREFLIGHT_2026-10-14/activation.preview.sql and deactivation.preview.sql. Generated offline only; not executed or server-side rehearsed this turn.
Single transaction, lock_timeout5s, statement_timeout30s, SHARE ROW EXCLUSIVE locks on four rental tables. Preconditions verify expected database, no noninternal triggers, media0, exact table counts, exact IDs and full typed row equality except active, and all inactive for activation. UPDATE row counts must be 8/21/1. Postconditions verify exact rows, untouched fields and public projection21; any mismatch raises an exception. Executor must ROLLBACK the SAME connection on any error, no retry. COMMIT uncertainty requires SELECT reconciliation. Refresh identity/schema and baseline immediately before any approved execution; stale preview is not approval.

## Expected Production behavior and verification plan
After separate approved activation, hard-refresh browser to clear cached empty catalog (client cache TTL60s; no polling). API vi/en/ko should return21 vehicles and contact; category counts10/10/1. Verify exact UUIDs, per-vehicle prices/deposits, no internal/raw fields and detail API each UUID200.
GO suggestion requires GO success + Nearby active + at least one result distanceRawKm>=2.0km (rounded fallback distanceKm>=2.1); ordinary citywide GO need not show it. Test >=2km and <2km controls using known fixture locations, not fabricated distances. NOW suggestion requires nonempty valid itinerary.
Open Catalog:21 cards and10/10/1 filters, actual minimum price100,000 VND/day, detail specs/placeholder/contact policy, VI/EN/KO, Back/focus/context. CTA tel:+84931981789 and https://zalo.me/0931981789; do not place a call/message. No fifth intent, Hero remains unchanged.
Activation/browser acceptance remains PENDING; cannot certify active UI with this read-only preflight. Production browser interactions can emit existing analytics writes: obtain scoped approval or use a verified request-blocking test harness before browser QA if no-write testing remains required.

## Deactivation rollback proposal
Separate transaction using same exact ID/UUID/data baseline, then active=false for8models/21vehicles/contact1; verify public projection0. Handles mixed active states but aborts if rows/data/extra records drift; never blindly disables unrelated future vehicles. Public API then empty/contactnull. Existing mounted browser may retain data until refresh; reload/reopen for validation. No D2 rerun, deletes, schema or core edits. Requires Owner authorization; not executed.

## Evidence / handoff
../RENTAL_ACTIVATION_PREFLIGHT_2026-10-14/readonly-audit.json contains every verified vehicle/spec/UUID and source comparison; exact-record-allowlist.json pins targets; public-api.json, worker-binding-names.json and connection-proof-sanitized.json document current runtime finding. audit.cjs is SELECT-only; prepare-preview.cjs is offline generation only.
No runtime source/UI/tests edited, no deployment, import, Git commit/push or DB write. STOP. Next: Owner reviews bundle-env versus Worker-secret finding and approves any distinct remediation scope; refresh preflight before requesting activation write approval. Data itself has no new mismatch against approved source.
