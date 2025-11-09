"use client";

import { useMemo } from "react";
import type { MatchWithId, RankChangeEntry } from "@/lib/types";
import { SummaryMatchItem } from "./summary-match-item";
import { SummaryRankChangeItem } from "./summary-rank-change-item";
import { Button } from "@/components/ui/button";
import { usePlayerData } from "../../player-data-context";

interface SummaryMatchesProps {
  matches: MatchWithId[];
  playerSummonerId: string | number;
  filteredRole?: string;
  onClearFilter?: () => void;
}

export function SummaryMatches({
  matches,
  playerSummonerId,
  filteredRole,
  onClearFilter,
}: SummaryMatchesProps) {
  const { rankChanges } = usePlayerData();
  // Filter matches to only include this player's matches
  const playerMatches = useMemo(() => {
    return matches.filter((match) =>
      match.participants.some((p) => p.summonerId === playerSummonerId)
    );
  }, [matches, playerSummonerId]);

  // Filter by role if specified and get rank changes
  const filteredEntries = useMemo(() => {
    // Filter matches by role if specified
    const filteredMatches = filteredRole
      ? playerMatches.filter((match) => {
          const participant = match.participants.find(
            (p) => p.summonerId === playerSummonerId
          );
          return (
            participant?.role?.toLowerCase() === filteredRole.toLowerCase()
          );
        })
      : playerMatches;

    // Create match entries
    const matchEntries = filteredMatches.map((match) => ({
      type: "match" as const,
      match,
      timestamp: new Date(match.date).getTime(),
    }));

    // Get rank changes for the filtered role if specified
    const rankChangeEntries: Array<{
      type: "rank_change";
      change: RankChangeEntry;
      timestamp: number;
    }> = [];
    if (filteredRole && rankChanges) {
      const roleChanges = rankChanges[filteredRole.toLowerCase()];
      if (roleChanges) {
        Object.values(roleChanges).forEach((change) => {
          rankChangeEntries.push({
            type: "rank_change",
            change,
            timestamp: change.timestamp,
          });
        });
      }
    }

    // Combine and sort by timestamp (newest first)
    return [...matchEntries, ...rankChangeEntries].sort(
      (a, b) => b.timestamp - a.timestamp
    );
  }, [playerMatches, filteredRole, playerSummonerId, rankChanges]);

  if (filteredEntries.length === 0) {
    return (
      <div className="flex flex-col">
        {filteredRole && (
          <div className="flex items-center justify-between mb-4 p-3 bg-background border border-border rounded-lg">
            <span className="text-sm text-foreground">
              Filtered by:{" "}
              <span className="font-semibold capitalize">{filteredRole}</span>
            </span>
            <Button
              onClick={onClearFilter}
              variant="destructive"
              size="sm"
              className="h-7 px-2 text-xs"
            >
              Clear
            </Button>
          </div>
        )}
        <p className="text-muted-foreground text-sm text-center py-8">
          No matches found
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-3">
      {filteredRole && (
        <div className="flex items-center justify-between p-3 bg-background border border-border rounded-lg">
          <span className="text-sm text-foreground">
            Filtered by:{" "}
            <span className="font-semibold capitalize">{filteredRole}</span>
          </span>
          <Button
            onClick={onClearFilter}
            variant="destructive"
            size="sm"
            className="h-7 px-2 text-xs"
          >
            Clear
          </Button>
        </div>
      )}
      {filteredEntries.map((entry) => {
        if (entry.type === "match") {
          const participant = entry.match.participants.find(
            (p) => p.summonerId === playerSummonerId
          );
          if (!participant) return null;

          return (
            <SummaryMatchItem
              key={entry.match.matchId}
              match={entry.match}
              participant={participant}
            />
          );
        } else if (entry.type === "rank_change") {
          return (
            <SummaryRankChangeItem
              key={`rank-change-${entry.change.timestamp}`}
              change={entry.change}
            />
          );
        }
        return null;
      })}
    </div>
  );
}
