"use client";

import { useMemo } from "react";
import {
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { chartTheme } from "@/components/home/activity-section/chart-theme";
import { buildGameScatterByRole } from "@/lib/build-game-scatter-by-role";
import { buildPlayerRankHistorySeries } from "@/lib/build-player-rank-history-series";
import type {
  InitialRankPlayer,
  MatchWithId,
  PlayerRankChanges,
  Role,
} from "@/lib/types";
import { useFormatDate, useTranslations } from "@/lib/i18n/locale-context";

const ROLES: Role[] = ["top", "jungle", "mid", "adc", "support"];

const ROLE_COLORS: Record<Role, string> = {
  top: "#ef4444",
  jungle: "#22c55e",
  mid: "#3b82f6",
  adc: "#eab308",
  support: "#a855f7",
};

const ROLE_LABEL_KEYS: Record<Role, string> = {
  top: "roles.top",
  jungle: "roles.jungle",
  mid: "roles.mid",
  adc: "roles.adc",
  support: "roles.support",
};

interface RankByRoleChartProps {
  initialRanks: InitialRankPlayer | null;
  rankChanges: PlayerRankChanges | null;
  matches: MatchWithId[];
  summonerId: string | number | undefined;
}

export function RankByRoleChart({
  initialRanks,
  rankChanges,
  matches,
  summonerId,
}: RankByRoleChartProps) {
  const t = useTranslations();
  const formatDate = useFormatDate();

  const data = useMemo(
    () => buildPlayerRankHistorySeries(initialRanks, rankChanges),
    [initialRanks, rankChanges]
  );

  const scatterByRole = useMemo(
    () =>
      buildGameScatterByRole(
        initialRanks,
        rankChanges,
        matches,
        summonerId
      ),
    [initialRanks, rankChanges, matches, summonerId]
  );

  const maxGameCount = useMemo(() => {
    const counts = ROLES.flatMap((r) =>
      scatterByRole[r].map((p) => p.count)
    );
    const m = counts.length > 0 ? Math.max(...counts) : 1;
    return Math.max(m, 2);
  }, [scatterByRole]);

  if (data.length === 0) {
    return (
      <div className="bg-background/30 border border-border rounded-lg h-[440px] w-full p-4 flex flex-col">
        <h3 className="text-sm font-semibold text-foreground mb-2">
          {t("playerStatsTab.rankByRoleTitle")}
        </h3>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground text-sm">
            {t("playerStatsTab.rankByRoleEmpty")}
          </p>
        </div>
      </div>
    );
  }

  const ranks = data.flatMap((row) => ROLES.map((role) => row[role]));
  const scatterY = ROLES.flatMap((r) => scatterByRole[r].map((p) => p.y));
  const allY = [...ranks, ...scatterY];
  const minR = Math.min(...allY);
  const maxR = Math.max(...allY);
  const pad = Math.max(1, Math.round((maxR - minR) * 0.08));
  const yDomain = [Math.max(0, minR - pad), maxR + pad] as [number, number];

  return (
    <div className="bg-background/30 border border-border rounded-lg h-[440px] w-full p-4 flex flex-col">
      <h3 className="text-sm font-semibold text-foreground mb-1">
        {t("playerStatsTab.rankByRoleTitle")}
      </h3>
      <p className="text-xs text-muted-foreground mb-2">
        {t("playerStatsTab.rankByRoleDescription")}
      </p>
      <p className="text-xs text-muted-foreground/80 mb-2">
        {t("playerStatsTab.rankByRoleGameDots")}
      </p>
      <div className="flex-1 min-h-0 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 8, right: 40, left: 4, bottom: 8 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={chartTheme.grid}
              opacity={chartTheme.gridOpacity}
            />
            <XAxis
              dataKey="ts"
              type="number"
              domain={["dataMin", "dataMax"]}
              scale="time"
              tick={{ fill: chartTheme.text, fontSize: 10 }}
              tickLine={{ stroke: chartTheme.axis }}
              axisLine={{ stroke: chartTheme.axis }}
              minTickGap={8}
              tickFormatter={(ts: number) =>
                formatDate(ts, { month: "short", day: "numeric" })
              }
            />
            <YAxis
              domain={yDomain}
              allowDecimals={false}
              tick={{ fill: chartTheme.text, fontSize: 12 }}
              tickLine={{ stroke: chartTheme.axis }}
              axisLine={{ stroke: chartTheme.axis }}
              width={36}
            />
            <ZAxis
              dataKey="count"
              type="number"
              domain={[1, maxGameCount]}
              range={[160, 900]}
            />
            <Legend
              wrapperStyle={{
                paddingTop: 12,
                fontSize: 12,
                color: chartTheme.text,
              }}
              formatter={(value) => t(ROLE_LABEL_KEYS[value as Role])}
            />
            {ROLES.map((role) => (
              <Line
                key={role}
                type="stepAfter"
                dataKey={role}
                name={role}
                stroke={ROLE_COLORS[role]}
                strokeWidth={2}
                dot={false}
                activeDot={false}
                connectNulls={false}
                isAnimationActive={false}
              />
            ))}
            {ROLES.map((role) => (
              <Scatter
                key={`${role}-games`}
                data={scatterByRole[role]}
                dataKey="y"
                name={role}
                zIndex={650}
                fill={ROLE_COLORS[role]}
                fillOpacity={0.88}
                stroke={ROLE_COLORS[role]}
                strokeWidth={1}
                strokeOpacity={0.9}
                legendType="none"
                isAnimationActive={false}
              />
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
