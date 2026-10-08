# P1 — OWNER PHYSICAL ONE-HAND UX VERIFICATION
Status: **BROWSER READY FOR OWNER PHYSICAL RETEST** (NOT OWNER PHYSICAL VERIFIED until tested on real device)
Date: 2026-10-09
Branch: `phase-2a-deploy`
Base HEAD: `09f62681c561b2953eaa66d1c8291c1363a833c4`

---

## 1. Executive Summary & Problem Addressed

Prior to this milestone, browser testing (M6-B) passed all automated criteria (>=44px touch targets, zero horizontal overflow, responsive layout). However, physical testing by the Owner on a real mobile device revealed a critical usability failure:
- **STAY ("Ở ĐÂU?")**: Reachable with one thumb at the bottom.
- **GO ("ĐI ĐÂU?")**: Difficult to reach.
- **EAT ("ĂN GÌ?")**: Not comfortably reachable.
- **NOW ("BÂY GIỜ LÀM GÌ?")**: Unreachable with one thumb without shifting palm grip or using a second hand.

**Root Cause**: The original layout used a single vertical stack (NOW $\to$ EAT $\to$ GO $\to$ STAY) beneath an oversized hero, placing NOW ($y \approx 180-276\text{px}$) and EAT ($y \approx 276-384\text{px}$) inside the Hard Reach Zone at the top of the mobile screen. Furthermore, tapping an intent expanded an inline accordion pushing remaining intents off-screen.

---

## 2. Approved Redesign Implementation

Following the Owner-approved visual concept:

1. **Compact Hero Banner**:
   - Mobile height reduced to $124\text{px}$ (from $240\text{px}+$ previously).
   - Preserves Da Nang / Dragon Bridge brand visual identity with `<h1>LA CÀ ĐÀ NẴNG</h1>`.
2. **Completely Flat Page Structure**:
   - Area below hero is flat normal page background.
   - Zero raised white sheets, zero floating panels, zero drag handles, and zero inline accordions.
3. **"Chọn nhanh" Section**:
   - Flat header: `"Chọn nhanh"` + `"Khám phá Đà Nẵng theo nhu cầu của bạn"`.
   - Internationalized across `vi`, `en`, and `ko`.
4. **2x2 Intent Grid**:
   - Mobile layout: 2 columns $\times$ 2 rows (`grid grid-cols-2 gap-3.5`).
   - Strict DOM & reading order: `NOW`, `EAT`, `GO`, `STAY`.
   - Row 1: `[⚡ BÂY GIỜ LÀM GÌ?, 🍜 ĂN GÌ?]`
   - Row 2: `[🧭 ĐI ĐÂU?, 🛏 Ở ĐÂU?]`
5. **Intent Card Visual Contract**:
   - **NOW**: Soft yellow / warm amber (`bg-[#FFFBEB]`, border `#FEF08A`, `Zap` vector icon).
   - **EAT**: Soft peach / orange (`bg-[#FFF7ED]`, border `#FED7AA`, `Utensils` vector icon).
   - **GO**: Soft blue (`bg-[#F0F9FF]`, border `#BAE6FD`, `Compass` vector icon).
   - **STAY**: Soft lavender / purple (`bg-[#FAF5FF]`, border `#E9D5FF`, `Bed` vector icon).
   - **Whole-card Click Target**: Entire card is an interactive `<button>` with `min-h-[148px]` (substantially exceeding $\ge 44\text{px}$).
   - Decorative bottom SVG waves customized per theme.
6. **Preference Interaction via Mobile Bottom Sheet**:
   - Tapping an intent opens a mobile modal bottom sheet (`PreferenceBottomSheet.tsx`).
   - Dialog semantics: `role="dialog"`, `aria-modal="true"`, `id="preference-panel-active"`.
   - Clear title: `{intentLabel} · {sheetTitle}` (e.g. `ĂN GÌ? · Chọn sở thích`).
   - $\ge 44\text{px}$ close button (`min-h-[44px] min-w-[44px]`, `aria-label="Đóng"`).
   - Escape key and backdrop dismissal supported.
   - All preference chips meet $\ge 44\text{px}$ touch target (`min-h-[44px]`).
   - Home 2x2 grid layout behind sheet remains completely stable (no accordion shifting).

---

## 3. Strict Business Logic & Scope Preservation

- **Neon Database**: Zero mutations, zero schema changes.
- **Discovery API**: Preserved intact (0–3 truthful results, no fake padding, exact Maps URLs).
- **Nearby Engine**: 1 km $\to$ 3 km $\to$ 5 km logic intact.
- **Analytics**: All 11 events preserved (`intent_selected`, `preference_selected` fire exactly once).
- **Calendar Reminder**: Untouched (belonging to P2).
- **NOW Flow**: Preserved sample itinerary behavior (`"Lịch trình mẫu nhanh"`); zero live DB queries.
- **CAFE**: Remains disabled.

---

## 4. Multi-Viewport Browser Measurements

Tested via local production server (`http://localhost:3005`) with Chrome browser engine:

| Viewport Size | Device Class | Hero Height | Grid Top Y | Grid Bottom Y | All 4 Cards Visible (No Scroll) | Overflow / Clipping |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **320 x 800** | Narrow Mobile | `124px` | `212.1px` | `520.2px` | **YES** | NONE |
| **375 x 812** | iPhone Mini / X | `124px` | `212.1px` | `520.2px` | **YES** | NONE |
| **390 x 844** | iPhone 12/13/14 | `124px` | `212.1px` | `520.2px` | **YES** | NONE |
| **393 x 852** | iPhone 14/15 Pro| `124px` | `212.1px` | `520.2px` | **YES** | NONE |
| **430 x 932** | iPhone Pro Max | `124px` | `212.1px` | `520.2px` | **YES** | NONE |

### Card Coordinates on 390x844:
- **NOW (`BÂY GIỜ LÀM GÌ?`)**: Top Y = `212.1px`, Bottom Y = `360.1px`, Height = `148px`
- **EAT (`ĂN GÌ?`)**: Top Y = `212.1px`, Bottom Y = `360.1px`, Height = `148px`
- **GO (`ĐI ĐÂU?`)**: Top Y = `372.2px`, Bottom Y = `520.2px`, Height = `148px`
- **STAY (`Ở ĐÂU?`)**: Top Y = `372.2px`, Bottom Y = `520.2px`, Height = `148px`

**Thumb-Zone Evaluation**: The entire 2x2 grid occupies $y \in [212.1\text{px}, 520.2\text{px}]$ on an $844\text{px}$ screen. Both rows sit in the middle-to-lower portion of the display, completely avoiding the top hard-reach zone ($y < 200\text{px}$).

---

## 5. Verification Gates

1. **Vitest Unit & Integration Suite**:
   - `npx vitest run --exclude "**/curation.test.ts"`:
   - **15 test files passed (15/15)**.
   - **298 tests passed (298/298)**.
   - Includes 9 new dedicated P1 tests in `tests/one-hand-ux.test.tsx` verifying:
     - 4 intent cards in strict DOM order `[NOW, EAT, GO, STAY]`.
     - 2x2 grid layout classes.
     - Whole-card clickable button targets ($\ge 148\text{px}$).
     - Flat "Chọn nhanh" header (no drag handle/sheet).
     - Preference bottom sheet dialog semantics and touch targets.
     - Independent sheet opening for EAT, GO, STAY, NOW.
     - Close button and Escape key dismissal.
     - Transition to Discovery and reset via "Đổi lựa chọn".
2. **ESLint**:
   - `npm run lint`: `✔ No ESLint warnings or errors`.
3. **TypeScript**:
   - `npm run typecheck`: Exit code 0 (`tsc --noEmit`).
4. **Next.js Production Build**:
   - `npm run build`: Exit code 0 (`Compiled successfully in 6.5s`, static pages generated 5/5).
5. **Data Integrity**:
   - `git diff HEAD -- src/data/curated/curated-places.json`: 0 diff (unmodified).
   - Zero database mutations.

---

## 6. Physical Device Acceptance Status

- **Browser Verification**: **PASS** (Layout, reachability zone, touch targets, modal flows verified).
- **Physical Device Acceptance**: **NOT YET VERIFIED** (Awaiting Owner physical testing on a real mobile device).
- **Status**: **BROWSER READY FOR OWNER PHYSICAL RETEST**.
