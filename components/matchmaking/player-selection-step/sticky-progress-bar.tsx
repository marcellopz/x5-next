"use client";

import { Users } from "lucide-react";
import { useMatchmaking } from "../matchmaking-context";

export function StickyProgressBar() {
  const { selectedPlayers } = useMatchmaking();

  return (
    <div className="sticky top-16 z-15 bg-card border border-border rounded-lg px-6 py-3 shadow-sm mx-3 -mt-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">
            Selected:{" "}
            <span className="hidden sm:inline" key={selectedPlayers.length}>
              {selectedPlayers.length}/10 players
            </span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-24 sm:w-32 bg-muted rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                selectedPlayers.length > 10 ? "bg-destructive" : "bg-primary"
              }`}
              style={{
                width: `${Math.min((selectedPlayers.length / 10) * 100, 100)}%`,
              }}
            />
          </div>
          <span className="text-xs text-muted-foreground">
            {selectedPlayers.length}/10
          </span>
        </div>
      </div>
    </div>
  );
}
