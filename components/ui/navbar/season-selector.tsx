"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "@/lib/i18n/locale-context";
import { cn } from "@/lib/utils";

interface SeasonOption {
  nameKey: string;
  url: string;
}

const SEASON_OPTIONS: SeasonOption[] = [
  { nameKey: "season.season1", url: "https://x5dosnerds.vercel.app" },
  { nameKey: "season.season2", url: "https://x5-season-2.vercel.app" },
  { nameKey: "season.season2Legacy", url: "https://x5-season-2-legacy.vercel.app" },
  { nameKey: "season.season3", url: "https://x5-season-3.vercel.app" },
  { nameKey: "season.season3Legacy", url: "https://x5-season-3-legacy.vercel.app" },
];

function isMainSeason(nameKey: string) {
  return nameKey === "season.season2" || nameKey === "season.season3";
}

function getCurrentSeasonKey(): "s3" | "s2" {
  const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || "";
  if (projectId.includes("season-2") || projectId.includes("s2")) return "s2";
  return "s3";
}

export function SeasonSelector() {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const seasonKey = getCurrentSeasonKey();
  const currentSeason = {
    full: seasonKey === "s3" ? t("season.season3") : t("season.season2"),
    short: seasonKey === "s3" ? t("season.s3") : t("season.s2"),
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const allSeasons = SEASON_OPTIONS.map((opt) => ({ ...opt, name: t(opt.nameKey) }));
  const currentPath = pathname || "/";
  const currentQuery = searchParams.toString();

  if (allSeasons.length === 0) {
    return null; // Don't show if there are no seasons
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-1 text-sm font-semibold tracking-tight"
        )}
      >
        <span className="hidden sm:inline">{currentSeason.full}</span>
        <span className="sm:hidden">{currentSeason.short}</span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute -left-7 top-full mt-2 w-40 rounded-md border border-border bg-background shadow-lg z-50">
          <div className="py-1">
            {allSeasons.map((season) => {
              const isCurrent =
                (seasonKey === "s3" && season.nameKey === "season.season3") ||
                (seasonKey === "s2" && season.nameKey === "season.season2");
              const shouldKeepRoute =
                isMainSeason(season.nameKey) && isMainSeason(`season.${seasonKey === "s3" ? "season3" : "season2"}`);
              const href = shouldKeepRoute
                ? `${season.url}${currentPath}${currentQuery ? `?${currentQuery}` : ""}`
                : season.url;
              return (
                <Link
                  key={season.nameKey}
                  href={href}
                  className={cn(
                    "block px-4 py-2 text-sm transition",
                    isCurrent
                      ? "bg-accent text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {season.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
