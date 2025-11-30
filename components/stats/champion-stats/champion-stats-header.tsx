"use client";

import { ChampionStatsSummaryCard } from "./champion-summary-card";
import { statRoutes } from "@/app/stats/stat-routes";

interface ChampionStatsHeaderProps {
  picked: number;
  neverPicked: number;
}

export function ChampionStatsHeader({
  picked,
  neverPicked,
}: ChampionStatsHeaderProps) {
  const info = statRoutes["champion-stats"];

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between relative">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">{info.title}</h1>
        <p className="text-sm text-muted-foreground">{info.description}</p>
      </div>
      <ChampionStatsSummaryCard
        className="w-full lg:w-auto lg:absolute top-0 right-0"
        picked={picked}
        neverPicked={neverPicked}
      />
    </div>
  );
}
