# Agent task queue
CURRENT_AUTHORITY — 2026-10-07T11:53:30+07:00. M3-A source/build/live API verified; selective local checkpoint authorized. STOP; M3-B NOT_STARTED.

ID | milestone | status | owner/current agent | dependencies | exact next action | verification
---|---|---|---|---|---|---
M0 | Protect work + docs + handoff | DONE | Completed | — | — | M0 evidence/validation.json + Git diff check
M0.5 | Selective local checkpoint | DONE | Completed | M0 | — | 40/40 tests; 45-file allowlist; hashes
M1-A | Provider + schema/import planning | DONE | Completed | M0.5 | — | Workbook QA passed; audit complete
M1-C | Neon connection verify + dry-run | DONE | Completed 2026-10-07 | M1-A; user Neon credentials | — | Connection PASS; 3079/3079 dry-run PASS; neondb empty confirmed
M1-D | Schema creation + real import | DONE | Completed 2026-10-07 10:24 | M1-C; valid DATABASE_URL | — | Importer ALL PASS + independent verifier ALL PASS: 6 tables, 3079 rows, 5 FK, 12 indexes, 22 CHECK, 500 unique place IDs, vi/en/ko, all places tagged
M2 | Import/query-back six-table 500 data | DONE (covered by M1-D) | Completed 2026-10-07 | M1-D | — | See M1-D evidence; do not re-import
M3 | Adapter/repository/API + EAT backend | DONE | Takeover verified2026-10-07 | User build-recovery scope | STOP before M3-B | lint/typecheck115 tests/build/live EAT smoke PASS; see M3A_BUILD_RECOVERY.md
M3-B | EAT frontend wiring | NOT_STARTED | Unassigned | Explicit user authorization after checkpoint review | Recheck Git and scope no-image compatibility | No frontend changes this takeover
M4 | CAFE/GO/STAY + mapping/ranking | NOT_STARTED | Unassigned | User authorization; M3 | Follow master and canonical spec; no early execution | Layer tests + applicable lint/typecheck/build; no invented PASS
M5 | GPS + nearby/server ranking | NOT_STARTED | Unassigned | User authorization; M4 | Follow master and canonical spec; no early execution | Layer tests + applicable lint/typecheck/build; no invented PASS
M6 | Text-first no-image PlaceCard | NOT_STARTED | Unassigned | User authorization; M5 | Follow master and canonical spec; no early execution | Layer tests + applicable lint/typecheck/build; no invented PASS
M7 | Stable one-thumb UX | NOT_STARTED | Unassigned | User authorization; M6 | Follow master and canonical spec; no early execution | Layer tests + applicable lint/typecheck/build; no invented PASS
M8 | VI/EN/KO runtime + Auto | NOT_STARTED | Unassigned | User authorization; M7 | Follow master and canonical spec; no early execution | Layer tests + applicable lint/typecheck/build; no invented PASS
M9 | Analytics runtime | NOT_STARTED | Unassigned | User authorization; M8 | Follow master and canonical spec; no early execution | Layer tests + applicable lint/typecheck/build; no invented PASS
M10 | Notification reminder MVP | NOT_STARTED | Unassigned | User authorization; M9 | Follow master and canonical spec; no early execution | Layer tests + applicable lint/typecheck/build; no invented PASS
M11 | Time/location-aware NOW if supported | NOT_STARTED | Unassigned | User authorization; M10 | Follow master and canonical spec; no early execution | Layer tests + applicable lint/typecheck/build; no invented PASS
M12 | Full regression + responsive/preview | NOT_STARTED | Unassigned | User authorization; M11 | Follow master and canonical spec; no early execution | Layer tests + applicable lint/typecheck/build; no invented PASS
M13 | Release report; approval before release | NOT_STARTED | Unassigned | User authorization; M12 | Follow master and canonical spec; no early execution | Layer tests + applicable lint/typecheck/build; no invented PASS
