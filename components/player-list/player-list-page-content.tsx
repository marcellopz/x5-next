"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { PlayerListTable } from "./player-list-table";
import type { PlayerList, PlayerSummary } from "@/lib/types";

interface PlayerListPageContentProps {
  playerList: PlayerList | null;
  playerSummary: PlayerSummary | null;
}

export function PlayerListPageContent({
  playerList,
  playerSummary,
}: PlayerListPageContentProps) {
  const [searchQuery, setSearchQuery] = React.useState("");

  // Calculate filtered count for display
  const filteredCount = React.useMemo(() => {
    if (!playerList) return 0;
    const total = Object.keys(playerList).length;
    if (!searchQuery.trim()) return total;

    const filtered = Object.entries(playerList).filter(([nameId, player]) => {
      if (player.hide === true) return false;
      const playerName = (player.name || nameId).toLowerCase();
      const query = searchQuery.trim().toLowerCase();
      return playerName.includes(query);
    });
    return filtered.length;
  }, [playerList, searchQuery]);

  const totalCount = playerList ? Object.keys(playerList).length : 0;

  return (
    <div className="flex flex-col">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Player List</h1>
            <p className="text-sm text-muted-foreground">
              {searchQuery.trim()
                ? `${filteredCount} of ${totalCount} players`
                : `${totalCount} players total`}
            </p>
          </div>
          <div className="w-full md:max-w-xs">
            <Input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              startIcon={<Search className="h-4 w-4" />}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 flex-1">
        <PlayerListTable
          playerList={playerList}
          playerSummary={playerSummary}
          searchQuery={searchQuery}
        />
      </div>
    </div>
  );
}
