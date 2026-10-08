# M7-C Verification Report: Intent Visuals & Language Placement Hotfix

Date: 2026-10-08
Branch: `phase-2a-deploy`
Base Checkpoint: `f47fcaff5255a8b839290eec624a9f93697ed50b`
Scope: Visual hotfix only (Intent vector visuals, footer language trigger placement, Next.js dev indicator clarification). Zero DB/API changes, zero new packages.

---

## 1. Issue 1 — Broken Intent Visuals

### Root Cause
- In `src/components/home/IntentCard.tsx`, intent visual containers used Next.js `<Image src={intent.thumbnailUrl} alt={localizedLabel} fill ... />` referencing unoptimized SVGs in `/images/demo/*.svg`.
- Next.js 15 disables SVG optimization by default unless `dangerouslyAllowSVG: true` is configured in `next.config.ts`.
- As a consequence, `/_next/image` failed to optimize/render the SVGs, causing broken image icons and spilling the `alt` text ("ĂN GÌ?", "ĐI ĐÂU?", "Ở ĐÂU?") into the 72x72 visual container on mobile.

### Fix
- Replaced fragile `<Image>` calls with native inline vector icons using already-installed `lucide-react` icons (`Utensils`, `Compass`, `Bed`, `Zap`).
- Designed tailored, harmonious background gradients and accent colors for each intent:
  - **EAT**: `Utensils` icon + `amber` gradient (`from-amber-50 via-orange-50 to-amber-100/70`) + `text-amber-600` + `🍜` emoji badge.
  - **GO**: `Compass` icon + `sky` gradient (`from-sky-50 via-cyan-50 to-sky-100/70`) + `text-sky-600` + `📍` emoji badge.
  - **STAY**: `Bed` icon + `indigo/purple` gradient (`from-indigo-50 via-purple-50 to-indigo-100/70`) + `text-indigo-600` + `🛏️` emoji badge.
  - **NOW**: `Zap` icon + `amber/yellow` gradient + `text-amber-600` + `⚡` emoji badge.
- Guaranteed:
  - 100% stable, zero network calls, zero external image dependencies.
  - Zero alt text leakage (SVGs have `aria-hidden="true"`).
  - No venue images reintroduced.

---

## 2. Issue 2 — Language Trigger Placement

### Root Cause & Owner Feedback
- In M7-B, `LanguageSelector` was positioned floating in the middle lower section of Home.
- Owner requested moving it to a clean **footer utility row**:
  ```
  LA CÀ ĐÀ NẴNG          [ 🌐 Tiếng Việt ]
  ```
  with Brand on the left, Language trigger on the right.
  When English: `[ 🌐 English ]`
  When Korean: `[ 🌐 한국어 ]`

### Fix
- In `src/app/page.tsx`:
  - Removed the floating middle `LanguageSelector` on Home (`lines 111-115`).
  - Implemented the footer utility row:
    ```tsx
    <footer className="w-full border-t border-slate-200/80 bg-white py-4 px-4 sm:px-6 mt-8">
      <div className="w-full max-w-lg md:max-w-4xl mx-auto flex items-center justify-between gap-3 flex-wrap">
        <span className="text-xs sm:text-sm font-bold text-slate-800 tracking-wider uppercase select-none">
          LA CÀ ĐÀ NẴNG
        </span>
        <div className="shrink-0">
          <LanguageSelector />
        </div>
      </div>
    </footer>
    ```
- In `src/components/i18n/LanguageSelector.tsx`:
  - Simplified `currentDisplayName` to render the clean, concise native name:
    ```tsx
    const currentDisplayName =
      locale === "vi" ? "Tiếng Việt" : locale === "en" ? "English" : "한국어";
    ```
  - Preserved touch target $\ge 44\text{px}$ (`min-h-[44px] min-w-[44px]`).
  - Preserved one-hand reachability at the bottom of the page.
  - Preserved bottom sheet modal for switching between VI, EN, KO, and Auto.
  - Maintained `flex-wrap` and compact spacing so no horizontal clipping occurs even on 320px viewports.

---

## 3. Next.js "N" Indicator Clarification
- The round floating button with the letter "N" at the bottom-left corner is Next.js 14.2+/15's built-in DevTools indicator (`nextjs-portal`).
- It is rendered **only** during development mode (`NODE_ENV === "development"`).
- In production builds (`next build` / `next start` / Cloudflare Worker deployment), Next.js automatically removes and tree-shakes this dev portal.
- Per strict non-negotiable instruction: **Do NOT alter or hack application code to hide it in dev**. It is not part of the product UI.

---

## 4. Verification Evidence

### Automated Test Suite
- Test command: `npx vitest run --exclude "**/curation.test.ts"`
- Results: **13 test files passed, 225/225 tests passed (100%)**, duration 11.28s.
  - Includes dedicated `tests/m7c-visual-hotfix.test.tsx` (4 tests) covering:
    - Zero `<img>` tags in intent cards; pure SVG vectors with `aria-hidden`.
    - Footer utility row structure (`justify-between`, `flex-wrap`, brand left, language right).
    - Dynamic button labels: `Tiếng Việt` $\rightarrow$ `English` $\rightarrow$ `한국어`.
    - Touch targets $\ge 44\text{px}$.

### Lint & Types
- `npm run lint`: **PASS** (0 warnings, 0 errors).
- `npm run typecheck`: **PASS** (`tsc --noEmit` exit code 0).

### Production Build
- `npm run build`: **PASS** (compiled in 4.9s, static pages 5/5 generated, zero build errors).

### Live Regression Check
- `EAT` discovery with Neon: **PASS** (tested live via dev server `GET /api/discovery?intent=EAT&locale=vi&preference=an_ngon 200`).
- `GO` / `STAY` discovery with Neon: **PASS** (verified in integration tests).
- `Nearby` GPS 1 $\rightarrow$ 3 $\rightarrow$ 5 km: **PASS** (verified in unit & integration tests).
- `CAFE` inactive: **PASS** (400 preserved).
- `NOW` sample timeline: **PASS** (preserved).
- Curated dataset: **PASS** (clean, 0 modifications).
