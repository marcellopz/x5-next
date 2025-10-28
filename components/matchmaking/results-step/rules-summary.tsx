"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Settings, Shield, Target } from "lucide-react";
import { useMatchmaking } from "../matchmaking-context";

export function RulesSummary() {
  const { selectedPlayers, config } = useMatchmaking();

  const hasPresetLanes =
    config.presetLanes.usePresetLanes &&
    Object.values(config.presetLanes.lanes).some(
      (lane) => lane.player1 || lane.player2
    );

  const hasAvoidRoles =
    config.avoidRoles.enabled &&
    config.avoidRoles.rules.filter((rule) => rule.playerId !== "").length > 0;

  const hasPlayerCombos =
    config.playerCombos.enabled &&
    config.playerCombos.combos.length > 0 &&
    config.playerCombos.combos[0].players.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Matchmaking Rules Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Selected Players */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">
            Selected Players ({selectedPlayers.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {selectedPlayers.map((player) => (
              <Badge
                key={player.account_id}
                variant="outline"
                className="text-xs"
              >
                {player.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Basic Configuration */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">
            Basic Configuration
          </h4>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">
              {config.matchOptions} Match Options
            </Badge>
            <Badge variant="secondary">Tolerance: {config.tolerance}</Badge>
          </div>
        </div>

        {/* Preset Lanes */}
        {hasPresetLanes && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Target className="h-4 w-4" />
              Preset Lanes
            </h4>
            <div className="space-y-1">
              {Object.entries(config.presetLanes.lanes).map(
                ([lane, players]) => {
                  if (!players.player1 && !players.player2) return null;

                  return (
                    <div key={lane} className="text-sm flex items-center gap-2">
                      <span className="font-medium capitalize w-16">
                        {lane}:
                      </span>
                      <div className="flex items-center gap-2">
                        {players.player1 && (
                          <Badge variant="outline" className="text-xs">
                            {players.player1.name}
                          </Badge>
                        )}
                        {players.player1 && players.player2 && (
                          <span className="text-muted-foreground">vs</span>
                        )}
                        {players.player2 && (
                          <Badge variant="outline" className="text-xs">
                            {players.player2.name}
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        )}

        {/* Avoid Roles */}
        {hasAvoidRoles && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Avoid Roles
            </h4>
            <div className="space-y-1">
              {config.avoidRoles.rules.map((rule, index) => {
                const player = selectedPlayers.find(
                  (p) => p.account_id === Number(rule.playerId)
                );
                if (!player) return null;

                return (
                  <div key={index} className="text-sm">
                    <Badge variant="outline" className="text-xs">
                      {player.name}
                    </Badge>
                    <span className="text-muted-foreground ml-2">
                      avoids {rule.lane}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Player Combos */}
        {hasPlayerCombos && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Team Combo
            </h4>
            <div className="flex flex-wrap gap-2">
              {config.playerCombos.combos[0].players.map((player) => (
                <Badge
                  key={player.account_id}
                  variant="outline"
                  className="text-xs"
                >
                  {player.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* No Advanced Rules */}
        {!hasPresetLanes && !hasAvoidRoles && !hasPlayerCombos && (
          <div className="text-sm text-muted-foreground italic">
            No advanced rules configured
          </div>
        )}
      </CardContent>
    </Card>
  );
}
