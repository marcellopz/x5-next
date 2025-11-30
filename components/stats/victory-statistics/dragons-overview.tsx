"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { VictoryStatistics } from "@/lib/types";
import { formatWinRate } from "./utils";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { chartTheme } from "@/components/home/activity-section/chart-theme";

interface DragonsOverviewProps {
  data: VictoryStatistics["dragons"];
}

const countLabels: Record<string, string> = {
  one: "1 Dragon",
  two: "2 Dragons",
  three: "3 Dragons",
  four: "4+ Dragons",
};

export function DragonsOverview({ data }: DragonsOverviewProps) {
  const rows = Object.entries(countLabels).map(([key, label]) => ({
    label,
    exact: data.exact[key as keyof typeof data.exact],
    atLeast: data.atLeast[key as keyof typeof data.atLeast],
  }));

  const chartData = rows.map((row) => ({
    label: row.label,
    exact: row.exact.winRate ?? 0,
    atLeast: row.atLeast.winRate ?? 0,
  }));
  const CustomLegendContent = () => (
    <div className="flex items-center gap-4 text-xs text-muted-foreground w-full justify-center pl-6">
      <div className="flex items-center gap-1">
        <span className="w-3 h-3 rounded-full bg-[#38bdf8]" />
        <span>Exact count</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="w-3 h-3 rounded-full bg-[#34d399]" />
        <span>At least</span>
      </div>
    </div>
  );

  const dragonSoul = data.dragonSoul;

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{ name: string; value: number }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: chartTheme.tooltip.background,
            border: `1px solid ${chartTheme.tooltip.border}`,
            borderRadius: "8px",
            padding: "8px 12px",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.2)",
          }}
        >
          <p
            style={{
              color: chartTheme.tooltip.label,
              fontWeight: 600,
              marginBottom: "4px",
            }}
          >
            {label}
          </p>
          {payload.map((entry) => (
            <p
              key={entry.name}
              style={{ color: chartTheme.tooltip.text, fontSize: "0.85rem" }}
            >
              {entry.name}: {entry.value.toFixed(1)}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Dragon Control Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 10, left: -20, bottom: -10 }}
              >
                <CartesianGrid
                  stroke={chartTheme.grid}
                  strokeOpacity={chartTheme.gridOpacity}
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  tick={{ fill: chartTheme.text, fontSize: 12 }}
                  axisLine={{ stroke: chartTheme.axis, strokeOpacity: 0.3 }}
                  tickLine={{ stroke: chartTheme.axis, strokeOpacity: 0.3 }}
                />
                <YAxis
                  domain={[0, 100]}
                  tickFormatter={(v) => `${v}%`}
                  tick={{ fill: chartTheme.text, fontSize: 12 }}
                  axisLine={{ stroke: chartTheme.axis, strokeOpacity: 0.3 }}
                  tickLine={{ stroke: chartTheme.axis, strokeOpacity: 0.3 }}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{
                    fill: chartTheme.cursor,
                    opacity: chartTheme.cursorOpacity,
                  }}
                />
                <Legend content={<CustomLegendContent />} />
                <Bar
                  dataKey="exact"
                  name="Exact count"
                  fill="#38bdf8"
                  radius={[6, 6, 0, 0]}
                  barSize={22}
                />
                <Bar
                  dataKey="atLeast"
                  name="At least"
                  fill="#34d399"
                  radius={[6, 6, 0, 0]}
                  barSize={22}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dragons Secured</TableHead>
                  <TableHead className="text-center">Exact WR</TableHead>
                  <TableHead className="text-center">At Least WR</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.label}>
                    <TableCell className="font-medium">{row.label}</TableCell>
                    <TableCell className="text-center text-primary">
                      {formatWinRate(row.exact.winRate)}
                    </TableCell>
                    <TableCell className="text-center text-emerald-500">
                      {formatWinRate(row.atLeast.winRate)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="border border-border rounded-lg p-4 bg-muted/30">
            <p className="text-sm text-muted-foreground">Dragon Soul</p>
            <p className="text-2xl font-semibold mt-1">
              {formatWinRate(dragonSoul.winRate)}
            </p>
            <p className="text-xs text-muted-foreground">
              {dragonSoul.wins} wins out of {dragonSoul.total} games
            </p>
          </div>
          <div className="border border-border rounded-lg p-4 bg-muted/30">
            <p className="text-sm text-muted-foreground">Average Dragons</p>
            <p className="text-2xl font-semibold mt-1">
              {(
                (data.exact.one.total +
                  2 * data.exact.two.total +
                  3 * data.exact.three.total +
                  4 * data.exact.four.total) /
                Math.max(
                  data.exact.one.total +
                    data.exact.two.total +
                    data.exact.three.total +
                    data.exact.four.total,
                  1
                )
              ).toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground">
              Weighted average across all games
            </p>
          </div>
          <div className="border border-border rounded-lg p-4 bg-muted/30">
            <p className="text-sm text-muted-foreground">High Control (≥3)</p>
            <p className="text-2xl font-semibold mt-1">
              {formatWinRate(data.atLeast.three.winRate)}
            </p>
            <p className="text-xs text-muted-foreground">
              {data.atLeast.three.wins} wins in {data.atLeast.three.total} games
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
