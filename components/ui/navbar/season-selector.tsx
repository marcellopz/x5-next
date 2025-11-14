"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SeasonOption {
  name: string;
  url: string;
}

const SEASON_OPTIONS: SeasonOption[] = [
  { name: "Season 1", url: "https://x5dosnerds.vercel.app" },
  { name: "Season 2", url: "https://x5-season-2.vercel.app" },
  { name: "Season 2 Legacy", url: "https://x5-season-2-legacy.vercel.app" },
  { name: "Season 3", url: "https://x5-season-3.vercel.app" },
  { name: "Season 3 Legacy", url: "https://x5-season-3-legacy.vercel.app" },
];

function getCurrentSeasonName(): { full: string; short: string } {
  const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || "";
  if (projectId.includes("season-3") || projectId.includes("s3")) {
    return { full: "season 3", short: "s3" };
  } else if (projectId.includes("season-2") || projectId.includes("s2")) {
    return { full: "season 2", short: "s2" };
  }
  return { full: "season 3", short: "s3" };
}

export function SeasonSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentSeason = getCurrentSeasonName();

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

  // Show all seasons, but highlight the current one
  const allSeasons = SEASON_OPTIONS;

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
                season.name.toLowerCase() === currentSeason.full;
              return (
                <Link
                  key={season.name}
                  href={season.url}
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
