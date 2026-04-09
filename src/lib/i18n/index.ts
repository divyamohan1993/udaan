import type { Locale, I18nStrings } from "../../shared/types";
import hiStrings from "../../data/i18n/hi.json";
import enStrings from "../../data/i18n/en.json";

/**
 * O(1) i18n Engine
 *
 * Flat Map<string, string> per locale for O(1) string resolution.
 * Variable interpolation with {var} patterns.
 * Hindi fallback to English. Returns key if not found.
 */

const locales: Record<Locale, Map<string, string>> = {
  hi: new Map(Object.entries(hiStrings as I18nStrings)),
  en: new Map(Object.entries(enStrings as I18nStrings)),
};

/**
 * O(1) string resolution with fallback chain and variable interpolation.
 *
 * Fallback: locale -> hi -> key
 * Interpolation: {varName} replaced with vars[varName]
 */
export function t(key: string, locale: Locale = "hi", vars?: Record<string, string | number>): string {
  let value = locales[locale]?.get(key) ?? locales.hi.get(key) ?? key;

  // Variable interpolation
  if (vars) {
    const varKeys = Object.keys(vars);
    for (let i = 0; i < varKeys.length; i++) {
      value = value.replace(`{${varKeys[i]}}`, String(vars[varKeys[i]]));
    }
  }

  return value;
}

export function getLocaleStrings(locale: Locale): Map<string, string> {
  return locales[locale] ?? locales.hi;
}

export function getKeyCount(locale: Locale): number {
  return locales[locale]?.size ?? 0;
}
