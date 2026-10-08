# M6-A Mentor Mobile UX & One-Hand Reachability Audit Report
**Timestamp**: 2026-10-08T11:45:00+07:00
**Branch**: `phase-2a-deploy`
**Base Commit**: `b2532706dc1b14ad447ff449ad45ec4106784104` (`feat: add nearby discovery with GPS`)
**Scope**: AUDIT ONLY. Zero modifications to `src/` or `tests/`.

---

## 1. Executive Summary & Verdict
- **Audit Verdict**: **FAIL (ONE-HAND ERGONOMICS NOT MET)**
- **Root Cause**:
  1. **Upper-Screen Control Anchoring**: The primary interaction buttons ("Gần tôi", "Đổi lựa chọn") are placed at the very top of the mobile viewport ($y \approx 20\text{px} - 60\text{px}$), which is deep within the **Hard / Impossible Thumb Reach Zone**.
  2. **Severe Position Instability**: Tapping an intent reorders the card to the top, unmounts the Hero section, and snaps content upwards by ~180px. Tapping a preference unmounts the entire IntentGrid. Controls jump unpredictably between taps.
  3. **No Fixed/Sticky Bottom Action Zone**: When scrolling down through 3 PlaceCards (~1100px total page height), all control buttons scroll out of view off the top. Users are forced to scroll all the way back to the top to change preference or toggle Nearby.

---

## 2. One-Hand Thumb Reachability Anatomy (390×844 Mobile Standard)
On a standard modern smartphone held in one hand (iPhone 12/13/14 standard 390×844):
- **Natural / Easy Thumb Reach Zone (Green Zone, $y \approx 500\text{px} - 780\text{px}$)**:
  - Sweep arc of the thumb resting naturally near the bottom.
  - Controls here require zero grip adjustment.
- **Stretch / Acceptable Zone (Yellow Zone, $y \approx 280\text{px} - 500\text{px}$)**:
  - Accessible by extending the thumb without shifting the palm.
- **Hard / Impossible Zone (Red Zone, $y \approx 0\text{px} - 280\text{px}$)**:
  - Requires shifting hand grip upwards (risk of dropping device) or using the second hand.
  - **Current Placement of "Gần tôi" & "Đổi lựa chọn"**: $y \approx 24\text{px} - 60\text{px}$ $\rightarrow$ **CRITICAL ERGONOMIC DEFECT**.

---

## 3. Journey-by-Journey Audit Findings

### 3.1. Home Screen
- **Hero Banner**: $y \approx 20\text{px} - 180\text{px}$ (160px height). Visually pleasant, but pushes interactive elements downward.
- **NOW Card**: $y \approx 190\text{px} - 290\text{px}$ (Yellow/Red boundary). Requires upward thumb stretch.
- **EAT Card**: $y \approx 305\text{px} - 395\text{px}$ (Yellow Zone). Acceptable reach.
- **GO Card**: $y \approx 410\text{px} - 500\text{px}$ (Yellow/Green boundary). Easy reach.
- **STAY Card**: $y \approx 515\text{px} - 605\text{px}$ (Green Zone). Perfect one-thumb reach.
- **Finding**: Bottom intents are easy to tap; top intent requires reaching high.

### 3.2. Intent Selection State (e.g., Tapping STAY or EAT)
- **Defect: Dynamic Reordering & Hero Unmount Jump**:
  - When STAY (at $y \approx 515\text{px}$) is tapped:
    - Hero unmounts completely.
    - `IntentGrid` dynamically reorders STAY to slot 1 ($y \approx 20\text{px}$).
    - PreferencePanel expands immediately below it ($y \approx 80\text{px} - 160\text{px}$).
    - Page auto-scrolls to top.
  - **Ergonomic Impact**: The item the user just tapped at the bottom suddenly catapults into the far top corner of the screen! The preference chips appear in the Hard Zone instead of remaining where the user's thumb was already positioned.

### 3.3. Preference Selection $\rightarrow$ Discovery Results Screen
- **Defect: Complete Unmount of Navigation & Far-Top Controls**:
  - When preference (e.g., "Ăn ngon") is tapped:
    - Entire `IntentGrid` unmounts.
    - `DiscoveryResults` mounts with header at $y \approx 24\text{px}$.
    - "Gần tôi" button ($y \approx 24\text{px}$, right aligned, min-h-[44px]).
    - "Đổi lựa chọn" button ($y \approx 24\text{px}$, right aligned, min-h-[44px]).
  - **Ergonomic Impact**: The two most important secondary navigation actions are placed at the furthest possible physical reach from the holding hand.

### 3.4. Scrolling & List Inspection
- **Defect: Missing Bottom Action Bar**:
  - 3 PlaceCards create a total scroll height of ~1185px on 390×844.
  - Once the user scrolls down to inspect PlaceCard 2 or 3:
    - "Gần tôi" and "Đổi lựa chọn" scroll out of view off the top.
    - The bottom of the screen has only the static footer.
    - To change preference or turn on Nearby, the user must backtrack and scroll upwards ~600px.

### 3.5. Google Maps CTA
- **Strength**: Rendered as a full-width button at the bottom of each PlaceCard (`min-h-[44px]`).
- **Reach**: When the user scrolls the card into the lower half of the screen, the Maps button lands directly in the Easy Thumb Zone. Excellent.

### 3.6. Geolocation Fallbacks & Empty State
- **Status Banners** (`inaccurate`, `denied`, `timeout`, `unavailable`):
  - Located at $y \approx 85\text{px} - 145\text{px}$.
  - Text + inline "Thử lại" button.
  - Sits in upper third of screen; reachable only with stretch.
- **Empty Nearby State (5 km)**:
  - Banner: *"Không tìm thấy địa điểm phù hợp trong 5 km."*
  - CTA: "Xem trên toàn Đà Nẵng" (`min-h-[44px]`).
  - Centered at $y \approx 320\text{px} - 380\text{px}$ (Acceptable reach).

---

## 4. Viewport Breakdown

| Viewport | Description | Reachability Status | Layout & Stability Observations |
| :--- | :--- | :--- | :--- |
| **320×640** | Narrow Mobile (iPhone SE 1) | **FAIL** | Content is very tall relative to viewport; top controls require thumb reaching to y=20; scrolling to bottom requires ~2.2 screen lengths; header wraps cleanly without horizontal overflow. |
| **390×844** | Primary Standard Mobile (iPhone 12/13/14) | **FAIL** | Benchmark viewport. Top buttons at y=24px are in the red zone. Scrolling cards pushes controls out of view. Reordering intents causes severe disorientation. |
| **393×852** | Modern Standard Mobile (iPhone 15/16) | **FAIL** | Identical reach issues to 390px. Top controls unreachable with single hand. |
| **430×932** | Large Mobile (iPhone 14/15/16 Pro Max) | **FAIL (CRITICAL)** | Device is physically wider and taller. Top right corner ($x=360, y=24$) is completely unreachable without shifting hand or using two hands. |
| **768×1024** | Tablet (iPad portrait) | **ACCEPTABLE** | Tablet typically held in two hands or one hand + index finger. 3-column card grid fits nicely, but mobile one-hand ergonomics do not apply directly here. |

---

## 5. Touch Target & Accessibility Audit
- **Touch Target Sizes**: **PASS**.
  - "Gần tôi": `min-h-[44px]`, rendered height = 44px, width = 96px.
  - "Đổi lựa chọn": `min-h-[44px]`, rendered height = 44px, width = 118px.
  - Preference chips: `min-h-[44px]`, rendered height = 44px, width = ~160px.
  - Maps CTA: `min-h-[44px]`, rendered height = 44px, width = full card width (358px).
- **Target Separation**: **PASS** (`gap-2` to `gap-2.5`, $\ge 8\text{px}$ separation prevents accidental adjacent taps).
- **Text Wrapping & Truncation**: **PASS**. No venue names or badges clipped or truncated with ellipsis.

---

## 6. Fixed / Sticky Bottom Action Zone Assessment

To satisfy the Mentor requirement ("thao tác thoải mái bằng một tay, không đổi tay, không với góc trên, không scroll ngược"):

### Proposed Actions to Move to Fixed Bottom Zone:
1. **"Gần tôi" Toggle Action**:
   - *Current position*: Top-right header ($y \approx 24\text{px}$).
   - *Problem*: Far out of thumb reach; disappears on scroll.
   - *Proposed*: Floating/sticky bottom toolbar pill or docked action.
2. **"Đổi lựa chọn" Reset Action**:
   - *Current position*: Top-right header ($y \approx 24\text{px}$).
   - *Problem*: Disappears when scrolling cards; requires scrolling back to top.
   - *Proposed*: Docked alongside "Gần tôi" in the fixed bottom action zone.
3. **Empty / Fallback CTAs ("Xem trên toàn Đà Nẵng", "Thử lại")**:
   - Can remain in card stream or be mirrored in the bottom action bar for immediate thumb access.

### Critical Implementation Guardrails for Fixed Bottom Zone:
- Must respect `env(safe-area-inset-bottom)` for iPhone home indicator bar.
- Must add matching `padding-bottom` (e.g., `pb-24`) to `<main>` to prevent the fixed bar from covering card details or the Google Maps button.
- Must ensure backdrop blur (`backdrop-blur-md bg-white/90`) to maintain readability over scrolling content.

---

## 7. Position Stability Assessment

| Interaction | Current Behavior | Verdict | Recommended Fix |
| :--- | :--- | :--- | :--- |
| **Tapping Intent (e.g. STAY)** | Intent moves from slot 4 to slot 1; Hero unmounts; content snaps up by 180px. | **FAIL** | Keep intent card slots stable in their original positions. Expand PreferencePanel in-place directly below the tapped card without reordering slots. Keep Hero intact or collapse gently. |
| **Tapping Preference** | Entire `IntentGrid` unmounts; screen replaces with `DiscoveryResults`. | **PARTIAL** | Results mounting is acceptable, but header controls jump to the top edge. Fixed bottom controls will eliminate this jump. |
| **Tapping "Gần tôi"** | Button state transitions from "Gần tôi" $\rightarrow$ "Đang định vị…" $\rightarrow$ "Gần tôi (Bật)". | **PASS** | Button width slightly shifts (~10px), but stays in same relative container. |
| **Tapping "Đổi lựa chọn"** | Returns to preference panel; page auto-scrolls. | **ACCEPTABLE** | Restores state cleanly, but jumps back to where chips were. |

---

## 8. Mentor Requirement Matrix

| Requirement | Current Status | Verdict | Evidence | Recommended Fix | Priority |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **One-hand mobile usage** | Controls placed at top ($y \approx 24\text{px}$) | **FAIL** | Requires shifting hand or 2nd hand on 390px/430px | Move primary controls to bottom thumb zone | **P0** |
| **Primary action thumb zone** | Primary actions in header | **FAIL** | "Gần tôi" & "Đổi lựa chọn" at $y=24\text{px}$ | Introduce sticky/fixed bottom action bar | **P0** |
| **No scrolling back up** | Actions scroll off top | **FAIL** | After scrolling 3 cards, 0 actions visible | Sticky bottom bar ensures actions always visible | **P0** |
| **Position stability** | Reorders intent & unmounts Hero | **FAIL** | STAY jumps from $y=515$ to $y=20$ | Keep intent slots stable; expand in-place | **P0** |
| **Touch targets $\ge 44\text{px}$** | All buttons $\ge 44\text{px}$ | **PASS** | `min-h-[44px]` on all action buttons | Preserve existing tokens | - |
| **Target spacing $\ge 8\text{px}$** | `gap-2` / `gap-2.5` | **PASS** | No adjacent tap conflicts observed | Preserve existing tokens | - |
| **No text clipping / ellipsis** | Wrapped cleanly | **PASS** | Long names wrap with `break-words` | Preserve existing styling | - |
| **Real Neon database** | Live connection | **PASS** | 500 places / 3079 rows | Keep intact | - |
| **GPS / Nearby flow** | 1 $\rightarrow$ 3 $\rightarrow$ 5 km | **PASS** | M5-B verified | Keep intact | - |
| **Analytics runtime** | Unstarted | **PENDING** | Architectural milestone M9 | Do not implement in M6 | - |
| **Notifications** | Unstarted | **PENDING** | Architectural milestone M10 | Do not implement in M6 | - |
| **VI / EN / KO runtime** | Helpers only | **PENDING** | Architectural milestone M8 | Do not implement in M6 | - |

---

## 9. Prioritized Defect Breakdown

### P0 — Usability & Ergonomic Blockers (Must resolve in M6-B)
1. **P0-1: Fixed/Sticky Bottom Action Bar**:
   - Provide a persistent floating bottom toolbar containing "Gần tôi" and "Đổi lựa chọn".
   - Keep actions inside natural thumb sweep arc ($y \approx 720\text{px} - 780\text{px}$ on 390×844).
   - Ensure safe area padding (`pb-24`) so no PlaceCard content is obscured.
2. **P0-2: Intent Position Stability**:
   - Stop reordering intent cards on tap. If user taps STAY, STAY stays at slot 4 and expands preferences in-place.
   - Maintain stable spatial memory for the user's thumb.
3. **P0-3: Eliminate Need to Scroll Back Up**:
   - Bottom bar remains visible at all scroll depths.

### P1 — Important Improvements
1. **P1-1: Sticky Banner for GPS Fallback Warnings**: Ensure "Thử lại" action when GPS is denied/inaccurate is easily tappable without reaching high.
2. **P1-2: Home Intent Cards Ergonomics**: Provide a subtle bottom dock or thumb-centric container so top intents (NOW, EAT) can be triggered with less thumb stretch.

### P2 — Polish
1. Micro-animations for bottom action transitions (e.g. "Gần tôi" icon rotation/pulse).
2. Refined elevation shadow for bottom toolbar across light backgrounds.

---

## 10. Conclusion & Next Steps
Milestone M6-A UX Audit is complete. The application possesses rock-solid backend logic, verified GPS algorithms, and robust data integrity, but **fails the Mentor One-Hand Ergonomics standard** due to top-anchored navigation and reordering instability.

**Next Milestone (M6-B)** will implement the targeted P0 ergonomic repairs (Sticky Bottom Action Bar + Intent Position Stabilization) upon explicit user authorization. STOP.
