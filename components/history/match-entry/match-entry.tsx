"use client";

import * as React from "react";
import { PlayerDisplay, TeamHeader, MatchHeader } from "./index";
import type { ReducedMatchData } from "@/lib/types";
import { sortParticipantsByRole } from "./match-utils";

interface MatchEntryProps {
  match: ReducedMatchData;
  className?: string;
}

export function MatchEntry({ match, className }: MatchEntryProps) {
  // Separate participants by team and calculate team stats in a single pass
  const { team100Data, team200Data } = React.useMemo(() => {
    const team100Participants: typeof match.participants = [];
    const team200Participants: typeof match.participants = [];

    const team100Stats = {
      totalKills: 0,
      totalDeaths: 0,
      totalAssists: 0,
      goldEarned: 0,
    };

    const team200Stats = {
      totalKills: 0,
      totalDeaths: 0,
      totalAssists: 0,
      goldEarned: 0,
    };

    // Single loop to separate teams and calculate stats
    for (const participant of match.participants) {
      if (participant.teamId === 100) {
        team100Participants.push(participant);
        team100Stats.totalKills += participant.stats.kills;
        team100Stats.totalDeaths += participant.stats.deaths;
        team100Stats.totalAssists += participant.stats.assists;
        team100Stats.goldEarned += participant.stats.goldEarned;
      } else {
        team200Participants.push(participant);
        team200Stats.totalKills += participant.stats.kills;
        team200Stats.totalDeaths += participant.stats.deaths;
        team200Stats.totalAssists += participant.stats.assists;
        team200Stats.goldEarned += participant.stats.goldEarned;
      }
    }

    return {
      team100Data: {
        participants: team100Participants,
        sortedParticipants: sortParticipantsByRole(team100Participants),
        ...team100Stats,
      },
      team200Data: {
        participants: team200Participants,
        sortedParticipants: sortParticipantsByRole(team200Participants),
        ...team200Stats,
      },
    };
  }, [match]);

  // Determine teams and winning status
  const { team100, team200, team100Won, team200Won } = React.useMemo(() => {
    const t100 = match.teams.find((t) => t.teamId === 100)!;
    const t200 = match.teams.find((t) => t.teamId === 200)!;

    return {
      team100: t100,
      team200: t200,
      team100Won: t100.win === "Win",
      team200Won: t200.win === "Win",
    };
  }, [match.teams]);

  return (
    <div
      className={`rounded-lg border border-border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow duration-200 p-3 sm:p-4 ${
        className || ""
      }`}
    >
      <MatchHeader
        matchId={match.gameId.toString()}
        gameDuration={match.gameDuration}
        date={match.date}
      />

      <div className="grid grid-cols-2 gap-2 md:gap-3">
        {/* Team 100 (Blue Side) */}
        <div className="space-y-2">
          <TeamHeader
            team={team100}
            isWinning={team100Won}
            goldEarned={team100Data.goldEarned}
            totalKills={team100Data.totalKills}
            totalDeaths={team100Data.totalDeaths}
            totalAssists={team100Data.totalAssists}
          />
          {team100Data.sortedParticipants.map((participant) => (
            <PlayerDisplay
              key={participant.participantId}
              participant={participant}
              totalKills={team100Data.totalKills}
            />
          ))}
        </div>

        {/* Team 200 (Red Side) */}
        <div className="space-y-2">
          <TeamHeader
            team={team200}
            isWinning={team200Won}
            goldEarned={team200Data.goldEarned}
            totalKills={team200Data.totalKills}
            totalDeaths={team200Data.totalDeaths}
            totalAssists={team200Data.totalAssists}
          />
          {team200Data.sortedParticipants.map((participant) => (
            <PlayerDisplay
              key={participant.participantId}
              participant={participant}
              totalKills={team200Data.totalKills}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
