import type { Locale, I18nStrings } from "../../shared/types";
import hiStrings from "../../data/i18n/hi.json";
import enStrings from "../../data/i18n/en.json";

const locales: Record<Locale, Map<string, string>> = {
  hi: new Map(Object.entries(hiStrings as I18nStrings)),
  en: new Map(Object.entries(enStrings as I18nStrings)),
};

export function t(key: string, locale: Locale = "hi"): string {
  return locales[locale]?.get(key) ?? locales.hi.get(key) ?? key;
}

export function getLocaleStrings(locale: Locale): Map<string, string> {
  return locales[locale] ?? locales.hi;
}
