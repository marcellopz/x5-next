"use client";

import { List } from "react-window";
import type { RowComponentProps } from "react-window";
import type { MatchWithId } from "@/lib/types";
import { MatchEntry } from "./match-entry";

interface MatchesListProps {
  matches: MatchWithId[];
}

interface RowProps {
  matches: MatchWithId[];
}

const ITEM_HEIGHT = 318;

function Row({ index, matches }: RowComponentProps<RowProps>) {
  const match = matches[index];
  return (
    <div className="pb-4">
      <MatchEntry match={match} />
    </div>
  );
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
    <List
      rowComponent={Row}
      rowCount={matches.length}
      rowHeight={ITEM_HEIGHT}
      rowProps={{ matches }}
    />
  );
}
