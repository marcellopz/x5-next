"use client";

import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { useMatchmaking } from "../matchmaking-context";
import type { Lane, AvoidRoleRule } from "../matchmaking-context";

interface AvoidRolesFormProps {
  enabled: boolean;
}

const laneOptions: { value: Lane; label: string }[] = [
  { value: "top", label: "Top" },
  { value: "jungle", label: "Jungle" },
  { value: "mid", label: "Mid" },
  { value: "adc", label: "ADC" },
  { value: "support", label: "Support" },
];

export function AvoidRolesForm({ enabled }: AvoidRolesFormProps) {
  const { selectedPlayers, config, setConfig } = useMatchmaking();

  // Get players that are NOT assigned in preset lanes
  const getAvailablePlayers = () => {
    const presetPlayerIds = new Set<string | number>();

    // Collect all players already assigned in preset lanes
    Object.values(config.presetLanes.lanes).forEach((lane) => {
      if (lane.player1) presetPlayerIds.add(lane.player1.account_id);
      if (lane.player2) presetPlayerIds.add(lane.player2.account_id);
    });

    return selectedPlayers.filter((p) => !presetPlayerIds.has(p.account_id));
  };

  const availablePlayers = getAvailablePlayers();

  const addRule = () => {
    setConfig((prev) => ({
      ...prev,
      avoidRoles: {
        ...prev.avoidRoles,
        rules: [...prev.avoidRoles.rules, { playerId: "", lane: "top" }],
      },
    }));
  };

  const removeRule = (index: number) => {
    setConfig((prev) => ({
      ...prev,
      avoidRoles: {
        ...prev.avoidRoles,
        rules: prev.avoidRoles.rules.filter((_, i) => i !== index),
      },
    }));
  };

  const updateRule = (
    index: number,
    field: keyof AvoidRoleRule,
    value: string | number
  ) => {
    setConfig((prev) => ({
      ...prev,
      avoidRoles: {
        ...prev.avoidRoles,
        rules: prev.avoidRoles.rules.map((rule, i) =>
          i === index ? { ...rule, [field]: value } : rule
        ),
      },
    }));
  };

  if (!enabled) return null;

  return (
    <div className="space-y-3">
      {config.avoidRoles.rules.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Click &quot;Add Rule&quot; to configure role avoidance
        </p>
      )}

      {config.avoidRoles.rules.map((rule, index) => (
        <div key={index} className="flex items-center gap-2">
          <Select
            value={rule.playerId}
            onChange={(e) => updateRule(index, "playerId", e.target.value)}
            className="flex-1"
          >
            <option value="">-</option>
            {availablePlayers.map((player) => (
              <option key={player.account_id} value={player.account_id}>
                {player.name}
              </option>
            ))}
          </Select>

          <span className="text-muted-foreground">avoids</span>

          <Select
            value={rule.lane}
            onChange={(e) => updateRule(index, "lane", e.target.value as Lane)}
            className="flex-1"
          >
            {laneOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => removeRule(index)}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}

      <Button type="button" variant="outline" size="sm" onClick={addRule}>
        <Plus className="h-4 w-4 mr-2" />
        Add Rule
      </Button>
    </div>
  );
}
