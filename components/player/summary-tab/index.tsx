"use client";

import { usePlayerData } from "../player-data-context";
import { RoleDistributionChart } from "./role-distribution-chart";
import { WinRateLast20GamesChart } from "./win-rate-last-20-games-chart";
import { ChampionStatsList } from "./champion-stats-list";

const NUMBER_OF_CHAMPIONS_TO_SHOW = 6;

export function PlayerSummaryTab() {
  const { champs, player, filteredRole, playerInfo } = usePlayerData();

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Champion Stats (lg: 4 columns) */}
        <div className="lg:col-span-4">
          <div className="flex justify-center">
            <div className="w-full">
              {/* Two boxes above champions */}
              <div className="space-y-4 mb-4">
                <RoleDistributionChart playerInfo={playerInfo} />
                <WinRateLast20GamesChart playerInfo={playerInfo} />
              </div>

              {/* Champion Stats Container */}
              <ChampionStatsList
                champs={champs}
                player={player}
                numberOfChampionsToShow={NUMBER_OF_CHAMPIONS_TO_SHOW}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Matches Summary (lg: 8 columns) */}
        <div className="lg:col-span-8">
          <div className="space-y-5">
            {/* Last Games Section */}
            <div className="bg-background/30 border border-border rounded-lg p-5 min-h-[170px]">
              <h3 className="text-xl font-bold text-foreground mb-4">
                Last Games
              </h3>
              <p className="text-muted-foreground">
                Placeholder for SummaryLastGames component
              </p>
            </div>

            {/* Matches Summary Section */}
            <div className="bg-background/30 border border-border rounded-lg p-5 min-h-[600px]">
              <h3 className="text-xl font-bold text-foreground mb-4">
                Matches Summary
              </h3>
              <p className="text-muted-foreground">
                Placeholder for SummaryMatches component
              </p>
              {filteredRole && (
                <p className="text-sm text-muted-foreground mt-2">
                  Filtered by: {filteredRole}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
