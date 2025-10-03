"use client";

import { Virtuoso } from "react-virtuoso";
import { MatchEntry } from "./match-entry";
import type { MatchWithId } from "@/lib/types";

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

  return (
    <div className="h-full">
      <Virtuoso
        data={matches}
        itemContent={(index, match) => (
          <div className="px-4 pb-4">
            <MatchEntry match={match} />
          </div>
        )}
        overscan={6000}
      />
    </div>
  );
}
