# Agent task queue
CURRENT M4-B OVERRIDE — 2026-10-07: M4-B GO & STAY Neon discovery completed and verified; selective local commit authorized. STOP before M5. Earlier milestone entries are historical.
CURRENT_AUTHORITY — 2026-10-07. M4-B verified complete; selective checkpoint authorized. STOP before M5.

ID | milestone | status | owner/current agent | dependencies | exact next action | verification
---|---|---|---|---|---|---
M0 | Protect work + docs + handoff | DONE | Completed | — | — | M0 evidence/validation.json + Git diff check
M0.5 | Selective local checkpoint | DONE | Completed | M0 | — | 40/40 tests; 45-file allowlist; hashes
M1-A | Provider + schema/import planning | DONE | Completed | M0.5 | — | Workbook QA passed; audit complete
M1-C | Neon connection verify + dry-run | DONE | Completed 2026-10-07 | M1-A; user Neon credentials | — | Connection PASS; 3079/3079 dry-run PASS; neondb empty confirmed
M1-D | Schema creation + real import | DONE | Completed 2026-10-07 10:24 | M1-C; valid DATABASE_URL | — | Importer ALL PASS + independent verifier ALL PASS: 6 tables, 3079 rows, 5 FK, 12 indexes, 22 CHECK, 500 unique place IDs, vi/en/ko, all places tagged
M2 | Import/query-back six-table 500 data | DONE (covered by M1-D) | Completed 2026-10-07 | M1-D | — | See M1-D evidence; do not re-import
M3 | Adapter/repository/API + EAT backend | DONE | Takeover verified2026-10-07 | User build-recovery scope | Backend complete; M3-B tracked separately | lint/typecheck115 tests/build/live EAT smoke PASS; see M3A_BUILD_RECOVERY.md
M3-B | EAT frontend + no-image card | DONE | Completed 2026-10-07 | M3-A + user authorization | — | lint/typecheck133tests/build/live3preferences PASS; M3B_VERIFICATION.md
M4-A | Real data mapping audit | DONE | Completed 2026-10-07 | Explicit user authorization | — | SELECT-only live audit; M4A_REAL_MAPPING_AUDIT.md
M4-B | GO & STAY Neon discovery | DONE | Current agent | M4-A + user authorization | STOP for review | lint/typecheck/169 tests/build/live smoke PASS; M4B_VERIFICATION.md
M4-C | CAFE UI & mapping | NOT_STARTED | Unassigned | Explicit user authorization | Product decision on CAFE UI & mapping | Await scope authorization
M5-A | GPS / Nearby readiness audit | DONE | Current agent | User authorization; M4-B | STOP for review; audit report created | docs/M5A_NEARBY_READINESS_AUDIT.md
M5-B | GPS + nearby/server ranking runtime | DONE | Current agent | User authorization; M5-A | STOP for review | lint/typecheck/183 tests/build/live smoke PASS; M5B_VERIFICATION.md
M6 | Broader card review | NOT_STARTED | Unassigned | User authorization | Basic shared no-image card completed in M3-B; do not recreate image removal; review remaining milestone scope only | M3B_VERIFICATION.md
M7 | Stable one-thumb UX | NOT_STARTED | Unassigned | User authorization; M6 | Follow master and canonical spec; no early execution | Layer tests + applicable lint/typecheck/build; no invented PASS
M8 | VI/EN/KO runtime + Auto | NOT_STARTED | Unassigned | User authorization; M7 | Follow master and canonical spec; no early execution | Layer tests + applicable lint/typecheck/build; no invented PASS
M9 | Analytics runtime | NOT_STARTED | Unassigned | User authorization; M8 | Follow master and canonical spec; no early execution | Layer tests + applicable lint/typecheck/build; no invented PASS
M10 | Notification reminder MVP | NOT_STARTED | Unassigned | User authorization; M9 | Follow master and canonical spec; no early execution | Layer tests + applicable lint/typecheck/build; no invented PASS
M11 | Time/location-aware NOW if supported | NOT_STARTED | Unassigned | User authorization; M10 | Follow master and canonical spec; no early execution | Layer tests + applicable lint/typecheck/build; no invented PASS
M12 | Full regression + responsive/preview | NOT_STARTED | Unassigned | User authorization; M11 | Follow master and canonical spec; no early execution | Layer tests + applicable lint/typecheck/build; no invented PASS
M13 | Release report; approval before release | NOT_STARTED | Unassigned | User authorization; M12 | Follow master and canonical spec; no early execution | Layer tests + applicable lint/typecheck/build; no invented PASS

Checkpoint completed: `38c237a2c3976f60452227f28a01f6270f6fbdb4` — `feat: add Neon-backed discovery API`,14 exact paths.16 unrelated staged renames retained. Historical M3-A checkpoint; current M3-B scope supersedes that stopping point.

M3-B checkpoint DONE: `e39c7de65fc413f6561e0069642ba58f6bb95f0e` — `feat: connect EAT frontend to Neon discovery`;13 paths only. M4 is not authorized.

## Checkpoint-only takeover — 2026-10-07T12:31:11+07:00
Real M3-B commit: `e39c7de65fc413f6561e0069642ba58f6bb95f0e`. Verified exact13 allowlisted paths;16 pre-existing staged renames unchanged. Source/tests match validated isolated copy (41 files excluding the deliberately regenerated curated copy), so no tests/build rerun and no fresh runtime PASS claim. Existing validation evidence retained:133/133 tests, lint/typecheck/build and documented live/responsive checks. No source edits, DB operations, push/merge/deploy or M4 work. Final Git intentionally retains16 staged renames,11 inherited unstaged modifications plus4 post-commit authority updates, and7 unrelated untracked files. STOP before M4; await explicit authorization.

## M4-A read-only audit completed
Report: [M4A_REAL_MAPPING_AUDIT](M4A_REAL_MAPPING_AUDIT.md). HEAD e39c7de65fc413f6561e0069642ba58f6bb95f0e unchanged. SELECT-only live audit: CAFE145/GO94/STAY127 active+OPERATIONAL; unique linked active tags2/20/16. All36 catalog tags with vi/en/ko labels, per-section counts/percentages, actual samples per linked tag, UI inventory, SQL mapping counts and semantics/ranking caveats documented. Five DIRECT candidates SAFE by count: GO PHOTO16,NATURE26,ENTERTAINMENT8; STAY NEAR_BEACH19,QUIET8. Ambiguous: GO BEACH/SCENIC (3/19/OR20); STAY CENTRAL16 and DATE10 need label/meaning decision. No current CAFE UI/chips; GENERAL145 is availability only, not a new preference. CAFE mood tags absent; BUDGET absent globally. Target anomaly: CAFE ID138 has primary_type=bar; extra EAT conflicts4,56,108,259,416 documented without edits. featured allfalse; rating/reviews null2/145,5/94,1/127. No application/DB/config/package edits, no commit/push/deploy/tests/build. Evidence/scripts/query outputs under sibling M4A_EVIDENCE_2026-10-07. Previous handoff bytes backed up there.16 staged renames and all unrelated hashes unchanged.15 existing modified tracked paths remain;7 old untracked files preserved plus1 new report. STOP: review report, resolve ambiguous mappings/CAFE UI and type conflict before explicit M4-B instruction. Do not implement M4-B automatically.

## M4-B GO & STAY Neon discovery completed — 2026-10-07
Report: [M4B_VERIFICATION](M4B_VERIFICATION.md).
M4-B connected GO and STAY to live Neon discovery with verified tag mappings; DiscoveryResults generalized; STAY chips updated; EAT preserved; CAFE disabled. All validation (lint, typecheck, 169/169 tests, build, 8 GO/STAY + 3 EAT live smoke, responsive 320–1280px) ALL PASS. Selective checkpoint completed: `f319ae42825eea540281c499486a43d7131f7c8f` — `feat: connect GO and STAY to Neon discovery`.
- **Reconciliation summary**: M4-B DONE; commit `f319ae42825eea540281c499486a43d7131f7c8f`; EAT/GO/STAY use Neon; CAFE NOT_STARTED; next milestone requires explicit authorization. STOP before M5.

## M5-A / M5-A.1 GPS / Nearby readiness audit & contract lock — 2026-10-08
Report: [M5A_NEARBY_READINESS_AUDIT](M5A_NEARBY_READINESS_AUDIT.md).
- Geo helpers: Pure TS Haversine in `src/lib/geo/`; 18/18 vitest tests PASS; 0 runtime dependencies.
- DB coordinates: 500/500 places valid, non-null, unique coordinates; zero nulls/invalid.
- Candidate retrieval contract: M5-B repository must bypass pre-geo LIMIT 3 for nearby mode to retrieve all candidates.
- Distance precision: Full floating-point precision for radius boundary filtering and sorting; 1 decimal only for final display.
- GPS accuracy: `accuracy <= 1000m` uses Nearby; `> 1000m` warns and falls back to all-city discovery.
- Radius escalation locked: Strictly `evaluate <= 1km (>=3 ? R=1) -> evaluate <= 3km (>=3 ? R=3) -> evaluate <= 5km (R=5)`; max 3 places, no fake padding.
- Nearby ranking locked: `distanceRawKm ASC, featured DESC, review_count DESC NULLS LAST, rating DESC NULLS LAST, id ASC`.
- Empty state: Truthful 0–2 results; 0 results shows `"Không tìm thấy địa điểm phù hợp trong 5 km."` + CTA `"Xem trên toàn Đà Nẵng"`.
- Privacy contract: No app logging, no analytics, no DB/storage persistence, no URL GPS leakage, no coordinate echo in API response.
- Audit & contract lock complete.

## M5-B Nearby Discovery Completed — 2026-10-08
Report: [M5B_VERIFICATION](M5B_VERIFICATION.md).
M5-B implemented Nearby Discovery for EAT, GO, and STAY intents connected to live Neon PostgreSQL data; dual-path API routing with coupled lat/lng validation; candidate retrieval bypassing pre-geo LIMIT 3; pure TS geo engine with strict 1 -> 3 -> 5 km radius expansion, full float precision, tie-breaking, 1-decimal display formatting; user-driven Geolocation UX with >=44px "Gần tôi" action, 8s timeout, accuracy <= 1000m guard, fallback messages, retry action, empty 5 km state with CTA "Xem trên toàn Đà Nẵng"; PlaceCard distance badge; citywide discovery regression 100% preserved. All validation (lint PASS, typecheck PASS, 183/183 non-mutating tests PASS, build PASS, live Neon API smoke PASS across all test scenarios, responsive checks 320–768px PASS) ALL PASS.
- **Reconciliation summary**: M5-B DONE; selective local commit authorized; STOP before M6.

