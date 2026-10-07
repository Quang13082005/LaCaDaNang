# AGENTS — LA CÀ ĐÀ NẴNG
CURRENT_AUTHORITY — repository cleanup + database preparation, updated 2026-10-06.

## Authority and startup
The user's latest explicit scope overrides attached plans. Latest user scope authorizes C0 handoff verification, C1 safe repository cleanup, C2 repository normalization, C3 DB provider reconciliation/Neon preparation and C4 PostgreSQL schema + offline workbook dry-run import preparation; then STOP for user review. No real DB import without an actual Neon project/credentials supplied by the user. No Home/UI/GPS/analytics/notification/i18n runtime work, push, merge or deploy. Do not execute every milestone merely because the master prompt describes it.
Every agent reads, in order: this file; [NON_NEGOTIABLES](docs/NON_NEGOTIABLES.md); [CURRENT_STATE](docs/CURRENT_STATE.md); [DECISIONS](docs/DECISIONS.md); [HANDOFF_CURRENT](docs/HANDOFF_CURRENT.md); [AGENT_TASK_QUEUE](docs/AGENT_TASK_QUEUE.md). All agents must strictly adhere to [NON_NEGOTIABLES](docs/NON_NEGOTIABLES.md) before any implementation. Then run Git status/diff/log and verify source against the handoff.
Milestone specifications and the user-supplied [master prompt](docs/inputs/ASTRA6_MASTER_EXECUTION_PROMPT_NO_IMAGE_MVP.md) follow this authority chain. Historical plans/checkpoints are evidence only; see [DOCUMENT_AUTHORITY](docs/DOCUMENT_AUTHORITY.md). Never restart Phase 0 without evidence of corruption.

## Safety and ownership
- Never git clean, reset --hard, delete untracked files, discard unrelated work or switch branches before safety/ownership verification. A backup is not permission to switch.
- Protect untracked work with hash-verified copies before changing shared documents. Do not stage/commit everything blindly. M0.5 may create a selective local checkpoint after validation; no push/merge/deploy or main/master changes.
- Before implementation identify owned files, callers and exact changes. Another DB session was previously active; absence of local changes does not establish exclusive ownership.
- Keep patches scoped; preserve working behavior. Do not add/upgrade packages, change lockfiles, Cloudflare/OpenNext config, fonts, global styles/tokens, curated data, schema or pipelines unless explicitly required by the authorized milestone.
- Do not delete/replace public assets or historical evidence. Do not silently catch errors, fabricate success or suppress type/test failures.
- Never write secret values to handoffs/logs. Environment variable names only.
- Existing curation tests write curated JSON. Run them in an isolated copy unless proven non-mutating. Do not regenerate the old 86-row seed from the new workbook.

## Product decisions
- MVP does not depend on venue images: no imageUrl/photoCount render requirement, place_media join, scraping or image-based ranking. Static Hero/intent artwork may remain. Runtime card still uses images until its authorized milestone fixes it.
- New data source: LA_CA_DB_READY_500_NO_IMAGE_FINAL.xlsx, six core tables, EAT/CAFE/GO/STAY. Preserve workbook IDs and truthful coverage exceptions; do not apply the old 15km seed exclusion automatically to the new administrative coverage.
- DB integration is the next critical path. Confirm existing provider/project/schema and owner first; never create a competing DB or invent credentials/schema. User accepted Neon PostgreSQL as the default provider ONLY if no existing production DB is found (none found in repo/env audit). Timestamps: Excel serial -> naive TIMESTAMP WITHOUT TIME ZONE; never attach Z/+07/UTC; source timestamps are never open-now evidence.
- Runtime NOW is a sample, not time-aware. Do not claim live hours, prices, availability, travel times or user distance without evidence.
- At most three truthful results (0/1/2 allowed), no padding. Preserve useful results within <=3 deliberate taps, preferably two.
- Do not infer subjective tags from venue types. Do not invent translations, Google identities or Maps URLs. Open stored valid Maps URLs only.
- No auth, booking, payments, social feed, public reviews, chat, runtime LLM recommendation or map SDK expansion without authorization.

## UX and architecture
DB -> repository -> adapter -> API/service -> frontend view model. Do not expose raw DB rows/credentials in presentation components.
One-thumb target: stable intent positions, predictable lower primary actions, safe-area/keyboard clearance, >=44px targets. Preserve context/reset/empty states, accessibility and reduced motion. No core text clamp/truncate/ellipsis/missing meaning. No-overflow alone is not PASS.
Minimum UI matrix: 360x800,390x844,430x932,768x900,1280x900; also inspect narrow clipping at 320,375,393,412,440,480 where requested. Capture screenshots after UI changes; browser viewports are not physical-device certification.
Keep existing sky/orange design tokens and Be Vietnam Pro. New locale runtime must preserve IDs/state and use VI/EN/KO/Auto with safe source fallback; KO human review remains pending.
Actual deployment architecture is Cloudflare Workers/OpenNext, not Vercel. Production release requires explicit approval and verified build/smoke evidence.

## Validation and handoff
For runtime changes: lint, typecheck, focused/integration/regression tests, build and responsive checks when UI changes. Report actual commands, cwd and result; never present old results as new.
M0 documentation-only validation: backup hashes, unchanged protected source/data/config hashes, document/link/authority consistency, Git diff review/check. Lint/tests/build are NOT RUN in M0; this scope-specific gate does not waive validation for M1+.
Before stopping, on interruption/blocker, before risky work, after every milestone, or when context/credit is estimated <=25%: stop new work and update CURRENT_STATE, HANDOFF_CURRENT and AGENT_TASK_QUEUE using the supplied template. Include timestamp, Git status, exact commands/results, touched/untouched files, DB/API state, data hash, blockers, recovery, DO NOT REDO/TOUCH and exact next step.
Use queue statuses NOT_STARTED/IN_PROGRESS/BLOCKED/READY_FOR_REVIEW/DONE. Claim DONE only for the authorized scope actually verified. STOP at the user's milestone boundary.
