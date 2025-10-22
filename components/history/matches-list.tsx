"use client";

import { useState, useEffect, useRef, memo } from "react";
import type { MatchWithId } from "@/lib/types";
import { MatchEntry } from "./match-entry";

// Memoized MatchEntry to prevent unnecessary re-renders
const MemoizedMatchEntry = memo(MatchEntry);

// Constants for configuration
const INITIAL_ITEMS = 10;
const ITEMS_PER_LOAD = 5;
const SCROLL_THRESHOLD = 800; // pixels from bottom to trigger loading

interface MatchesListProps {
  matches: MatchWithId[];
}

export function MatchesList({ matches }: MatchesListProps) {
  const [visibleItems, setVisibleItems] = useState(INITIAL_ITEMS);
  const canLoadMoreRef = useRef(true);
  console.log("visibleItems", visibleItems);

  // Get the subset of matches to display
  const displayedMatches = matches.slice(0, visibleItems);

  // Get the scroll element
  const getScrollElement = () => {
    return document.scrollingElement || document.documentElement;
  };

  // Handle infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollElement = getScrollElement();
      if (!scrollElement) return;

      const { scrollTop, scrollHeight, clientHeight } = scrollElement;
      const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
      const isNearBottom = distanceFromBottom <= SCROLL_THRESHOLD;

      // Only load more if we're near the bottom, have more items, and can load more
      if (
        isNearBottom &&
        visibleItems < matches.length &&
        canLoadMoreRef.current
      ) {
        console.log("Loading more items...");
        canLoadMoreRef.current = false; // Prevent multiple loads

        // Load items instantly
        setVisibleItems((prev) => {
          const newCount = Math.min(prev + ITEMS_PER_LOAD, matches.length);
          console.log("Updated visible items:", newCount);
          return newCount;
        });

        // Re-enable loading immediately
        canLoadMoreRef.current = true;
      }
    };

    const scrollElement = getScrollElement();

    if (scrollElement) {
      // Add scroll listeners
      scrollElement.addEventListener("scroll", handleScroll, { passive: true });
      window.addEventListener("scroll", handleScroll, { passive: true });

      return () => {
        scrollElement.removeEventListener("scroll", handleScroll);
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [visibleItems, matches.length]);

  if (matches.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No matches found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {displayedMatches.map((match, index) => (
        <MemoizedMatchEntry
          key={match.matchId}
          match={match}
          priority={index < 5} // Prioritize first 5 items
        />
      ))}

      {/* Always show spinner if there are items left to load */}
      {visibleItems < matches.length && (
        <div className="flex justify-center py-4">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            <span className="text-muted-foreground">
              Loading more matches...
            </span>
          </div>
        </div>
      )}

      {/* End of list indicator */}
      {visibleItems >= matches.length && matches.length > 0 && (
        <div className="flex justify-center py-4">
          <div className="text-muted-foreground">No more matches to load</div>
        </div>
      )}
    </div>
  );
}
