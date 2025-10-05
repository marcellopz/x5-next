"use client";

import { useState } from "react";
import { CompactLeaderboard } from "@/components/ui/compact-leaderboard";
import { CollapsibleSection } from "@/components/ui/collapsible-section";
import type { LeaderboardItem } from "@/components/ui/compact-leaderboard";

// Mocked data
const topWinRateData: LeaderboardItem[] = [
  { id: "1", label: "ProPlayer123", value: "75.0%", subtitle: "40 games" },
  { id: "2", label: "WinnerGamer", value: "68.0%", subtitle: "52 games" },
  { id: "3", label: "TopPlayer99", value: "62.0%", subtitle: "38 games" },
  { id: "4", label: "Consistent", value: "58.5%", subtitle: "45 games" },
  { id: "5", label: "GoodPlayer", value: "55.2%", subtitle: "48 games" },
  { id: "6", label: "SolidWins", value: "52.8%", subtitle: "50 games" },
];

const topKDAData: LeaderboardItem[] = [
  { id: "1", label: "KDAMaster", value: "4.50", subtitle: "156 games" },
  { id: "2", label: "ProPlayer123", value: "3.80", subtitle: "203 games" },
  { id: "3", label: "SkillGamer", value: "3.20", subtitle: "178 games" },
  { id: "4", label: "GoodMechanics", value: "2.95", subtitle: "145 games" },
  { id: "5", label: "Consistent", value: "2.75", subtitle: "198 games" },
  { id: "6", label: "Average", value: "2.50", subtitle: "189 games" },
];

const topKillParticipationData: LeaderboardItem[] = [
  { id: "1", label: "TeamPlayer", value: "72.0%", subtitle: "89 games" },
  { id: "2", label: "ProPlayer123", value: "68.0%", subtitle: "203 games" },
  { id: "3", label: "SupportMain", value: "65.0%", subtitle: "156 games" },
  { id: "4", label: "Roamer", value: "62.5%", subtitle: "134 games" },
  { id: "5", label: "Aggressive", value: "60.8%", subtitle: "167 games" },
  { id: "6", label: "Playmaker", value: "58.2%", subtitle: "145 games" },
];

const topGamesPlayedData: LeaderboardItem[] = [
  { id: "1", label: "Grinder123", value: "250", subtitle: "52% WR" },
  { id: "2", label: "NoLifeGamer", value: "198", subtitle: "48% WR" },
  { id: "3", label: "ProPlayer123", value: "175", subtitle: "65% WR" },
  { id: "4", label: "CasualPlayer", value: "142", subtitle: "50% WR" },
  { id: "5", label: "WeekendWarrior", value: "128", subtitle: "55% WR" },
  { id: "6", label: "Dedicated", value: "115", subtitle: "51% WR" },
];

export function PlayerStatsSection() {
  const [expanded, setExpanded] = useState(false);

  return (
    <CollapsibleSection title="Player Leaderboard">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <CompactLeaderboard
          items={topWinRateData}
          title="Top Win Rates"
          expanded={expanded}
          onExpandedChange={setExpanded}
          collapsedAction={{
            label: "See All Stats",
            onClick: () => {},
          }}
        />

        <CompactLeaderboard
          items={topKDAData}
          title="Top Average KDA"
          expanded={expanded}
          onExpandedChange={setExpanded}
          collapsedAction={{
            label: "See All Stats",
            onClick: () => {},
          }}
        />

        <CompactLeaderboard
          items={topKillParticipationData}
          title="Top Kill Participation"
          expanded={expanded}
          onExpandedChange={setExpanded}
          collapsedAction={{
            label: "See All Stats",
            onClick: () => {},
          }}
        />

        <CompactLeaderboard
          items={topGamesPlayedData}
          title="Most Games Played"
          expanded={expanded}
          onExpandedChange={setExpanded}
          collapsedAction={{
            label: "See All Stats",
            onClick: () => {},
          }}
        />
      </div>
    </CollapsibleSection>
  );
}
