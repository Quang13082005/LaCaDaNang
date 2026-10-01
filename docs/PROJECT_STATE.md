# PROJECT_STATE.md

## Current phase
Phase 2A Data Curation completed

## Status
WAITING FOR USER DATA REVIEW

## Locked product decisions
- Mobile-first web/PWA.
- Four primary intents: Ăn gì, Đi đâu, Bây giờ làm gì, Ở đâu.
- First useful result in <=3 taps; target 2 taps for normal discovery.
- “Bây giờ làm gì?” generates a mini itinerary from current Da Nang local time after one primary preference tap.
- Start with hardcoded prototype, then a small curated JSON seed.
- No auth/booking/payment/social feed/public review/runtime AI recommendation in MVP.
- UI polish is a core product requirement.
- Results are usually 3 strong cards in a vertical mobile stack.
- Vercel is the deployment target.
- Tailwind CSS is explicitly chosen.
- Be Vietnam Pro + locked sky/orange design tokens are the initial visual system.
- shadcn/ui is limited to primitives, not the main travel cards/chips.

## Data status
- Raw candidate source audited (300 candidates: 180 EAT, 115 STAY, 5 GO + 1 Mikazuki water park).
- Geofence enforced: strictly within Da Nang (radius <= 15km), excluded 6 non-Da Nang / Quảng Nam records.
- Deduplication enforced: removed duplicate chain branches (kept 1 flagship each).
- Phase 2A.2 Curation Evidence Hardening applied:
  - 5 Safe Auto-Derived Tags only: `POPULAR`, `CAFE`, `SEAFOOD`, `CENTRAL`, `NEAR_BEACH` (documented in `docs/DATA_TAG_RULES.md`).
  - All unverified subjective tags moved to `manualReviewTags` (74 places queued in `docs/MANUAL_CURATION_QUEUE.md`).
  - Unverified `CHEAP` tags removed 100% (due to `priceLevel = null`).
  - Unverified `NIGHT` tags removed 100% (due to lack of verified opening hours).
  - `timeTags = []`, `bestTimeOfDay = []`, `typicalDurationMinutes = null` set to prevent false assumptions.
  - Reasons rewritten to be 100% factual (rating, review count, location, distance, verified type, photo count).
- Curated seed generated: `src/data/curated/curated-places.json` (86 places: 50 EAT, 6 GO, 30 STAY).
- 100% validated via Zod schema (`PlaceSchema`).
- Audit reports: `docs/DATA_CURATION_REPORT.md`, `docs/DATA_TAG_RULES.md`, `docs/MANUAL_CURATION_QUEUE.md`, `docs/GO_DATA_GAPS.md`.

## Image strategy — locked for MVP
- Phase 1 uses a small number of approved local demo images or legally reusable/owned travel images under `public/images/demo/`.
- Phase 2 final curated places should each have a stable `imageUrl`; preferred source is an owned/licensed local asset under `public/images/places/`.
- Do not hotlink unstable third-party venue images.
- Do not copy/re-distribute copyrighted Google Maps/Facebook/venue photos without permission or a valid license.
- Branded category fallback is allowed only when no approved real image is available.

## Manual pre-work still required by user
1. Review curated seed `src/data/curated/curated-places.json` (86 places).
2. Review GO gaps in `docs/GO_DATA_GAPS.md` and approve/verify ~15-20 iconic GO destinations.
3. Review and approve before Phase 2B (frontend integration).

## Analytics strategy
- Basic Vercel Analytics begins in Phase 3.
- Share infrastructure moves earlier to Phase 6.
- Full funnel/100-user experiment occurs in Phase 8.

## Known blockers / risks
- GO source coverage remains limited (6 places); manual verification/addition of iconic places is required.
- Image licensing cannot be solved automatically by the coding agent.

## Next action
- User review of Phase 2A curated dataset and gap reports.
- User approves curated seed and GO addition list.
- DO NOT start Phase 2B until user approval.
