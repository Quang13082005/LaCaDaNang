# CAFE activation — BLOCKED before implementation

2026-10-09. Read-only audit refreshed during continuation. CAFE remains disabled in Discovery API and has no secondary UI entry yet. No CAFE activation commit exists. Its use as one stop inside NOW is separate from enabling a CAFE discovery intent and carries only the existing NOW event.

## Verified data

Active/OPERATIONAL CAFE count145. Active tags: CAFE145 (100%), POPULAR4 (~2.76%). Rating143/145, review_count143/145, non-null coordinates145/145. Translation row coverage VI145, EN145, KO145; row coverage does not certify translation quality. Query evidence: sibling CONTINUATION_2026-10-09/now-live.json and now-tag-audit.json; source SELECT script now-live-entry.txt. Zero writes.

General CAFE145 is a supported proposed filter. POPULAR4 meets three-result citywide capacity but has low coverage; do not expose additional subjective tags. Preferences/labels are proposals only until activation resumes.

## CAFE ANALYTICS CONTRACT BLOCKER

The owner's Phase C10 explicitly says: "If CAFE activation requires changing the canonical Analytics enum/event contract: STOP and report: CAFE ANALYTICS CONTRACT BLOCKER".

Actual source `src/lib/analytics/types.ts` ANALYTICS_INTENTS = NOW/EAT/GO/STAY. `validator.ts` uses that strict enum. `docs/schema/002_analytics_events.sql` has the same CHECK constraint. Reusing current DiscoveryResults/PlaceCard/Home tracking with intent=CAFE would require extending this contract or explicitly excluding CAFE from telemetry. Never relabel CAFE as EAT or cast it past the validator. No analytics schema/query/event has been changed.

Two concrete routes for owner decision:
1. Enable CAFE with explicit, documented telemetry exclusion for CAFE-specific intent/preference/results/nearby/maps events, retaining the 11-event schema and existing tracked flows. Generic language/session events can stay unchanged. This needs a visible tracking boundary through shared discovery components and regression tests; do not silently drop events or send CAFE under another intent.
2. Authorize a separate analytics contract extension adding CAFE consistently to types, validators, reports/tests and DB constraint. This requires schema/migration authority outside current no-mutation scope; no migration executed.

Recommendation under current no-DB-change scope: option1 only after owner explicitly accepts the analytics coverage gap. Preserve four primary2×2cards; proposed compact secondary CAFE entry, generic Nearby reuse1→3→5, VI/EN/KO, no fake tags. EAT subtitle correction remains queued with CAFE activation.

## Status

CAFE UI/API/preferences/nearby/locale/live acceptance: NOT IMPLEMENTED/NOT VERIFIED. No fifth card or hidden general CAFE enablement. Full Phase D is blocked on this decision. Existing EAT/GO/STAY/Nearby/Maps/Reminder/i18n/analytics regression is separately tested in the NOW checkpoint; that does not mean CAFE passed.

Exact next step: owner selects explicit CAFE telemetry exclusion or separately authorizes analytics contract extension; next agent verifies Git/handoff then implements only the chosen route. Do not restart Hero/NOW or import DB again. No push/deploy, Calendar or Nearby sparsity work.
