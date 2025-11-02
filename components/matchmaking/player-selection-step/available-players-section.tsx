"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CompactPlayerCard } from "@/components/ui/player-card/compact-player-card";
import { Plus, Search, Users, Grid3X3, Table as TableIcon } from "lucide-react";
import { useMatchmaking } from "../matchmaking-context";
import { WildcardDialog } from "./wildcard-dialog";
import { PlayersTable } from "./players-table";

export function AvailablePlayersSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [wildcardOpen, setWildcardOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  useEffect(() => {
    const updateViewMode = () => {
      if (window.innerWidth < 1024) {
        setViewMode("table");
      } else {
        setViewMode("cards");
      }
    };

    // Set initial view mode
    updateViewMode();

    // Listen for resize events
    window.addEventListener("resize", updateViewMode);
    return () => window.removeEventListener("resize", updateViewMode);
  }, []);
  const { players, selectedPlayers, addPlayer, removePlayer } =
    useMatchmaking();

  const handleTableSelectionChange = (newSelection: Set<string | number>) => {
    // Convert Set back to player objects
    const newSelectedPlayers = players.filter((player) =>
      newSelection.has(player.account_id)
    );

    // Clear current selection and add new ones
    selectedPlayers.forEach((player) => removePlayer(player));
    newSelectedPlayers.forEach((player) => addPlayer(player));
  };

  const isPlayerFiltered = (player: (typeof players)[0]) => {
    return !player.name.toLowerCase().includes(searchTerm.toLowerCase());
  };

  const filteredPlayers = players.filter((player) => !isPlayerFiltered(player));

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <CardTitle>Available Players</CardTitle>
            <CardDescription>
              Click on a player card to add them to the match
            </CardDescription>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="xs"
              className="h-8 pr-3"
              onClick={() => setWildcardOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Wildcard
            </Button>
            <div className="flex gap-1">
              <Button
                variant={viewMode === "cards" ? "default" : "outline"}
                size="xs"
                className="h-8 px-2"
                onClick={() => setViewMode("cards")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                size="xs"
                className="h-8 px-2"
                onClick={() => setViewMode("table")}
              >
                <TableIcon className="h-4 w-4" />
              </Button>
            </div>
            <Input
              placeholder="Search players..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
              startIcon={<Search className="h-4 w-4" />}
              compact
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {players.length > 0 ? (
          viewMode === "cards" ? (
            <>
              <div
                className="grid gap-6 justify-items-center mt-4"
                style={{
                  gridTemplateColumns:
                    "repeat(auto-fill, minmax(188px, 188px))",
                  justifyContent: "center",
                }}
              >
                {players.map((player) => {
                  const isSelected = selectedPlayers.some(
                    (selected) => selected.account_id === player.account_id
                  );
                  const isFiltered = isPlayerFiltered(player);

                  return (
                    <CompactPlayerCard
                      key={player.account_id}
                      player={player}
                      selected={isSelected}
                      onClick={() =>
                        isSelected ? removePlayer(player) : addPlayer(player)
                      }
                      style={{ display: isFiltered ? "none" : undefined }}
                    />
                  );
                })}
              </div>
              {filteredPlayers.length === 0 && searchTerm && (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    No players found matching your criteria
                  </p>
                </div>
              )}
            </>
          ) : (
            <PlayersTable
              players={filteredPlayers}
              selectedPlayers={selectedPlayers}
              onSelectionChange={handleTableSelectionChange}
            />
          )
        ) : (
          <div className="text-center py-8">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              No available players to select
            </p>
          </div>
        )}
      </CardContent>
      <WildcardDialog open={wildcardOpen} onOpenChange={setWildcardOpen} />
    </Card>
  );
}
