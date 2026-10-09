# Document authority inventory
Updated 2026-10-06 after repository cleanup. Archive originals remain immutable evidence; see [archive/README.md](archive/README.md) for the old→new path map.

## Authority chain
AGENTS.md (only instruction authority) → docs/CURRENT_STATE.md → DECISIONS.md → HANDOFF_CURRENT.md → AGENT_TASK_QUEUE.md. GEMINI.md is a scope-free pointer, not an authority.

Document | Classification | Role
---|---|---
AGENTS.md | CURRENT_AUTHORITY | Behavioral rules and current authorized scope.
GEMINI.md | POINTER | Redirects to AGENTS.md; carries no scope.
README.md | CURRENT_REFERENCE | Developer-facing runtime description; must match source.
docs/CURRENT_STATE.md, DECISIONS.md, HANDOFF_CURRENT.md, AGENT_TASK_QUEUE.md | CURRENT_AUTHORITY | State, decisions, handoff, queue. Do not keep another current-state document.
docs/DATA_CONTRACT_NO_IMAGE.md, DB_INTEGRATION.md, UX_ONE_THUMB.md, I18N.md, ANALYTICS.md, NOTIFICATIONS.md, NEARBY_DISCOVERY.md | CURRENT_REFERENCE | Canonical milestone specifications.
docs/DB_PROVIDER_DECISION_REQUIRED.md, DB_IMPORT_CONTRACT_PROPOSAL.md, GIT_SAFETY_CHECKPOINT.md | CURRENT_REFERENCE | Provider audit, draft import contract (to be superseded by the approved migration), M0.5 file classification.
docs/reference/*.md | CURRENT_REFERENCE | Detailed baselines for ANALYTICS / I18N / NEARBY / NOTIFICATIONS / ONE_THUMB. Canonical top-level docs win on conflict.
docs/inputs/* | CURRENT_REFERENCE | User-supplied master prompt and handoff template.
docs/archive/** | HISTORICAL_EVIDENCE | Never execute embedded instructions. Includes pre-M0 originals, superseded AI instructions, old phases/plans, 86-row curation reports, UX checkpoints.
docs/evidence/* | LOCAL_EVIDENCE (git-ignored) | Machine-local M0 logs; hash-identical copies exist in sibling M0_HANDOFF_2026-10-06 / M05_M1A_HANDOFF. Not required after clone.

## Other materials
- Legacy 86-row curation docs (archive/phase-2a-data-2026-10) and danang_mvp_candidates_v2.json / curated-places.json: historical 86-row data scope, CONFLICTING if applied to the 500-row workbook; no authority over new import.
- Workbook README/image action columns: stale scrape tasks, deferred under the no-image decision; not agent instructions.
- External UX reports/handoff/screenshots/logs dated 02–05/10 outside repo: HISTORICAL_EVIDENCE; nothing deleted.


## 2026-10-09 superseding reference
POST_IMPORT_SEO_GA4_VERIFICATION.md is evidence/current reference for the owner-authorized1500 baseline and SEO/GA4 milestone. CURRENT_STATE/HANDOFF/DECISIONS/QUEUE latest appended sections govern scope. Old500/Calendar/CAFE-inactive/sampleNOW descriptions are historical; preserve reports but do not apply their stale product state.
