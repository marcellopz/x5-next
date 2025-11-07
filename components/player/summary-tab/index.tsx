"use client";

import { useRouter } from "next/navigation";
import { usePlayerData } from "../player-data-context";

const NUMBER_OF_CHAMPIONS_TO_SHOW = 5;

export function PlayerSummaryTab() {
  const { champs, player, filteredRole } = usePlayerData();
  const router = useRouter();
  const slug = player.name_id || player.account_id.toString();

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Champion Stats (lg: 4 columns) */}
        <div className="lg:col-span-4">
          <div className="flex justify-center">
            <div className="w-full">
              {/* Two boxes above champions */}
              <div className="space-y-4 mb-4">
                <div className="bg-background/30 border border-border rounded-lg h-[175px]">
                  {/* Placeholder for box 1 */}
                </div>
                <div className="bg-background/30 border border-border rounded-lg h-[120px]">
                  {/* Placeholder for box 2 */}
                </div>
              </div>

              {/* Champion Stats Container */}
              <div className="border border-border rounded-lg overflow-hidden">
                {/* Placeholder for champion stats list */}
                <div className="space-y-0">
                  {champs
                    .slice(0, NUMBER_OF_CHAMPIONS_TO_SHOW)
                    .map((champ, index) => (
                      <div
                        key={index}
                        className="border-b border-white/10 p-4 min-h-[80px] bg-background/30 last:border-b-0"
                      >
                        <p className="text-muted-foreground text-sm">
                          Champion Stat #{index + 1}
                        </p>
                        <p className="text-foreground">
                          {champ.championName || `Champion ${champ.championId}`}
                        </p>
                      </div>
                    ))}
                </div>

                {/* See All Champions Button */}
                {champs.length > NUMBER_OF_CHAMPIONS_TO_SHOW && (
                  <div className="flex pb-2">
                    <button
                      onClick={() => router.push(`/player/${slug}/champions`)}
                      className="mx-auto px-4 py-2 text-primary hover:text-primary/80 transition-colors"
                    >
                      See all champions
                    </button>
                  </div>
                )}
              </div>
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
