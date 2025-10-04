"use client";

import { useState, useEffect } from "react";
import { Virtuoso } from "react-virtuoso";
import { MatchEntry } from "./match-entry";
import type { MatchWithId } from "@/lib/types";

interface MatchesListProps {
  matches: MatchWithId[];
}

const INITIAL_LOAD = 10; // Load first 20 matches
const LOAD_MORE_COUNT = 10; // Load 10 more at a time

export function MatchesList({ matches }: MatchesListProps) {
  const [displayedCount, setDisplayedCount] = useState(INITIAL_LOAD);
  const [isLoading, setIsLoading] = useState(false);

  // Reset displayed count when matches change
  useEffect(() => {
    setDisplayedCount(INITIAL_LOAD);
  }, [matches]);

  const displayedMatches = matches.slice(0, displayedCount);
  const hasMore = displayedCount < matches.length;

  const loadMore = () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);

    // Simulate loading delay for better UX
    setTimeout(() => {
      setDisplayedCount((prev) =>
        Math.min(prev + LOAD_MORE_COUNT, matches.length)
      );
      setIsLoading(false);
    }, 300);
  };

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
        data={displayedMatches}
        itemContent={(index, match) => <MatchEntry match={match} />}
        endReached={loadMore}
        overscan={10000}
        components={{
          Footer: () =>
            hasMore ? (
              <div className="py-8 text-center">
                <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      <span>Loading more matches...</span>
                    </>
                  ) : (
                    <span>Scroll down to load more</span>
                  )}
                </div>
              </div>
            ) : displayedMatches.length > INITIAL_LOAD ? (
              <div className="py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  All matches loaded ({matches.length} total)
                </p>
              </div>
            ) : null,
        }}
      />
    </div>
  );
}
