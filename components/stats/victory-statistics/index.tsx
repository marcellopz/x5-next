"use client";

import type { VictoryStatistics } from "@/lib/types";
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
  const summaryItems = [
    {
      title: "First Blood",
      description: "Teams securing the first takedown",
      entry: data.firstBlood,
      icon: "sword" as const,
    },
    {
      title: "First Tower",
      description: "Teams destroying the first turret",
      entry: data.firstTower,
      icon: "towerControl" as const,
    },
    {
      title: "First Dragon",
      description: "Teams claiming the opening dragon",
      entry: data.firstDragon,
      icon: "origami" as const,
    },
    {
      title: "Atakhan",
      description: "Teams claiming Atakhan",
      entry: data.atakhan,
      icon: "skull" as const,
    },
  ];

  const firstObjectives: ObjectiveStat[] = [
    {
      label: "First Blood",
      entry: data.firstBlood,
      description: "Early skirmish momentum",
    },
    {
      label: "First Tower",
      entry: data.firstTower,
      description: "Macro map pressure",
    },
    {
      label: "First Inhibitor",
      entry: data.firstInhibitor,
      description: "Late-game advantage",
    },
    {
      label: "First Baron",
      entry: data.firstBaron,
      description: "Late objective control",
    },
    {
      label: "First Dragon",
      entry: data.firstDragon,
      description: "Neutral objective tempo",
    },
  ];

  const majorObjectives: ObjectiveStat[] = [
    {
      label: "Rift Herald",
      entry: data.riftHerald,
      description: "Mid-game pacing",
    },
    {
      label: "Baron Nashor",
      entry: data.baron,
      description: "Siege potential",
    },
    {
      label: "Elder Dragon",
      entry: data.elderDragon,
      description: "Late-game finisher",
    },
    {
      label: "Atakhan",
      entry: data.atakhan,
      description: "Massive combat buff",
    },
  ];

  return (
    <div className="space-y-6">
      <SummaryCards items={summaryItems} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ObjectiveTable
          title="First Objective Advantage"
          objectives={firstObjectives}
        />
        <ObjectiveTable
          title="Neutral Objective Control"
          objectives={majorObjectives}
        />
      </div>

      <VoidGrubsSection data={data.voidGrubs} />

      <DragonsOverview data={data.dragons} />

      <DragonTypesSection types={data.dragons.types} />
    </div>
  );
}
