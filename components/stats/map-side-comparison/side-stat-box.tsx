"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { chartTheme } from "@/components/home/activity-section/chart-theme";

interface SideStatBoxProps {
  title: string;
  redSideStat: number;
  blueSideStat: number;
}

// Colors matching the theme (red-400 and blue-400 with appropriate opacity)
const RED_COLOR = "#f87171"; // red-400
const BLUE_COLOR = "#60a5fa"; // blue-400

export function SideStatBox({
  title,
  redSideStat,
  blueSideStat,
}: SideStatBoxProps) {
  const total = redSideStat + blueSideStat;

  // Prepare data for pie chart
  const data = [
    { name: "Red Side", value: redSideStat, color: RED_COLOR },
    { name: "Blue Side", value: blueSideStat, color: BLUE_COLOR },
  ].filter((item) => item.value > 0); // Only show if value > 0

  // Custom tooltip
  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{
      name: string;
      value: number;
      color: string;
    }>;
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage =
        total > 0 ? ((data.value / total) * 100).toFixed(1) : "0.0";
      return (
        <div
          style={{
            backgroundColor: chartTheme.tooltip.background,
            border: `1px solid ${chartTheme.tooltip.border}`,
            borderRadius: "8px",
            padding: "8px 12px",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
          }}
        >
          <p style={{ color: chartTheme.tooltip.text, fontWeight: 600 }}>
            {data.name}
          </p>
          <p style={{ color: chartTheme.tooltip.label }}>
            {data.value} ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-4!">
        {total === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No data available
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative w-full h-32 xl:h-42">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 0, right: 0, bottom: -5, left: 0 }}>
                  <Tooltip content={<CustomTooltip />} />
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius="65%"
                    outerRadius="90%"
                    paddingAngle={2}
                    dataKey="value"
                    stroke={chartTheme.tooltip.background}
                    strokeWidth={2}
                    cornerRadius={5}
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: RED_COLOR }}
                  />
                  <span className="text-sm font-semibold text-red-400">
                    {redSideStat}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: BLUE_COLOR }}
                  />
                  <span className="text-sm font-semibold text-blue-400">
                    {blueSideStat}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
