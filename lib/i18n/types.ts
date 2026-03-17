import type en from "./locales/en.json";

export type Locale = "en" | "pt";

export type Translations = typeof en;

export const LOCALE_COOKIE = "x5_locale";

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_MAP: Record<Locale, string> = {
  en: "en-US",
  pt: "pt-BR",
};
