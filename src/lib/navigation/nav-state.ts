import { PREFERENCES_BY_INTENT } from "@/data/discovery-ui";
import type { DiscoveryLocale, DiscoverySection } from "@/lib/data/discovery-contract";
import { hubPath, slugOf } from "@/lib/seo/browse";
import { placePath } from "@/lib/seo/site";

export const DISCOVERY_SELECTION_STORAGE_KEY = "laca_discovery_selection";
export const NAV_SOURCE_STORAGE_KEY = "laca_nav_source";
export const RETURN_RESTORE_KEY = "laca_return_restore";

/** TTL for temporary session state: 30 minutes */
export const NAV_STATE_TTL_MS = 30 * 60 * 1000;

/** Set or clear the one-time pending return-restore flag */
export function setPendingReturnRestore(enabled: boolean): void {
  if (typeof window === "undefined") return;
  try {
    if (enabled) {
      window.sessionStorage?.setItem(RETURN_RESTORE_KEY, "true");
    } else {
      window.sessionStorage?.removeItem(RETURN_RESTORE_KEY);
    }
  } catch {
    // Storage access failures must never throw
  }
}

/**
 * Check and consume the one-time pending return-restore flag.
 * Returns true only if the user is returning from a detail page.
 */
export function consumeReturnRestoreFlag(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const isPending = window.sessionStorage?.getItem(RETURN_RESTORE_KEY) === "true";
    if (isPending) {
      window.sessionStorage?.removeItem(RETURN_RESTORE_KEY);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export const VALID_INTENTS = ["EAT", "GO", "NOW", "STAY"] as const;
export type ValidIntent = (typeof VALID_INTENTS)[number];

export interface DiscoverySelectionState {
  intent: ValidIntent;
  preference: string;
  timestamp: number;
}

export interface NavSourceState {
  path: string;
  type: "home" | "place" | "browse";
  timestamp: number;
}

/** Strictly validate whether an intent is one of the 4 allowed */
export function isValidIntent(intent: unknown): intent is ValidIntent {
  return typeof intent === "string" && (VALID_INTENTS as readonly string[]).includes(intent);
}

/** Strictly validate whether a preference belongs to the intent */
export function isValidPreference(intent: string, preference: unknown): boolean {
  if (typeof preference !== "string" || !preference || preference.length > 50) return false;
  if (intent === "NOW" && preference === "time_slot") return true;

  const validChips = PREFERENCES_BY_INTENT[intent];
  if (!validChips) return false;
  return validChips.some((chip) => chip.id === preference);
}

/** Validate whether a relative path is a safe internal application route */
export function isSafeInternalPath(path: unknown): path is string {
  if (typeof path !== "string" || !path.startsWith("/")) return false;
  // Disallow protocol-relative URLs (//example.com), backslashes, etc.
  if (path.startsWith("//") || path.includes("\\")) return false;

  // Home route
  if (path === "/" || path === "/?locale=en" || path === "/?locale=ko") return true;

  // Place detail route: /places/123 with optional ?locale=en|ko
  if (/^\/places\/[1-9]\d*(\?locale=(en|ko))?$/.test(path)) return true;

  // Browse hub route: /browse/(eat|cafe|go|stay) with optional page and locale params
  if (
    /^\/browse\/(eat|cafe|go|stay)(\?(locale=(en|ko)|page=[1-9]\d{0,3})(&?(locale=(en|ko)|page=[1-9]\d{0,3}))*)?$/.test(
      path
    )
  ) {
    return true;
  }

  return false;
}

/** Save active discovery selection to sessionStorage */
export function saveDiscoverySelection(intent: string, preference: string): void {
  if (typeof window === "undefined") return;
  if (!isValidIntent(intent) || !isValidPreference(intent, preference)) return;

  try {
    const state: DiscoverySelectionState = {
      intent,
      preference,
      timestamp: Date.now(),
    };
    window.sessionStorage?.setItem(DISCOVERY_SELECTION_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage access failures must never throw
  }
}

/** Get valid, non-expired discovery selection from sessionStorage */
export function getValidDiscoverySelection(): { intent: ValidIntent; preference: string } | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.sessionStorage?.getItem(DISCOVERY_SELECTION_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<DiscoverySelectionState>;
    if (!parsed || typeof parsed !== "object") return null;

    // Check TTL
    if (typeof parsed.timestamp !== "number" || Date.now() - parsed.timestamp > NAV_STATE_TTL_MS) {
      clearDiscoverySelection();
      return null;
    }

    if (isValidIntent(parsed.intent) && isValidPreference(parsed.intent, parsed.preference)) {
      return {
        intent: parsed.intent,
        preference: parsed.preference as string,
      };
    }

    clearDiscoverySelection();
    return null;
  } catch {
    return null;
  }
}

/** Clear discovery selection (e.g. when resetting or clicking Home) */
export function clearDiscoverySelection(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage?.removeItem(DISCOVERY_SELECTION_STORAGE_KEY);
  } catch {
    // ignore
  }
}

/** Save internal navigation source */
export function saveNavSource(path: string, type: "home" | "place" | "browse"): void {
  if (typeof window === "undefined") return;
  if (!isSafeInternalPath(path)) return;

  try {
    const state: NavSourceState = {
      path,
      type,
      timestamp: Date.now(),
    };
    window.sessionStorage?.setItem(NAV_SOURCE_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

/** Get valid, non-expired internal navigation source */
export function getValidNavSource(): NavSourceState | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.sessionStorage?.getItem(NAV_SOURCE_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<NavSourceState>;
    if (!parsed || typeof parsed !== "object") return null;

    // Check TTL
    if (typeof parsed.timestamp !== "number" || Date.now() - parsed.timestamp > NAV_STATE_TTL_MS) {
      clearNavSource();
      return null;
    }

    if (
      isSafeInternalPath(parsed.path) &&
      (parsed.type === "home" || parsed.type === "place" || parsed.type === "browse")
    ) {
      return {
        path: parsed.path,
        type: parsed.type,
        timestamp: parsed.timestamp,
      };
    }

    clearNavSource();
    return null;
  } catch {
    return null;
  }
}

/** Clear navigation source */
export function clearNavSource(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage?.removeItem(NAV_SOURCE_STORAGE_KEY);
  } catch {
    // ignore
  }
}

/**
 * Resolve the safe "Quay lại" target URL for a place detail page.
 * 1. If a valid internal navigation source exists and is not the current page: returns that source path.
 * 2. If direct/cold landing (Google Search, shared link): returns category browse path /browse/{section}.
 */
export function resolveBackTarget(
  place: { id: number; section: DiscoverySection },
  locale: DiscoveryLocale
): { href: string; isFallback: boolean } {
  const currentPath = placePath(place.id, locale);
  const source = getValidNavSource();

  if (source && source.path !== currentPath && isSafeInternalPath(source.path)) {
    return { href: source.path, isFallback: false };
  }

  // Fallback category hub: /browse/{section}
  const categoryHub = hubPath(slugOf(place.section), 1, locale);
  return { href: categoryHub, isFallback: true };
}
