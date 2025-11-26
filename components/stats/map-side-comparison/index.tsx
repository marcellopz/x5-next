"use client";

import { SideStatBox } from "./side-stat-box";
import { StatsTable, type ExtendedTeamSideStats } from "./stats-table";
import type { TeamSideStats } from "@/lib/types";

interface MapSideComparisonProps {
  redSide: TeamSideStats;
  blueSide: TeamSideStats;
}

const firstsStats = [
  { key: "firstBlood" as keyof ExtendedTeamSideStats, label: "First Bloods" },
  {
    key: "firstBaron" as keyof ExtendedTeamSideStats,
    label: "Killed First Baron",
  },
  {
    key: "firstDragon" as keyof ExtendedTeamSideStats,
    label: "Killed First Dragon",
  },
  {
    key: "firstInhibitor" as keyof ExtendedTeamSideStats,
    label: "Destroyed First Inhibitor",
  },
  {
    key: "firstTower" as keyof ExtendedTeamSideStats,
    label: "Destroyed First Tower",
  },
];

const otherStats = [
  { key: "baronKills" as keyof ExtendedTeamSideStats, label: "Barons Killed" },
  {
    key: "dragonKills" as keyof ExtendedTeamSideStats,
    label: "Dragons Killed",
  },
  {
    key: "riftHeraldKills" as keyof ExtendedTeamSideStats,
    label: "Rift Heralds Killed",
  },
  {
    key: "towerKills" as keyof ExtendedTeamSideStats,
    label: "Turrets Destroyed",
  },
  { key: "voidGrubs" as keyof ExtendedTeamSideStats, label: "Void Grubs" },
  { key: "atakhans" as keyof ExtendedTeamSideStats, label: "Atakhans" },
  {
    key: "elderDragons" as keyof ExtendedTeamSideStats,
    label: "Elder Dragons",
  },
];

export function MapSideComparison({
  redSide,
  blueSide,
}: MapSideComparisonProps) {
  return (
    <div className="space-y-6">
      {/* Pie Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <SideStatBox
          title="Wins"
          redSideStat={redSide.wins}
          blueSideStat={blueSide.wins}
        />
        <SideStatBox
          title="Kills"
          redSideStat={redSide.kills}
          blueSideStat={blueSide.kills}
        />
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatsTable
          title="First Objectives"
          stats={firstsStats}
          redSide={redSide}
          blueSide={blueSide}
        />
        <StatsTable
          title="Objectives"
          stats={otherStats}
          redSide={redSide}
          blueSide={blueSide}
        />
      </div>
    </div>
  );
}
