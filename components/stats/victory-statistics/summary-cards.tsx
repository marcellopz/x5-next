"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StatEntry } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Trophy, Sword, TowerControl, Skull, Origami } from "lucide-react";
import { formatWinRate } from "./utils";

export interface SummaryCardItem {
  title: string;
  entry: StatEntry;
  description: string;
  icon?: "trophy" | "sword" | "towerControl" | "skull" | "origami";
  accent?: string;
}

const iconMap = {
  trophy: Trophy,
  sword: Sword,
  towerControl: TowerControl,
  skull: Skull,
  origami: Origami,
};

export function SummaryCards({ items }: { items: SummaryCardItem[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {items.map((item) => {
        const Icon = item.icon ? iconMap[item.icon] : Trophy;
        const progress = Math.min(Math.max(item.entry.winRate ?? 0, 0), 100);
        const accentClass =
          item.accent ??
          "from-primary/10 via-primary/5 to-transparent border-border";

        return (
          <Card
            key={item.title}
            className={cn(
              "relative border bg-linear-to-br",
              accentClass,
              "overflow-hidden"
            )}
          >
            <CardHeader className="space-y-1">
              <div className="relative">
                <CardTitle className="text-base">{item.title}</CardTitle>
                <div className="p-2.5 rounded-full bg-background/60 border border-border absolute top-0 right-0">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-3xl font-semibold">
                  {formatWinRate(item.entry.winRate)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {item.entry.wins} wins out of {item.entry.total} games
                </p>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-2 bg-primary transition-all duration-500"
                  style={{ width: `${mounted ? progress : 0}%` }}
                />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
