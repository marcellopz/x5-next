"use client";

import { useMemo } from "react";
import {
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { chartTheme } from "@/components/home/activity-section/chart-theme";
import { buildPlayerRankHistorySeries } from "@/lib/build-player-rank-history-series";
import type {
  InitialRankPlayer,
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

// Distinct dash patterns so coinciding step lines still read as separate
// traces. Recharts' default Legend previews each pattern automatically.
const ROLE_DASH: Record<Role, string | undefined> = {
  top: undefined,
  jungle: "6 3",
  mid: "2 3",
  adc: "8 3 2 3",
  support: "1 3",
};

// Small role offsets to keep overlapping lines visually distinct while still
// preserving overall rank evolution readability.
const baseYOffset = 0.16;
const ROLE_Y_OFFSET: Record<Role, number> = {
  top: -baseYOffset,
  jungle: -baseYOffset / 2,
  mid: 0,
  adc: baseYOffset / 2,
  support: baseYOffset,
};

interface RankByRoleChartProps {
  initialRanks: InitialRankPlayer | null;
  rankChanges: PlayerRankChanges | null;
}

export function RankByRoleChart({
  initialRanks,
  rankChanges,
}: RankByRoleChartProps) {
  const t = useTranslations();
  const formatDate = useFormatDate();

  const data = useMemo(
    () => buildPlayerRankHistorySeries(initialRanks, rankChanges),
    [initialRanks, rankChanges]
  );

  const dataWithRoleOffsets = useMemo(
    () =>
      data.map((row) => ({
        ...row,
        top: row.top + ROLE_Y_OFFSET.top,
        jungle: row.jungle + ROLE_Y_OFFSET.jungle,
        mid: row.mid + ROLE_Y_OFFSET.mid,
        adc: row.adc + ROLE_Y_OFFSET.adc,
        support: row.support + ROLE_Y_OFFSET.support,
      })),
    [data]
  );

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

  const allY = dataWithRoleOffsets.flatMap((row) =>
    ROLES.map((role) => row[role])
  );
  const minR = Math.min(...allY);
  const maxR = Math.max(...allY);
  const pad = 0.3;
  const yDomain = [Math.max(0, minR - pad), maxR + pad] as [number, number];
  const tickStart = Math.ceil(yDomain[0]);
  const tickEnd = Math.ceil(yDomain[1]);
  const yTicks = Array.from(
    { length: Math.max(1, tickEnd - tickStart + 2) },
    (_, i) => tickStart + i
  );

  return (
    <div className="bg-background/30 border border-border rounded-lg h-[440px] w-full p-4 flex flex-col">
      <h3 className="text-sm font-semibold text-foreground mb-2">
        {t("playerStatsTab.rankByRoleTitle")}
      </h3>
      <div className="flex-1 min-h-0 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={dataWithRoleOffsets}
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
              ticks={yTicks}
              interval={0}
              tick={{ fill: chartTheme.text, fontSize: 12 }}
              tickLine={{ stroke: chartTheme.axis }}
              axisLine={{ stroke: chartTheme.axis }}
              width={36}
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
                strokeDasharray={ROLE_DASH[role]}
                dot={false}
                activeDot={false}
                connectNulls={false}
                isAnimationActive={false}
              />
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
