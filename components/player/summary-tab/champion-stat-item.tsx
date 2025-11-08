"use client";

import Image from "next/image";
import type { ChampionStats } from "@/lib/types";
import { CHAMPIONICONURL } from "@/lib/resources";

interface ChampionStatItemProps {
  champion: ChampionStats;
}

function floatToPercentageString(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

function formatKDA(champion: ChampionStats): string {
  if (champion.kda !== undefined) {
    return champion.kda.toFixed(2);
  }

  // Calculate KDA if not provided
  const kills = champion.kills ?? 0;
  const deaths = champion.deaths ?? 0;
  const assists = champion.assists ?? 0;
  const kda = deaths > 0 ? (kills + assists) / deaths : kills + assists;
  return kda.toFixed(2);
}

export function ChampionStatItem({ champion }: ChampionStatItemProps) {
  const championId = Number(champion.championId);
  const championIconUrl = `${CHAMPIONICONURL}${championId}.png`;
  const winRate =
    champion.winRate ??
    (champion.numberOfMatches && champion.numberOfMatches > 0
      ? champion.wins / champion.numberOfMatches
      : 0);
  const numberOfMatches = champion.numberOfMatches ?? champion.picks ?? 0;

  return (
    <div className="border-b border-white/10 p-3 bg-background/30 last:border-b-0">
      <div className="flex items-center gap-3">
        {/* Champion Icon */}
        <div className="shrink-0">
          <Image
            src={championIconUrl}
            alt={champion.championName || `Champion ${championId}`}
            width={48}
            height={48}
            className="rounded"
          />
        </div>

        {/* Champion Name and KDA */}
        <div className="flex-1 min-w-0">
          <p className="text-foreground font-semibold truncate">
            {champion.championName || `Champion ${championId}`}
          </p>
          <p className="text-muted-foreground text-sm">{formatKDA(champion)}</p>
        </div>

        {/* Win Rate and Number of Games */}
        <div className="shrink-0 text-right">
          <p className="text-foreground font-semibold">
            {floatToPercentageString(winRate)}
          </p>
          <p className="text-muted-foreground text-sm">
            {numberOfMatches} {numberOfMatches === 1 ? "game" : "games"}
          </p>
        </div>
      </div>
    </div>
  );
}
