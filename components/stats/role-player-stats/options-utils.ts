import { PlayersAverageRoleStats, Role, RoleStatKey } from "@/lib/types";
import { statLabels, statCategories } from "./stat-config";

const rolesOrder: Role[] = ["top", "jungle", "mid", "adc", "support"];

// Stats that should be formatted as percentages (0-1 range converted to 0-100%)
export const percentageStats: RoleStatKey[] = [
  "wins",
  "killParticipation",
  "damageShare",
  "earlyGameKP",
  "firstBlood",
  "firstBloodKill",
  "firstBloodAssist",
  "firstTowerKill",
  "firstTowerAssist",
  "objectiveControlRate",
];

export const formatStatLabel = (stat: RoleStatKey): string => {
  return statLabels[stat] || stat;
};

export const formatStatValue = (key: RoleStatKey, value: number): string => {
  if (percentageStats.includes(key)) {
    return `${(value * 100).toFixed(1)}%`;
  }

  if (value >= 100 || Number.isInteger(value)) {
    return value.toFixed(0);
  }

  return value.toFixed(2);
};

export const getStatOptions = (
  data: PlayersAverageRoleStats
): RoleStatKey[] => {
  const keys = new Set<RoleStatKey>();

  // Check all role data
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

  // Also check the "all" data if available
  if (data.all) {
    const firstPlayer = Object.values(data.all)[0];
    if (firstPlayer) {
      Object.keys(firstPlayer.averageStats).forEach((statKey) =>
        keys.add(statKey as RoleStatKey)
      );
    }
  }

  return Array.from(keys);
};

export const getStatGroups = (
  availableStats: RoleStatKey[]
): Array<{
  label: string;
  options: Array<{ value: string; label: string }>;
}> => {
  const groups = statCategories
    .map((category) => {
      const categoryStats = category.stats.filter((stat) =>
        availableStats.includes(stat)
      );

      if (categoryStats.length === 0) return null;

      return {
        label: category.label,
        options: categoryStats.map((stat) => ({
          value: stat as string,
          label: statLabels[stat],
        })),
      };
    })
    .filter((group) => group !== null);

  return groups as Array<{
    label: string;
    options: Array<{ value: string; label: string }>;
  }>;
};
