"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, X } from "lucide-react";
import { useMatchmaking } from "../matchmaking-context";

export function SelectedPlayersSection() {
  const { selectedPlayers, removePlayer } = useMatchmaking();

  // Separate regular and wildcard players
  const regularPlayers = selectedPlayers.filter((p) => !p.isWildcard);
  const wildcardPlayers = selectedPlayers.filter((p) => p.isWildcard);

  return (
    <Card className="z-20 relative">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-4 w-4" />
              Selected Players ({selectedPlayers.length} / 10)
            </CardTitle>
            <CardDescription className="text-sm">
              Players who will participate in the match
            </CardDescription>
          </div>

          {/* Progress Bar */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-24 sm:w-32 bg-muted rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  selectedPlayers.length > 10 ? "bg-destructive" : "bg-primary"
                }`}
                style={{
                  width: `${Math.min(
                    (selectedPlayers.length / 10) * 100,
                    100
                  )}%`,
                }}
              />
            </div>
            <span className="text-xs text-muted-foreground">
              {selectedPlayers.length}/10
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {selectedPlayers.length > 0 ? (
          <div className="space-y-3">
            {/* Regular Players */}
            {regularPlayers.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {regularPlayers.map((player) => (
                  <Badge
                    key={player.account_id}
                    variant="secondary"
                    className="flex items-center gap-2 px-2 py-2"
                  >
                    {player.name}
                    <button
                      onClick={() => removePlayer(player)}
                      className="h-4 w-4 p-0 cursor-pointer rounded-full bg-white/10 text-muted-foreground hover:bg-white/15 flex items-center justify-center transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Wildcard Players */}
            {wildcardPlayers.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {wildcardPlayers.map((player) => (
                  <div
                    key={player.account_id}
                    className="flex flex-col gap-1 p-3 rounded-lg border border-border bg-card"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{player.name}</span>
                      <button
                        onClick={() => removePlayer(player)}
                        className="h-3 w-3 p-0 cursor-pointer rounded-full bg-white/10 text-muted-foreground hover:bg-white/15 flex items-center justify-center transition-colors"
                      >
                        <X className="h-2 w-2" />
                      </button>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-0.5">
                      <div className="flex gap-1">
                        <span>T: {player.top}</span>
                        <span className="text-border">|</span>
                        <span>J: {player.jungle}</span>
                      </div>
                      <div className="flex gap-1">
                        <span>M: {player.mid}</span>
                        <span className="text-border">|</span>
                        <span>A: {player.adc}</span>
                      </div>
                      <div>
                        <span>S: {player.support}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-1 mt-[6px]">
            <p className="text-muted-foreground text-sm">
              No players selected yet. Click on player cards below to add them.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
