"use client";

import type { MatchWithId } from "@/lib/types";
import { MatchEntry } from "./match-entry";

interface MatchesListProps {
  matches: MatchWithId[];
}

export function MatchesList({ matches }: MatchesListProps) {
  if (matches.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No matches found</p>
      </div>
    );
  }

  const matchesToShow = matches.slice(0, 4);

  return (
    <div className="space-y-4">
      {matchesToShow.map((match) => (
        <MatchEntry key={match.matchId} match={match} />
      ))}
    </div>
  );
}
