"use client";

import { SummaryCards, type SummaryCardItem } from "@/components/stats/victory-statistics/summary-cards";
import { DragonsOverview } from "@/components/stats/victory-statistics/dragons-overview";
import type { VictoryStatistics } from "@/lib/types";

interface VictoryPreviewProps {
  cards: SummaryCardItem[];
  dragonData: VictoryStatistics["dragons"] | null;
}

export function VictoryPreview({ cards, dragonData }: VictoryPreviewProps) {
  return (
    <div className="space-y-4">
      <SummaryCards items={cards} />
      {dragonData ? (
        <DragonsOverview data={dragonData} />
      ) : (
        <div className="rounded-lg border border-dashed border-border/60 bg-card/40 p-4 text-sm text-muted-foreground">
          Dragon overview data coming soon.
        </div>
      )}
    </div>
  );
}

