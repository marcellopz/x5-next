"use client";

import { useLocale } from "@/lib/i18n/locale-context";
import { cn } from "@/lib/utils";

export function LanguageToggle() {
  const { locale, setLocale } = useLocale();

  return (
    <div className="flex items-center rounded-md border border-border bg-background overflow-hidden">
      <button
        onClick={() => setLocale("pt")}
        className={cn(
          "px-3 py-1.5 text-xs font-medium transition-colors",
          locale === "pt"
            ? "text-foreground bg-accent"
            : "text-muted-foreground hover:text-foreground hover:bg-accent/50 cursor-pointer"
        )}
      >
        PT
      </button>
      <button
        onClick={() => setLocale("en")}
        className={cn(
          "px-3 py-1.5 text-xs font-medium transition-colors",
          locale === "en"
            ? "text-foreground bg-accent"
            : "text-muted-foreground hover:text-foreground hover:bg-accent/50 cursor-pointer"
        )}
      >
        EN
      </button>
    </div>
  );
}
