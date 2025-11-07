"use client";

import { usePlayerData } from "../player-data-context";

export function PlayerStatsTab() {
  const { playerInfo, playerPairs, playerSummary } = usePlayerData();

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">Stats tab content - Coming soon</p>
      {/* TODO: Implement stats tab */}
    </div>
  );
}
