"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { PlayerInfo } from "@/lib/types";
import { chartTheme } from "@/components/home/activity-section/chart-theme";

interface WinRateLast20GamesChartProps {
  playerInfo: PlayerInfo;
}

export function WinRateLast20GamesChart({
  playerInfo,
}: WinRateLast20GamesChartProps) {
  const winsArray = playerInfo.winsArray ?? [];
  const totalGames = winsArray.length;

  // If no games, show empty state
  if (totalGames === 0) {
    return (
      <div className="bg-background/30 border border-border rounded-lg h-[240px] p-4 flex flex-col">
        <h3 className="text-sm font-semibold text-foreground mb-2">
          Win Rate (Last 20 Games)
        </h3>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground text-sm">
            No games data available
          </p>
        </div>
      </div>
    );
  }

  // Get the last 20 games (or all games if less than 20)
  const gamesToShow = Math.min(20, totalGames);
  const startIndex = totalGames - gamesToShow;

  // Calculate win rate for each game in the last 20
  // winsArray[i] contains cumulative wins after game (i+1)
  const chartData = Array.from({ length: gamesToShow }, (_, index) => {
    const actualGameIndex = startIndex + index;
    const gameNumber = actualGameIndex + 1; // Game numbers are 1-indexed
    const cumulativeWins = winsArray[actualGameIndex];
    const winRate = cumulativeWins / gameNumber;
    const gamesAgo = gamesToShow - index; // Number of games ago (20, 19, ..., 1)

    return {
      game: index + 1, // Relative game number (1-20) - kept for compatibility
      gamesAgo: gamesAgo,
      winRate: winRate,
      absoluteGame: gameNumber, // Absolute game number for tooltip
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

  // Format win rate as percentage for display
  const formatWinRate = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  return (
    <div className="bg-background/30 border border-border rounded-lg h-[220px] p-4 flex flex-col">
      <h3 className="text-sm font-semibold text-foreground mb-2">
        Win Rate (Last {gamesToShow} Games)
      </h3>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 5, right: 5, left: -10, bottom: -10 }}
          >
            <defs>
              <linearGradient id="colorWinRate" x1="0" y1="0" x2="0" y2="1">
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
            <XAxis
              dataKey="gamesAgo"
              tick={{ fill: chartTheme.text, fontSize: 12 }}
              tickLine={{ stroke: chartTheme.axis }}
              axisLine={{ stroke: chartTheme.axis }}
              minTickGap={5}
              tickFormatter={(value) => value.toString()}
            />
            <YAxis
              domain={[yAxisMin, yAxisMax]}
              tick={{ fill: chartTheme.text, fontSize: 14 }}
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
              labelFormatter={(label, payload) => {
                if (payload && payload[0]?.payload?.gamesAgo) {
                  const gamesAgo = payload[0].payload.gamesAgo;
                  return `${gamesAgo} ${gamesAgo === 1 ? "game" : "games"} ago`;
                }
                return label;
              }}
            />
            <Area
              type="monotone"
              dataKey="winRate"
              stroke={chartTheme.primary}
              strokeWidth={2}
              fill="url(#colorWinRate)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
