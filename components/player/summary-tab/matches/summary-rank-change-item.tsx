"use client";

import type { RankChangeEntry } from "@/lib/types";

interface SummaryRankChangeItemProps {
  change: RankChangeEntry;
}

function formatRankChangeDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year:
      date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
  });
}

function getDaysSince(timestamp: number): number {
  const now = new Date();
  const date = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  return Math.floor(diffInSeconds / 86400);
}

export function SummaryRankChangeItem({ change }: SummaryRankChangeItemProps) {
  const dateStr = formatRankChangeDate(change.timestamp);
  const daysSince = getDaysSince(change.timestamp);

  return (
    <div className="flex items-center justify-between p-3 bg-background border border-border rounded-lg">
      <div className="flex items-center gap-2 text-xs text-muted-foreground w-full">
        <span className="font-semibold text-foreground">Rank Change:</span>
        <span className="capitalize font-semibold text-primary">
          {change.role} {change.oldRank} → {change.newRank}
        </span>
        <span className="ml-auto">
          {dateStr} ({daysSince}d ago)
        </span>
      </div>
    </div>
  );
}
