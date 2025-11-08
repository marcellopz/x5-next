"use client";

import { useRouter } from "next/navigation";
import type { ChampionStats, Player } from "@/lib/types";
import { ChampionStatItem } from "./champion-stat-item";

interface ChampionStatsListProps {
  champs: ChampionStats[];
  player: Player;
  numberOfChampionsToShow?: number;
}

export function ChampionStatsList({
  champs,
  player,
  numberOfChampionsToShow = 5,
}: ChampionStatsListProps) {
  const router = useRouter();
  const slug = player.name_id || player.account_id.toString();

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <h3 className="text-sm font-semibold text-foreground p-4 pb-3 border-white/10">
        Top Champions
      </h3>
      <div className="space-y-0">
        {champs.slice(0, numberOfChampionsToShow).map((champ, index) => (
          <ChampionStatItem key={champ.championId || index} champion={champ} />
        ))}
      </div>

      {/* See All Champions Button */}
      {champs.length > numberOfChampionsToShow && (
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
  );
}
