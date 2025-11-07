"use client";

import { usePlayerData } from "../player-data-context";

export function PlayerChampionsTab() {
  const { champs } = usePlayerData();

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">
        Champions tab content - Coming soon
      </p>
      {/* TODO: Implement champions tab */}
    </div>
  );
}
