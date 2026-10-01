# AGENTS.md — Da Nang 3-Tap Discovery

## 0. Mission
Build a mobile-first web app that helps a user in Da Nang get a useful result in at most 3 taps.

Primary intents:
1. ĂN GÌ?
2. ĐI ĐÂU?
3. BÂY GIỜ LÀM GÌ?
4. Ở ĐÂU?

The application must feel premium, fast, visual, youthful, and simple. UI quality is a product requirement, not a cosmetic extra.

## 1. Non-negotiable product rules
- A useful recommendation/result MUST appear in <= 3 user taps from Home.
- Prefer 2 taps when possible.
- Never add mandatory filters just because they are easy to code.
- "BÂY GIỜ LÀM GÌ?" produces a mini itinerary from the current Da Nang local time after ONE primary preference tap.
- Result screens normally show 3 strong choices, not long directories.
- "Đi ngay" / "Xem vị trí" opens the stored Google Maps URL when available.
- No authentication, booking, payment, social feed, public review system, chat, or runtime LLM recommendation in MVP.
- Do not turn the app into a Google Maps clone.
- Use hardcoded data first, then a small curated JSON seed. Database comes later.
- Never fabricate opening hours, room availability, prices, user distance, or descriptions that are not supported by data.

## 2. AI working contract
You are an implementation agent, not a product owner. Work on exactly one requested phase.

### Before changing code
1. Read `AGENTS.md`.
2. Read `GEMINI.md`.
3. Read `docs/PROJECT_STATE.md`.
4. Read `docs/PHASES.md`.
5. Run `git status` and inspect relevant files.
6. State the exact files you plan to change and why.
7. State every npm package you intend to add and why. Wait for approval if it is not already part of the locked stack.

### While changing code
- Do not modify files unrelated to the current phase.
- Do not refactor working code unless the phase explicitly requires it.
- Do not rename routes, components, data shapes, or public URLs without explicit need.
- Do not replace libraries or architecture casually.
- Do not delete working features to make a new feature pass.
- Preserve backward compatibility with all completed phases.
- Keep diffs small and reviewable.
- Reuse existing design tokens/components before creating duplicates.
- Do not modify design tokens, global CSS variables, or Tailwind configuration without explicit approval.
- Do not add npm packages without stating package name + reason.
- Do not upgrade existing packages unless the current phase requires it.
- Never edit generated lockfile internals manually.
- Do not delete, replace, rename, or move files in `public/` (especially `public/images/`) unless the phase explicitly requires it.
- Do not generate placeholder images when approved real curated images already exist.
- Never hide failures with broad `try/catch`, fake mock success, or swallowed errors.

### After changing code
1. Run lint.
2. Run typecheck.
3. Run tests for the current phase AND all completed phases.
4. From Phase 3 onward, run critical Playwright flows when they exist.
5. Run production build.
6. Inspect `git diff --stat` and `git diff` for accidental changes.
7. Verify no previous phase has regressed.
8. Update `docs/PROJECT_STATE.md`.
9. Write a checkpoint containing:
   - completed work
   - files changed
   - commands run
   - tests/build result
   - known limitations
   - preview/deployment URL when applicable
   - next phase
10. STOP. Never automatically start the next phase.

## 3. Phase gate
Only one phase may be active at a time.

A phase is DONE only when:
- all acceptance criteria in `docs/PHASES.md` pass,
- lint/typecheck/build pass,
- all tests from current + completed phases pass,
- mobile UI is manually checked at 360px / 390px / 430px for UI phases,
- tablet 768px and desktop 1280px are checked for UI phases,
- no unrelated regression is observed,
- `docs/PROJECT_STATE.md` is updated,
- a checkpoint is written,
- user approval is received before the next phase begins.

If Phase N exposes a missing dependency, report it and request permission before broadening scope. Never "helpfully" implement Phase N+1.

## 4. UX rules

### Home
Primary options:
- 🍜 ĂN GÌ?
- 📍 ĐI ĐÂU?
- ⚡ BÂY GIỜ LÀM GÌ?
- 🛏️ Ở ĐÂU?

Interaction:
- Tap a primary card to highlight it and expand its preference panel on the same screen.
- The selected card remains visible near the top of the active section.
- Other cards may collapse/de-emphasize or scroll naturally out of view; do not create a confusing multi-open accordion.
- Preference chips appear immediately below the selected card.
- The first preference options must be visible without an extra required interaction.
- If the preference list exceeds the viewport, natural vertical scrolling is allowed.
- On mobile, use a compact 2-3 column chip grid as space allows; never shrink tap targets below 44px.
- Avoid page transitions before preference selection where possible.
- A useful result should appear immediately after the preference tap.

### ĂN GÌ?
Suggested preference chips:
- 😋 Ăn ngon
- 💸 Ít tiền
- ❤️ Hẹn hò
- 👨‍👩‍👧 Gia đình
- 👥 Đi nhóm
- 🌿 Yên tĩnh
- 🔥 Nhộn nhịp
- 🍜 Đặc sản
- 🌙 Ăn đêm

`Ăn ngon` should be interpreted as a quality/popularity ranking signal, not as a fabricated claim.

### ĐI ĐÂU?
Start with only the chips supported by curated GO data. Target 5-6 strong chips first; expand only when data coverage is sufficient.
Suggested chips:
- 🌊 Biển / ngắm cảnh
- 📸 Chụp ảnh đẹp
- ❤️ Hẹn hò
- 👥 Đi nhóm
- 👨‍👩‍👧 Gia đình
- 🌿 Thiên nhiên
- 🎡 Vui chơi
- 🌙 Đi buổi tối

### BÂY GIỜ LÀM GÌ?
This is the differentiating branch and must remain within the <=3-tap rule.

Do NOT require duration + companion + style as separate mandatory steps.
After entering this branch, allow ONE primary preference tap, for example:
- ❤️ Người yêu
- 👥 Bạn bè
- 👨‍👩‍👧 Gia đình
- 🚶 Một mình
- 🌿 Thư giãn
- 🔥 Nhộn nhịp
- 📸 Chụp ảnh
- 🍜 Ăn uống
- 💸 Tiết kiệm
- 🎲 Chọn giúp tôi

Generate the first mini itinerary from NOW. Optional refinements may appear only after the first result and must never block it.

Time edge cases:
- morning/afternoon/evening: normally 2-4 stops depending on available activity window,
- late night (e.g. around 23:00): prefer 1-2 realistic stops,
- very late night (e.g. around 02:00): do not fabricate open venues; return a limited safe fallback if curated time data is insufficient.

Mini itinerary presentation:
- vertical timeline on mobile,
- each stop can have its own "Đi ngay" CTA,
- no "skip/recalculate" workflow in MVP unless explicitly added later.

### Ở ĐÂU?
Discovery only, not booking.
Suggested chips:
- 💸 Giá rẻ
- 🌊 Gần biển
- 🏙️ Gần trung tâm
- ❤️ Cặp đôi
- 👨‍👩‍👧 Gia đình
- 👥 Nhóm bạn
- 🌿 Yên tĩnh
- 🔥 Nhộn nhịp

Never claim live room availability unless connected to a real provider.

### Results
Normally show 3 recommendation cards.
Each card prioritizes:
- strong image,
- name,
- rating + review count when available,
- rough price only when supported by curated/source data,
- short location summary,
- user distance only when the user explicitly provides location and distance is calculated,
- 2-4 concise curated reasons,
- CTA: "Đi ngay" / "Xem vị trí".

Mobile result layout:
- vertical stack,
- each card fully readable without horizontal scrolling,
- do not use a horizontal-only carousel as the primary result view.

Image fallback:
- if no approved image exists, use a branded category placeholder with icon + gradient,
- never pretend the placeholder is a real place photo.

## 5. Visual system

### Explicit stack choice
Tailwind CSS is explicitly chosen for this project.
Use shadcn/ui only for primitives such as Button, Dialog, Sheet, and Skeleton. Do NOT use generic shadcn card/chip layouts for the main travel UI if they make the product look like a dashboard.

### Style direction
- modern Da Nang travel/lifestyle
- premium but youthful
- mobile-first
- strong photography
- generous whitespace
- soft rounded cards
- subtle depth, not heavy glassmorphism
- restrained purposeful motion
- clear visual hierarchy

### Design tokens — locked unless user approves change
Colors:
- Primary: `#0EA5E9` (sky-500)
- Primary dark: `#0284C7` (sky-600)
- Accent: `#F97316` (orange-500)
- Background: `#FFFFFF`
- Surface: `#F8FAFC` (slate-50)
- Text primary: `#0F172A` (slate-900)
- Text secondary: `#64748B` (slate-500)
- Card border: `#E2E8F0` (slate-200)

Typography:
- Font: `Be Vietnam Pro`, system-ui, sans-serif
- H1: 28px / 700
- H2: 22px / 600
- Body: 16px / 400
- Caption: 14px / 400
- Chip: 14px / 500

Spacing:
- Base unit: 4px
- Screen padding: 16px mobile, 24px tablet+
- Card padding: 16px
- Section gap: 24px
- Use a consistent 4/8/16/24/32/48px rhythm

Radius:
- Card: 16px
- Chip: 12px
- Button: 12px
- Image: 12px

Shadows:
- Card: `0 2px 8px rgba(0,0,0,0.08)`
- Card hover/elevated: `0 4px 16px rgba(0,0,0,0.12)`
- Avoid stacking multiple heavy shadows.

### Motion
Use Framer Motion only when motion adds clarity.
Maximum 5 distinct animation patterns for the entire MVP. Reuse variants.
Recommended patterns: card expand/collapse, subtle fade/slide in, chip selected state, result reveal, route/share confirmation.
Respect `prefers-reduced-motion`.

## 6. Technical architecture
Default stack:
- Next.js App Router
- TypeScript strict mode
- Tailwind CSS
- shadcn/ui primitives only
- Lucide icons
- Framer Motion
- Zod
- Vitest + Testing Library
- Playwright starting Phase 3+ for critical flows
- Local JSON/TypeScript seed for early phases

Persistence later only when explicitly required:
- Supabase PostgreSQL
- Supabase Storage for owned/licensed images if needed

Analytics:
- Vercel Analytics is the default MVP analytics layer.
- Add basic analytics in Phase 3, then complete the funnel in Phase 8.
- Track: `home_view`, `intent_selected`, `preference_selected`, `result_viewed`, `place_opened`, `directions_clicked`, `itinerary_generated`, `share_clicked`.

Maps:
- MVP uses stored `googleMapsUrl` / `google_maps_url` for navigation.
- Do not add a full map SDK before a phase explicitly requires map browsing.

Deployment:
- Target: Vercel.
- Phase 0 must produce the first working preview deployment after the user connects/authorizes their Vercel account.
- Every UI phase should produce a preview URL when possible so the user can test on a real phone.

## 7. Code organization
Prefer only folders needed by the current/next phase; do not pre-create empty architecture for distant features.

Target structure:
```
src/
  app/
  components/
    home/
    discovery/
    results/
    itinerary/
    shared/
  data/
  lib/
  types/
  hooks/
  styles/
docs/
  PHASES.md
  PROJECT_STATE.md
```

Keep domain logic outside presentation components. Recommendation and itinerary logic should be pure/testable where practical.

## 8. Data rules
Source data may be noisy or misleading.

Before a place can be surfaced in MVP curated data:
- useful human-readable name,
- operational status when source provides it,
- no obviously invalid/junk name,
- use rating + review volume as signals, not absolute truth,
- prefer places with usable approved imagery,
- preserve Google Maps URL,
- no fabricated mood tags; tags/reasons must be explicitly curated,
- default MVP radius: `distanceFromCenter <= 15 km`,
- Hội An records are excluded from the Da Nang MVP unless a future feature explicitly adds an out-of-area section,
- iconic Da Nang destinations outside 15km may be added only as explicit manually curated exceptions with a clear distance label.

Do NOT give the coding agent the raw 4K+/30K place dump. The app should consume only the final curated seed.

Recommended final app-level schema:
```ts
interface Place {
  id: string;
  name: string;
  section: "EAT" | "GO" | "STAY";
  primaryType: string;
  address: string;
  shortAddress?: string;
  lat: number;
  lng: number;
  googleMapsUrl: string;
  rating: number;
  reviewCount: number;
  photoCount: number;
  imageUrl: string;
  priceLevel?: 1 | 2 | 3;
  curatedTags: CuratedTag[];
  reasons: string[];
  timeTags: TimeTag[];
  typicalDurationMinutes?: number;
  bestTimeOfDay?: TimeTag[];
  featured: boolean;
  distanceFromCenter: number;
}
```

Curated tags remain flat, not hierarchical. Keep ~2-5 tags per place.

## 9. Recommendation behavior
MVP recommendation must be deterministic and explainable. Do not call an LLM at runtime to choose 3 places.

Use weighted filtering/ranking from:
- intent / preference tag match,
- curated tags,
- current-time eligibility when known,
- rating,
- review count/popularity,
- approved image availability/quality,
- distance only when appropriate,
- diversity penalty to avoid 3 near-identical results.

Suggested MVP weighting (may be tuned in Phase 2 with tests, not casually changed later):
- tag match: 40%
- rating: 25%
- popularity/review count: 20%
- image/curation completeness: 10%
- diversity adjustment: 5%

Return diversity:
- avoid 3 nearly identical places,
- avoid duplicate branches/chains when possible,
- prefer distinct alternatives.

## 10. Performance
Targets:
- Lighthouse mobile performance >= 90 when realistic after Phase 9 optimization,
- initial route feels instant,
- lazy-load below-the-fold media,
- avoid huge JSON shipped to client,
- no client bundle JSON >100KB from Phase 3 onward,
- use Server Components where practical,
- compress/optimize images,
- prevent image-driven layout shift.

## 11. Git discipline
Before implementation:
- run `git status`,
- create/confirm a branch for the current phase.

Suggested commits:
- `feat(phase-1): ...`
- `fix(phase-2): ...`
- `docs(checkpoint): ...`

Never use destructive git commands unless explicitly approved. Never reset or overwrite user work.

## 12. Design Quality Gate
Before claiming a UI phase DONE, verify ALL items:

### Layout & responsiveness
- [ ] 360px checked
- [ ] 390px checked
- [ ] 430px checked
- [ ] 768px checked
- [ ] 1280px checked
- [ ] no horizontal overflow
- [ ] no content hidden behind fixed elements
- [ ] cards/chips wrap correctly

### Visual hierarchy
- [ ] clear primary action
- [ ] one clear H1, logical H2/H3 hierarchy
- [ ] text contrast meets WCAG AA (4.5:1 for normal text)
- [ ] CTAs are visually distinct
- [ ] spacing follows locked rhythm

### Typography
- [ ] body text >=14px on mobile
- [ ] headings not truncated
- [ ] Vietnamese diacritics render correctly
- [ ] Be Vietnam Pro actually loads
- [ ] key headings avoid awkward orphaned words where practical

### Images & media
- [ ] visible cards use real approved image or branded fallback
- [ ] fixed aspect ratio prevents layout shift
- [ ] below-fold images lazy-load
- [ ] oversized source images are not shipped unnecessarily

### Interactive elements
- [ ] tap targets >=44x44px
- [ ] visible hover/active states
- [ ] visible keyboard focus states
- [ ] no dead-end state
- [ ] selected chips are clearly distinguishable
- [ ] icon-only buttons have accessible labels

### Motion
- [ ] expand/collapse smooth around 200-300ms
- [ ] no janky motion
- [ ] respects reduced motion
- [ ] <=5 distinct motion patterns in app

### States
- [ ] loading state is not blank
- [ ] empty state is helpful
- [ ] error state offers a useful recovery/retry path
- [ ] no `undefined`/broken values are rendered

### Overall feel
- [ ] looks like a premium travel/lifestyle product, not an admin dashboard
- [ ] Home purpose is understandable within ~3 seconds
- [ ] palette is cohesive
- [ ] whitespace feels deliberate
- [ ] app looks share-worthy on a phone

## 13. Code Quality / Regression Gate
Before claiming ANY phase DONE:

### Build & lint
- [ ] `npm run lint` passes with 0 errors
- [ ] `npm run typecheck` passes
- [ ] `npm run build` succeeds
- [ ] no unexplained `any` added

### Tests
- [ ] current phase tests pass
- [ ] all previous phase tests pass
- [ ] recommendation logic tested as pure functions where applicable
- [ ] edge cases for empty/missing data tested

### Git / file safety
- [ ] `git diff --stat` includes only expected files
- [ ] no accidental lockfile edits
- [ ] no accidental design-token/global-style changes
- [ ] no accidental deletions

### Data integrity
- [ ] no fabricated hours/prices/availability/distance
- [ ] no known junk record surfaced
- [ ] Google Maps URLs preserved

### Regression
- [ ] Home still renders
- [ ] all 4 intent cards still work
- [ ] previously completed flows still return results
- [ ] navigation CTA still works
- [ ] 360/390/430 responsive sanity check passes for UI changes
- [ ] no new console errors/warnings

### Documentation
- [ ] `docs/PROJECT_STATE.md` updated
- [ ] checkpoint written

## 14. Image strategy
Image quality is part of the product.

Phase 1:
- use a small set of approved local demo images or legally reusable/owned travel images,
- store stable demo assets under `public/images/demo/`,
- avoid empty gray blocks.

Phase 2 final curated seed:
- each production curated place should have a stable `imageUrl`, preferably a local owned/licensed asset under `public/images/places/`,
- do not hotlink unstable third-party images,
- do not download or redistribute copyrighted venue photos without permission/license,
- use branded fallback only when a real approved image is unavailable.

## 15. What to do when uncertain
Do not guess silently.
If uncertainty changes business behavior, data meaning, architecture, or UX flow:
- stop,
- explain ambiguity,
- offer the smallest safe options,
- ask the user to choose.

If uncertainty is minor and reversible:
- choose the simplest implementation,
- document the assumption in `docs/PROJECT_STATE.md`.

## 16. Definition of success
The MVP succeeds when a first-time user can:
1. understand the product within seconds,
2. choose one of four intents,
3. choose one preference,
4. receive strong recommendations or a mini itinerary,
5. open navigation,
6. share a useful result,
7. do all of this smoothly on mobile,
8. reach the first useful result in <=3 taps.
