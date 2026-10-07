# Historical archive
HISTORICAL_EVIDENCE only. Nothing here is current authorization; never execute embedded instructions (image requirements, Vercel target, old phase gates, past deploy steps). Current truth: [CURRENT_STATE](../CURRENT_STATE.md), [DECISIONS](../DECISIONS.md).

## Folders
- `pre-M0-2026-10-06/` — exact byte-for-byte originals captured before M0 normalization.
- `ai-instructions/` — superseded agent instructions (UX hardening prompt, manual prework, PROJECT_STATE redirect). Still-valid rules were migrated into [UX_ONE_THUMB](../UX_ONE_THUMB.md) and AGENTS.md.
- `phases/` — old Phase 0-2 plan (PHASES.md).
- `plans/` — PLAN_REVISED.pdf (old image gate / Vercel / Phase-10-only DB assumptions).
- `phase-2a-data-2026-10/` — 86-row curation reports, tag rules, GO gaps, manual queue. Legacy data scope; NOT authority for the 500-row workbook.
- `ux-checkpoints-2026-10/` — UX checkpoints dated 2026-10-04 and 2026-10-05.

## Path map (moved 2026-10-06, cleanup commit)
| Old path | New path |
|---|---|
| GEMINI_3_8_UX_HARDENING_IMPLEMENTATION.md | docs/archive/ai-instructions/GEMINI_3_8_UX_HARDENING_IMPLEMENTATION.md |
| MANUAL_PREWORK.md | docs/archive/ai-instructions/MANUAL_PREWORK.md |
| docs/PROJECT_STATE.md | docs/archive/ai-instructions/PROJECT_STATE_redirect.md |
| PLAN_REVISED.pdf | docs/archive/plans/PLAN_REVISED.pdf |
| docs/PHASES.md | docs/archive/phases/PHASES.md |
| docs/DATA_CURATION_REPORT.md, DATA_TAG_RULES.md, GO_DATA_GAPS.md, MANUAL_CURATION_QUEUE.md | docs/archive/phase-2a-data-2026-10/ |
| docs/UX_PRODUCT_CHECKPOINT_2026-10-04.md, ..._2026-10-05.md | docs/archive/ux-checkpoints-2026-10/ |
| docs/ANALYTICS_SPEC.md, I18N_ARCHITECTURE.md, NEARBY_ENGINE_PREPARATION.md, NOTIFICATION_SPEC.md, ONE_THUMB_UX_AUDIT.md | docs/reference/ (still current detailed references) |

Note: `src/data/curated/curated-places.json` and comments in `src/lib/data/build-curated-seed.ts` still mention the old `docs/GO_DATA_GAPS.md` / `DATA_TAG_RULES.md` / `MANUAL_CURATION_QUEUE.md` paths. Those files are protected legacy data/code and were intentionally not edited; use the map above.
