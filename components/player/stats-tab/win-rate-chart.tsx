"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { chartTheme } from "@/components/home/activity-section/chart-theme";

interface WinRateChartProps {
  winsArray: number[] | undefined;
}

function formatWinRate(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

export function WinRateChart({ winsArray }: WinRateChartProps) {
  if (!winsArray || winsArray.length === 0) {
    return (
      <div className="bg-background/30 border border-border rounded-lg h-[400px] p-4 flex flex-col">
        <h3 className="text-sm font-semibold text-foreground mb-2">
          Win Rate Graph
        </h3>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground text-sm">
            No games data available
          </p>
        </div>
      </div>
    );
  }

  // Calculate win rate for each game
  // winsArray[i] contains cumulative wins after game (i+1)
  const chartData = winsArray.map((cumulativeWins, index) => {
    const gameNumber = index + 1; // Game numbers are 1-indexed
    const winRate = cumulativeWins / gameNumber;

    return {
      game: gameNumber,
      winRate: winRate,
    };
  });

  // Calculate min and max win rates for Y-axis domain
  const winRates = chartData.map((d) => d.winRate);
  const minWinRate = Math.min(...winRates);
  const maxWinRate = Math.max(...winRates);
  const range = maxWinRate - minWinRate;
  const padding = Math.max(range * 0.02, 0.01); // 2% padding or minimum 1%

  const yAxisMin = Math.max(0, minWinRate - padding);
  const yAxisMax = Math.min(1, maxWinRate + padding);

  return (
    <div className="bg-background/30 border border-border rounded-lg h-[400px] p-4 flex flex-col">
      <h3 className="text-sm font-semibold text-foreground mb-2">
        Win Rate Graph
      </h3>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
          >
            <defs>
              <linearGradient
                id="colorWinRateStats"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor={chartTheme.primary}
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor={chartTheme.primary}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={chartTheme.grid}
              opacity={chartTheme.gridOpacity}
            />
            <XAxis
              dataKey="game"
              tick={{ fill: chartTheme.text, fontSize: 12 }}
              tickLine={{ stroke: chartTheme.axis }}
              axisLine={{ stroke: chartTheme.axis }}
              minTickGap={20}
            />
            <YAxis
              domain={[yAxisMin, yAxisMax]}
              tick={{ fill: chartTheme.text, fontSize: 12 }}
              tickLine={{ stroke: chartTheme.axis }}
              axisLine={{ stroke: chartTheme.axis }}
              tickFormatter={formatWinRate}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: chartTheme.tooltip.background,
                border: `1px solid ${chartTheme.tooltip.border}`,
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
              labelStyle={{
                color: chartTheme.tooltip.text,
                fontWeight: 600,
              }}
              itemStyle={{ color: chartTheme.tooltip.label }}
              formatter={(value: number) => formatWinRate(value)}
              labelFormatter={(label) => `Game ${label}`}
            />
            <Area
              type="monotone"
              dataKey="winRate"
              stroke={chartTheme.primary}
              strokeWidth={2}
              fill="url(#colorWinRateStats)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
