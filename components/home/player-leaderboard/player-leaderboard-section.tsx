"use client";

import { useState, useMemo } from "react";
import { CompactLeaderboard } from "@/components/ui/compact-leaderboard";
import { CollapsibleSection } from "@/components/ui/collapsible-section";
import type { LeaderboardItem } from "@/components/ui/compact-leaderboard";
import { Leaderboard } from "@/lib/types";
import { useTranslations } from "@/lib/i18n/locale-context";

const defaultLeaderboard: Leaderboard = {
  killParticipation: [],
  winRate: [],
  winRateLast20Games: [],
  numberOfChampionsPlayed: [],
  numberOfGames: [],
};

export function PlayerOverallLeaderboard({
  leaderboard = defaultLeaderboard,
}: {
  leaderboard?: Leaderboard;
}) {
  const t = useTranslations();
  const [expanded, setExpanded] = useState(false);

  // Transform leaderboard data to CompactLeaderboard format
  const winRateData: LeaderboardItem[] = useMemo(
    () =>
      leaderboard?.winRate?.slice(0, 10).map((entry) => ({
        id: entry.summonerId,
        label: entry.legend_name,
        value: `${(entry.value * 100).toFixed(1)}%`,
        subtitle: t("home.inGames").replace("{{count}}", String(entry.extra)),
      })),
    [leaderboard?.winRate, t]
  );

  const recentWinRateData: LeaderboardItem[] = useMemo(
    () =>
      leaderboard?.winRateLast20Games?.slice(0, 10).map((entry) => ({
        id: entry.summonerId,
        label: entry.legend_name,
        value: `${(entry.value * 100).toFixed(1)}%`,
        subtitle: t("home.inGames").replace("{{count}}", String(entry.extra)),
      })),
    [leaderboard?.winRateLast20Games, t]
  );

  const championsPlayedData: LeaderboardItem[] = useMemo(
    () =>
      leaderboard?.numberOfChampionsPlayed?.slice(0, 10).map((entry) => ({
        id: entry.summonerId,
        label: entry.legend_name,
        value: entry.value.toString(),
        subtitle: t("home.championsLabel"),
      })),
    [leaderboard?.numberOfChampionsPlayed, t]
  );

  const gamesPlayedData: LeaderboardItem[] = useMemo(
    () =>
      leaderboard?.numberOfGames?.slice(0, 10).map((entry) => ({
        id: entry.summonerId,
        label: entry.legend_name,
        value: entry.value.toString(),
        subtitle: t("home.gamesLabel"),
      })),
    [leaderboard?.numberOfGames, t]
  );

  return (
    <CollapsibleSection title={t("home.playerLeaderboard")}>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <CompactLeaderboard
          items={winRateData}
          title={t("home.highestWinRate")}
          expanded={expanded}
          onExpandedChange={setExpanded}
        />

        <CompactLeaderboard
          items={recentWinRateData}
          title={t("home.recentWinRate")}
          expanded={expanded}
          onExpandedChange={setExpanded}
        />

        <CompactLeaderboard
          items={championsPlayedData}
          title={t("home.mostChampionsPlayed")}
          expanded={expanded}
          onExpandedChange={setExpanded}
        />

        <CompactLeaderboard
          items={gamesPlayedData}
          title={t("home.mostGamesPlayed")}
          expanded={expanded}
          onExpandedChange={setExpanded}
        />
      </div>
    </CollapsibleSection>
  );
}
