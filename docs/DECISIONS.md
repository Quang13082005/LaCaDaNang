# Decisions
CURRENT_AUTHORITY — 2026-10-06. User message and supplied master prompt are the source; no runtime implementation is implied.

1. **Current authorization: M0.5 and M1-A only.** Selective local checkpoint permitted after targeted tests; audit provider and propose import/normalization contract. No Home/UI/DB implementation/import or push/merge/deploy; stop before M1-B.
2. **No-image MVP.** Images/place_media/photoCount cannot gate integration, ranking or release. No scraping. Static branding may remain. Existing card dependency is outstanding work, not already removed.
3. **500-row workbook supersedes the 86-row seed as intended import source.** Preserve both originals. Only administrative_units, places, tags, place_tags, tag_translations, place_translations are core imports. Workbook SHA256: 874e7d6d9f5688af85de347051d4fc67a52f44bbd97a249d1f717056f6496bd3.
4. **Four data sections:** EAT/CAFE/GO/STAY; future intent identifiers include NOW. CAFE has no current UI branch. Exact five-intent presentation remains later UI scope; M0 adds none.
5. **New administrative coverage is authoritative.** Do not run the old 15km/old Quảng Nam exclusion pipeline against it. Đắc Pring=1, La Êê=1, Hoàng Sa=0; Trà Vân=3. Do not invent quotas. Location service area policy must be explicit later.
6. **Actual stack is Next App Router + Cloudflare/OpenNext.** Supabase is mentioned historically but actual provider/project/schema is UNCONFIRMED. Do not create a competing DB. Existing DB owner must hand over schema/connection/ownership.
7. **No-image DB boundary first.** M1 confirms facts before creating discovery-contract.ts; do not pass DB rows directly to components. Numeric nulls and translations stay truthful.
8. **NOW remains sample until M11.** No open-now/clock feasibility claim from NIGHT tags alone. Workbook has no opening-hours/duration contract.
9. **Stable one-thumb UX is pending M7.** No-overflow or 44px alone does not establish PASS. Preserve 0–3 outcomes/context/reset and <=3 taps.
10. **Retain geo/i18n independent work.** Libraries implemented, runtime pending. VI/EN/KO supported by helpers; no invented venue translations. Review KO with humans.
11. **Analytics vocabulary changes.** Master event vocabulary in ANALYTICS.md supersedes eight-event legacy spec; retain privacy/dedup principles, not an assumed installed provider.
12. **Notifications first use case is an explicit reminder.** No permission on Home; delivery/provider/background support unconfirmed.
13. **Authority cleanup is reversible.** Exact old root instructions preserved under archive, other docs marked historical/reference in place; do not delete evidence.
14. **Documentation-only gate for M0.** Hash protection, links, authority and Git checks replace irrelevant runtime reruns for this docs-only milestone. Runtime tests remain mandatory in implementation milestones. No fresh runtime PASS claim.
15. **Master sequence ambiguity remains explicit:** M3 real EAT precedes M6 full no-image card. At M3, if current Image requirement blocks a real slice, propose/document a minimal compatibility adjustment or stop; never invent image URLs or silently execute all M6/M7 early. Broad order remains M0–M13.
16. **M0.5 selective checkpoint now authorized.** M0 backups retained;41 initial untracked classified in GIT_SAFETY_CHECKPOINT. Commit durable docs + four geo/i18n source files + two tests; exclude six local evidence files. No push.

## M1-A decisions / proposals
17. Local checkpoint dd7275446e7e85cc695e52a700f3cbdd52fef5a3 created after40 targeted tests and explicit45-file staged allowlist. Six M0 evidence files excluded; no push. Post-checkpoint handoff/planning docs remain uncommitted intentionally.
18. DB_PROVIDER_DECISION_REQUIRED: local audit does not identify a real provider/project/schema. Internal Miniflare metadata is not app DB. Neon PostgreSQL is the recommended option if no existing project; D1 requires explicit acceptance of integer boolean storage. Neither chosen or created.
19. Strict no-loss null/numeric normalization: preserve source IDs, true booleans, null ratings/counts; exact integer conversion, finite/range checks. No image requirement. All-column proposal in DB_IMPORT_CONTRACT_PROPOSAL is not finalized SQL.
20. Timestamp audit policy: Excel epoch1899-12-30 -> naive datetime, retain raw source/workbook/hash. No timezone proven, no Z/+07 inference. Proposed source wall-time storage preserves uncertainty. Replacing only export metadata created_at/updated_at with DB CURRENT_TIMESTAMP requires confirmation of meaning; never replace google_verified_at/source_updated_at with import time.
21. M1-A audit complete, schema finalization BLOCKED. No discovery-contract.ts until provider/schema and key mapping decisions are settled. STOP before M1-B; no DB rows, migration, UI, API, GPS/ranking/analytics/notification/i18n runtime work.
