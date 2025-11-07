"use client";

import { usePlayerData } from "../player-data-context";

export function PlayerRecordsTab() {
  const { playerInfo } = usePlayerData();
  const records = playerInfo.records;

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">Records tab content - Coming soon</p>
      {/* TODO: Implement records tab */}
    </div>
  );
}
