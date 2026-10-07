/**
 * Discovery API contract (no-image MVP) — the ONLY shape the browser/UI may rely on.
 *
 * Deliberately independent from:
 *  - `src/types/place.ts` / `DemoPlace` (demo shapes: require imageUrl, rating:number, reasons[]);
 *  - `place-schema.ts` (old 86-row curated seed: EAT/GO/STAY only, Da Nang bounding box);
 *  - raw PostgreSQL rows (never leave the repository/adapter layer).
 *
 * Not part of this contract on purpose: imageUrl, photo_count, phone/website, invented
 * prices, opening hours, travel time, user distance, "reasons" or any subjective tag that
 * the database does not carry.
 */
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type SupportedLocale } from "@/lib/i18n/locales";

export const DISCOVERY_SECTIONS = ["EAT", "CAFE", "GO", "STAY"] as const;
export type DiscoverySection = (typeof DISCOVERY_SECTIONS)[number];

export const DISCOVERY_LOCALES = SUPPORTED_LOCALES;
export type DiscoveryLocale = SupportedLocale;
export const DISCOVERY_DEFAULT_LOCALE: DiscoveryLocale = DEFAULT_LOCALE;
/** Locale used when the requested translation row is missing. Rows missing both fall back to source name. */
export const DISCOVERY_FALLBACK_LOCALE: DiscoveryLocale = "vi";

/** MVP rule: at most three truthful results, never padded. */
export const DISCOVERY_MAX_RESULTS = 3;

/** Enabled API slices. CAFE validates but answers 400 INTENT_NOT_AVAILABLE. */
export const ENABLED_DISCOVERY_SECTIONS: readonly DiscoverySection[] = ["EAT", "GO", "STAY"];

/** Identifier of the ordering rule; bump when the rule changes so clients/tests can tell. */
export const DISCOVERY_RANKING_RULE = "provisional-v1" as const;

export type TagDomain = "EAT" | "CAFE" | "GO" | "STAY" | "COMMON";

export interface DiscoveryTag {
  code: string;
  label: string;
  domain: TagDomain;
}

export interface DiscoveryArea {
  id: number;
  name: string;
  unitType: string;
}

export interface DiscoveryPlace {
  /** Workbook/DB `places.id` (internal key, preserved from the workbook). */
  id: number;
  /** External Google identity (`places.google_place_id`). */
  googlePlaceId: string;
  section: DiscoverySection;
  /** Localized display name (falls back to vi, then to the source name). */
  name: string;
  /** Localized type label from the translation row (currently generic, e.g. "Địa điểm"). */
  typeLabel: string;
  /** Raw source type, e.g. "establishment". Not translated, not a subjective tag. */
  primaryType: string;
  address: string;
  area: DiscoveryArea;
  location: { lat: number; lng: number };
  /** Stored valid Google Maps URL; open as-is, never constructed. */
  googleMapsUrl: string;
  /** null = unknown. Never defaulted to 0. */
  rating: number | null;
  /** null = unknown. Never defaulted to 0. */
  reviewCount: number | null;
  tags: DiscoveryTag[];
  /** Source description. Currently null for all rows; never synthesized. */
  description: string | null;
  /** true when the requested-locale translation was missing and a fallback was used. */
  translationFallback: boolean;
}

export type PreferenceMappingKind = "general" | "tags";

export interface DiscoveryResponseData {
  intent: DiscoverySection;
  locale: DiscoveryLocale;
  preference: string | null;
  /** How `preference` was applied: "tags" = filtered by verified tag codes, "general" = no tag filter. */
  preferenceMapping: PreferenceMappingKind | null;
  count: number;
  places: DiscoveryPlace[];
  meta: {
    limit: typeof DISCOVERY_MAX_RESULTS;
    ranking: typeof DISCOVERY_RANKING_RULE;
    source: "neon-postgres";
  };
}

export type DiscoveryErrorCode =
  | "INVALID_PARAMETER"
  | "INTENT_NOT_AVAILABLE"
  | "DATABASE_UNAVAILABLE"
  | "INTERNAL_ERROR";

export interface DiscoveryErrorBody {
  ok: false;
  error: {
    code: DiscoveryErrorCode;
    message: string;
    /** Name of the offending query parameter, for INVALID_PARAMETER only. */
    field?: string;
  };
}

export interface DiscoverySuccessBody {
  ok: true;
  data: DiscoveryResponseData;
}

export type DiscoveryApiBody = DiscoverySuccessBody | DiscoveryErrorBody;

export function isDiscoverySection(value: unknown): value is DiscoverySection {
  return typeof value === "string" && (DISCOVERY_SECTIONS as readonly string[]).includes(value);
}

export function isDiscoveryLocale(value: unknown): value is DiscoveryLocale {
  return typeof value === "string" && (DISCOVERY_LOCALES as readonly string[]).includes(value);
}

export function isTagDomain(value: unknown): value is TagDomain {
  return value === "EAT" || value === "CAFE" || value === "GO" || value === "STAY" || value === "COMMON";
}

/** Validated request, produced only by `parseDiscoveryQuery`. */
export interface DiscoveryQuery {
  intent: DiscoverySection;
  locale: DiscoveryLocale;
  preference: string | null;
}

export type ParseResult =
  | { ok: true; query: DiscoveryQuery }
  | { ok: false; field: string; message: string };

const PREFERENCE_PATTERN = /^[a-z][a-z0-9_]{0,31}$/;

/**
 * Strict query validation. Values must match exactly (no silent coercion): unknown intents,
 * unsupported locales, malformed/duplicated parameters are rejected with the field name.
 * `locale` omitted -> default `vi` (documented, explicit); `preference` omitted -> null.
 */
export function parseDiscoveryQuery(params: URLSearchParams): ParseResult {
  for (const key of ["intent", "locale", "preference"]) {
    if (params.getAll(key).length > 1) {
      return { ok: false, field: key, message: `Parameter "${key}" must appear at most once.` };
    }
  }

  const intent = params.get("intent");
  if (intent === null || intent === "") {
    return { ok: false, field: "intent", message: `Parameter "intent" is required (${DISCOVERY_SECTIONS.join("|")}).` };
  }
  if (!isDiscoverySection(intent)) {
    return { ok: false, field: "intent", message: `Unsupported intent. Allowed: ${DISCOVERY_SECTIONS.join("|")}.` };
  }

  const rawLocale = params.get("locale");
  let locale: DiscoveryLocale = DISCOVERY_DEFAULT_LOCALE;
  if (rawLocale !== null) {
    if (!isDiscoveryLocale(rawLocale)) {
      return { ok: false, field: "locale", message: `Unsupported locale. Allowed: ${DISCOVERY_LOCALES.join("|")}.` };
    }
    locale = rawLocale;
  }

  const rawPreference = params.get("preference");
  let preference: string | null = null;
  if (rawPreference !== null && rawPreference !== "") {
    if (!PREFERENCE_PATTERN.test(rawPreference)) {
      return { ok: false, field: "preference", message: "Malformed preference identifier." };
    }
    preference = rawPreference;
  }

  return { ok: true, query: { intent, locale, preference } };
}
