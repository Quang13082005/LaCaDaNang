> CURRENT_REFERENCE — 2026-10-06. Use docs/UX_ONE_THUMB.md as the canonical milestone specification. This document provides baseline/details; newer vocabulary/scope wins on conflict. Current authority: docs/CURRENT_STATE.md, docs/DECISIONS.md and docs/HANDOFF_CURRENT.md (paths relative to repository root). Original content retained below as evidence, not execution authorization.

# One-thumb UX — 2026-10-04

Baseline: `a749466`, `phase-2a-deploy`. This is a new acceptance gate, separate from the earlier text-clipping pass. A text-clipping PASS does not establish thumb reachability.

## Current flow and findings

Home → intent → preference → result / sample itinerary takes two taps. Maps requires a third tap where a stored URL exists. Reset returns to the active preference panel. Closing the active intent returns Home.

- Home: four large targets, but their vertical positions depend on Hero and viewport height. NOW near the top of the choices is harder to reach than STAY.
- Intent: `IntentGrid` moves whichever intent was tapped into the first row. This is a deliberate context change in the old design but fails the new stable-position requirement.
- Preference: hiding Hero and scrolling to the selection anchor places the required next action near the top. Live baseline at 390×844: active EAT y=28, preference rows y=145 and 197, 44px tall. The second tap is outside the lower thumb region.
- Result: reset lives in the top context header and wraps to another row depending on text width. Its position differs from itinerary reset.
- Maps: full-width CTA at the bottom of each eligible card is a good pattern; no link is fabricated for places without a stored URL. Card height and scroll position still affect reach.
- Itinerary: Maps remains at the bottom of each eligible stop, but reset is high in a separate banner; the first stop can be high on a tall screen.
- Controls: current preference grid has 8px gaps, minimum 44px targets. Do not shrink targets to make the layout fit.

## Smallest proposed repair, pending file ownership

1. Keep a consistent mobile bottom decision area for intent/preference controls. Use normal flow with a minimum dynamic viewport height and bottom alignment before considering a fixed overlay. Do not make every card/button fixed.
2. Preserve intent order and a stable slot for changing intent; do not reorder the active button after a tap. Keep the next preference action in the same lower region.
3. Use one consistent reset pattern at the bottom of result/itinerary, with space reserved if a sticky action is necessary. Keep card Maps at the card bottom, full width, minimum 44px.
4. Preserve two taps to results and three to Maps; no extra confirmation or required filter.
5. Short screens, text zoom, keyboard and safe-area must scroll without covered content. Both left- and right-hand use need actual-device feedback; a CSS threshold alone is not proof of physical reach.

## Conflict gate

Likely shared files: `src/app/page.tsx`, `src/data/demo-places.ts`, `src/components/home/{IntentGrid,PreferencePanel}.tsx`, results/itinerary components, data/types/API and `docs/PROJECT_STATE.md`. No DB ownership manifest is present in this checkout. A clean git status does not prove another session will not edit these files.

Do not modify these files until ownership is known. User explicitly requires stopping the conflictable part, not pre-emptively refactoring it. UI implementation and one-thumb acceptance remain **PENDING / NOT PASS** while this gate is unresolved.

## Verification plan

At 360×800, 390×844, 430×932, 768×900 and 1280×900: record bounding boxes and screenshots for Home, each intent, preference → result, Maps, reset and NOW → itinerary. Compare same-function controls before/after. Check ≥44×44, gaps, bottom reach, no overlap/clipping, no content behind actions, no accidental extra tap, and stable focus. Repeat with long copy and zero/one/two results after DB handoff. Human one-hand verification remains necessary before claiming the mentor's physical-use criterion is met.

## Live baseline measurements this session

Measured production DOM after confirming state and actual viewport; values are top y in CSS px, not a physical thumb-radius model. All listed controls are 44px tall.

- 360×800: EAT result reset y=45, Maps y=371; itinerary reset y=136, Maps y=323.
- 390×844: EAT result reset y=45, Maps y=389; itinerary reset y=136, Maps y=323.
- 430×932: EAT result reset y=45, Maps y=424; itinerary reset y=136, Maps y=323.
- 768×900: EAT result reset y=57, Maps y=340; itinerary reset y=84, Maps y=291.
- 1280×900: EAT result reset y=57, Maps y=366; itinerary reset y=84, Maps y=291.

Baseline source and live Home/EAT preference/result/reset/NOW preference/itinerary inspected. Full per-intent × viewport post-change matrix has NOT been run because UI code remains intentionally unchanged. Earlier 2026-10-03 clipping screenshots are historical context, not evidence for this new thumb criterion. An early rapid-resize measurement batch had stale viewport/state and was discarded; only confirmed measurements above are used. No claim that “≥44px” alone proves one-hand comfort.
