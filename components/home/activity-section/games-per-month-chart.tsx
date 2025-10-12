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
import { GamesPerMonth } from "@/lib/types";
import { chartTheme } from "./chart-theme";

interface GamesPerMonthChartProps {
  data: GamesPerMonth;
}

export function GamesPerMonthChart({ data }: GamesPerMonthChartProps) {
  // Transform data for recharts
  const chartData = Object.entries(data)
    .map(([month, games]) => {
      // Parse yyyy-mm format and create date properly
      const [year, monthNum] = month.split("-");
      const date = new Date(parseInt(year), parseInt(monthNum) - 1); // monthNum - 1 because JS months are 0-indexed

      return {
        monthKey: month, // Keep original for sorting
        month: date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
        games,
      };
    })
    .sort((a, b) => a.monthKey.localeCompare(b.monthKey));

  return (
    <Card className="flex flex-col h-[350px]">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Games played per month</CardTitle>
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
              dataKey="month"
              tick={{ fill: chartTheme.text, fontSize: 12 }}
              tickLine={{ stroke: chartTheme.axis }}
              axisLine={{ stroke: chartTheme.axis }}
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
