# PROJECT_STATE.md

## Current phase
Phase 1 implementation completed

## Status
WAITING FOR USER VISUAL REVIEW

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
- Raw/filtered source exists but is NOT suitable for direct application use.
- Claude review identified heavy Hội An contamination and weak GO coverage.
- Revised candidate file should enforce default radius <=15km and exclude Hội An from the Da Nang MVP.
- Iconic Da Nang destinations outside the radius may later be curated as explicit exceptions with clear distance labels.
- Coding agent must consume only the final curated seed, not the large candidate/raw files.

## Image strategy — locked for MVP
- Phase 1 uses a small number of approved local demo images or legally reusable/owned travel images under `public/images/demo/`.
- Phase 2 final curated places should each have a stable `imageUrl`; preferred source is an owned/licensed local asset under `public/images/places/`.
- Do not hotlink unstable third-party venue images.
- Do not copy/re-distribute copyrighted Google Maps/Facebook/venue photos without permission or a valid license.
- Branded category fallback is allowed only when no approved real image is available.

## Manual pre-work still required by user
1. Review the revised candidate JSON and manually curate the final ~100 places.
2. Manually add enough real GO destinations to cover the enabled GO preference chips; the filtered source is insufficient.
3. Assign curated tags/reasons/time tags to final places.
4. Add `typicalDurationMinutes` and `bestTimeOfDay` for places eligible for mini itineraries.
5. Provide/approve one legally usable image per final curated place, or accept branded fallback.
6. Connect/authorize Vercel during Phase 0 when Gemini reaches deployment.
7. Test Phase 1 preview on a real phone and approve the visual direction before Phase 2.

## Analytics strategy
- Basic Vercel Analytics begins in Phase 3.
- Share infrastructure moves earlier to Phase 6.
- Full funnel/100-user experiment occurs in Phase 8.

## Known blockers / risks
- GO source coverage remains too small after geographic cleanup; manual curation is required.
- Image licensing cannot be solved automatically by the coding agent.
- Real-device visual approval and Vercel account authorization require the user.

## Next action
- User visual test of Phase 1 on real mobile phone (360px, 390px, 430px).
- User tests all 4 intent flows and mini itinerary.
- User visual approval required before Phase 2 begins.
- Phase 2: DO NOT START.
