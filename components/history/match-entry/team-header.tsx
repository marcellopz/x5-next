"use client";

import * as React from "react";
import type { ReducedTeamData } from "@/lib/types";

interface TeamHeaderProps {
  team: ReducedTeamData;
  isWinning: boolean;
  goldEarned: number;
  totalKills: number;
  totalDeaths: number;
  totalAssists: number;
}

export function TeamHeader({
  team,
  isWinning,
  goldEarned,
  totalKills,
  totalDeaths,
  totalAssists,
}: TeamHeaderProps) {
  return (
    <div
      className={`flex items-center justify-between mb-2 p-1 md:p-2 rounded-md lg:mb-3 text-xs xl:text-sm ${
        isWinning
          ? "bg-blue-500/15 border border-blue-500/30 text-blue-300"
          : "bg-red-500/15 border border-red-500/30 text-red-300"
      }`}
    >
      <span className="font-medium" title={isWinning ? "Victory" : "Defeat"}>
        Team {team.teamId / 100}: {isWinning ? "Victory" : "Defeat"}
      </span>
      <div className="hidden lg:flex items-center gap-4">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-orange-500" title="Dragons" />
          <span>{team.hordeKills || 0}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-orange-500" title="Dragons" />
          <span>{team.dragonKills || 0}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-purple-600" title="Baron" />
          <span>{team.baronKills || 0}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-yellow-500" title="Towers" />
          <span>{team.towerKills || 0}</span>
        </div>
        <div className="flex items-center gap-1">
          <div
            className="w-2 h-2 rounded-full bg-blue-500"
            title="Inhibitors"
          />
          <span>{team.inhibitorKills || 0}</span>
        </div>
        <div className="flex items-center gap-1">
          <div
            className="w-2 h-2 rounded-full bg-yellow-400"
            title="Gold Earned"
          />
          <span>{(goldEarned / 1000).toFixed(1) || 0}k</span>
        </div>
      </div>
      <div className="hidden xs:flex font-medium items-center gap-1">
        {totalKills} / {totalDeaths} / {totalAssists}
      </div>
    </div>
  );
}
