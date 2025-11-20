import React, { useMemo } from "react";
import MiniStatCard from "./MiniStatCard";
import { ROLE_META, RoleKey, RoleStat, TITLE_TO_API_MAPPING } from "./roleMeta";
import {
  LeaderboardEntry,
  RoleLeaderboardData,
  RoleLeaderboardStats,
} from "@/lib/types";

interface RoleStatsPaneProps {
  activeRole: RoleKey;
  roleLeaderboard?: RoleLeaderboardData | null;
}

export function RoleStatsPane({
  activeRole,
  roleLeaderboard,
}: RoleStatsPaneProps) {
  const roleStats = ROLE_META[activeRole].stats;

  // Transform role leaderboard data into RoleStat format
  const leaderboardStats: RoleStat[] = useMemo(() => {
    const roleData = roleLeaderboard?.[activeRole];

    // Map each stat from roleStats to actual data
    const stats: RoleStat[] = roleStats.map((stat) => {
      const mapping = TITLE_TO_API_MAPPING[stat.title];

      if (mapping && roleData?.[mapping.apiKey as keyof RoleLeaderboardStats]) {
        const entry = roleData[
          mapping.apiKey as keyof RoleLeaderboardStats
        ] as LeaderboardEntry;
        return {
          title: stat.title,
          value: entry.legend_name,
          description: mapping.format(entry.value),
        };
      }

      // Return stat with "-" if no data found
      return {
        title: stat.title,
        value: "-",
        description: "-",
      };
    });

    return stats;
  }, [activeRole, roleLeaderboard, roleStats]);

  return (
    <div className="flex min-w-0 h-full flex-col gap-2">
      <div className="flex gap-2 pb-2 mb-2 border-b border-primary/20">
        <h3 className="text-xl text-primary  ">
          {ROLE_META[activeRole].label} Stats
        </h3>
        <h4 className="text-sm text-muted-foreground opacity-80 flex flex-col justify-end">
          Stats based on the last 10 games
        </h4>
      </div>
      <div className="flex-1 grid grid-cols-2 gap-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 auto-rows-fr">
        {leaderboardStats.slice(0, 12).map((s, idx) => (
          <MiniStatCard
            key={idx}
            title={s.title}
            value={s.value}
            description={s.description}
          />
        ))}
      </div>
    </div>
  );
}

export default RoleStatsPane;
