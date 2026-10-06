> HISTORICAL_EVIDENCE — 2026-10-06. Past UX implementation prompt is completed history. Its old commit/deploy instructions do not authorize new work. Current authority: docs/CURRENT_STATE.md, docs/DECISIONS.md and docs/HANDOFF_CURRENT.md (paths relative to repository root). Original content retained below as evidence, not execution authorization.

# GEMINI 3.8 — UX HARDENING IMPLEMENTATION
## La Cà Đà Nẵng — Mentor Review Patch

> This task is an **implementation patch** approved after the Astra UX audit.
> It is NOT a new product phase, NOT a UI redesign, and NOT a replacement for Phase 2A.

---

# 0. MISSION

You are continuing the existing **La Cà Đà Nẵng** project.

Current context:
- The project has already completed the earlier UI work.
- Phase 2A data curation/hardening is still the current data phase.
- The project has already been successfully deployed to Cloudflare Workers using OpenNext.
- The current deployment workflow is known to work.
- Astra completed a UX audit and identified concrete UX/truthfulness/responsive problems.
- The mentor now wants the product optimized from the user's point of view:
  **what should be shown, when should it be shown, what should be removed, and what is missing.**

Your job in this task is:

**IMPLEMENT ONLY THE APPROVED UX HARDENING WORK BELOW.**

Do not expand the product.

The expected result is:
- simpler,
- more truthful,
- easier to read,
- easier to tap,
- better on small phones,
- clearer after each decision,
- still fast,
- still recognizable as the current La Cà Đà Nẵng product.

---

# 1. NON-NEGOTIABLE SCOPE RULES

## 1.1 Do not redesign the product

Do NOT:
- replace the current visual identity,
- create a new design system,
- change the entire page structure just for aesthetics,
- add fancy animation,
- add glassmorphism,
- add gradient effects just to look modern,
- create an AI assistant,
- create chat,
- create onboarding,
- create a new navigation system,
- create booking,
- create hotel booking,
- create social features,
- create reviews,
- create accounts/login,
- create a complicated filter system,
- create a new recommendation engine,
- add new product phases.

This is UX hardening, not product expansion.

## 1.2 Do not destroy Phase 2A

Phase 2A is still ongoing.

Treat all Phase 2A curated data, reports, provenance work, tag rules and data-hardening documents as **read-only unless a tiny compatibility change is absolutely required to compile**.

Do NOT:
- rewrite the curated dataset,
- regenerate the seed,
- add hundreds of new places,
- change curation methodology,
- change Phase 2A acceptance criteria,
- resume GO expansion,
- change provenance rules,
- “finish Phase 2A” inside this task.

This UX task must be independently reversible.

## 1.3 Do not invent data

Never fabricate:
- price,
- opening hours,
- travel time,
- distance,
- room availability,
- “near you”,
- “open now”,
- “cheap”,
- “best”,
- “#1”,
- “perfect”,
- “quiet”,
- “lively”,
- “good for couples/groups/family”,
- current-time suitability.

Only show a claim when the current data source supports it.

If support is unclear:
**hide the claim.**

## 1.4 Do not add dependencies unless absolutely unavoidable

Prefer the existing stack and components.

Do not install a package to solve:
- layout,
- scroll,
- responsive,
- tap target,
- text wrapping,
- conditional rendering.

These can be solved with the current application stack.

---

# 2. SAFETY BEFORE EDITING

Before changing code:

1. Read:
   - `AGENTS.md`
   - `GEMINI.md`
   - `docs/PHASES.md`
   - `docs/PROJECT_STATE.md`
   - `HANDOFF.md` if present
   - relevant UX/data rule documents
   - current `src/app/page.tsx`
   - current place/recommendation data and selection logic

2. Run:
   ```bash
   git status
   git branch --show-current
   ```

3. Report the current branch and whether the tree is clean.

4. DO NOT reset, restore, discard, overwrite, rebase, merge, or delete existing user work.

5. Do NOT switch branches unless the user explicitly requested it.

6. If the working tree contains unrelated user changes:
   - preserve them,
   - do not overwrite them,
   - report them,
   - limit edits to clearly relevant files.

The last known deployment branch was:

`phase-2a-deploy`

But DO NOT assume it is still current.
Check first.

---

# 3. UX PRINCIPLE FOR THIS PATCH

At every state ask:

> What does the user need to see to make the NEXT decision?

The user should not continue seeing large UI blocks for a decision they already completed.

Use **progressive disclosure**.

Target mental model:

```text
HOME
  ↓
Choose intent
  ↓
Show relevant preference immediately next to that intent
  ↓
Choose preference
  ↓
Collapse completed decision UI
  ↓
Show truthful result
  ↓
Change selection without restarting from zero
```

Keep the current goal:

**Useful content within <= 3 taps.**

Do not introduce a Generate/Continue/Confirm button after preference selection.

---

# 4. APPROVED UX CHANGES — P0

These are mandatory.

---

## P0.1 STOP FILLING RESULTS WITH NON-MATCHING FALLBACKS

Current problem:
- If a preference only has 0, 1 or 2 matching places, current logic fills the remaining cards with unrelated places so the UI always shows three.
- This makes the selected preference untrustworthy.

Required behavior:

### If 3+ real matches
Show up to 3 real matching results.

### If 2 real matches
Show exactly 2.

Text near results:

`Có 2 gợi ý cho lựa chọn này.`

### If 1 real match
Show exactly 1.

Text:

`Có 1 gợi ý cho lựa chọn này.`

### If 0 real matches
Show no fake card.

Show a compact empty state:

`Chưa có gợi ý phù hợp tiêu chí này.`

Primary action:

`Đổi lựa chọn`

Do NOT:
- duplicate a result,
- randomize unrelated places,
- silently fall back,
- add an irrelevant third card.

### Implementation requirement

Find the current recommendation/filter function.

Remove the behavior that pads the result list with non-matching entries.

Keep deterministic ordering for true matches.

Do not rewrite the whole recommendation architecture.

Add or update tests for:
- 0 matches,
- 1 match,
- 2 matches,
- >=3 matches.

---

## P0.2 REMOVE UNSUPPORTED CLAIMS

Audit every currently rendered claim.

Remove/hide claims that are not supported by current data.

At minimum inspect:

- price,
- “Từ ...đ / đêm”,
- “giá rẻ”,
- opening hours,
- “ăn đêm”,
- “đi buổi tối”,
- exact walking distance,
- exact meters,
- “2 phút đi bộ”,
- current time suitability,
- “gần bạn”,
- “mở cửa”,
- “#1 / #2 / #3”,
- “hoàn hảo”,
- “đã chọn lọc tốt nhất”,
- “phù hợp” reasons that are generic rather than preference-specific.

Rule:

**If evidence is not clearly traceable in the current data source, do not render it.**

Do not “solve” an unsupported claim by adding:
- “tham khảo”,
- “ước tính”,
- “có thể”.

If the value is not trusted, hide it.

---

## P0.3 REMOVE UNSUPPORTED RANKING

Remove:

`#1`
`#2`
`#3`
or equivalent ranking badges.

Current ordering may remain deterministic internally.

But the UI must not imply:
- best,
- second best,
- third best,

unless a real ranking model with evidence exists.

Result heading should describe the selected context, not a rank.

Example:

`ĂN GÌ? · Hẹn hò`

not:

`#1 gợi ý`

---

## P0.4 HARDEN NOW TRUTHFULNESS

The intent name may remain:

`BÂY GIỜ LÀM GÌ?`

because it represents the user's need.

However the current implementation does NOT truly calculate from the current local time.

Therefore remove copy such as:

- `Gợi ý theo giờ`
- `từ thời gian hiện tại`
- `ngay lúc này`
- any sentence implying real-time schedule calculation

Use truthful prototype wording.

Preferred wording:

Home subtitle for NOW:
`Xem một lịch trình mẫu nhanh`

Result title:
`Lịch trình mẫu`

If a short supporting sentence is required:
`Một lịch trình tham khảo để bạn bắt đầu nhanh.`

Do not claim:
- current opening hours,
- exact feasibility,
- current-time optimization,
- exact travel-time continuity.

### NOW preference options

Inspect the current mapping.

Only render options that the implementation actually handles with a meaningful distinct mapping.

If several options all produce the same default itinerary:
hide those unsupported options.

For example, if supported by the current mapping, labels may be normalized to:

- `Đi cùng người yêu`
- `Đi cùng bạn bè`
- `Đi một mình`
- `Chọn giúp tôi`

But DO NOT blindly use this list.

First inspect which options truly have distinct current behavior.

`Chọn giúp tôi` may stay only if it is explicitly a generic itinerary rather than pretending personalization.

Do NOT add:
- duration,
- transport,
- budget,
- mood,
- additional required steps.

---

## P0.5 GOOGLE MAPS CTA MUST BE TRUTHFUL

Current audit found demo CIDs may open the wrong destination.

For every currently surfaced card and NOW itinerary stop:

1. Trace the Maps target.
2. Prefer an existing verified:
   - `google_maps_url`,
   - Google place ID,
   - or exact known source already stored in project data.

3. If an exact trusted Maps destination exists:
   use it.

4. If no exact trusted destination exists:
   DO NOT invent a CID.
   DO NOT create a fake URL.
   DO NOT show a Maps CTA for that item.

Do not use an ambiguous generated search query if it could point to the wrong business.

The CTA label should be:

`Xem trên Google Maps`

For STAY also use:

`Xem trên Google Maps`

Do not use:
`Đi ngay trên Google Maps`

unless the action genuinely starts navigation.

### Acceptance

When a Maps CTA is rendered:
- destination name on Maps must correspond to the place card/itinerary stop,
- no known demo CID should remain.

---

## P0.6 FIX THE 320–346PX GO CHIP OVERFLOW

The label similar to:

`Biển / ngắm cảnh`

currently overflows on narrow widths.

Required:
- no text outside its tap region,
- no hidden core meaning,
- no horizontal page overflow,
- do not use ellipsis to cut the meaning.

Allow:
- wrapping,
- a wider/flexible grid item,
- responsive chip layout.

The full label must remain readable.

Test continuously from 320px through 346px.

---

# 5. APPROVED UX CHANGES — P1

---

## P1.1 PREFERENCE MUST APPEAR NEXT TO THE SELECTED INTENT

Current problem:
For EAT and GO, the user taps an intent but the preference panel appears after other intent cards.

Required interaction:

When an intent is selected:
- its preference panel must appear immediately after / directly associated with that selected intent,
- the next decision must be visually adjacent to the action that caused it.

Do NOT place the EAT/GO preference panel after unrelated intent cards.

### Preferred implementation strategy

Use the current component structure where possible.

Render the preference panel conditionally directly after the active intent card in DOM order.

Do not create a separate new page.

Do not add a modal.

Do not add a bottom sheet unless the existing architecture already uses one and it solves a proven issue.

---

## P1.2 COMPACT COMPLETED DECISIONS

### State A — Initial Home

Show:
- product brand,
- one short useful subtitle,
- four primary intents.

Do NOT show:
- preference panels,
- results,
- ranking,
- long explanations.

### State B — Intent selected, preference not selected

Show:
- active intent clearly,
- preference immediately next to it,
- other intents still accessible but lower priority.

Other intent cards may become more compact:
- icon,
- main label,
- minimal/no subtitle.

Do not remove the ability to change intent.

### State C — Preference selected / results visible

The decision is complete.

Do NOT keep:
- large hero introduction,
- all large intent cards,
- the entire expanded preference grid,

above the result as if the user has not made a choice.

Instead show a compact context row/header near results:

Example:

`ĂN GÌ? · Hẹn hò`

and:

`Đổi lựa chọn`

For GO/STAY/NOW use the corresponding labels.

The exact visual styling should follow the existing design system.
Do not redesign the visual language.

---

## P1.3 CHANGE SELECTION WITHOUT LOSING ORIENTATION

Current reset behavior hides the result but does not intentionally return the user to the right place.

Required:

When user taps:

`Đổi lựa chọn`

then:

1. remove/close result state,
2. restore the active intent + its preference panel,
3. scroll/focus the beginning of that preference panel into a comfortable viewport position,
4. do not return to the very top of Home,
5. do not force the user to reselect the intent first.

Use respectful smooth scrolling only if motion is already used and does not harm usability.

Do not create a complex state machine.

---

## P1.4 TAP TARGET HARDENING

The audit measured change-selection controls around 28–32px.

Required:
- interactive controls should have an effective tap area around at least 44px in height/size where practical,
- text must remain fully readable,
- controls must not overlap.

Apply especially to:
- `Đổi lựa chọn`
- previous `Đổi tiêu chí`
- previous `Đổi gu`

Normalize wording to:

`Đổi lựa chọn`

Do not add sticky buttons unless there is an existing proven need.

---

## P1.5 SHORTEN CORE COPY

Replace long/clipped copy with short functional copy.

### Home subtitle

Replace the current long/clipped sentence with:

`Tìm chỗ ăn, chơi và nghỉ ở Đà Nẵng.`

This should:
- wrap naturally if needed,
- never be truncated with ellipsis,
- never be forced into one line on narrow phones.

### Remove low-value repeated copy where present

Remove if currently rendered and redundant:
- city badge such as `Đà Nẵng · Gợi ý nhanh`,
- `Hoặc khám phá theo nhu cầu`,
- `Chạm 1 để xem`,
- footer claim about 2/3 taps,
- `Đề xuất chọn lọc`.

Do not remove the product name.

### STAY subtitle

Use a short truthful explanation such as:

`Tìm chỗ nghỉ`

Do not claim the whole branch is:
`gần biển`

unless all shown places meet verified evidence.

### Preference helper

Prefer:

`Bạn muốn tìm chỗ thế nào?`

only when a helper is actually useful.

If the chips are self-explanatory, omit helper copy.

---

## P1.6 RESULT CONTEXT

Near the top of results, always show the current context.

Format:

`<INTENT> · <PREFERENCE>`

Examples:
- `ĂN GÌ? · Hẹn hò`
- `ĐI ĐÂU? · Thiên nhiên`
- `Ở ĐÂU? · Gần biển`

For NOW:
- use the selected supported option,
- but do not imply real-time personalization.

Also show:
- `Đổi lựa chọn`

When fewer than 3 results exist:
show the truthful count message.

Do not show:
- fake rank,
- generic “selected recommendation” badge.

---

## P1.7 RESULT CARD INFORMATION HIERARCHY

User decision priority:

1. Place name
2. Area / location context
3. Category/type if useful
4. Verified rating + review count if evidence exists
5. 1–2 evidence-based reasons tied to current preference
6. Google Maps CTA if verified

### Image

Current illustration/SVG is not necessarily a real place photo.

If it is decorative:
- keep it only if it helps recognition,
- make it less dominant than the place name,
- do not present it as a factual photograph,
- use appropriate alt behavior.

Do not add random stock photos.

### Name

Must be fully readable.

Do not ellipsize the primary place name if that removes identity.

Allow reasonable wrapping.

### Category + Area

Keep when real and helpful.

Avoid overlapping badge layers.

### Rating

Show only when traceable to current trusted source.

If the currently rendered number is a placeholder/demo value:
hide it.

When rating is shown:
show review count when available.

### Price

Hide current unverified price.

Do not render fake starting prices.

### Reasons

Show at most 1–2 concise reasons.

Each reason must explain the current selection.

Bad:
`Không gian phù hợp`

Good only if supported:
`Thuộc nhóm cafe`
`Khu vực Hải Châu`

Do not fabricate subjective reasons.

If no supported reason exists:
omit the reason block.

### Maps

Label:
`Xem trên Google Maps`

Only render when exact target is trusted.

---

# 6. PREFERENCE VISIBILITY RULES

Do NOT blindly preserve every current preference.

Do NOT blindly delete all preferences either.

For every current EAT/GO/STAY preference:

1. Inspect current data source.
2. Inspect current filter/matching logic.
3. Ask whether the label represents a claim that current data can support.
4. Ask whether at least one truthful match currently exists.
5. If the claim is unsupported:
   hide the preference for this mentor-review patch.

Examples of risky preferences:
- cheap,
- late night,
- night,
- quiet,
- lively,
- family,
- group,
- couple,
- near beach,
- near center,

when the current source does not provide evidence for those semantics.

Do not use “tag exists in demo data” as sufficient evidence if the tag itself was manually guessed.

### Important

This UX patch must NOT solve this by re-curating the whole dataset.

The rule is:

**If support is not ready, hide the option for now.**

Phase 2A can restore options later after evidence hardening.

### Empty categories

If an intent would become empty after hiding unsupported preferences:
do NOT invent a new complex filter.

Use the smallest truthful behavior already supported by current product architecture.

If necessary:
- expose only a generic supported option,
- or render a simple truthful message that this branch is still being prepared.

Prefer preserving the existing two-tap interaction when it can be done truthfully.

---

# 7. RESPONSIVE REQUIREMENTS

The app must not be optimized for one specific phone.

It must behave continuously across common mobile widths.

## Required viewport matrix

At minimum test:

- 320px
- 360px
- 375px
- 390px
- 393px
- 412px
- 414px
- 430px
- 440px
- 480px

Also test:

- tablet around 768px
- desktop around 1280px

## Device-reference matrix

Use available browser presets when possible:

- iPhone SE
- iPhone 16
- iPhone 16 Pro Max
- Pixel 9
- Pixel 9 Pro
- Pixel 10
- Samsung Galaxy A55

If exact presets are unavailable, use reference viewport sizes and state clearly that these are viewport simulations, not physical-device verification.

Reference sizes from the prior audit:

- iPhone SE: 375×667
- iPhone 16: 393×852
- iPhone 16 Pro Max: ~440×956
- Android reference: ~412×915

Do not falsely claim Safari/native-device testing if only Chromium viewport testing was done.

---

# 8. RESPONSIVE ACCEPTANCE RULES

Across 320–480px:

## No critical text clipping

The following must never lose meaning:
- app title,
- Home subtitle,
- intent name,
- intent short subtitle,
- preference chip text,
- result place name,
- current context,
- CTA label,
- empty-state message.

Do NOT solve core text with ellipsis.

## No horizontal overflow

`document.documentElement.scrollWidth`
must not exceed the viewport due to layout bugs.

Test all key states.

## Preference chips

Must:
- wrap cleanly,
- keep full meaning,
- remain tappable,
- not overlap adjacent chips.

## Tap targets

Important actions should have effective tap area around 44px.

## Result viewport

After preference selection:
- auto-scroll may remain,
- the result heading/context should appear in a useful position,
- the first result should not be buried under large completed-decision UI.

## Change selection

After tapping `Đổi lựa chọn`:
- the preference panel should become visible without the user hunting for it.

---

# 9. STATE-BY-STATE TARGET UX

## 9.1 HOME — INITIAL

SHOW:
- `LA CÀ ĐÀ NẴNG`
- `Tìm chỗ ăn, chơi và nghỉ ở Đà Nẵng.`
- four intents:
  - ĂN GÌ?
  - ĐI ĐÂU?
  - BÂY GIỜ LÀM GÌ?
  - Ở ĐÂU?
- only short truthful supporting text where genuinely useful.

HIDE:
- preference panels,
- result cards,
- result badges,
- ranking,
- unsupported realtime claims,
- repeated marketing copy.

## 9.2 INTENT SELECTED

SHOW:
- selected intent clearly,
- its relevant supported preferences immediately next to it.

KEEP ACCESSIBLE BUT COMPACT:
- other intents.

HIDE:
- irrelevant preference panels.

## 9.3 PREFERENCE SELECTED

SHOW:
- compact current context,
- `Đổi lựa chọn`,
- truthful result count/content.

COMPACT/HIDE:
- full hero,
- full intent stack,
- full preference grid.

## 9.4 RESULTS

SHOW:
- `<Intent> · <Preference>`
- correct number of matches,
- place name,
- truthful supporting data,
- Maps CTA only when valid.

HIDE:
- fake rank,
- unsupported price,
- unsupported reason,
- unrelated result.

## 9.5 NOW RESULTS

SHOW:
- supported selected option,
- `Lịch trình mẫu`,
- itinerary stops that are actually mapped,
- Maps CTA only when valid.

HIDE:
- current-time claims,
- fake hours/feasibility,
- options with no distinct behavior.

## 9.6 CHANGE SELECTION

After tap:
- return to active intent + preference,
- place preference panel in viewport,
- keep other intent switch available,
- do not restart from the top.

## 9.7 EMPTY / LIMITED

0:
`Chưa có gợi ý phù hợp tiêu chí này.`

1:
`Có 1 gợi ý cho lựa chọn này.`

2:
`Có 2 gợi ý cho lựa chọn này.`

Action:
`Đổi lựa chọn`

Do not apologize excessively.

---

# 10. IMPLEMENTATION STYLE

Keep changes small and understandable.

Prefer:
- conditional rendering,
- small helper functions,
- existing components,
- current CSS/Tailwind conventions,
- deterministic behavior.

Avoid:
- broad refactors,
- new state-management libraries,
- new global stores,
- unnecessary abstractions,
- huge new component trees.

When touching an existing function:
understand why it currently exists before changing it.

Do not fix unrelated code.

---

# 11. TESTS REQUIRED

Before declaring success, run all existing project checks.

At minimum, if scripts exist:

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run build:worker
```

Use the actual project scripts if names differ.

Do not use:
```bash
npm audit fix --force
```

Do not upgrade dependencies during this task.

---

# 12. UX BEHAVIOR TEST CASES

Add/update automated tests when practical for logic.

At minimum cover recommendation behavior:

### EAT/GO/STAY result count
- 0 matches → 0 cards
- 1 match → 1 card
- 2 matches → 2 cards
- 3+ matches → max 3 real matches

### No fallback contamination
Every rendered result for a preference must satisfy that preference under the current matching function.

### Preference reset
Changing intent must clear incompatible preference/result state.

### Change selection
Result disappears and selected intent stays available for changing preference.

### Unsupported UI
- no rank badge,
- no unsupported price when data is unverified,
- no realtime NOW wording.

Do not create brittle snapshot tests for purely decorative markup unless existing test style already uses them.

---

# 13. MANUAL UX TEST MATRIX

Test these flows on every important mobile width:

## EAT
Home
→ ĂN GÌ?
→ supported preference
→ result
→ Đổi lựa chọn
→ choose another preference

## GO
Home
→ ĐI ĐÂU?
→ supported preference
→ result
→ Đổi lựa chọn

Specifically test the former narrow GO chip around 320–346px.

## STAY
Home
→ Ở ĐÂU?
→ supported preference
→ result or limited state
→ Maps if available

Confirm:
- no fake price,
- no unsupported exact distance.

## NOW
Home
→ BÂY GIỜ LÀM GÌ?
→ supported option
→ Lịch trình mẫu
→ Maps on a stop if valid
→ Đổi lựa chọn

Confirm:
- no current-time claim,
- no fixed-hour content pretending to be realtime.

---

# 14. CONTINUOUS WIDTH TEST

Do not only test presets.

Resize continuously:

`320px → 480px`

Look for:
- chip overflow,
- accidental nowrap,
- clipped subtitles,
- layout jumps,
- horizontal scroll,
- overlapping controls,
- broken auto-scroll target.

A layout that works at 360 and 390 but breaks at 376 is still broken.

---

# 15. LANDSCAPE CHECK

Check at least:

- one iPhone-like landscape,
- one Android-like landscape.

Confirm:
- no horizontal page overflow,
- no overlapping control,
- result remains usable,
- change-selection action remains tappable.

Do not optimize landscape at the expense of portrait.
Portrait remains primary.

---

# 16. ACCESSIBILITY / INTERACTION BASICS

Without redesigning:

- keep semantic buttons for actions,
- avoid clickable `div` if current component can be a button,
- maintain visible focus states,
- ensure buttons have accessible labels,
- decorative images should not be announced as factual place photos,
- preserve keyboard accessibility on desktop,
- avoid focus traps,
- respect `prefers-reduced-motion` if adding/retaining smooth behavior.

Do not turn this into a full accessibility rewrite.

---

# 17. ACCEPTANCE CHECKLIST — MUST PASS

Do NOT say “UX ready” until all applicable items pass.

## Truthfulness
- [ ] No non-matching fallback cards
- [ ] 0/1/2 results shown truthfully
- [ ] No unsupported price shown
- [ ] No unsupported exact distance/time shown
- [ ] No unsupported NOW realtime claim
- [ ] No fake rank
- [ ] Maps CTA only for trusted destinations

## Flow
- [ ] Preference appears next to selected intent
- [ ] Result reached within <=3 taps
- [ ] Completed decision UI is compact near results
- [ ] Current intent + preference visible near results
- [ ] Change selection returns user to the correct preference area
- [ ] Intent can still be changed

## Mobile
- [ ] 320px no GO chip overflow
- [ ] iPhone SE layout usable
- [ ] iPhone 16 no clipped core text
- [ ] ~412px Android layout usable
- [ ] 430–480px still compact
- [ ] no horizontal overflow
- [ ] important tap targets ~44px
- [ ] no core meaning hidden by ellipsis

## Build
- [ ] lint pass
- [ ] typecheck pass
- [ ] tests pass
- [ ] Next build pass
- [ ] OpenNext Cloudflare build pass

---

# 18. GIT DISCIPLINE

Do not commit until:
- implementation is complete,
- tests pass,
- build passes,
- UX matrix has been manually checked.

Before commit:

```bash
git status
git diff --stat
git diff
```

Review the diff.

Ensure no unrelated Phase 2A/data files were accidentally modified.

Preferred commit message:

```text
fix: harden mobile UX for mentor review
```

Do not force push.

Do not touch `master` unless the user explicitly instructs it.

Push only the current intended working branch after verification.

---

# 19. CLOUDFLARE DEPLOYMENT

The project has previously deployed successfully using OpenNext + Cloudflare Workers.

Known working stack from prior checkpoint:
- Next.js 15.5.27
- @opennextjs/cloudflare 1.20.7
- Wrangler 4.145.0

Do not upgrade these during this UX task.

After code/tests/build are all passing:

1. Confirm working tree/commit.
2. Deploy using the existing tested project command, expected to be:

```bash
npm run deploy
```

3. If the script already performs:
   - OpenNext build
   - OpenNext deploy

do not manually duplicate the build unnecessarily.

4. Confirm Cloudflare prints a successful deployed Worker URL/version.

5. Smoke test the public production URL.

Do not treat Windows OpenNext warning as failure if build/deploy completes successfully.

Do not run:
`npm audit fix --force`.

---

# 20. PRODUCTION SMOKE TEST AFTER DEPLOY

On the public Cloudflare URL, verify:

### Home
- brand visible
- subtitle complete
- four intents understandable
- no realtime claim

### EAT
- preference near selected intent
- correct result count
- no unrelated padding
- change selection works

### GO
- 320px / narrow behavior fixed
- full preference label readable
- correct result count

### STAY
- no fake price
- no unsupported distance
- limited result state truthful

### NOW
- says `Lịch trình mẫu`
- no realtime promise
- unsupported options hidden
- itinerary readable

### Maps
For every CTA visible in the smoke-test sample:
- open it,
- verify destination corresponds to the displayed place.

---

# 21. FINAL REPORT FORMAT

After implementation and testing, report in chat using exactly these sections:

## A. PRE-CHANGE CHECKPOINT
- branch
- git status
- files inspected
- existing build/test state

## B. FILES CHANGED
For every changed file:
- path
- why it changed
- what behavior changed

## C. P0 IMPLEMENTED
- fallback removal
- truthful claims
- NOW
- Maps
- narrow chip fix

## D. P1 IMPLEMENTED
- preference placement
- compact selected state
- change selection
- tap targets
- copy
- result hierarchy

## E. PREFERENCES HIDDEN
List each hidden preference and why it is not currently trustworthy.

Do not say “unsupported” without explaining the missing evidence.

## F. RESULT BEHAVIOR
Show tested examples for:
- 0 matches
- 1 match
- 2 matches
- 3+ matches

## G. RESPONSIVE MATRIX

Table:

| Width / Device | Home | Intent | Preference | Result | NOW | STAY | Overflow | Text clipping | Tap | Status |

Include at least:
- 320
- 360
- 375 / iPhone SE
- 390
- 393 / iPhone 16
- 412 Android reference
- 430
- 440 / Pro Max reference
- 480

## H. TEST RESULTS
Report:
- lint
- typecheck
- tests
- Next build
- OpenNext build

Do not say PASS unless the command actually passed.

## I. DEPLOYMENT
- commit id
- branch pushed
- Cloudflare deploy status
- public URL
- Worker version if shown

## J. REMAINING LIMITATIONS

Explicitly state what is NOT solved.

Examples:
- real iOS Safari not physically tested,
- current-time NOW engine not implemented,
- Phase 2A evidence work still ongoing,
- preferences may return later after data verification.

## K. PHASE 2A CONTINUITY

State clearly:

- Phase 2A was not replaced.
- Curated data work remains at its previous checkpoint.
- This task was only a UX hardening patch.
- List any Phase 2A file touched, ideally `none`.

End with:

`UX HARDENING IMPLEMENTED — READY FOR MENTOR REVIEW`

---

# 22. STOP CONDITIONS

STOP and report instead of improvising if:

1. A required UX fix would require rewriting Phase 2A data architecture.
2. Correct Maps destinations cannot be established from trusted project data.
3. A preference cannot be supported without inventing semantics.
4. A requested claim would require fake current time/opening hours/distance/price.
5. Existing unrelated user changes make a safe edit ambiguous.
6. Deployment would require destructive Git operations.
7. A package upgrade appears necessary.

Do NOT solve a blocker by broadening scope.

---

# 23. FINAL PRODUCT PRINCIPLE

The mentor is not asking:

“Can AI make this screen prettier?”

The mentor is asking:

> “When I am the customer, what do I need to read and tap right now?”

Every code change must answer that question.

Prefer:
- fewer truthful options
over
- many weak options.

Prefer:
- two real results
over
- three padded results.

Prefer:
- “Lịch trình mẫu”
over
- pretending the app knows the current moment.

Prefer:
- a hidden Maps button
over
- a wrong destination.

Prefer:
- a complete two-line label
over
- a pretty ellipsis that removes meaning.

Do not optimize for screenshots.

Optimize for the person holding the phone.
