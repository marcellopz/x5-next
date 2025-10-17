"use client";

import * as React from "react";
import type { ReducedTeamData } from "@/lib/types";

interface TeamHeaderProps {
  team: ReducedTeamData;
  isWinning: boolean;
  goldEarned: number;
}

export function TeamHeader({ team, isWinning, goldEarned }: TeamHeaderProps) {
  return (
    <div
      className={`flex items-center justify-between mb-2 p-1 md:p-2 rounded-md ${
        isWinning
          ? "bg-blue-500/15 border border-blue-500/30"
          : "bg-red-500/15 border border-red-500/30"
      }`}
    >
      <span
        className={`text-xs font-medium ${
          isWinning ? "text-blue-300" : "text-red-300"
        }`}
        title={isWinning ? "Victory" : "Defeat"}
      >
        {isWinning ? "Victory" : "Defeat"}
      </span>
      <div className="hidden md:flex items-center gap-4">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-orange-500" title="Dragons" />
          <span className="text-xs text-muted-foreground">
            {team.hordeKills || 0}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-orange-500" title="Dragons" />
          <span className="text-xs text-muted-foreground">
            {team.dragonKills || 0}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-purple-600" title="Baron" />
          <span className="text-xs text-muted-foreground">
            {team.baronKills || 0}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-yellow-500" title="Towers" />
          <span className="text-xs text-muted-foreground">
            {team.towerKills || 0}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <div
            className="w-2 h-2 rounded-full bg-blue-500"
            title="Inhibitors"
          />
          <span className="text-xs text-muted-foreground">
            {team.inhibitorKills || 0}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <div
            className="w-2 h-2 rounded-full bg-yellow-400"
            title="Gold Earned"
          />
          <span className="text-xs text-muted-foreground">
            {(goldEarned / 1000).toFixed(1) || 0}k
          </span>
        </div>
      </div>
    </div>
  );
}
