# Agent task queue
CURRENT_AUTHORITY — 2026-10-06. M0.5 and M1-A authorized; STOP before M1-B.

ID | milestone | status | owner/current agent | dependencies | exact next action | verification
---|---|---|---|---|---|---
M0 | Protect work + docs + handoff | DONE | Current Codex | User M0 request | Review docs and handoff; STOP | M0 evidence/validation.json + Git diff check
M1 | Provider/schema + no-image contract | BLOCKED | Current Codex audit; provider owner unknown | M1-A decision | Confirm provider/schema/time policy; code not created | Audit complete; no DB proof
M2 | Import/query-back six-table500 data | NOT_STARTED | Unassigned | User authorization; M1 | Follow master and canonical spec; no early execution | Layer tests + applicable lint/typecheck/build; no invented PASS
M3 | Adapter/repository/API + EAT | NOT_STARTED | Unassigned | User authorization; M2 | Follow master and canonical spec; no early execution | Layer tests + applicable lint/typecheck/build; no invented PASS
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

M0.5 | Selective local checkpoint | DONE | Current Codex | M0 | Local dd72754 created; no push |40/40 tests;45-file allowlist; hashes
M1-A | Provider + schema/import planning | BLOCKED | Current Codex | M0.5 | Review completed audit; choose/hand over provider and timestamp policy | Workbook QA passed; actual schema unconfirmed
M1-B | Contract after provider/schema decision | NOT_STARTED | Unassigned | User authorization;provider/schema/time | First obtain real provider/schema/owner; no implementation yet | Future validation
