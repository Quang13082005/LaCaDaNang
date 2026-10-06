# PHASES.md — Da Nang 3-Tap Discovery

## Phase 0 — Repository Bootstrap + Design Tokens
**Goal:** freeze scope, setup the project, lock visual tokens, and prove deployment.

**Requires:** none.

**Deliverables:**
- Next.js App Router + TypeScript strict + Tailwind project
- Be Vietnam Pro configured
- locked design tokens from `AGENTS.md`
- lint/typecheck/test/build scripts
- AGENTS.md + GEMINI.md + docs/PHASES.md + docs/PROJECT_STATE.md
- only the folders/types needed to enable Phase 1; do not pre-build distant architecture
- base `Place`, `CuratedTag`, `TimeTag` types
- Vercel project connection + first preview deploy after user authorizes account

**Acceptance:**
- empty app shell builds successfully
- lint/typecheck/build pass
- mobile-first base shell renders at 360/390/430
- Vercel preview URL works
- no feature implementation beyond shell

---

## Phase 1 — Visual Prototype with Hardcoded Data
**Goal:** prove visual direction and <=3-tap UX before real data/backend work.

**Requires:** Phase 0.

**Deliverables:**
- premium home/hero
- 4 intent cards: Ăn gì / Đi đâu / Bây giờ làm gì / Ở đâu
- same-page expand/collapse preference panel
- hardcoded results for each intent family
- hardcoded mini itinerary
- 3-card vertical result presentation
- real approved demo imagery or branded fallback (no empty gray boxes)
- example "Đi ngay" links
- restrained Framer Motion transitions
- Vercel preview

**Acceptance:**
- first useful result reachable in <=2 taps from Home for prototype flows
- Design Quality Gate passes at 360/390/430/768/1280
- user tests preview on a real phone and approves visual direction
- no database/backend/auth/runtime AI

---

## Phase 2 — Real Data Adapter + Curated Seed
**Goal:** replace hardcoded place cards with a small reliable curated dataset.

**Requires:**
- Phase 1 approved
- final curated seed prepared by the user from the candidate file
- GO coverage manually expanded enough to support selected GO chips
- approved `imageUrl` for each final curated place or explicit branded fallback decision

**Deliverables:**
- import final `curated_places.json` only (not raw 4K+/30K dumps)
- normalized `Place` schema + Zod validation
- deterministic ranking/filtering pure functions
- tag-to-preference mapping
- diversity logic
- unit tests for ranking/filtering
- replace hardcoded cards with real curated data

**Acceptance:**
- no junk records surfaced
- no Hội An result appears in Da Nang MVP unless explicitly marked as a future/out-of-area exception
- every enabled main preference can return 3 meaningful results or a graceful fallback
- no fabricated fields
- all tests pass

---

## Phase 3 — “ĂN GÌ?” Complete + Basic Analytics
**Goal:** production-quality food discovery and start measuring real behavior.

**Requires:** Phase 2.

**Deliverables:**
- all supported food chips wired to ranking engine
- 3 ranked results
- fallback/empty state
- directions CTA
- Vercel Analytics installed
- events: `home_view`, `intent_selected`, `preference_selected`, `result_viewed`, `directions_clicked`
- Playwright setup for critical happy path begins here

**Acceptance:**
- every enabled EAT chip returns valid results or intentional fallback
- core analytics events fire in preview
- mobile UX + unit/integration/E2E critical path pass
- previous phase tests pass

---

## Phase 4 — “ĐI ĐÂU?” Complete
**Goal:** production-quality sightseeing/experience discovery.

**Requires:**
- Phase 2
- sufficient curated GO data; if coverage is insufficient, reduce enabled chips rather than fabricate recommendations

**Deliverables:**
- only GO preference chips with adequate coverage
- curated attraction/experience results
- 3-card results + directions
- diversity logic

**Acceptance:**
- results are diverse and relevant
- no transport agency/spa/etc. appears as a sightseeing result unless intentionally curated
- no repetitive/irrelevant recommendations
- all previous flow tests pass

---

## Phase 5 — “Ở ĐÂU?” Complete
**Goal:** lodging discovery without becoming a booking platform.

**Requires:** Phase 2.

**Deliverables:**
- near beach / center / budget / couple / family / group / quiet / lively preferences as supported by curated data
- 3 result cards
- Google Maps location CTA

**Acceptance:**
- no claim of live room availability
- no unsupported real-time price claim
- UI communicates discovery, not booking
- all regression tests pass

---

## Phase 6 — Share + Open Graph Growth Loop
**Goal:** enable organic sharing before the 100-user experiment.

**Requires:** Phases 3-5 result flows stable.

**Deliverables:**
- native Web Share API where supported
- copy-link fallback
- shareable URLs that reproduce the same intent/preference/result state deterministically
- Open Graph metadata + branded social preview
- share button on result view
- lightweight share text using the current date/context (e.g. “Kết quả hôm nay”) without fabricating venue facts
- `share_clicked` event

**Acceptance:**
- shared link reopens the same state/results deterministically
- social preview is readable and branded
- fallback copy link works
- sharing does not add a mandatory step to discovery flow

---

## Phase 7 — “BÂY GIỜ LÀM GÌ?” Mini Itinerary
**Goal:** implement the main differentiating feature after EAT/GO data is reliable.

**Requires:**
- Phases 3 + 4 completed
- curated `timeTags`, `typicalDurationMinutes`, and `bestTimeOfDay` for eligible places
- Phase 6 share infrastructure available

**Deliverables:**
- current Da Nang local time logic
- one preference tap after entering the branch
- itinerary generator based on current time + curated time tags
- 1-4 stops depending on remaining realistic activity window
- vertical mobile timeline
- per-stop "Đi ngay" CTA
- shareable itinerary
- `itinerary_generated` event
- deterministic travel-time assumption documented if real routing is not available

**Acceptance:**
- useful itinerary remains within <=2 taps from Home in normal flow (<=3 maximum)
- no impossible time ordering
- no venue claimed open unless curated time data supports it
- edge tests: ~06:00, 12:00, 18:00, 23:00, 02:00
- late-night output scales down to realistic 1-2 stops when appropriate
- all previous phase tests pass

---

## Phase 8 — Analytics Deep Dive + 100-User Experiment
**Goal:** launch a measurable real-user validation experiment.

**Requires:** Phases 3-7 stable.

**Deliverables:**
- complete events: `home_view`, `intent_selected`, `preference_selected`, `result_viewed`, `place_opened`, `directions_clicked`, `itinerary_generated`, `share_clicked`
- funnel definition
- unique user tracking using analytics provider capabilities
- production deployment/domain
- distribution checklist for external launch

**Metrics:**
- unique users
- result completion rate
- median taps-to-result
- directions CTR
- share rate
- drop-off by intent

**Acceptance:**
- can verify whether ~100 real users used the product
- can identify where users drop off
- no need for feedback widget yet unless behavioral data is insufficient

---

## Phase 9 — PWA + Performance + SEO
**Goal:** make the validated MVP installable, faster, and easier to discover.

**Requires:** Phase 8 experiment app stable.

**Deliverables:**
- manifest/icons
- basic offline shell
- metadata/sitemap/robots
- performance audit/fixes
- structured SEO pages only where genuinely useful

**Acceptance:**
- install experience works on supported browsers
- Lighthouse/mobile audit target >=90 where realistic
- no SEO work compromises the <=3-tap core UX

---

## Phase 10 — Persistence / Admin (post-validation)
**Goal:** make curation manageable only after demand is validated.

**Requires:** evidence from Phase 8 that ongoing data operations are worthwhile.

**Deliverables:**
- Supabase/PostgreSQL migration if approved
- admin curation UI
- place/tag/reason/featured/image management

**Acceptance:**
- migration is transparent to end users
- existing recommendation behavior remains backward compatible

---

## Deferred until after validation
Do NOT build early:
- user accounts
- social feed
- public review system
- hotel booking engine
- payments
- chat
- runtime LLM recommendation
- full Google Maps SDK
- complex personalization
- feedback widget unless Phase 8 data shows a clear need
- Hội An as a full section
