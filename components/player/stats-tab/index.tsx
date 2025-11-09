"use client";

import { useMemo } from "react";
import { usePlayerData } from "../player-data-context";
import { StatBox } from "./stat-box";
import { WinRateChart } from "./win-rate-chart";
import { WinRateTable } from "./win-rate-table";

function floatToPercentageString(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

export function PlayerStatsTab() {
  const { playerInfo, playerPairs, playerSummary } = usePlayerData();

  const sameTeam = useMemo(() => {
    if (!playerPairs) return [];
    return Object.entries(playerPairs)
      .map(([k, v]) => {
        const pair = v as { same_team?: { games: number; wins: number } };
        const summary = playerSummary?.[k] as
          | { summonerName?: string }
          | undefined;
        return {
          games: pair.same_team?.games ?? 0,
          wins: pair.same_team?.wins ?? 0,
          summonerName: summary?.summonerName ?? k,
          summonerId: k,
        };
      })
      .filter((p) => p.games > 0)
      .sort((a, b) => b.games - a.games);
  }, [playerPairs, playerSummary]);

  const oppositeTeam = useMemo(() => {
    if (!playerPairs) return [];
    return Object.entries(playerPairs)
      .map(([k, v]) => {
        const pair = v as { opposite_team?: { games: number; wins: number } };
        const summary = playerSummary?.[k] as
          | { summonerName?: string }
          | undefined;
        return {
          games: pair.opposite_team?.games ?? 0,
          wins: pair.opposite_team?.wins ?? 0,
          summonerName: summary?.summonerName ?? k,
          summonerId: k,
        };
      })
      .filter((p) => p.games > 0)
      .sort((a, b) => b.games - a.games);
  }, [playerPairs, playerSummary]);

  const blueSideWinRate =
    playerInfo?.statsPerSide?.blueSide?.games &&
    playerInfo.statsPerSide.blueSide.games > 0
      ? playerInfo.statsPerSide.blueSide.wins /
        playerInfo.statsPerSide.blueSide.games
      : 0;

  const redSideWinRate =
    playerInfo?.statsPerSide?.redSide?.games &&
    playerInfo.statsPerSide.redSide.games > 0
      ? playerInfo.statsPerSide.redSide.wins /
        playerInfo.statsPerSide.redSide.games
      : 0;

  return (
    <div className="p-4 space-y-5">
      <div className="flex flex-col lg:flex-row gap-5">
        {/* Left Column: Chart and Stat Boxes */}
        <div className="flex-1 flex flex-col gap-5">
          <WinRateChart winsArray={playerInfo?.winsArray} />
          <div className="flex flex-wrap gap-5">
            <StatBox
              title="Win Rate (Blue Side)"
              value={floatToPercentageString(blueSideWinRate)}
              numberOfGames={playerInfo?.statsPerSide?.blueSide.games}
            />
            <StatBox
              title="Win Rate (Red Side)"
              value={floatToPercentageString(redSideWinRate)}
              numberOfGames={playerInfo?.statsPerSide?.redSide.games}
            />
          </div>
        </div>

        {/* Right Column: Win Rate Tables */}
        <div className="flex-1 flex flex-col flex-wrap xl:flex-row gap-5">
          <WinRateTable players={sameTeam} title="Win Rate With" />
          <WinRateTable players={oppositeTeam} title="Win Rate Against" />
        </div>
      </div>
    </div>
  );
}
