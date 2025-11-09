"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import type { PlayerInfo } from "@/lib/types";
import { chartTheme } from "@/components/home/activity-section/chart-theme";

const roles = ["top", "jungle", "mid", "adc", "support"];
const roleColors = [
  "#D4A853", // hsl(42, 60%, 52%) - primary/gold
  "#8B7355", // hsl(42, 38%, 32%) - brown
  "#B4BDD3", // hsl(215, 20%, 70%) - light blue-gray
  "#E5E9F0", // hsl(210, 40%, 93%) - very light blue-gray
  "#6B7A99", // hsl(215, 20%, 50%) - medium blue-gray
];

const roleLabels: Record<string, string> = {
  top: "Top",
  jungle: "Jungle",
  mid: "Mid",
  adc: "ADC",
  support: "Support",
};

interface RoleDistributionChartProps {
  playerInfo: PlayerInfo;
}

export function RoleDistributionChart({
  playerInfo,
}: RoleDistributionChartProps) {
  // Prepare data for pie chart
  const roleData = roles
    .map((role, index) => {
      const roleMatch = playerInfo.roleMatches?.[role] ?? {
        games: 0,
        wins: 0,
      };
      return {
        name: roleLabels[role] || role,
        value: roleMatch.games,
        color: roleColors[index],
      };
    })
    .filter((item) => item.value > 0) // Only show roles with games
    .sort((a, b) => b.value - a.value); // Sort in descending order by value

  return (
    <div className="bg-background/30 border border-border rounded-lg p-4 flex flex-col">
      <h3 className="text-sm font-semibold text-foreground mb-2">
        Role Distribution
      </h3>
      <div className="flex items-center flex-1 gap-6">
        {/* Pie Chart */}
        <div className="shrink-0" style={{ width: "112px", height: "114px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
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
              />
              <Pie
                data={roleData}
                cx="50%"
                cy="50%"
                innerRadius={35}
                outerRadius={50}
                paddingAngle={5}
                dataKey="value"
                stroke="#181D27"
                strokeWidth={2}
                cornerRadius={4}
              >
                {roleData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* Legend */}
        <div className="flex-1 flex flex-col justify-center gap-0.5">
          {roleData.map((item) => (
            <div key={item.name} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-foreground">{item.name}</span>
              <span className="text-muted-foreground ml-auto">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
