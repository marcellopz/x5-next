"use client";

import type { PlayerInfo, ChampionStats } from "@/lib/types";
import { usePlayerPage } from "../player-page-context";

interface PlayerSummaryTabProps {
  champs: ChampionStats[];
  playerInfo: PlayerInfo;
}

export function PlayerSummaryTab({
  champs,
  playerInfo,
}: PlayerSummaryTabProps) {
  const { filteredRole } = usePlayerPage();

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">Summary tab content - Coming soon</p>
      {/* TODO: Implement summary tab */}
    </div>
  );
}
