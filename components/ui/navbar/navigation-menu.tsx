"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { NavLink } from "./nav-link";
import { statRoutes } from "@/app/stats/stat-routes";
import { useTranslations } from "@/lib/i18n/locale-context";
import { cn } from "@/lib/utils";

function StatsDropdown() {
  const t = useTranslations();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isStatsRoute = pathname === "/stats" || pathname.startsWith("/stats/");

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const links = [
    { href: "/stats", label: t("nav.statistics") },
    ...Object.entries(statRoutes).map(([slug, route]) => ({
      href: `/stats/${slug}`,
      label: t(route.titleKey),
    })),
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "rounded-md px-3 py-1.5 text-md text-muted-foreground hover:text-foreground hover:bg-muted/40 transition flex items-center gap-1.5",
          isStatsRoute && "text-foreground bg-muted/50"
        )}
      >
        <span>{t("nav.statistics")}</span>
        <ChevronDown
          className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-64 rounded-md border border-border bg-background p-1 shadow-lg z-50">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block rounded-sm px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 transition",
                  isActive && "bg-accent text-foreground"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function NavigationMenu() {
  const t = useTranslations();
  return (
    <nav className="hidden items-center gap-1 md:flex">
      <NavLink href="/history" label={t("nav.history")} />
      <NavLink href="/player-list" label={t("nav.players")} />
      <NavLink href="/patch-notes" label={t("nav.patchNotes")} />
      <StatsDropdown />
    </nav>
  );
}
