"use client";

import Image from "next/image";
import type { ChampionStats } from "@/lib/types";
import { CHAMPIONICONURL } from "@/lib/resources";
import { useTranslations } from "@/lib/i18n/locale-context";

interface ChampionStatItemProps {
  champion: ChampionStats;
}

function floatToPercentageString(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

function formatKDA(champion: ChampionStats): string {
  const kdaValue = champion.kda ?? 0;
  if (!isFinite(kdaValue)) return "Perfect";
  return kdaValue.toFixed(2);
}

function getKDAColorClass(champion: ChampionStats): string {
  const kdaValue = champion.kda ?? 0;

  if (!isFinite(kdaValue)) {
    return "text-primary";
  }

  if (kdaValue < 3) {
    return "text-muted-foreground";
  } else if (kdaValue < 4) {
    return "text-green-500";
  } else if (kdaValue < 5) {
    return "text-blue-500";
  } else {
    return "text-primary";
  }
}

export function ChampionStatItem({ champion }: ChampionStatItemProps) {
  const t = useTranslations();
  const championId = Number(champion.championId);
  const championIconUrl = `${CHAMPIONICONURL}${championId}.png`;
  const kdaDisplay = formatKDA(champion) === "Perfect" ? t("common.perfect") : formatKDA(champion);
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
            alt={champion.championName || `${t("common.champion")} ${championId}`}
            width={48}
            height={48}
            sizes="48px"
            className="rounded"
          />
        </div>

        {/* Champion Name and KDA */}
        <div className="flex-1 min-w-0">
          <p className="text-foreground font-semibold truncate">
            {champion.championName || `${t("common.champion")} ${championId}`}
          </p>
          <p className={`text-sm ${getKDAColorClass(champion)}`}>
            {kdaDisplay}
          </p>
        </div>

        {/* Win Rate and Number of Games */}
        <div className="shrink-0 text-right">
          <p className="text-foreground font-semibold">
            {floatToPercentageString(winRate)}
          </p>
          <p className="text-muted-foreground text-sm">
            {numberOfMatches} {numberOfMatches === 1 ? t("common.game") : t("common.games")}
          </p>
        </div>
      </div>
    </div>
  );
}
