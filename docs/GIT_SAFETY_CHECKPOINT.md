# M0.5 Git safety inventory

Scope: initial41 untracked files from M0. Every file explicitly classified; no git add . or destructive Git commands. Generated/test-copy/build-copy/backups outside repo excluded. No GENERATED/BACKUP_ONLY/STALE file among these41: archived Markdown here is intentionally retained documentation, not build output.

File | Classification | Stage in local checkpoint | Reason
---|---|---|---
GEMINI_3_8_UX_HARDENING_IMPLEMENTATION.md | DOC_REQUIRED | YES | Canonical/spec/input or referenced historical instruction retained for durable handoff
docs/AGENT_TASK_QUEUE.md | DOC_REQUIRED | YES | Canonical/spec/input or referenced historical instruction retained for durable handoff
docs/ANALYTICS.md | DOC_REQUIRED | YES | Canonical/spec/input or referenced historical instruction retained for durable handoff
docs/ANALYTICS_SPEC.md | DOC_REQUIRED | YES | Canonical/spec/input or referenced historical instruction retained for durable handoff
docs/CURRENT_STATE.md | DOC_REQUIRED | YES | Canonical/spec/input or referenced historical instruction retained for durable handoff
docs/DATA_CONTRACT_NO_IMAGE.md | DOC_REQUIRED | YES | Canonical/spec/input or referenced historical instruction retained for durable handoff
docs/DB_INTEGRATION.md | DOC_REQUIRED | YES | Canonical/spec/input or referenced historical instruction retained for durable handoff
docs/DECISIONS.md | DOC_REQUIRED | YES | Canonical/spec/input or referenced historical instruction retained for durable handoff
docs/DOCUMENT_AUTHORITY.md | DOC_REQUIRED | YES | Canonical/spec/input or referenced historical instruction retained for durable handoff
docs/HANDOFF_CURRENT.md | DOC_REQUIRED | YES | Canonical/spec/input or referenced historical instruction retained for durable handoff
docs/I18N.md | DOC_REQUIRED | YES | Canonical/spec/input or referenced historical instruction retained for durable handoff
docs/I18N_ARCHITECTURE.md | DOC_REQUIRED | YES | Canonical/spec/input or referenced historical instruction retained for durable handoff
docs/NEARBY_DISCOVERY.md | DOC_REQUIRED | YES | Canonical/spec/input or referenced historical instruction retained for durable handoff
docs/NEARBY_ENGINE_PREPARATION.md | DOC_REQUIRED | YES | Canonical/spec/input or referenced historical instruction retained for durable handoff
docs/NOTIFICATIONS.md | DOC_REQUIRED | YES | Canonical/spec/input or referenced historical instruction retained for durable handoff
docs/NOTIFICATION_SPEC.md | DOC_REQUIRED | YES | Canonical/spec/input or referenced historical instruction retained for durable handoff
docs/ONE_THUMB_UX_AUDIT.md | DOC_REQUIRED | YES | Canonical/spec/input or referenced historical instruction retained for durable handoff
docs/UX_ONE_THUMB.md | DOC_REQUIRED | YES | Canonical/spec/input or referenced historical instruction retained for durable handoff
docs/UX_PRODUCT_CHECKPOINT_2026-10-04.md | DOC_REQUIRED | YES | Canonical/spec/input or referenced historical instruction retained for durable handoff
docs/UX_PRODUCT_CHECKPOINT_2026-10-05.md | DOC_REQUIRED | YES | Canonical/spec/input or referenced historical instruction retained for durable handoff
docs/archive/README.md | DOC_REQUIRED | YES | Canonical/spec/input or referenced historical instruction retained for durable handoff
docs/archive/pre-M0-2026-10-06/AGENTS.md | DOC_REQUIRED | YES | Canonical/spec/input or referenced historical instruction retained for durable handoff
docs/archive/pre-M0-2026-10-06/GEMINI.md | DOC_REQUIRED | YES | Canonical/spec/input or referenced historical instruction retained for durable handoff
docs/archive/pre-M0-2026-10-06/GEMINI_3_8_UX_HARDENING_IMPLEMENTATION.md | DOC_REQUIRED | YES | Canonical/spec/input or referenced historical instruction retained for durable handoff
docs/archive/pre-M0-2026-10-06/MANUAL_PREWORK.md | DOC_REQUIRED | YES | Canonical/spec/input or referenced historical instruction retained for durable handoff
docs/archive/pre-M0-2026-10-06/docs/PHASES.md | DOC_REQUIRED | YES | Canonical/spec/input or referenced historical instruction retained for durable handoff
docs/archive/pre-M0-2026-10-06/docs/PROJECT_STATE.md | DOC_REQUIRED | YES | Canonical/spec/input or referenced historical instruction retained for durable handoff
docs/evidence/commands.md | EVIDENCE_ONLY | NO | Machine-local M0 log/manifest, retain locally without staging
docs/evidence/git-before.txt | EVIDENCE_ONLY | NO | Machine-local M0 log/manifest, retain locally without staging
docs/evidence/git-final.txt | EVIDENCE_ONLY | NO | Machine-local M0 log/manifest, retain locally without staging
docs/evidence/protection-manifest.json | EVIDENCE_ONLY | NO | Machine-local M0 log/manifest, retain locally without staging
docs/evidence/validation.json | EVIDENCE_ONLY | NO | Machine-local M0 log/manifest, retain locally without staging
docs/evidence/workbook-audit.json | EVIDENCE_ONLY | NO | Machine-local M0 log/manifest, retain locally without staging
docs/inputs/AI_AGENT_HANDOFF_TEMPLATE.md | DOC_REQUIRED | YES | Canonical/spec/input or referenced historical instruction retained for durable handoff
docs/inputs/ASTRA6_MASTER_EXECUTION_PROMPT_NO_IMAGE_MVP.md | DOC_REQUIRED | YES | Canonical/spec/input or referenced historical instruction retained for durable handoff
src/lib/geo/distance.ts | SOURCE_REQUIRED | YES | Pure geo/i18n source, runtime foundations
src/lib/geo/filter-nearby.ts | SOURCE_REQUIRED | YES | Pure geo/i18n source, runtime foundations
src/lib/i18n/locales.ts | SOURCE_REQUIRED | YES | Pure geo/i18n source, runtime foundations
src/lib/i18n/messages.ts | SOURCE_REQUIRED | YES | Pure geo/i18n source, runtime foundations
tests/geo.test.ts | TEST_REQUIRED | YES | Focused non-curation regression tests
tests/i18n.test.ts | TEST_REQUIRED | YES | Focused non-curation regression tests

The6 docs/evidence files stay untracked/local. Links to them are optional local evidence; durable facts are in canonical docs. Archive originals remain DOC_REQUIRED because current authority redirects to them; retained history does not authorize executing old instructions. All initial files preserved in sibling M05_M1A_HANDOFF/pre-checkpoint, independently of Git.
