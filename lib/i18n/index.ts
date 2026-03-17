import { cookies } from "next/headers";
import type { Locale, Translations } from "./types";
import { LOCALE_COOKIE, DEFAULT_LOCALE } from "./types";
import en from "./locales/en.json";
import pt from "./locales/pt.json";

const translations: Record<Locale, Translations> = { en, pt };

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const value = cookieStore.get(LOCALE_COOKIE)?.value;
  if (value === "en" || value === "pt") return value;
  return DEFAULT_LOCALE;
}

export function getTranslations(locale: Locale): Translations {
  return translations[locale];
}

export function t(trans: Translations, key: string): string {
  const parts = key.split(".");
  let current: unknown = trans;
  for (const part of parts) {
    if (current && typeof current === "object" && part in current) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return key;
    }
  }
  return typeof current === "string" ? current : key;
}

export { LOCALE_COOKIE, DEFAULT_LOCALE } from "./types";
export type { Locale, Translations } from "./types";
