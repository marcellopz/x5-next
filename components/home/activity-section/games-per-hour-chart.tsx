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
import { chartTheme } from "./chart-theme";

interface GamesPerHourChartProps {
  data: number[];
}

export function GamesPerHourChart({ data }: GamesPerHourChartProps) {
  // Transform data for recharts
  const chartData = data.map((games, hour) => ({
    hour: `${hour}:00`,
    games,
  }));

  return (
    <Card className="flex flex-col h-[350px]">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">
          Games played by hour of the day
        </CardTitle>
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
              dataKey="hour"
              tick={{ fill: chartTheme.text, fontSize: 12 }}
              tickLine={{ stroke: chartTheme.axis }}
              axisLine={{ stroke: chartTheme.axis }}
              interval={2}
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
