"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  isSupportedLocale,
  resolveLocale,
  type SupportedLocale,
} from "@/lib/i18n/locales";
import { translate, type MessageKey } from "@/lib/i18n/messages";

export interface LocaleContextValue {
  locale: SupportedLocale;
  isManual: boolean;
  setLocale: (nextLocale: SupportedLocale) => void;
  setAuto: () => void;
  t: (key: MessageKey, params?: Record<string, string | number>) => string;
  formatNumber: (val: number, options?: Intl.NumberFormatOptions) => string;
}

export const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  // Initial server and pre-hydration state is ALWAYS "vi"
  // (matches <html lang="vi"> to guarantee zero hydration mismatch).
  const [locale, setLocaleState] = useState<SupportedLocale>(DEFAULT_LOCALE);
  const [isManual, setIsManual] = useState<boolean>(false);

  useEffect(() => {
    let stored: unknown = null;
    try {
      stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    } catch {
      stored = null;
    }

    const languages =
      typeof navigator !== "undefined" && Array.isArray(navigator.languages)
        ? navigator.languages
        : [];
    const language = typeof navigator !== "undefined" ? navigator.language : undefined;

    const resolved = resolveLocale({ manual: stored, languages, language });
    setLocaleState(resolved);
    setIsManual(isSupportedLocale(stored));
    document.documentElement.lang = resolved;
  }, []);

  const handleSetLocale = useCallback((nextLocale: SupportedLocale) => {
    setLocaleState(nextLocale);
    setIsManual(true);
    document.documentElement.lang = nextLocale;
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale);
    } catch {
      // Gracefully ignore storage failures (private browsing / disabled cookies)
    }
  }, []);

  const handleSetAuto = useCallback(() => {
    setIsManual(false);
    try {
      localStorage.removeItem(LOCALE_STORAGE_KEY);
    } catch {
      // Gracefully ignore storage failures
    }
    const languages =
      typeof navigator !== "undefined" && Array.isArray(navigator.languages)
        ? navigator.languages
        : [];
    const language = typeof navigator !== "undefined" ? navigator.language : undefined;
    const resolved = resolveLocale({ languages, language });
    setLocaleState(resolved);
    document.documentElement.lang = resolved;
  }, []);

  const t = useCallback(
    (key: MessageKey, params?: Record<string, string | number>) => {
      return translate(locale, key, params);
    },
    [locale]
  );

  const formatNumber = useCallback(
    (val: number, options?: Intl.NumberFormatOptions) => {
      try {
        return new Intl.NumberFormat(locale, options).format(val);
      } catch {
        return String(val);
      }
    },
    [locale]
  );

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      isManual,
      setLocale: handleSetLocale,
      setAuto: handleSetAuto,
      t,
      formatNumber,
    }),
    [locale, isManual, handleSetLocale, handleSetAuto, t, formatNumber]
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    // Safe fallback for isolated components or unit tests without Provider
    return {
      locale: DEFAULT_LOCALE,
      isManual: false,
      setLocale: () => {},
      setAuto: () => {},
      t: (key, params) => translate(DEFAULT_LOCALE, key, params),
      formatNumber: (val, options) =>
        new Intl.NumberFormat(DEFAULT_LOCALE, options).format(val),
    };
  }
  return ctx;
}
