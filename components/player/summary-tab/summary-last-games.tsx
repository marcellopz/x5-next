"use client";

import Image from "next/image";
import { useMemo } from "react";
import type { MatchWithId, ReducedParticipant } from "@/lib/types";
import { CHAMPIONICONURL } from "@/lib/resources";
import { WinRateCircularProgress } from "@/components/ui/win-rate-circular-progress";

interface SummaryLastGamesProps {
  matches: MatchWithId[];
  playerSummonerId: string | number;
}

function floatToPercentageString(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

export function SummaryLastGames({
  matches,
  playerSummonerId,
}: SummaryLastGamesProps) {
  // Filter matches to only include this player's matches
  const playerMatches = useMemo(() => {
    return matches.filter((match) =>
      match.participants.some((p) => p.summonerId === playerSummonerId)
    );
  }, [matches, playerSummonerId]);

  // Get last 20 games (or all if less than 20)
  const lastGames = playerMatches.slice(0, 20);

  // Get player participant data for each match
  const playerGameData = useMemo(() => {
    return lastGames
      .map((match) => {
        const participant = match.participants.find(
          (p) => p.summonerId === playerSummonerId
        );
        return participant
          ? {
              championId: participant.championId,
              championName: participant.championName,
              stats: participant.stats,
            }
          : null;
      })
      .filter((game) => game !== null) as Array<{
      championId: number;
      championName: string;
      stats: ReducedParticipant["stats"];
    }>;
  }, [lastGames, playerSummonerId]);

  // Calculate stats
  const wins = useMemo(
    () =>
      playerGameData.reduce((acc, game) => acc + (game.stats.win ? 1 : 0), 0),
    [playerGameData]
  );

  const winRate = playerGameData.length > 0 ? wins / playerGameData.length : 0;
  const losses = playerGameData.length - wins;

  const kills = useMemo(
    () => playerGameData.reduce((acc, game) => acc + game.stats.kills, 0),
    [playerGameData]
  );

  const deaths = useMemo(
    () => playerGameData.reduce((acc, game) => acc + game.stats.deaths, 0),
    [playerGameData]
  );

  const assists = useMemo(
    () => playerGameData.reduce((acc, game) => acc + game.stats.assists, 0),
    [playerGameData]
  );

  // Group games by champion
  const gameGroupsPerChamp = useMemo(() => {
    const groups: {
      [championName: string]: Array<{
        championId: number;
        championName: string;
        stats: ReducedParticipant["stats"];
      }>;
    } = {};

    playerGameData.forEach((game) => {
      const championName = game.championName;
      if (groups[championName]) {
        groups[championName].push(game);
      } else {
        groups[championName] = [game];
      }
    });

    return Object.values(groups).sort((a, b) => b.length - a.length);
  }, [playerGameData]);

  const getAvg = (value: number) => (value / playerGameData.length).toFixed(1);
  const kdaRatio =
    deaths > 0 ? ((kills + assists) / deaths).toFixed(2) : "Perfect";

  if (playerGameData.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <h3 className="text-sm font-semibold text-foreground mb-4">
        Stats of Last {playerGameData.length} Games
      </h3>

      {/* Stats Section with Champions Inline */}
      <div className="flex items-center justify-center gap-4 md:ml-2">
        {/* Win Rate Circular Progress */}
        <div className="shrink-0">
          <WinRateCircularProgress
            value={winRate}
            size={100}
            labelFontSize={18}
            wins={wins}
            losses={losses}
            showWinsLossesInside={false}
            showLabel={false}
          />
        </div>

        {/* Stats Details */}
        <div className="flex flex-col gap-1 shrink-0">
          <p className="text-foreground text-sm">
            {playerGameData.length}G {wins}W {losses}L
          </p>
          <p className="text-muted-foreground text-sm">
            {getAvg(kills)} / {getAvg(deaths)} / {getAvg(assists)}
          </p>
          <p className="text-foreground text-sm font-semibold">
            {kdaRatio}:1 KDA
          </p>
        </div>

        {/* Champions Section - Inline Grid (3 columns, 2 rows) */}
        <div className="flex-1 hidden md:grid grid-cols-3 grid-rows-2 gap-2 min-w-[240px] max-w-[360px] ml-6">
          {gameGroupsPerChamp.slice(0, 6).map((champGroup) => {
            const champId = champGroup[0].championId;
            const n = champGroup.length;
            const champWins = champGroup.reduce(
              (acc, game) => acc + (game.stats.win ? 1 : 0),
              0
            );
            const champWinRate = champWins / n;

            return (
              <div key={champId} className="flex items-center gap-2">
                <div className="relative shrink-0">
                  <Image
                    src={`${CHAMPIONICONURL}${champId}.png`}
                    alt={champGroup[0].championName}
                    width={36}
                    height={36}
                    className="rounded"
                  />
                </div>
                <div className="flex flex-col">
                  <p
                    className={`text-xs font-semibold ${
                      champWinRate > 0.6 ? "text-green-500" : "text-foreground"
                    }`}
                  >
                    {floatToPercentageString(champWinRate)}
                  </p>
                  <p className="text-muted-foreground text-[10px]">
                    {champWins}W {n - champWins}L
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
