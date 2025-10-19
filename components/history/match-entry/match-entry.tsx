"use client";

import * as React from "react";
import {
  formatMatchDuration,
  formatMatchDate,
  PlayerDisplay,
  TeamHeader,
} from "./index";
import type { ReducedMatchData } from "@/lib/types";
import { sortParticipantsByRole } from "./match-utils";

interface MatchEntryProps {
  match: ReducedMatchData;
  className?: string;
}

export function MatchEntry({ match, className }: MatchEntryProps) {
  // Separate participants by team
  const team100 = match.participants.filter((p) => p.teamId === 100);
  const team200 = match.participants.filter((p) => p.teamId === 200);

  // Determine which team won
  const team100Won = match.teams.find((t) => t.teamId === 100)?.win === "Win";
  const team200Won = match.teams.find((t) => t.teamId === 200)?.win === "Win";

  const sortedTeam100 = sortParticipantsByRole(team100);
  const sortedTeam200 = sortParticipantsByRole(team200);

  const team100GoldEarned = team100.reduce(
    (acc, curr) => acc + curr.stats.goldEarned,
    0
  );
  const team200GoldEarned = team200.reduce(
    (acc, curr) => acc + curr.stats.goldEarned,
    0
  );

  const team100TotalKills = team100.reduce(
    (acc, curr) => acc + curr.stats.kills,
    0
  );
  const team200TotalKills = team200.reduce(
    (acc, curr) => acc + curr.stats.kills,
    0
  );

  return (
    <div
      className={`rounded-lg border border-border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow duration-200 p-3 sm:p-4 ${
        className || ""
      }`}
    >
      <div className="pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {formatMatchDuration(match.gameDuration)}
          </span>
        </div>
        <div className="text-sm text-muted-foreground">
          {formatMatchDate(match.date)}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 md:gap-3">
        {/* Team 100 (Blue Side) */}
        <div className="space-y-2">
          <TeamHeader
            team={match.teams.find((t) => t.teamId === 100)!}
            isWinning={team100Won}
            goldEarned={team100GoldEarned}
            totalKills={team100TotalKills}
          />
          {sortedTeam100.map((participant) => (
            <PlayerDisplay
              key={participant.participantId}
              participant={participant}
              totalKills={team100TotalKills}
            />
          ))}
        </div>

        {/* Team 200 (Red Side) */}
        <div className="space-y-2">
          <TeamHeader
            team={match.teams.find((t) => t.teamId === 200)!}
            isWinning={team200Won}
            goldEarned={team200GoldEarned}
            totalKills={team200TotalKills}
          />
          {sortedTeam200.map((participant) => (
            <PlayerDisplay
              key={participant.participantId}
              participant={participant}
              totalKills={team200TotalKills}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
