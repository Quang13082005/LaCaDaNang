# ASTRA 6 — MASTER EXECUTION PROMPT
## LA CÀ ĐÀ NẴNG — NO-IMAGE MVP → DATABASE → REAL DISCOVERY → ONE-THUMB UX

### 0. Mission and current source of truth

You are now the primary implementation agent for the LA CÀ ĐÀ NẴNG project.

Repository:
`D:\Dự án tìm địa điểm ăn chơi\LaCaDaNang\danang_revised_pack`

Current working branch at handoff:
`phase-2a-deploy`

Known audited HEAD at handoff:
`a7494666e786f0b968484ea142cc221ddaf38050`

Latest database-ready workbook supplied by the user:
`LA_CA_DB_READY_500_NO_IMAGE_FINAL.xlsx`

IMPORTANT PRODUCT DECISION:
**The MVP does NOT depend on venue images.**
Images/place_media are deferred and MUST NOT block database integration, recommendation, UX, testing, or deployment.

Latest core dataset has already passed the no-image QA gate:
- 500 places
- 500 non-null Google Place IDs
- 500 unique Google Place IDs
- 500 Google Maps URLs
- 500 valid lat/lng
- 500 administrative-unit foreign keys
- 500 active/current rows
- 500 valid sections: EAT / CAFE / GO / STAY
- 500 places with at least one tag
- 1500 place translations: VI / EN / KO
- 0 pending identity replacements
- images intentionally excluded from the MVP release gate

Trà Vân final coverage contains:
- Caffe SuKa
- Cây Quế Cổ Thụ
- Cầu Đăk Buôn

Coverage exceptions remain truthful policy exceptions:
- Đắc Pring = 1 verified suitable venue
- La Êê = 1 verified suitable venue
- Hoàng Sa = 0 fabricated venues
Do NOT invent venues to satisfy quotas.

Core tables intended for MVP import:
1. administrative_units
2. places
3. tags
4. place_tags
5. tag_translations
6. place_translations

`place_media` is DEFERRED and must not be required by runtime queries.

---

# 1. ABSOLUTE SAFETY RULES

Before changing code:

1. Read:
   - `AGENTS.md`
   - current project state/checkpoints
   - current handoff file
   - decisions file
   - Git status/diff/log
   - package.json / lockfile
   - the runtime source that will actually be modified
2. Verify reality from source and Git. Do not trust an old roadmap over current code.
3. Do not infer that something exists because a document says it exists.
4. Do not claim PASS until source/tests/runtime evidence supports PASS.
5. Do not fabricate DB schema, API contracts, Google IDs, translations, tags, credentials, env vars, deployment state, or completed work.
6. Do not rewrite unrelated features just to make the requested feature work.
7. Keep changes small and scoped. One milestone = one coherent change.
8. Do not silently upgrade dependencies.
9. Do not change package/lockfile, Cloudflare config, font, global styles, schema, data pipeline, or deployment config unless the current milestone genuinely requires it.
10. Never use `git clean`, destructive reset, or branch switching before protecting untracked work.
11. Never delete evidence/logs/checkpoints blindly.
12. Never push, merge to main/master, or deploy production without explicit user approval.
13. Local checkpoint commits are encouraged after a milestone passes validation.
14. Never put secrets/tokens/passwords in docs, logs, handoff files, or commits.
15. Do not run mutating curation tests in the real repo without first proving they are non-mutating. Existing audit says the curation suite can rewrite curated JSON/timestamps.

If a prerequisite is missing, stop at a precise blocker and write the handoff before spending more time.

---

# 2. FIRST ACTION — PROTECT THE CURRENT WORK

The audit found important untracked work. Before feature implementation:

- Run `git status --short`, `git diff`, `git diff --check`, `git log -5 --oneline`.
- Inventory all untracked files.
- Do NOT delete them.
- Reconcile whether they are current source, evidence, logs, generated copies, or stale docs.
- Preserve source changes in Git once validated.
- Keep generated build/test copies outside the source tree if appropriate.
- If a branch split is useful, create it only after untracked work is protected. Prefer a dedicated branch such as `phase-3-db-integration`, but do not merge/deploy without approval.

Create or update:
- `docs/CURRENT_STATE.md`
- `docs/DECISIONS.md`
- `docs/HANDOFF_CURRENT.md`
- `docs/AGENT_TASK_QUEUE.md`

These become the authoritative cross-agent state documents.

---

# 3. DOCUMENT / INSTRUCTION CLEANUP BEFORE IMPLEMENTATION

Audit ALL root-level and docs instruction/state files, especially:

- `AGENTS.md`
- `GEMINI_3_8_UX_HARDENING_IMPLEMENTATION.md`
- `PROJECT_STATE.md`
- `PHASES*`
- old plans / handoffs / checkpoints
- `I18N_ARCHITECTURE.md`
- `ONE_THUMB_UX_AUDIT.md`
- `ANALYTICS_SPEC.md`
- `NOTIFICATION_SPEC.md`
- `NEARBY_ENGINE_PREPARATION.md`
- data-curation reports/rules
- deploy docs

For each document classify it as:

`CURRENT_AUTHORITY`
`CURRENT_REFERENCE`
`HISTORICAL_EVIDENCE`
`STALE`
`CONFLICTING`

Rules:
- Never delete historical evidence merely because it is old.
- Move superseded instructions to `docs/archive/` or clearly mark them HISTORICAL.
- Remove old files from the authority chain when they contradict current product decisions.
- If `GEMINI_3_8_UX_HARDENING_IMPLEMENTATION.md` is superseded, archive it and replace its authority with current cross-agent docs. Do not blindly delete without reconciling any still-valid constraints.
- `PROJECT_STATE.md` must either be brought current or replaced by `docs/CURRENT_STATE.md`; do not keep two contradictory “current” states.
- Remove/replace old statements that images are mandatory for MVP.
- Replace stale Vercel assumptions with actual Cloudflare architecture where source/config confirms Cloudflare.
- Clearly state that NOW is currently mock until a later milestone makes it real.
- Clearly state that DB integration is the immediate critical path.

Desired authority hierarchy:

1. `AGENTS.md` — behavioral rules for every AI agent
2. `docs/CURRENT_STATE.md` — verified current repo/runtime state
3. `docs/DECISIONS.md` — product/architecture decisions and rationale
4. `docs/HANDOFF_CURRENT.md` — exact resumption point
5. milestone-specific specs below

Create/update these canonical specs:
- `docs/DATA_CONTRACT_NO_IMAGE.md`
- `docs/DB_INTEGRATION.md`
- `docs/UX_ONE_THUMB.md`
- `docs/I18N.md`
- `docs/ANALYTICS.md`
- `docs/NOTIFICATIONS.md`
- `docs/NEARBY_DISCOVERY.md`

Do not create duplicate docs if an existing document can safely become the canonical file.

---

# 4. CROSS-AGENT HANDOFF PROTOCOL — MANDATORY

Astra 6 may run out of credit. Every future agent must be able to continue safely.

## Trigger for handoff update

Update `docs/HANDOFF_CURRENT.md`:
- after EVERY completed milestone;
- before a large risky operation;
- whenever remaining credit/context appears <= 25%;
- whenever execution is interrupted or a blocker appears;
- BEFORE stopping the session.

If credit becomes low, stop new implementation first and refresh the handoff. Do not spend the last usable context on another large code change.

## Required HANDOFF_CURRENT contents

Always include:

- timestamp
- repo path
- current branch
- HEAD commit
- `git status --short`
- current objective
- completed in this session
- files created
- files modified
- files intentionally NOT touched
- decisions made and why
- DB schema/migration/import state
- API contract state
- data source/version/hash if relevant
- exact commands run
- lint/typecheck/test/build results
- failures and unresolved warnings
- environment variable NAMES only, never values/secrets
- known blockers
- exact next task
- exact first file/command the next agent should inspect
- rollback/recovery note
- whether there are uncommitted changes
- latest local checkpoint commit hash if one exists
- “DO NOT REDO” section
- “DO NOT TOUCH YET” section

## AGENT_TASK_QUEUE

Maintain:
`docs/AGENT_TASK_QUEUE.md`

Use:
`ID | milestone | status | owner/current agent | dependencies | exact next action | verification`

Statuses:
`NOT_STARTED`
`IN_PROGRESS`
`BLOCKED`
`READY_FOR_REVIEW`
`DONE`

## New-agent startup protocol

Every new agent MUST:

1. read `AGENTS.md`;
2. read `docs/CURRENT_STATE.md`;
3. read `docs/DECISIONS.md`;
4. read `docs/HANDOFF_CURRENT.md`;
5. read `docs/AGENT_TASK_QUEUE.md`;
6. run Git status/diff/log;
7. verify the handoff against actual source;
8. continue the exact next task.

Never restart from Phase 0 unless evidence proves state corruption.

---

# 5. MENTOR REQUIREMENTS — NON-NEGOTIABLE PRODUCT TARGETS

Implement all of the following across staged milestones.

## A. Stable interaction positions

Mentor feedback:
“click 1 cái nó tự thay đổi vị trí là thứ không hợp lý”.

Therefore:
- A button/card must not jump to a different location merely because it was selected.
- Intent cards must keep stable spatial positions.
- Selection should change visual state, not reorder controls.
- “Đổi lựa chọn”, Maps CTA, and other primary actions should use consistent positions.
- Prevent layout shift during loading/results where practical.

## B. Mobile one-thumb UX

Mobile is the primary target.

Primary actions should be reachable near the lower thumb zone:
- use a stable bottom action area or bottom sheet where appropriate;
- respect `env(safe-area-inset-bottom)`;
- avoid placing mandatory next actions at the top after every state transition;
- avoid covering content/keyboard;
- preserve 44px+ touch targets;
- no accidental overlap at 320/360/390/393/430 widths.

Validate at least:
- 360×800
- 390×844
- 430×932
- 768×900
- 1280×900

Mobile is the priority; tablet/desktop must still remain usable.

## C. Analytics

Analytics is currently spec-only. Implement an MVP analytics layer with a provider abstraction so product logic is not coupled to one vendor.

Minimum event vocabulary:
- `app_open`
- `locale_resolved`
- `locale_changed`
- `location_permission_prompted`
- `location_permission_granted`
- `location_permission_denied`
- `intent_selected`
- `preference_selected`
- `discovery_requested`
- `discovery_succeeded`
- `discovery_empty`
- `discovery_failed`
- `place_maps_opened`
- `selection_reset`
- `now_started`
- `itinerary_viewed`
- `notification_opt_in_shown`
- `notification_permission_granted`
- `notification_permission_denied`
- `notification_scheduled`

Privacy:
- Do not send raw precise GPS coordinates to analytics unless there is a documented need and consent.
- Prefer radius bucket / admin unit / anonymous request metadata.
- Never send secrets or personal identifiers unnecessarily.

Select the actual analytics provider only after inspecting current deployment capabilities and user constraints. Do not invent an installed SDK.

## D. Notifications

Design a SMALL MVP, not a large notification platform.

Recommended first use case:
After a user has chosen a suggestion/plan, offer:
“Nhắc tôi trước khi đi”
with a useful default such as 30 minutes.

Rules:
- Do not request notification permission on first page load.
- Ask only after the user has received value and explicitly chooses the reminder.
- If browser/PWA constraints prevent background delivery, document that honestly.
- Separate notification UI/business contract from delivery provider.
- Web Push/service-worker backend can be a later subphase if needed.

## E. Multi-language

Minimum:
- Vietnamese
- English

Preferred:
- Korean

Existing i18n utilities already support VI/EN/KO and language-tag normalization.

Runtime requirements:
- auto resolve from device/browser language;
- manual override VI/EN/KO;
- persist manual choice;
- allow “Auto” mode;
- update `<html lang>`;
- keep IDs/state unchanged when locale changes;
- UI labels use typed translation keys;
- DB-backed place/tag translations use adapter fallback;
- do NOT invent translated venue names that are not present in DB;
- fallback safely to Vietnamese/source value;
- validate long English text and Korean glyphs;
- Korean copy still needs human/native review before calling localization perfect.

## F. Real database

Home must stop using demo data as production runtime source.

Do not connect DB rows directly to React components.

First define a stable no-image frontend contract, then:
DB → repository → adapter → API/service → frontend view model.

## G. User lat/lng + nearby filtering

Implement browser geolocation with explicit permission.

Flow:
1. Ask only when nearby functionality is used or clearly useful.
2. Handle:
   - granted
   - denied
   - unavailable
   - timeout
   - stale/low-accuracy result
3. Do not persist precise location by default.
4. Send lat/lng to server/Worker for discovery request.

Initial radius:
- ~1 km per mentor example.

If fewer than useful results exist, use a documented policy such as:
1 km → 3 km → 5 km
rather than padding with irrelevant places.

Server/Worker:
- validate lat/lng/radius/intent/preference;
- filter only active/current eligible places;
- apply section and approved-tag mapping;
- calculate/query distance;
- rank candidates;
- return maximum 3 useful results;
- never fabricate/pad results;
- distinguish zero-result from request error.

Existing Haversine helpers may be reused, but verify server/runtime compatibility before reuse.

Ranking MVP must be explicit and null-safe.
Example dimensions:
- exact section eligibility: mandatory
- preference/tag match: strongest ranking signal
- distance: strong signal
- rating/review evidence: tie-breaker/quality signal where present
- optional diversity rule to avoid near-duplicate recommendations

Do not treat missing rating as 0 if that creates an unintended penalty without documenting the policy.

---

# 6. NO-IMAGE MVP OPTIMIZATION

This is a major scope reduction.

Production runtime contract MUST NOT require:
- imageUrl
- photoCount for rendering
- place_media join
- image completeness
- image-based ranking

Do NOT delete `place_media` history if it already exists; simply do not import/query it for MVP.

PlaceCard:
- remove mandatory `next/image` venue rendering;
- use a compact text-first card;
- use section icon/badge:
  - EAT
  - CAFE
  - GO
  - STAY
- show only useful data:
  - name
  - primary type
  - area/admin unit
  - optional rating/review count if real
  - matched preference reason
  - distance when location exists
  - Maps CTA

Do not show ugly blank image placeholders.

Hero/Intent illustrations:
- may remain as brand/static UI assets because they are not venue DB images;
- do not make DB integration depend on them.

Skeleton:
- remove large image skeleton if final card has no image.

No-image design goal:
less scrolling, faster rendering, clearer choices, better one-thumb use.

---

# 7. DATABASE INTEGRATION SEQUENCE

Do not start by editing Home.

## Phase DB-0 — Confirm provider and schema ownership

Inspect actual project/environment.

If a database project/provider already exists:
- read its real schema and connection mechanism;
- do not create a competing database.

If no DB exists or provider is genuinely undecided:
- stop at a decision checkpoint;
- present the minimal provider/schema proposal;
- do not invent credentials or claim setup succeeded.

## Phase DB-1 — Contract

Create first:
`src/lib/data/discovery-contract.ts`

Contract requirements:
- no image requirement;
- null-safe rating/review count;
- stable place ID;
- section `EAT | CAFE | GO | STAY`;
- name;
- primaryType;
- address/area;
- latitude/longitude;
- googleMapsUrl;
- approved tags;
- optional localized display values;
- optional distanceKm;
- optional match reasons.

Unify the three existing Place shapes through this contract.
Do not keep multiple production contracts alive indefinitely.

## Phase DB-2 — Adapter

Create:
`src/lib/data/place-adapter.ts`

Responsibilities:
- DB row → discovery view model
- administrative-unit join
- translation fallback
- nullable numeric fields
- approved tags
- no image
- never invent values

Tests must cover:
- null rating
- null review count
- missing translation
- invalid/missing Maps URL
- unknown/unsupported section
- duplicate tag input
- VI/EN/KO fallback behavior

## Phase DB-3 — Repository/API

Create a repository/service layer.

If same-origin Next route is appropriate:
`src/app/api/discovery/route.ts`

Do not expose raw DB credentials to browser code.

API must distinguish:
- success with results
- success with zero results
- validation error
- server/DB failure

## Phase DB-4 — Import data

Use:
`LA_CA_DB_READY_500_NO_IMAGE_FINAL.xlsx`

Import ONLY the six core tables for MVP.

Before committing import/migration:
- validate row counts;
- validate unique keys;
- validate foreign keys;
- validate section enum/domain;
- validate translation uniqueness;
- validate tag relationships.

After import, query back and prove:
- 500 places
- 500 unique Google Place IDs
- 500 coordinates
- 500 admin FKs
- 500 active rows
- 500 tagged rows
- 1500 place translations
- no place_media dependency

Write this evidence into the handoff.

## Phase DB-5 — EAT end-to-end first

Do one vertical slice:
user → EAT → preference → real DB/API → 0–3 results → Maps.

Validate before adding the next section.

Then:
CAFE → GO → STAY.

Do not integrate all four at once if EAT has not passed end-to-end.

---

# 8. RECOMMENDATION ENGINE

Replace demo `array.filter(...).slice(0,3)` with a transparent MVP ranking.

Keep stable intent IDs:
`EAT`, `CAFE`, `GO`, `NOW`, `STAY`.

Create an explicit preference mapping:
`stable UI preference ID → approved DB tag(s)/eligibility rule`

Do not infer subjective tags such as QUIET/DATE from venue type unless the DB has approved evidence.

Return:
- 0, 1, 2, or max 3 results
- never pad
- always include an explainable matched reason

Preserve the user's ≤3-tap discovery objective.

---

# 9. ONE-THUMB UX IMPLEMENTATION

Do this AFTER the DB contract and first real vertical slice are stable enough to avoid double rework.

Key redesign:
- do NOT reorder an intent after click;
- selected state stays in the same location;
- preference selection appears without moving the original controls unpredictably;
- keep primary actions in a predictable bottom region on mobile;
- use sticky bottom CTA/action rail where useful;
- “Đổi lựa chọn” should be consistently reachable;
- Maps CTA should be reachable without top-of-page travel;
- loading should preserve layout height and prevent jumps;
- async responses must not race and display stale results;
- keyboard/focus behavior must be checked.

Preserve:
- progressive disclosure
- no padding with fake results
- 0-result state
- context/reset semantics

Run real responsive verification after changes.

---

# 10. I18N RUNTIME

After DB contract is stable:

- introduce locale provider;
- resolve Auto from device/browser;
- persist manual override;
- add VI / EN / KO / Auto switch;
- update html lang;
- migrate static UI strings to typed message keys;
- connect DB `place_translations` and `tag_translations` through adapter;
- fallback safely;
- never translate identifiers or fabricate venue translations.

Do not couple localization state to recommendation identity.

---

# 11. ANALYTICS IMPLEMENTATION

Implement only after core runtime is real enough that events mean something.

Create:
- typed analytics event contract;
- provider abstraction;
- no-op/local provider for tests;
- chosen production provider only after verifying it exists/is acceptable.

Add events at actual user intent points, not every render.

Tests:
- no duplicate event on rerender;
- selected intent/preference IDs stable;
- no precise GPS leakage;
- failure/empty/success distinguished.

---

# 12. NOTIFICATION MVP

Implement after stable discovery flow.

First functional scope:
- explicit user action “Nhắc tôi trước khi đi”
- reminder tied to a selected place/plan
- permission only after click
- useful denial fallback
- deep-link back to relevant state if technically supported

Do not build background push infrastructure until the minimal browser/PWA behavior and product value are validated.

---

# 13. “BÂY GIỜ LÀM GÌ?” / NOW

Current NOW itinerary is mock.

Do NOT pretend it is live.

Recommended order:
1. finish real EAT/CAFE/GO/STAY discovery;
2. use time + user location + real DB to form a minimal itinerary;
3. keep only a few stops;
4. do not invent opening hours if DB does not contain them;
5. if opening hours are missing, phrase result as suggestion, not “open now”.

If opening-hours data is later required, define a new evidence-backed data contract.

---

# 14. TESTING / VALIDATION GATES

At every milestone:

- lint
- typecheck
- focused unit tests
- integration tests for changed layer
- build
- responsive/manual check where UI changed

Important existing warning:
The curation suite can mutate curated JSON/timestamps.
Do not blindly run it in the real repo until made non-mutating or safely isolated.

Required new tests:
- DB adapter
- repository/API validation
- null fields
- locale fallback
- preference mapping
- nearby radius
- ranking
- 0/1/2/3 results
- race/stale request
- reset behavior
- no-image PlaceCard
- geolocation denied/unavailable
- analytics dedupe/privacy
- notification permission states

No milestone is DONE if its validation gate fails.

---

# 15. IMPLEMENTATION ORDER

Execute in this exact broad order unless evidence forces a documented change:

M0. Protect Git/untracked work + normalize docs/instructions + handoff protocol.
M1. Confirm DB provider/schema + create no-image discovery contract.
M2. Import/validate 500-record six-table database.
M3. Adapter/repository/API + EAT real vertical slice.
M4. CAFE/GO/STAY real discovery + preference mapping/ranking.
M5. Browser geolocation + ~1km nearby filtering + Worker/server ranking.
M6. Remove venue-image dependency + text-first PlaceCard.
M7. One-thumb stable-position UX.
M8. Runtime i18n VI/EN/KO + Auto/manual.
M9. Analytics runtime.
M10. Notification MVP.
M11. Convert NOW from mock to time/location-aware minimal itinerary when data supports it.
M12. Full regression + responsive + preview build.
M13. Prepare release report. Do NOT deploy/merge without user approval.

Do not jump to a later milestone merely because it is visually interesting.

---

# 16. CREDIT / CONTEXT EXHAUSTION RULE

This is mandatory for Astra 6 and every subsequent AI agent.

When you estimate that remaining usable credit/context is becoming low:

STOP implementing.

Do these steps first:
1. save all files;
2. run the smallest relevant validation;
3. update `docs/CURRENT_STATE.md`;
4. update `docs/HANDOFF_CURRENT.md`;
5. update `docs/AGENT_TASK_QUEUE.md`;
6. record current Git diff/status;
7. create a local checkpoint commit if the milestone is coherent and tests pass;
8. write the exact next command/file/action;
9. state all unresolved blockers;
10. stop cleanly.

A fresh agent must be able to continue without asking the user to reconstruct context.

---

# 17. DEFINITION OF “DO NOT BREAK OTHER FEATURES”

For every patch:

- identify owned files first;
- identify callers/importers before changing a type;
- search all usages before renaming/removing a field;
- preserve public behavior not in scope;
- add adapter compatibility instead of mass-editing unrelated code where practical;
- never silence TypeScript errors with `any` just to pass;
- never delete failing tests merely to go green;
- never fake response data to satisfy UI;
- never weaken validation without a documented reason;
- never overwrite user files or concurrent-agent work;
- if another agent appears to own a file, stop and reconcile ownership.

After each patch, report:
`WHAT CHANGED`
`WHAT DID NOT CHANGE`
`HOW VERIFIED`
`KNOWN RISKS`
`NEXT EXACT STEP`

---

# 18. START NOW

First milestone only:

1. Perform a fresh read-only audit of Git and the current authoritative docs.
2. Protect the 14 untracked files.
3. Reconcile and modernize stale/conflicting instruction files.
4. Establish the canonical cross-agent handoff documents.
5. Verify the supplied `LA_CA_DB_READY_500_NO_IMAGE_FINAL.xlsx` import contract against the intended DB provider/schema.
6. Create the no-image discovery contract only after actual schema/provider facts are known.
7. Update HANDOFF before moving to database import.

Continue milestone-by-milestone without asking routine questions.
Only ask the user when a real external decision/credential/provider choice cannot be inferred safely.
