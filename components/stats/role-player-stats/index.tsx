"use client";

import React from "react";
import { PlayersAverageRoleStats, Role, RoleStatKey } from "@/lib/types";
import { RolePlayerStatsTable } from "./table";
import { Select } from "@/components/ui/select";

const rolesOrder: Role[] = ["top", "jungle", "mid", "adc", "support"];
const roleOptions: Array<Role | "all"> = ["all", ...rolesOrder];
const roleLabels: Record<Role | "all", string> = {
  all: "All Roles",
  top: "Top Lane",
  jungle: "Jungle",
  mid: "Mid Lane",
  adc: "Bot Lane",
  support: "Support",
};

interface RolePlayerStatsProps {
  data: PlayersAverageRoleStats;
}

const formatStatLabel = (stat: string) =>
  stat
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Za-z])([0-9])/g, "$1 $2")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const formatStatValue = (key: RoleStatKey, value: number) => {
  if (key === "wins") {
    return `${(value * 100).toFixed(1)}%`;
  }

  if (value >= 100 || Number.isInteger(value)) {
    return value.toFixed(0);
  }

  return value.toFixed(2);
};

const getStatOptions = (data: PlayersAverageRoleStats): RoleStatKey[] => {
  const keys = new Set<RoleStatKey>();
  for (const role of rolesOrder) {
    const players = data[role];
    if (!players) continue;
    const firstPlayer = Object.values(players)[0];
    if (firstPlayer) {
      Object.keys(firstPlayer.averageStats).forEach((statKey) =>
        keys.add(statKey as RoleStatKey)
      );
    }
  }
  return Array.from(keys);
};

export function RolePlayerStats({ data }: RolePlayerStatsProps) {
  const statOptions = React.useMemo(() => getStatOptions(data), [data]);

  const [selectedRole, setSelectedRole] = React.useState<Role | "all">("all");
  const [selectedStat, setSelectedStat] = React.useState<RoleStatKey>(
    statOptions[0] ?? "wins"
  );

  React.useEffect(() => {
    if (!statOptions.includes(selectedStat) && statOptions.length > 0) {
      setSelectedStat(statOptions[0]);
    }
  }, [statOptions, selectedStat]);

  const rows = React.useMemo(() => {
    const playersByRole =
      selectedRole === "all"
        ? rolesOrder.flatMap((role) =>
            Object.values(data[role] ?? {}).map((player) => ({
              role,
              player,
            }))
          )
        : Object.values(data[selectedRole] ?? {}).map((player) => ({
            role: selectedRole,
            player,
          }));

    return playersByRole
      .map(({ role, player }) => {
        const value = player.averageStats[selectedStat];
        if (typeof value !== "number") return null;

        return {
          id: `${role}-${player.playerInfo.summonerId}`,
          summonerId: player.playerInfo.summonerId,
          name: player.playerInfo.gameName,
          tagLine: player.playerInfo.tagLine,
          numberOfGames: player.playerInfo.numberOfGames,
          rawValue: value,
          formattedValue: formatStatValue(selectedStat, value),
        };
      })
      .filter(Boolean)
      .sort((a, b) => (b?.rawValue ?? 0) - (a?.rawValue ?? 0)) as Array<{
      id: string;
      summonerId: string;
      name: string;
      tagLine?: string;
      numberOfGames: number;
      rawValue: number;
      formattedValue: string;
    }>;
  }, [data, selectedRole, selectedStat]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <div className="flex flex-col gap-1">
          <label
            htmlFor="role-select"
            className="text-sm text-muted-foreground"
          >
            Lane
          </label>
          <Select
            id="role-select"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as Role | "all")}
          >
            {roleOptions.map((role) => (
              <option key={role} value={role}>
                {roleLabels[role]}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="stat-select"
            className="text-sm text-muted-foreground"
          >
            Statistic
          </label>
          <Select
            id="stat-select"
            value={selectedStat}
            onChange={(e) => setSelectedStat(e.target.value as RoleStatKey)}
          >
            {statOptions.map((stat) => (
              <option key={stat} value={stat}>
                {formatStatLabel(stat)}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <RolePlayerStatsTable
        statLabel={formatStatLabel(selectedStat)}
        rows={rows}
      />
    </div>
  );
}
