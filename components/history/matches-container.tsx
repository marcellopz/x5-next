"use client";

import { useState, useEffect, useTransition } from "react";
import { MatchesList } from "./matches-list";
import { MatchesFilter } from "./matches-filter";
import type { MatchWithId, Player } from "@/lib/types";

interface MatchesContainerProps {
  matches: MatchWithId[];
  playerList: Player[];
}

export type FilterIdentifier =
  | { type: "player"; accountId: number }
  | { type: "champion"; championName: string };

export function MatchesContainer({
  matches,
  playerList,
}: MatchesContainerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [identifier, setIdentifier] = useState<FilterIdentifier | null>(null);
  const [isFiltering, startTransition] = useTransition();
  const [filteredMatches, setFilteredMatches] =
    useState<MatchWithId[]>(matches);

  // Filter matches asynchronously to avoid blocking UI
  useEffect(() => {
    if (!identifier) {
      setFilteredMatches(matches);
      return;
    }

    startTransition(() => {
      const filtered = matches.filter((match) => {
        return match.participants.some((participant) => {
          if (identifier.type === "player") {
            return participant.summonerId === Number(identifier.accountId);
          } else {
            // Champion filter
            return (
              participant.championName.toLowerCase() ===
              identifier.championName.toLowerCase()
            );
          }
        });
      });

      setFilteredMatches(filtered);
    });
  }, [matches, identifier, startTransition]);

  const handleInputChange = (value: string) => {
    setSearchQuery(value);
    setIsDropdownOpen(value.length > 0);
    // Clear filter if user clears the input
    if (value.trim() === "") {
      setIdentifier(null);
    }
  };

  const handleInputFocus = () => {
    if (searchQuery.length > 0) {
      setIsDropdownOpen(true);
    }
  };

  const handleInputBlur = () => {
    // Delay closing to allow click on dropdown items
    setTimeout(() => setIsDropdownOpen(false), 200);
  };

  const handleOptionClick = (filter: FilterIdentifier) => {
    // Find the display name for the search query
    let displayName = "";
    if (filter.type === "player") {
      const player = playerList.find((p) => p.account_id === filter.accountId);
      displayName = player?.name || "";
    } else {
      displayName = filter.championName;
    }
    setSearchQuery(displayName);
    setIdentifier(filter);
    setIsDropdownOpen(false);
  };

  return (
    <div className="flex flex-col">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Match History</h1>
            <p className="text-sm text-muted-foreground">
              {identifier
                ? `${filteredMatches.length} of ${matches.length} matches`
                : `${matches.length} matches total`}
            </p>
          </div>
          <div className="w-full md:max-w-xs">
            <MatchesFilter
              playerList={playerList}
              searchQuery={searchQuery}
              isDropdownOpen={isDropdownOpen}
              onInputChange={handleInputChange}
              onInputFocus={handleInputFocus}
              onInputBlur={handleInputBlur}
              onOptionClick={handleOptionClick}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 flex-1">
        {/* Loading state while filtering */}
        {isFiltering ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
            <p className="text-sm text-muted-foreground">
              Filtering matches...
            </p>
          </div>
        ) : (
          /* Virtualized matches list with infinite scroll */
          <MatchesList filteringBy={identifier} matches={filteredMatches} />
        )}
      </div>
    </div>
  );
}
