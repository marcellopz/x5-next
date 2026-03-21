"use client";

import type { VictoryStatistics } from "@/lib/types";
import { useTranslations } from "@/lib/i18n/locale-context";
import { SummaryCards } from "./summary-cards";
import { ObjectiveTable } from "./objective-table";
import { VoidGrubsSection } from "./void-grubs-section";
import { DragonsOverview } from "./dragons-overview";
import { DragonTypesSection } from "./dragon-types-section";
import type { ObjectiveStat } from "./utils";

interface VictoryStatisticsViewProps {
  data: VictoryStatistics;
}

export function VictoryStatisticsView({ data }: VictoryStatisticsViewProps) {
  const t = useTranslations();

  const summaryItems = [
    {
      title: t("stats.victory.firstBlood"),
      description: t("stats.victory.firstBloodDesc"),
      entry: data.firstBlood,
      icon: "sword" as const,
    },
    {
      title: t("stats.victory.firstTower"),
      description: t("stats.victory.firstTowerDesc"),
      entry: data.firstTower,
      icon: "towerControl" as const,
    },
    {
      title: t("stats.victory.firstDragon"),
      description: t("stats.victory.firstDragonDesc"),
      entry: data.firstDragon,
      icon: "origami" as const,
    },
    {
      title: t("stats.victory.firstBaron"),
      description: t("stats.victory.firstBaronDesc"),
      entry: data.firstBaron,
      icon: "crown" as const,
    },
  ];

  const firstObjectives: ObjectiveStat[] = [
    {
      label: t("stats.victory.firstBlood"),
      entry: data.firstBlood,
      description: t("stats.victory.earlySkirmishMomentum"),
    },
    {
      label: t("stats.victory.firstTower"),
      entry: data.firstTower,
      description: t("stats.victory.macroMapPressure"),
    },
    {
      label: t("stats.victory.firstInhibitor"),
      entry: data.firstInhibitor,
      description: t("stats.victory.firstInhibitorDesc"),
    },
    {
      label: t("stats.victory.firstBaron"),
      entry: data.firstBaron,
      description: t("stats.victory.firstBaronDesc"),
    },
    {
      label: t("stats.victory.firstDragon"),
      entry: data.firstDragon,
      description: t("stats.victory.neutralObjectiveTempo"),
    },
  ];

  const majorObjectives: ObjectiveStat[] = [
    {
      label: t("stats.victory.riftHerald"),
      entry: data.riftHerald,
      description: t("stats.victory.midGamePacing"),
    },
    {
      label: t("stats.victory.baronNashor"),
      entry: data.baron,
      description: t("stats.victory.siegePotential"),
    },
    {
      label: t("stats.victory.elderDragon"),
      entry: data.elderDragon,
      description: t("stats.victory.lateGameFinisher"),
    },
    {
      label: t("stats.victory.atakhan"),
      entry: data.atakhan,
      description: t("stats.victory.massiveCombatBuff"),
    },
  ];

  return (
    <div className="space-y-6">
      <SummaryCards items={summaryItems} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ObjectiveTable
          title={t("stats.victory.firstObjectiveAdvantage")}
          objectives={firstObjectives}
        />
        <ObjectiveTable
          title={t("stats.victory.neutralObjectiveControl")}
          objectives={majorObjectives}
        />
      </div>

      <VoidGrubsSection data={data.voidGrubs} />

      <DragonsOverview data={data.dragons} />

      <DragonTypesSection types={data.dragons.types} />
    </div>
  );
}
