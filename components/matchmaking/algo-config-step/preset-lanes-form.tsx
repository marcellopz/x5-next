"use client";

import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useMatchmaking } from "../matchmaking-context";
import type { Lane } from "../matchmaking-context";

interface PresetLanesFormProps {
  enabled: boolean;
}

const laneLabels: Record<Lane, string> = {
  top: "Top",
  jungle: "Jungle",
  mid: "Mid",
  adc: "ADC",
  support: "Sup",
};

export function PresetLanesForm({ enabled }: PresetLanesFormProps) {
  const { selectedPlayers, config, updatePresetLane, updatePresetLanesConfig } =
    useMatchmaking();

  // Get available players for a specific lane and side
  const getAvailablePlayers = (currentLane: Lane) => {
    const usedPlayerIds = new Set<string | number>();

    // Collect all players already assigned in OTHER lanes (not the current one)
    (Object.keys(config.presetLanes.lanes) as Lane[]).forEach((lane) => {
      if (lane !== currentLane) {
        if (config.presetLanes.lanes[lane].player1)
          usedPlayerIds.add(config.presetLanes.lanes[lane].player1!);
        if (config.presetLanes.lanes[lane].player2)
          usedPlayerIds.add(config.presetLanes.lanes[lane].player2!);
      }
    });

    return selectedPlayers.filter((p) => !usedPlayerIds.has(p.account_id));
  };

  const handlePlayerSelect = (
    lane: Lane,
    side: "player1" | "player2",
    playerNameId: string
  ) => {
    updatePresetLane(lane, side, playerNameId);
  };

  if (!enabled) return null;

  return (
    <div className="space-y-3">
      {(Object.keys(config.presetLanes.lanes) as Lane[]).map((lane) => {
        const availablePlayers = getAvailablePlayers(lane);

        return (
          <div key={lane} className="flex items-center gap-3">
            <p className="text-sm font-medium leading-none w-20">
              {laneLabels[lane]}:
            </p>
            <div className="flex items-center gap-2 flex-1">
              <Select
                value={config.presetLanes.lanes[lane].player1 || ""}
                onChange={(e) =>
                  handlePlayerSelect(lane, "player1", e.target.value)
                }
                className="flex-1"
              >
                <option value="">-</option>
                {availablePlayers.map((player) => (
                  <option key={player.name_id} value={player.name_id}>
                    {player.name}
                  </option>
                ))}
              </Select>
              <span className="text-muted-foreground">vs</span>
              <Select
                value={config.presetLanes.lanes[lane].player2 || ""}
                onChange={(e) =>
                  handlePlayerSelect(lane, "player2", e.target.value)
                }
                className="flex-1"
              >
                <option value="">-</option>
                {availablePlayers.map((player) => (
                  <option key={player.name_id} value={player.name_id}>
                    {player.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        );
      })}

      <div className="flex items-center gap-2 pt-2 border-t border-border">
        <Checkbox
          id="randomize-sides"
          checked={config.presetLanes.randomizeSides}
          onChange={(e) =>
            updatePresetLanesConfig({ randomizeSides: e.target.checked })
          }
        />
        <label
          htmlFor="randomize-sides"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Randomize sides
        </label>
      </div>
    </div>
  );
}
