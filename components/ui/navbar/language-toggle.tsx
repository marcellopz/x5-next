"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function LanguageToggle() {
  const [language, setLanguage] = useState<"en" | "pt">("en");

  return (
    <div className="flex items-center rounded-md border border-border bg-background overflow-hidden">
      <button
        onClick={() => setLanguage("pt")}
        className={cn(
          "px-3 py-1.5 text-xs font-medium transition-colors",
          language === "pt"
            ? "text-foreground bg-accent"
            : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
        )}
      >
        PT
      </button>
      <button
        onClick={() => setLanguage("en")}
        className={cn(
          "px-3 py-1.5 text-xs font-medium transition-colors",
          language === "en"
            ? "text-foreground bg-accent"
            : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
        )}
      >
        EN
      </button>
    </div>
  );
}
