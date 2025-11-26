"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PlayerRankChangeStats, PlayerList } from "@/lib/types";
import { RankChangesTable } from "./rank-changes-table";
import { WinLossByRoleTable } from "./win-loss-by-role-table";

type ViewMode = "changes" | "winloss";

interface RankAnalysisProps {
  data: PlayerRankChangeStats;
  playerList: PlayerList | null;
}

export function RankAnalysis({ data, playerList }: RankAnalysisProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("winloss");

  const getPlayerName = (nameId: string): string => {
    if (!playerList || !playerList[nameId]) {
      return nameId;
    }
    return playerList[nameId].name;
  };

  return (
    <div className="space-y-6">
      {/* View Mode Toggle */}
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={viewMode === "winloss" ? "default" : "outline"}
          onClick={() => setViewMode("winloss")}
          className={cn(
            "transition-colors rounded-xl!",
            viewMode === "winloss" && "ring-2 ring-primary/50"
          )}
        >
          Win/Loss Since Last Change
        </Button>
        <Button
          size="sm"
          variant={viewMode === "changes" ? "default" : "outline"}
          onClick={() => setViewMode("changes")}
          className={cn(
            "transition-colors rounded-xl!",
            viewMode === "changes" && "ring-2 ring-primary/50"
          )}
        >
          Rank Changes
        </Button>
      </div>

      {/* Content */}
      {viewMode === "changes" && (
        <RankChangesTable
          data={data.number_of_changes}
          getPlayerName={getPlayerName}
        />
      )}

      {viewMode === "winloss" && (
        <WinLossByRoleTable
          data={data.win_loses_since_last_change}
          getPlayerName={getPlayerName}
        />
      )}
    </div>
  );
}
