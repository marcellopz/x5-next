"use client";

import { useMemo, memo, useState, useEffect } from "react";
import { PlayerDisplay } from "./player-display";
import { TeamHeader } from "./team-header";
import { MatchHeader } from "./match-header";
import { MatchEntrySkeleton } from "./match-entry-skeleton";
import type { ReducedMatchData } from "@/lib/types";
import { sortParticipantsByRole } from "./match-utils";

interface MatchEntryProps {
  match: ReducedMatchData;
  className?: string;
  priority?: boolean;
}

interface ProcessedTeamData {
  participants: ReducedMatchData["participants"];
  sortedParticipants: ReducedMatchData["participants"];
  totalKills: number;
  totalDeaths: number;
  totalAssists: number;
  goldEarned: number;
}

interface ProcessedMatchData {
  team100Data: ProcessedTeamData;
  team200Data: ProcessedTeamData;
  team100: ReducedMatchData["teams"][0];
  team200: ReducedMatchData["teams"][0];
  team100Won: boolean;
  team200Won: boolean;
}

export function MatchEntry({
  match,
  className,
  priority = false,
}: MatchEntryProps) {
  const [isProcessing, setIsProcessing] = useState(!priority);

  const processedData = useMemo((): ProcessedMatchData => {
    const team100Participants: ReducedMatchData["participants"] = [];
    const team200Participants: ReducedMatchData["participants"] = [];

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

    const t100 = match.teams.find((t) => t.teamId === 100)!;
    const t200 = match.teams.find((t) => t.teamId === 200)!;

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
      team100: t100,
      team200: t200,
      team100Won: t100.win === "Win",
      team200Won: t200.win === "Win",
    };
  }, [match]);

  // Set processing to false when calculations are complete
  useEffect(() => {
    if (
      processedData.team100Data &&
      processedData.team200Data &&
      processedData.team100 &&
      processedData.team200
    ) {
      if (priority) {
        // High priority: process immediately
        setIsProcessing(false);
      } else {
        // Low priority: use requestIdleCallback for better performance
        const processWhenIdle = () => {
          if (window.requestIdleCallback) {
            window.requestIdleCallback(() => {
              setIsProcessing(false);
            });
          } else {
            // Fallback for browsers without requestIdleCallback
            setTimeout(() => setIsProcessing(false), 0);
          }
        };

        processWhenIdle();
      }
    }
  }, [processedData, priority]);

  // Show skeleton while processing
  if (isProcessing) {
    return <MatchEntrySkeleton className={className} />;
  }

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
            team={processedData.team100}
            isWinning={processedData.team100Won}
            goldEarned={processedData.team100Data.goldEarned}
            totalKills={processedData.team100Data.totalKills}
            totalDeaths={processedData.team100Data.totalDeaths}
            totalAssists={processedData.team100Data.totalAssists}
          />
          {processedData.team100Data.sortedParticipants.map((participant) => (
            <PlayerDisplay
              key={participant.participantId}
              participant={participant}
              totalKills={processedData.team100Data.totalKills}
              priority={priority}
            />
          ))}
        </div>

        {/* Team 200 (Red Side) */}
        <div className="space-y-2">
          <TeamHeader
            team={processedData.team200}
            isWinning={processedData.team200Won}
            goldEarned={processedData.team200Data.goldEarned}
            totalKills={processedData.team200Data.totalKills}
            totalDeaths={processedData.team200Data.totalDeaths}
            totalAssists={processedData.team200Data.totalAssists}
          />
          {processedData.team200Data.sortedParticipants.map((participant) => (
            <PlayerDisplay
              key={participant.participantId}
              participant={participant}
              totalKills={processedData.team200Data.totalKills}
              priority={priority}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default memo(MatchEntry, (prevProps, nextProps) => {
  return prevProps.match.gameId === nextProps.match.gameId;
});
