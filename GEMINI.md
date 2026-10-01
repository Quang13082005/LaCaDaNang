# GEMINI.md — Project Context

Project: Da Nang 3-Tap Discovery
Deploy target: Vercel (URL added to PROJECT_STATE after Phase 0 deploy)

Read and obey in this order:
1. @./AGENTS.md
2. @./docs/PHASES.md
3. @./docs/PROJECT_STATE.md

Current phase: read `docs/PROJECT_STATE.md` — it is the single source of truth.

Core rules:
- A useful recommendation must be reachable from Home in at most 3 taps.
- UI quality is a product requirement, not cosmetic.
- Work on exactly one requested phase.
- Inspect before editing.
- Keep diffs narrow.
- Do not refactor unrelated working code.
- Do not change locked design tokens/global styles without explicit approval.
- Do not add or upgrade dependencies without stating package name + reason first.
- Do not delete/replace public image assets outside current phase scope.
- Run current + all previous phase tests before claiming DONE.
- Update `docs/PROJECT_STATE.md` after every completed phase.
- STOP after the phase checkpoint and wait for user approval.

Before coding a phase, report:
1. current phase + status,
2. exact deliverables,
3. exact acceptance criteria,
4. files/folders you plan to change,
5. dependencies/packages you plan to add,
6. what you will explicitly NOT do.

Do not begin implementation until the user confirms the plan when they explicitly request a readiness/planning pass.
