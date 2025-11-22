"use client";

import { useState, useMemo } from "react";
import { CompactLeaderboard } from "@/components/ui/compact-leaderboard";
import { CollapsibleSection } from "@/components/ui/collapsible-section";
import type { LeaderboardItem } from "@/components/ui/compact-leaderboard";
import { Leaderboard } from "@/lib/types";

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
  const [expanded, setExpanded] = useState(false);

  // Transform leaderboard data to CompactLeaderboard format
  const winRateData: LeaderboardItem[] = useMemo(
    () =>
      leaderboard?.winRate?.slice(0, 10).map((entry) => ({
        id: entry.summonerId,
        label: entry.legend_name,
        value: `${(entry.value * 100).toFixed(1)}%`,
        subtitle: `In ${entry.extra} games`,
      })),
    [leaderboard?.winRate]
  );

  const recentWinRateData: LeaderboardItem[] = useMemo(
    () =>
      leaderboard?.winRateLast20Games?.slice(0, 10).map((entry) => ({
        id: entry.summonerId,
        label: entry.legend_name,
        value: `${(entry.value * 100).toFixed(1)}%`,
        subtitle: `In ${entry.extra} games`,
      })),
    [leaderboard?.winRateLast20Games]
  );

  const championsPlayedData: LeaderboardItem[] = useMemo(
    () =>
      leaderboard?.numberOfChampionsPlayed?.slice(0, 10).map((entry) => ({
        id: entry.summonerId,
        label: entry.legend_name,
        value: entry.value.toString(),
        subtitle: `Champions`,
      })),
    [leaderboard?.numberOfChampionsPlayed]
  );

  const gamesPlayedData: LeaderboardItem[] = useMemo(
    () =>
      leaderboard?.numberOfGames?.slice(0, 10).map((entry) => ({
        id: entry.summonerId,
        label: entry.legend_name,
        value: entry.value.toString(),
        subtitle: `Games`,
      })),
    [leaderboard?.numberOfGames]
  );

  return (
    <CollapsibleSection title="Player Leaderboard">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <CompactLeaderboard
          items={winRateData}
          title="Highest Win Rate"
          expanded={expanded}
          onExpandedChange={setExpanded}
        />

        <CompactLeaderboard
          items={recentWinRateData}
          title="Recent Win Rate"
          expanded={expanded}
          onExpandedChange={setExpanded}
        />

        <CompactLeaderboard
          items={championsPlayedData}
          title="Most Champions Played"
          expanded={expanded}
          onExpandedChange={setExpanded}
        />

        <CompactLeaderboard
          items={gamesPlayedData}
          title="Most Games Played"
          expanded={expanded}
          onExpandedChange={setExpanded}
        />
      </div>
    </CollapsibleSection>
  );
}
