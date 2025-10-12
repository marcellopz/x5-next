"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { GameDurationHistogram } from "@/lib/types";
import { chartTheme } from "./chart-theme";

interface GameDurationChartProps {
  data: GameDurationHistogram;
}

export function GameDurationChart({ data }: GameDurationChartProps) {
  // Transform data for recharts and sort by duration
  const chartData = Object.entries(data)
    .map(([range, games]) => {
      // Extract the start of the range for sorting
      const start = parseInt(range.split("-")[0]);
      return {
        range: range,
        rangeWithUnit: `${range} min`,
        games,
        sortKey: start,
      };
    })
    .sort((a, b) => a.sortKey - b.sortKey);

  return (
    <Card className="flex flex-col h-[350px]">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Game duration distribution</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={chartTheme.grid}
              opacity={chartTheme.gridOpacity}
            />
            <XAxis
              dataKey="range"
              tick={{ fill: chartTheme.text, fontSize: 12 }}
              tickLine={{ stroke: chartTheme.axis }}
              axisLine={{ stroke: chartTheme.axis }}
              interval={1}
            />
            <YAxis
              tick={{ fill: chartTheme.text, fontSize: 12 }}
              tickLine={{ stroke: chartTheme.axis }}
              axisLine={{ stroke: chartTheme.axis }}
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
              cursor={{
                fill: chartTheme.cursor,
                opacity: chartTheme.cursorOpacity,
              }}
              labelFormatter={(value) => {
                const item = chartData.find((d) => d.range === value);
                return item?.rangeWithUnit || value;
              }}
            />
            <Bar
              dataKey="games"
              fill={chartTheme.primary}
              radius={[6, 6, 0, 0]}
              maxBarSize={60}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
