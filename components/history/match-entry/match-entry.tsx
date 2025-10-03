"use client";

import * as React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatMatchDuration, formatMatchDate, PlayerDisplay } from "./index";
import type { MatchData } from "@/lib/types";

interface MatchEntryProps {
  match: MatchData;
  className?: string;
}

export function MatchEntry({ match, className }: MatchEntryProps) {
  // Separate participants by team
  const team100 = match.participants.filter((p) => p.teamId === 100);
  const team200 = match.participants.filter((p) => p.teamId === 200);

  // Determine which team won
  const team100Won = match.teams.find((t) => t.teamId === 100)?.win === "Win";
  const team200Won = match.teams.find((t) => t.teamId === 200)?.win === "Win";

  return (
    <Card
      className={`hover:shadow-md transition-shadow duration-200 ${
        className || ""
      }`}
    >
      <CardHeader className="pb-3 px-4 sm:px-6 pt-4 sm:pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {formatMatchDuration(match.gameDuration)}
            </span>
          </div>
          <div className="text-sm text-muted-foreground">
            {formatMatchDate(match.date)}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 px-4 sm:px-6 pb-4 sm:pb-6">
        <div className="grid grid-cols-2 gap-3 md:gap-6">
          {/* Team 100 (Blue Side) */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  team100Won ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className="text-sm font-medium">
                {team100Won ? "Victory" : "Defeat"}
              </span>
            </div>
            {team100.map((participant) => (
              <PlayerDisplay
                key={participant.participantId}
                participant={participant}
              />
            ))}
          </div>

          {/* Team 200 (Red Side) */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  team200Won ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className="text-sm font-medium">
                {team200Won ? "Victory" : "Defeat"}
              </span>
            </div>
            {team200.map((participant) => (
              <PlayerDisplay
                key={participant.participantId}
                participant={participant}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
