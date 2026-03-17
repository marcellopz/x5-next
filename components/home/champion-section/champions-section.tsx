"use client";

import { CollapsibleSection } from "@/components/ui/collapsible-section";
import { ChampionCard } from "./champion-card";
import { ChampionTable } from "./champion-table";
import {
  ChampionLeaderboard,
  ChampionLeaderboardEntry,
  SummarizedOverallData,
} from "@/lib/types";
import { useMemo } from "react";
import { useTranslations } from "@/lib/i18n/locale-context";

const defaultChampionLeaderboardEntry: ChampionLeaderboardEntry = {
  championId: "",
  championName: "",
  numberOfGames: 0,
  value: 0,
  winRate: 0,
};

const defaultChampionLeaderboard: ChampionLeaderboard = {
  mostBanned: { ...defaultChampionLeaderboardEntry },
  mostLosses: { ...defaultChampionLeaderboardEntry },
  mostPlayed: { ...defaultChampionLeaderboardEntry },
  mostWins: { ...defaultChampionLeaderboardEntry },
};

const defaultChampionTableData: SummarizedOverallData["champions"] = {};

export function ChampionsSection({
  championLeaderboard = defaultChampionLeaderboard,
  championTableData = defaultChampionTableData,
  totalGames = 0,
}: {
  championLeaderboard?: ChampionLeaderboard;
  championTableData?: SummarizedOverallData["champions"];
  totalGames?: number;
}) {
  const t = useTranslations();
  const championCards = useMemo(
    () => [
      {
        championId: parseInt(championLeaderboard.mostPlayed.championId) || 0,
        championName: championLeaderboard.mostPlayed.championName || "-",
        stat: t("home.mostPlayedLast20"),
        value: championLeaderboard.mostPlayed.value.toString(),
        gamesPlayed: championLeaderboard.mostPlayed.numberOfGames,
        winRate: `${(championLeaderboard.mostPlayed.winRate * 100).toFixed(
          0
        )}%`,
      },
      {
        championId: parseInt(championLeaderboard.mostWins.championId) || 0,
        championName: championLeaderboard.mostWins.championName || "-",
        stat: t("home.mostWinsLast20"),
        value: championLeaderboard.mostWins.value.toString(),
        gamesPlayed: championLeaderboard.mostWins.numberOfGames,
        winRate: `${(championLeaderboard.mostWins.winRate * 100).toFixed(0)}%`,
      },
      {
        championId: parseInt(championLeaderboard.mostBanned.championId) || 0,
        championName: championLeaderboard.mostBanned.championName || "-",
        stat: t("home.mostBannedLast20"),
        value: championLeaderboard.mostBanned.value.toString(),
        gamesPlayed: championLeaderboard.mostBanned.numberOfGames,
        winRate: `${(championLeaderboard.mostBanned.winRate * 100).toFixed(
          0
        )}%`,
      },
      {
        championId: parseInt(championLeaderboard.mostLosses.championId) || 0,
        championName: championLeaderboard.mostLosses.championName || "-",
        stat: t("home.mostLossesLast20"),
        value: championLeaderboard.mostLosses.value.toString(),
        gamesPlayed: championLeaderboard.mostLosses.numberOfGames,
        winRate: `${(championLeaderboard.mostLosses.winRate * 100).toFixed(
          0
        )}%`,
      },
    ],
    [championLeaderboard, t]
  );

  return (
    <CollapsibleSection title={t("home.championStatistics")}>
      <div className="grid gap-4 lg:grid-cols-4 lg:items-stretch min-w-0">
        {/* Left side - Standout picks (2x2 grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 lg:content-start">
          {championCards.map((champion, index) => (
            <ChampionCard key={index} {...champion} />
          ))}
        </div>

        {/* Right side - Champions table */}
        <div className="lg:col-span-3 flex min-w-0">
          <ChampionTable
            data={Object.values(championTableData)}
            totalGames={totalGames}
          />
        </div>
      </div>
    </CollapsibleSection>
  );
}
