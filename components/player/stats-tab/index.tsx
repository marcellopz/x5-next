"use client";

import type { PlayerInfo, PlayerPairs, PlayerSummary } from "@/lib/types";

interface PlayerStatsTabProps {
  playerInfo: PlayerInfo;
  playerPairs: PlayerPairs | null;
  playerSummary: PlayerSummary | null;
}

export function PlayerStatsTab({
  playerInfo,
  playerPairs,
  playerSummary,
}: PlayerStatsTabProps) {
  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">Stats tab content - Coming soon</p>
      {/* TODO: Implement stats tab */}
    </div>
  );
}

