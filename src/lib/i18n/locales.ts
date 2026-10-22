export const SUPPORTED_LOCALES = ["vi", "en", "ko", "ru", "zh"] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: SupportedLocale = "vi";
export const LOCALE_STORAGE_KEY = "laca.ui-locale.v1";

export function isSupportedLocale(value: unknown): value is SupportedLocale {
  return typeof value === "string" && (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

/** Returns the standard BCP-47 HTML document language tag for a given SupportedLocale */
export function documentLangForLocale(locale: SupportedLocale): string {
  if (locale === "zh") return "zh-Hans";
  return locale;
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

  try {
    const loc = new Intl.Locale(canonical);
    const lang = loc.language.toLowerCase();

    // Chinese policy: only Simplified Chinese maps to "zh"
    // Traditional Chinese (zh-Hant, zh-TW, zh-HK, zh-MO) does NOT auto-map to "zh".
    if (lang === "zh") {
      const script = loc.script;
      const region = loc.region;
      if (script === "Hant" || region === "TW" || region === "HK" || region === "MO") {
        return null;
      }
      return "zh";
    }

    if (isSupportedLocale(lang)) {
      return lang;
    }
  } catch {
    const primary = canonical.split("-")[0].toLowerCase();
    if (primary === "zh") {
      if (/-(tw|hk|mo|hant)/i.test(canonical)) return null;
      return "zh";
    }
    return isSupportedLocale(primary) ? primary : null;
  }

  return null;
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
