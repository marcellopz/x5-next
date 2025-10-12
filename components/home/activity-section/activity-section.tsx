"use client";

import { CollapsibleSection } from "@/components/ui/collapsible-section";
import { GameDurationHistogram, GamesPerMonth } from "@/lib/types";
import { GamesPerMonthChart } from "./games-per-month-chart";
import { GamesPerHourChart } from "./games-per-hour-chart";
import { GamesPerDayChart } from "./games-per-day-chart";
import { GameDurationChart } from "./game-duration-chart";

interface ActivitySectionData {
  gamesPerMonth: GamesPerMonth;
  gamesPerHour: number[];
  gamesPerDay: number[];
  gameDurationDistribution: GameDurationHistogram;
}

export function ActivitySection({ data }: { data: ActivitySectionData }) {
  return (
    <CollapsibleSection title="Activity Analytics">
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <GamesPerMonthChart data={data.gamesPerMonth} />
        <GamesPerHourChart data={data.gamesPerHour} />
        <GamesPerDayChart data={data.gamesPerDay} />
        <GameDurationChart data={data.gameDurationDistribution} />
      </div>
    </CollapsibleSection>
  );
}
