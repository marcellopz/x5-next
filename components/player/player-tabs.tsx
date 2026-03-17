"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTranslations } from "@/lib/i18n/locale-context";

const tabs = [
  { labelKey: "playerTabs.summary", path: "" },
  { labelKey: "playerTabs.champions", path: "champions" },
  { labelKey: "playerTabs.stats", path: "stats" },
  { labelKey: "playerTabs.records", path: "records" },
];

interface PlayerTabsProps {
  slug: string;
}

export function PlayerTabs({ slug }: PlayerTabsProps) {
  const pathname = usePathname();
  const t = useTranslations();

  return (
    <div className="border-t border-border">
      <div className="flex">
        {tabs.map((tab) => {
          const href =
            tab.path === "" ? `/player/${slug}` : `/player/${slug}/${tab.path}`;
          const isActive =
            tab.path === ""
              ? pathname === `/player/${slug}`
              : pathname === href;

          return (
            <Link
              key={tab.path}
              href={href}
              className={cn(
                "px-6 py-4 font-medium transition-all relative cursor-pointer",
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t(tab.labelKey)}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
