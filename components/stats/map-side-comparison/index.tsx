"use client";

import { useTranslations } from "@/lib/i18n/locale-context";
import { SideStatBox } from "./side-stat-box";
import { StatsTable, type ExtendedTeamSideStats } from "./stats-table";
import type { TeamSideStats } from "@/lib/types";

interface MapSideComparisonProps {
  redSide: TeamSideStats;
  blueSide: TeamSideStats;
}

export function MapSideComparison({
  redSide,
  blueSide,
}: MapSideComparisonProps) {
  const t = useTranslations();
  const firstsStats = [
    { key: "firstBlood" as keyof ExtendedTeamSideStats, label: t("stats.mapSide.firstBloods") },
    { key: "firstBaron" as keyof ExtendedTeamSideStats, label: t("stats.mapSide.killedFirstBaron") },
    { key: "firstDragon" as keyof ExtendedTeamSideStats, label: t("stats.mapSide.killedFirstDragon") },
    { key: "firstInhibitor" as keyof ExtendedTeamSideStats, label: t("stats.mapSide.destroyedFirstInhibitor") },
    { key: "firstTower" as keyof ExtendedTeamSideStats, label: t("stats.mapSide.destroyedFirstTower") },
  ];
  const otherStats = [
    { key: "baronKills" as keyof ExtendedTeamSideStats, label: t("stats.mapSide.baronsKilled") },
    { key: "dragonKills" as keyof ExtendedTeamSideStats, label: t("stats.mapSide.dragonsKilled") },
    { key: "riftHeraldKills" as keyof ExtendedTeamSideStats, label: t("stats.mapSide.riftHeraldsKilled") },
    { key: "towerKills" as keyof ExtendedTeamSideStats, label: t("stats.mapSide.turretsDestroyed") },
    { key: "voidGrubs" as keyof ExtendedTeamSideStats, label: t("stats.mapSide.voidGrubs") },
    { key: "atakhans" as keyof ExtendedTeamSideStats, label: t("stats.mapSide.atakhans") },
    { key: "elderDragons" as keyof ExtendedTeamSideStats, label: t("stats.mapSide.elderDragons") },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <SideStatBox
          title={t("common.wins")}
          redSideStat={redSide.wins}
          blueSideStat={blueSide.wins}
        />
        <SideStatBox
          title={t("stats.mapSide.kills")}
          redSideStat={redSide.kills}
          blueSideStat={blueSide.kills}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatsTable
          title={t("stats.mapSide.firstObjectives")}
          stats={firstsStats}
          redSide={redSide}
          blueSide={blueSide}
        />
        <StatsTable
          title={t("stats.mapSide.objectives")}
          stats={otherStats}
          redSide={redSide}
          blueSide={blueSide}
        />
      </div>
    </div>
  );
}
