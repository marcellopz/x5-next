"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, User, X } from "lucide-react";
import { groupChangesByDate } from "@/lib/utils";
import { PatchNotesList } from "./patch-notes-list";
import { PatchStats } from "@/components/home/hero-section/patch-notes/patch-stats";
import type { RankChangeLog, InitialRanksData, Player } from "@/lib/types";
import type { GroupedChangesByDate } from "@/lib/utils";

interface PatchNotesPageContentProps {
  rankChangeLog: RankChangeLog | null;
  initialRankChangeLog: InitialRanksData | null;
  playerList: Player[];
}

interface FilterOption {
  id: string;
  name: string;
  accountId: number;
}

export function PatchNotesPageContent({
  rankChangeLog,
  initialRankChangeLog,
  playerList,
}: PatchNotesPageContentProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = React.useState<number | null>(
    null
  );

  const groupedChanges = React.useMemo(
    () => groupChangesByDate(rankChangeLog, initialRankChangeLog),
    [rankChangeLog, initialRankChangeLog]
  );

  // Filter grouped changes by selected player
  const filteredGroupedChanges: GroupedChangesByDate = React.useMemo(() => {
    if (!selectedPlayerId) return groupedChanges;

    const filtered: GroupedChangesByDate = {};
    const selectedPlayer = playerList.find(
      (p) => p.account_id === selectedPlayerId
    );
    if (!selectedPlayer) return groupedChanges;

    Object.entries(groupedChanges).forEach(([date, changes]) => {
      const filteredChanges = changes.filter((change) => {
        if (change.type === "new_player") {
          return change.name_id === selectedPlayer.name_id;
        } else {
          return change.name_id === selectedPlayer.name_id;
        }
      });

      if (filteredChanges.length > 0) {
        filtered[date] = filteredChanges;
      }
    });

    return filtered;
  }, [groupedChanges, selectedPlayerId, playerList]);

  // Calculate consolidated stats from filtered changes
  const stats = React.useMemo(() => {
    let buffs = 0;
    let nerfs = 0;
    let newPlayers = 0;

    Object.values(filteredGroupedChanges).forEach((changes) => {
      changes.forEach((change) => {
        if (change.type === "new_player") {
          newPlayers++;
        } else if (change.type === "rank_change") {
          if (change.newRank > change.oldRank) {
            buffs++;
          } else {
            nerfs++;
          }
        }
      });
    });

    return {
      buffs,
      nerfs,
      newPlayers,
      patches: Object.keys(filteredGroupedChanges).length,
    };
  }, [filteredGroupedChanges]);

  // Filter options for autocomplete
  const allOptions: FilterOption[] = React.useMemo(() => {
    return playerList.map((player) => ({
      id: player.account_id?.toString() ?? "",
      name: player.name,
      accountId: player.account_id as number,
    }));
  }, [playerList]);

  const autocompleteOptions: FilterOption[] = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.trim().toLowerCase();
    return allOptions.filter((option) =>
      option.name.toLowerCase().includes(query)
    );
  }, [allOptions, searchQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setIsDropdownOpen(e.target.value.length > 0);
    // Clear filter if user clears the input
    if (e.target.value.trim() === "") {
      setSelectedPlayerId(null);
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

  const handleOptionClick = (option: FilterOption) => {
    setSearchQuery(option.name);
    setSelectedPlayerId(option.accountId);
    setIsDropdownOpen(false);
  };

  const selectedPlayer = selectedPlayerId
    ? playerList.find((p) => p.account_id === selectedPlayerId)
    : null;

  return (
    <div className="flex flex-col">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Patch Notes</h1>
            <div className="mt-2">
              <PatchStats
                patches={stats.patches}
                buffs={stats.buffs}
                nerfs={stats.nerfs}
                newPlayers={stats.newPlayers}
              />
            </div>
          </div>
          <div className="w-full md:max-w-xs">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Search players..."
                value={searchQuery}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                startIcon={<Search className="h-4 w-4" />}
                className="w-full"
                autoFocus
              />

              {/* Autocomplete Dropdown */}
              {isDropdownOpen && autocompleteOptions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-auto">
                  <div className="p-1">
                    {autocompleteOptions.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => handleOptionClick(option)}
                        className="w-full text-left px-3 py-2 rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-2"
                      >
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="flex-1">{option.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty state when searching but no results */}
              {isDropdownOpen &&
                searchQuery.length > 0 &&
                autocompleteOptions.length === 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg">
                    <div className="p-3 text-center text-sm text-muted-foreground">
                      No matches found
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
        {selectedPlayer && (
          <div className="mt-4 flex items-center gap-2">
            <p className="text-sm text-muted-foreground">
              Filtering by:{" "}
              <span className="font-medium">{selectedPlayer.name}</span>
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={() => {
                setSearchQuery("");
                setSelectedPlayerId(null);
              }}
            >
              <X className="h-3 w-3 mr-1" />
              Clear
            </Button>
          </div>
        )}
      </div>

      <div className="container mx-auto px-4 flex-1 pb-8">
        <PatchNotesList
          groupedChanges={filteredGroupedChanges}
          selectedPlayerNameId={
            selectedPlayerId
              ? playerList.find((p) => p.account_id === selectedPlayerId)
                  ?.name_id
              : null
          }
        />
      </div>
    </div>
  );
}
