export const SUPPORTED_LOCALES = ["vi", "en", "ko"] as const;
export type SupportedLocale = typeof SUPPORTED_LOCALES[number];
export const DEFAULT_LOCALE: SupportedLocale = "vi";
export const LOCALE_STORAGE_KEY = "laca.ui-locale.v1";

export function isSupportedLocale(value: unknown): value is SupportedLocale {
  return value === "vi" || value === "en" || value === "ko";
}

/** Accepts a browser BCP-47 language tag, without reading any browser globals. */
export function localeFromLanguageTag(value: unknown): SupportedLocale | null {
  if (typeof value !== "string") return null;
  const tag = value.trim();
  if (!tag) return null;
  let canonical: string;
  try {
    [canonical] = Intl.getCanonicalLocales(tag);
  } catch {
    // Malformed language input is not an application failure.
    return null;
  }
  const primary = canonical.split("-")[0].toLowerCase();
  return isSupportedLocale(primary) ? primary : null;
}

export interface LocalePreferences {
  /** Persist only exact supported locale IDs. null/undefined means automatic. */
  manual?: unknown;
  languages?: readonly string[];
  language?: string;
}

/** Pure: callers pass browser preferences after hydration; server default stays VI. */
export function resolveLocale({ manual, languages = [], language }: LocalePreferences = {}): SupportedLocale {
  if (isSupportedLocale(manual)) return manual;
  for (const tag of languages) {
    const locale = localeFromLanguageTag(tag);
    if (locale) return locale;
  }
  return localeFromLanguageTag(language) ?? DEFAULT_LOCALE;
}
