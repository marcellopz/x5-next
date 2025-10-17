"use client";

import { MatchesList } from "./matches-list";
import type { MatchWithId } from "@/lib/types";

interface MatchesContainerProps {
  matches: MatchWithId[];
}

export function MatchesContainer({ matches }: MatchesContainerProps) {
  // TODO: Add filter functionality here in the future
  return (
    <div className="h-full flex flex-col">
      {/* Future: Filter controls will go here */}

      {/* Matches list with virtualization */}
      <div className="flex-1">
        <MatchesList matches={matches} />
      </div>
    </div>
  );
}
