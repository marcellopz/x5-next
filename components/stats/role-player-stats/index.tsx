"use client";

import React from "react";
import { PlayersAverageRoleStats, Role, RoleStatKey } from "@/lib/types";
import { RolePlayerStatsTable } from "./table";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { getStatDescription } from "./stat-config";
import {
  formatStatLabel,
  formatStatValue,
  getStatOptions,
  getStatGroups,
} from "./options-utils";

const roleOptions: Array<Role | "all"> = [
  "all",
  "top",
  "jungle",
  "mid",
  "adc",
  "support",
];
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

export function RolePlayerStats({ data }: RolePlayerStatsProps) {
  const statOptions = React.useMemo(() => getStatOptions(data), [data]);
  const statGroups = React.useMemo(
    () => getStatGroups(statOptions),
    [statOptions]
  );

  const [selectedRole, setSelectedRole] = React.useState<Role | "all">("all");
  const [selectedStat, setSelectedStat] = React.useState<RoleStatKey>(
    statOptions[0] ?? "wins"
  );
  const [filterMoreThanFive, setFilterMoreThanFive] = React.useState(true);

  React.useEffect(() => {
    if (!statOptions.includes(selectedStat) && statOptions.length > 0) {
      setSelectedStat(statOptions[0]);
    }
  }, [statOptions, selectedStat]);

  const rows = React.useMemo(() => {
    // Get players data based on selected role
    const playersData =
      selectedRole === "all" ? data.all ?? {} : data[selectedRole] ?? {};

    const players = Object.values(playersData);

    return players
      .filter((player) =>
        filterMoreThanFive ? player.playerInfo.numberOfGames > 5 : true
      )
      .map((player) => {
        const value = player.averageStats[selectedStat];
        if (typeof value !== "number") return null;

        return {
          id: `${selectedRole}-${player.playerInfo.summonerId}`,
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
  }, [data, selectedRole, selectedStat, filterMoreThanFive]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-end">
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
            groups={statGroups}
          />
        </div>

        <div className="flex items-center gap-2 mb-2.5">
          <Checkbox
            id="more-than-five-checkbox"
            checked={filterMoreThanFive}
            onChange={(e) => setFilterMoreThanFive(e.target.checked)}
          />
          <label
            htmlFor="more-than-five-checkbox"
            className="text-sm text-muted-foreground cursor-pointer select-none"
          >
            Filter for more than 5 games
          </label>
        </div>
      </div>

      <RolePlayerStatsTable
        statLabel={formatStatLabel(selectedStat)}
        statDescription={getStatDescription(selectedStat)}
        rows={rows}
      />
    </div>
  );
}
