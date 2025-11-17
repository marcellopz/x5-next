"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { CHAMPIONICONURL } from "@/lib/resources";
import { formatNumber } from "./match-utils";

interface DamageChartProps {
  matchData: unknown;
}

interface Participant {
  participantId: number;
  teamId: number;
  championId: number;
  championName: string;
  stats: {
    totalDamageDealtToChampions: number;
    totalDamageTaken: number;
    goldEarned: number;
    visionScore: number;
  };
}

interface MatchData {
  participants: Participant[];
}

const tabKey = [
  "totalDamageDealtToChampions",
  "totalDamageTaken",
  "goldEarned",
  "visionScore",
] as const;

const tabEmojis = ["⚔️", "🛡️", "💰", "👀"];

const tabLabels = ["Damage", "Damage Taken", "Gold", "Vision"];

const Tab = ({
  setTabState,
  tabState,
  n,
  text,
}: {
  setTabState: (n: number) => void;
  tabState: number;
  n: number;
  text: string;
}) => (
  <button
    onClick={() => setTabState(n)}
    className={`flex-1 h-12 flex items-center justify-center transition-colors ${
      tabState === n
        ? "border-l border-r border-b-0 border-border bg-background/50 font-semibold text-foreground"
        : "bg-accent/70 border-l border-r border-b border-border/50 hover:bg-background/10 text-muted-foreground"
    }`}
  >
    <p className="text-sm">{text}</p>
  </button>
);

const TeamSection = ({
  team,
  teamName,
  tabState,
  max,
  isBlueTeam,
}: {
  team: Participant[];
  teamName: string;
  tabState: number;
  max: number;
  isBlueTeam: boolean;
}) => {
  const sortedTeam = useMemo(() => {
    return [...team].sort(
      (a, b) => b.stats[tabKey[tabState]] - a.stats[tabKey[tabState]]
    );
  }, [team, tabState]);

  const barColor = isBlueTeam ? "bg-blue-500" : "bg-red-500";

  return (
    <div className="mb-4">
      <div
        className={`p-2 mb-2 rounded text-center ${
          isBlueTeam
            ? "bg-blue-500/20 border border-blue-500/40"
            : "bg-red-500/20 border border-red-500/40"
        }`}
      >
        <h3 className="text-lg font-semibold text-foreground m-0">
          {teamName}
        </h3>
      </div>
      <ul className="list-none p-0 m-0">
        {sortedTeam.map((p, i) => {
          const value = p.stats[tabKey[tabState]];
          const percentage = max > 0 ? (value / max) * 100 : 0;

          return (
            <li key={i} className="p-2">
              <div className="flex items-center gap-3">
                <Image
                  src={`${CHAMPIONICONURL}${p.championId}.png`}
                  width={50}
                  height={50}
                  alt={`${p.championName} champion icon`}
                  className="rounded border border-border/60 shrink-0"
                  unoptimized
                />
                <div className="flex-1 py-3.5">
                  <div
                    className={`h-5 ${barColor} rounded-sm`}
                    style={{
                      width: `${percentage}%`,
                    }}
                    title={formatNumber(value)}
                  />
                </div>
                <div className="flex items-center gap-1 w-20 justify-end shrink-0">
                  <span className="text-lg">{tabEmojis[tabState]}</span>
                  <span className="text-sm font-semibold text-foreground">
                    {formatNumber(value)}
                  </span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export function DamageChart({ matchData }: DamageChartProps) {
  const [tabState, setTabState] = useState(0);

  const match = matchData as MatchData | null | undefined;

  // Calculate max value across all participants for proper scaling
  const max = useMemo(() => {
    if (!match || !match.participants) return 0;
    return Math.max(
      ...match.participants.map((p) => p.stats[tabKey[tabState]])
    );
  }, [match, tabState]);

  if (!match || !match.participants) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground text-sm">No match data available</p>
      </div>
    );
  }

  // Split participants into blue and red teams
  const blueTeam = match.participants.filter((p) => p.teamId === 100);
  const redTeam = match.participants.filter((p) => p.teamId === 200);

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className="flex h-12">
        {tabLabels.map((label, i) => (
          <Tab
            key={i}
            setTabState={setTabState}
            tabState={tabState}
            n={i}
            text={label}
          />
        ))}
      </div>
      <div className="border-l border-r border-border p-2.5">
        <TeamSection
          team={blueTeam}
          teamName="Blue Team"
          tabState={tabState}
          max={max}
          isBlueTeam={true}
        />
        <div className="h-0.5 bg-linear-to-r from-blue-500 via-muted-foreground to-red-500 rounded my-6" />
        <TeamSection
          team={redTeam}
          teamName="Red Team"
          tabState={tabState}
          max={max}
          isBlueTeam={false}
        />
      </div>
    </div>
  );
}
