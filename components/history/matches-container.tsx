"use client";

import { MatchesList } from "./matches-list";
import type { MatchWithId } from "@/lib/types";

interface MatchesContainerProps {
  matches: MatchWithId[];
}

export function MatchesContainer({ matches }: MatchesContainerProps) {
  return (
    <div className="h-full">
      {/* Future: Filter controls will go here */}

      {/* Virtualized matches list with infinite scroll */}
      <MatchesList matches={matches} />
    </div>
  );
}
