"use client";

import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X, Users } from "lucide-react";
import { useMatchmaking } from "../matchmaking-context";

interface PlayerCombosFormProps {
  enabled: boolean;
}

export function PlayerCombosForm({ enabled }: PlayerCombosFormProps) {
  const { selectedPlayers, config, setConfig } = useMatchmaking();

  // Get players that are NOT assigned in preset lanes
  const getAvailablePlayers = () => {
    const presetPlayerIds = new Set<string>();

    // Collect all players already assigned in preset lanes
    Object.values(config.presetLanes.lanes).forEach((lane) => {
      if (lane.player1) presetPlayerIds.add(lane.player1);
      if (lane.player2) presetPlayerIds.add(lane.player2);
    });

    return selectedPlayers.filter((p) => !presetPlayerIds.has(p.name_id));
  };

  const availablePlayers = getAvailablePlayers();

  // Get players already used in combos
  const getUsedPlayerIds = () => {
    const usedIds = new Set<string>();
    config.playerCombos.combos.forEach((combo) => {
      combo.players.forEach((player) => {
        usedIds.add(player);
      });
    });
    return usedIds;
  };

  const usedPlayerIds = getUsedPlayerIds();

  // Get players available for the combo (excluding those already in the combo)
  const getAvailablePlayersForCombo = () => {
    return availablePlayers.filter((player) => {
      // Include if not used in the combo
      return !usedPlayerIds.has(player.name_id);
    });
  };

  const addPlayerToCombo = (playerId: string) => {
    const player = availablePlayers.find((p) => p.name_id === playerId);
    if (!player) return;

    setConfig((prev) => ({
      ...prev,
      playerCombos: {
        ...prev.playerCombos,
        combos: prev.playerCombos.combos.map((combo) => ({
          ...combo,
          players: [...combo.players, player.name_id],
        })),
      },
    }));
  };

  const removePlayerFromCombo = (playerId: string) => {
    setConfig((prev) => ({
      ...prev,
      playerCombos: {
        ...prev.playerCombos,
        combos: prev.playerCombos.combos.map((combo) => ({
          ...combo,
          players: combo.players.filter((p) => p !== playerId),
        })),
      },
    }));
  };

  if (!enabled) return null;

  return (
    <div className="space-y-4">
      {config.playerCombos.combos.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Add players to create a team combo
        </p>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2 pt-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              Team Combo ({config.playerCombos.combos[0].players.length}/5)
            </span>
          </div>

          {/* Selected Players */}
          {config.playerCombos.combos[0].players.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {config.playerCombos.combos[0].players.map((player) => (
                <div
                  key={player}
                  className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded text-sm"
                >
                  <span>
                    {selectedPlayers.find((p) => p.name_id === player)?.name}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removePlayerFromCombo(player)}
                    className="h-4 w-4 p-0 hover:bg-primary/20"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Add Player Selector */}
          {config.playerCombos.combos[0].players.length < 5 && (
            <div className="flex items-center gap-2">
              <Select
                value=""
                onChange={(e) => {
                  if (e.target.value) {
                    addPlayerToCombo(e.target.value);
                  }
                }}
                className="flex-1"
              >
                <option value="">Add player...</option>
                {getAvailablePlayersForCombo().map((player) => (
                  <option key={player.name_id} value={player.name_id}>
                    {player.name}
                  </option>
                ))}
              </Select>
            </div>
          )}

          {config.playerCombos.combos[0].players.length >= 5 && (
            <p className="text-xs text-muted-foreground">
              Maximum 5 players per combo
            </p>
          )}
        </div>
      )}
    </div>
  );
}
