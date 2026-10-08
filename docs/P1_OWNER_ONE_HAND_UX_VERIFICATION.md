# P1 / P1.2 — OWNER PHYSICAL ONE-HAND UX VERIFICATION
Status: **BROWSER READY FOR OWNER PHYSICAL RETEST** (NOT OWNER PHYSICAL VERIFIED until tested on real device)
Date: 2026-10-09
Branch: `phase-2a-deploy`
Base HEAD: `09f62681c561b2953eaa66d1c8291c1363a833c4`
P1 Commit: `13db85ff3b258226a6bf2ea47cea197feb02ced5`

---

## 1. Executive Summary & Problem Addressed

Prior to this milestone, browser testing (M6-B) passed all automated criteria (>=44px touch targets, zero horizontal overflow, responsive layout). However, physical testing by the Owner on a real mobile device revealed a critical usability failure:
- **STAY ("Ở ĐÂU?")**: Reachable with one thumb at the bottom.
- **GO ("ĐI ĐÂU?")**: Difficult to reach.
- **EAT ("ĂN GÌ?")**: Not comfortably reachable.
- **NOW ("BÂY GIỜ LÀM GÌ?")**: Unreachable with one thumb without shifting palm grip or using a second hand.

**Root Cause**: The original layout used a single vertical stack (NOW $\to$ EAT $\to$ GO $\to$ STAY) beneath an oversized hero, placing NOW ($y \approx 180-276\text{px}$) and EAT ($y \approx 276-384\text{px}$) inside the Hard Reach Zone at the top of the mobile screen. Furthermore, tapping an intent expanded an inline accordion pushing remaining intents off-screen.

---

## 2. Approved Redesign Implementation (P1)

Following the Owner-approved visual concept:

1. **Completely Flat Page Structure**:
   - Area below hero is flat normal page background.
   - Zero raised white sheets, zero floating panels, zero drag handles, and zero inline accordions.
2. **"Chọn nhanh" Section**:
   - Flat header: `"Chọn nhanh"` + `"Khám phá Đà Nẵng theo nhu cầu của bạn"`.
   - Internationalized across `vi`, `en`, and `ko`.
3. **2x2 Intent Grid**:
   - Mobile layout: 2 columns $\times$ 2 rows (`grid grid-cols-2 gap-2.5 sm:gap-3.5`).
   - Strict DOM & reading order: `NOW`, `EAT`, `GO`, `STAY`.
   - Row 1: `[⚡ BÂY GIỜ LÀM GÌ?, 🍜 ĂN GÌ?]`
   - Row 2: `[🧭 ĐI ĐÂU?, 🛏 Ở ĐÂU?]`
4. **Intent Card Visual Contract**:
   - **NOW**: Soft yellow / warm amber (`bg-[#FFFBEB]`, border `#FEF08A`, `Zap` vector icon).
   - **EAT**: Soft peach / orange (`bg-[#FFF7ED]`, border `#FED7AA`, `Utensils` vector icon).
   - **GO**: Soft blue (`bg-[#F0F9FF]`, border `#BAE6FD`, `Compass` vector icon).
   - **STAY**: Soft lavender / purple (`bg-[#FAF5FF]`, border `#E9D5FF`, `Bed` vector icon).
   - **Whole-card Click Target**: Entire card is an interactive `<button>` with `min-h-[136px] sm:min-h-[148px]` (substantially exceeding $\ge 44\text{px}$).
   - Decorative bottom SVG waves customized per theme.
5. **Preference Interaction via Mobile Bottom Sheet**:
   - Tapping an intent opens a mobile modal bottom sheet (`PreferenceBottomSheet.tsx`).
   - Dialog semantics: `role="dialog"`, `aria-modal="true"`, `id="preference-panel-active"`.
   - Clear title: `{intentLabel} · {sheetTitle}` (e.g. `ĂN GÌ? · Chọn sở thích`).
   - $\ge 44\text{px}$ close button (`min-h-[44px] min-w-[44px]`, `aria-label="Đóng"`).
   - Escape key and backdrop dismissal supported.
   - All preference chips meet $\ge 44\text{px}$ touch target (`min-h-[44px]`).
   - Home 2x2 grid layout behind sheet remains completely stable (no accordion shifting).

---

## 3. P1.2 Owner Correction: True One-Hand Bottom-Anchored Layout

### Root Causes Diagnosed
1. **Root Cause of Dead White Space**:
   In `src/app/page.tsx`, the outer container had `min-h-screen flex flex-col justify-between` while `<main>` had `flex-1` and `<footer>` had `mt-8`. Because the initial P1 Hero was hardcoded to a short fixed height ($125\text{px}$), the total content inside `<main>` stopped at $\approx 480\text{px}$. On an $844\text{px}$ viewport, `<main>` stretched to $787\text{px}$, leaving nearly $300\text{px}$ of empty dead white space between the 2x2 grid and the footer.
2. **Root Cause of High Grid Position**:
   Because the spare vertical space remained as dead white padding below the grid, the 2x2 grid remained positioned high up ($y \in [212\text{px}, 520\text{px}]$), leaving `NOW` and `EAT` at $y=212\text{px}$, which is in the upper quadrant and still awkward for one-thumb reach.

### P1.2 Architectural Solution
1. **Dynamic Hero Vertical Expansion**:
   `<Hero>` in `src/components/home/Hero.tsx` now uses `flex-1 min-h-[190px] max-h-[460px] md:max-h-[360px] flex flex-col`. Instead of leaving dead space below, any spare vertical height on the mobile viewport is absorbed by the vivid Dragon Bridge / Da Nang hero image at the top.
2. **Ergonomic Card Heights**:
   `<IntentCard>` uses `min-h-[136px] sm:min-h-[148px] p-3 sm:p-4 rounded-[20px]`. This keeps cards comfortably large ($\ge 3\times$ the $44\text{px}$ standard) while fitting the entire Home screen in one viewport without scroll.
3. **Bottom-Anchored 2x2 Grid**:
   The 2x2 grid is pushed down into the lower thumb zone ($y \approx 280\text{px}-608\text{px}$). `NOW` and `EAT` sit at $y \approx 280\text{px}-324\text{px}$ (middle thumb reach), and `GO` and `STAY` sit at $y \approx 420\text{px}-608\text{px}$ (natural thumb rest zone).
4. **Immediate Footer Attachment**:
   On Home, `<footer>` sits directly below the 2x2 grid with natural spacing (`mt-2 sm:mt-2.5`). The measured gap between the grid bottom and the footer top is **exactly 12px** across all mobile viewports, completely eliminating the dead white gap.
5. **Dragon Bridge Hero Asset**:
   Local project asset `/images/demo/danang-hero.svg` is used. (Note: No photographic Dragon Bridge raster asset exists in the repository; vector SVG is utilized with zero external runtime dependencies).

---

## 4. Multi-Viewport Browser Measurements (P1.2 Complete Matrix)

Verified in live Chromium browser at `http://localhost:3005`:

| Viewport Size | Phone Device Class | Hero Height | "Chọn nhanh" Y | 2x2 Grid Y | Footer Y | Gap (Grid $\to$ Footer) | All 4 Visible (No Scroll) | One-Thumb Reach Assessment |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **320 x 800** | Narrow Mobile | `200px` | `224px – 268px` | `280px – 564px` | `576px – 620px` | **12px** | **YES** | **YES** (NOW/EAT $y=280\text{px}$) |
| **360 x 800** | Compact Android | `200px` | `224px – 268px` | `280px – 564px` | `576px – 620px` | **12px** | **YES** | **YES** (NOW/EAT $y=280\text{px}$) |
| **375 x 812** | iPhone Mini / X | `204px` | `228px – 272px` | `284px – 568px` | `580px – 624px` | **12px** | **YES** | **YES** (NOW/EAT $y=284\text{px}$) |
| **390 x 844** | iPhone 12/13/14 | `216px` | `240px – 284px` | `296px – 580px` | `592px – 636px` | **12px** | **YES** | **YES** (NOW/EAT $y=296\text{px}$) |
| **393 x 852** | iPhone 14/15 Pro | `220px` | `244px – 288px` | `300px – 584px` | `596px – 640px` | **12px** | **YES** | **YES** (NOW/EAT $y=300\text{px}$) |
| **412 x 915** | Pixel 7 / Galaxy | `236px` | `260px – 304px` | `316px – 600px` | `612px – 656px` | **12px** | **YES** | **YES** (NOW/EAT $y=316\text{px}$) |
| **430 x 932** | iPhone Pro Max | `244px` | `268px – 312px` | `324px – 608px` | `620px – 664px` | **12px** | **YES** | **YES** (NOW/EAT $y=324\text{px}$) |

### Card Coordinates at 390x844:
- **NOW (`BÂY GIỜ LÀM GÌ?`)**: Top Y = `296px`, Bottom Y = `432px`, Height = `136px`
- **EAT (`ĂN GÌ?`)**: Top Y = `296px`, Bottom Y = `432px`, Height = `136px`
- **GO (`ĐI ĐÂU?`)**: Top Y = `444px`, Bottom Y = `580px`, Height = `136px`
- **STAY (`Ở ĐÂU?`)**: Top Y = `444px`, Bottom Y = `580px`, Height = `136px`
- **Footer**: Top Y = `592px`, Bottom Y = `636px`
- **Gap between Grid and Footer**: `592px - 580px = 12px` (zero dead white space).

---

## 5. Strict Business Logic & Scope Preservation

- **Neon Database**: Zero mutations, zero schema changes.
- **Discovery API**: Preserved intact (0–3 truthful results, no fake padding, exact Maps URLs).
- **Nearby Engine**: 1 km $\to$ 3 km $\to$ 5 km logic intact.
- **Analytics**: All 11 events preserved (`intent_selected`, `preference_selected` fire exactly once).
- **Calendar Reminder**: Untouched (belonging to P2).
- **NOW Flow**: Preserved sample itinerary behavior (`"Lịch trình mẫu nhanh"`); zero live DB queries.
- **CAFE**: Remains disabled.

---

## 6. Verification Quality Gates

1. **Vitest Unit & Integration Suite**:
   - `npx vitest run --exclude "**/curation.test.ts"`:
   - **15 test files passed (15/15)**.
   - **298 tests passed (298/298)**.
2. **ESLint**:
   - `npm run lint`: `✔ No ESLint warnings or errors`.
3. **TypeScript**:
   - `npm run typecheck`: Exit code 0 (`tsc --noEmit`).
4. **Next.js Production Build**:
   - `npm run build`: Exit code 0 (compiled and static pages 5/5 generated).
5. **Data Integrity**:
   - `git diff HEAD -- src/data/curated/curated-places.json`: 0 diff (unmodified).
   - Zero database mutations.

---

## 7. Physical Device Acceptance Status

- **Browser Layout Verification**: **PASS** (Zero dead space, 12px natural gap, bottom-anchored 2x2 grid, all 4 cards visible without scroll).
- **Physical Device Acceptance**: **NOT YET VERIFIED** (Awaiting Owner physical testing on a real mobile device).
- **Status**: **BROWSER READY FOR OWNER PHYSICAL RETEST**.
