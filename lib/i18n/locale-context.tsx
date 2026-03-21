"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import type { Locale, Translations } from "./types";
import { LOCALE_COOKIE, DEFAULT_LOCALE, LOCALE_MAP } from "./types";
import en from "./locales/en.json";
import pt from "./locales/pt.json";

const translationMap: Record<Locale, Translations> = { en, pt };

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value};expires=${expires};path=/;SameSite=Lax`;
}

export function LocaleProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: ReactNode;
}) {
  const router = useRouter();
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const setLocale = useCallback((newLocale: Locale) => {
    if (newLocale === locale) {
      return;
    }
    setLocaleState(newLocale);
    setCookie(LOCALE_COOKIE, newLocale, 365);
    router.refresh();
  }, [locale, router]);

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    return { locale: DEFAULT_LOCALE, setLocale: () => {} };
  }
  return context;
}

export function useTranslations() {
  const { locale } = useLocale();
  const trans = translationMap[locale];

  return useCallback(
    (key: string): string => {
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
    },
    [trans]
  );
}

export function useFormatDate() {
  const { locale } = useLocale();
  const intlLocale = LOCALE_MAP[locale];

  return useCallback(
    (date: Date | number, options?: Intl.DateTimeFormatOptions): string => {
      return new Intl.DateTimeFormat(intlLocale, options).format(date);
    },
    [intlLocale]
  );
}

export function useFormatNumber() {
  const { locale } = useLocale();
  const intlLocale = LOCALE_MAP[locale];

  return useCallback(
    (num: number, options?: Intl.NumberFormatOptions): string => {
      return new Intl.NumberFormat(intlLocale, options).format(num);
    },
    [intlLocale]
  );
}
