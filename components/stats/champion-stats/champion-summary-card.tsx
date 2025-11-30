"use client";

import { cn } from "@/lib/utils";

interface ChampionSummaryCardProps {
  className?: string;
  picked: number;
  neverPicked: number;
}

export function ChampionStatsSummaryCard({
  className,
  picked,
  neverPicked,
}: ChampionSummaryCardProps) {
  return (
    <div
      className={cn(
        "max-w-md rounded-lg border border-border/60 bg-card/60 px-4 py-3",
        className
      )}
    >
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">
          Champion Overview
        </p>
        <div className="space-y-1 text-sm">
          <p>
            <span className="text-muted-foreground">
              Champions picked at least once:
            </span>{" "}
            <span className="font-semibold text-foreground">{picked}</span>
          </p>
          <p>
            <span className="text-muted-foreground">
              Champions never picked:
            </span>{" "}
            <span className="font-semibold text-foreground">{neverPicked}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
