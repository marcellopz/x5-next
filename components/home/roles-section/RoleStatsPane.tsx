import React from "react";
import MiniStatCard from "./MiniStatCard";
import { ROLE_META, RoleKey, RoleStat } from "./roleMeta";

interface RoleStatsPaneProps {
  activeRole: RoleKey;
  miniStats?: Array<{ title: string; value: string | number }>;
}

export function RoleStatsPane({ activeRole, miniStats }: RoleStatsPaneProps) {
  const roleStats = ROLE_META[activeRole].stats;
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
        {((miniStats as RoleStat[] | undefined) ?? roleStats)
          .slice(0, 12)
          .map((s, idx) => (
            <MiniStatCard
              key={idx}
              title={s.title}
              value={s.value}
              description={(s as RoleStat).description}
            />
          ))}
      </div>
    </div>
  );
}

export default RoleStatsPane;
