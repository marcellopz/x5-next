"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  { label: "Summary", path: "" },
  { label: "Champions", path: "champions" },
  { label: "Stats", path: "stats" },
  { label: "Records", path: "records" },
];

interface PlayerTabsProps {
  slug: string;
}

export function PlayerTabs({ slug }: PlayerTabsProps) {
  const pathname = usePathname();

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
              {tab.label}
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
