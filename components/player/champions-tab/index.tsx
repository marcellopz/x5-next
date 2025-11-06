"use client";

import type { ChampionStats } from "@/lib/types";

interface PlayerChampionsTabProps {
  champs: ChampionStats[];
}

export function PlayerChampionsTab({ champs }: PlayerChampionsTabProps) {
  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">
        Champions tab content - Coming soon
      </p>
      {/* TODO: Implement champions tab */}
    </div>
  );
}

