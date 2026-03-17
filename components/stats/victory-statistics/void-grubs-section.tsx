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
import { useTranslations } from "@/lib/i18n/locale-context";
import type { VictoryStatistics } from "@/lib/types";
import { formatWinRate, getLosses } from "./utils";
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

interface VoidGrubsSectionProps {
  data: VictoryStatistics["voidGrubs"];
}

const grubOrder = ["one", "two", "three"] as const;

type VoidGrubRow = {
  label: string;
  wins: number;
  total: number;
  winRate: number;
};

const buildRows = (
  entries: Record<string, VictoryStatistics["voidGrubs"]["exact"]["one"]>,
  labelMap: Record<string, string>,
  atLeastLabelMap: Record<string, string>,
  isAtLeast = false
): VoidGrubRow[] =>
  grubOrder
    .filter((key) => Boolean(entries[key]))
    .map((key) => {
      const entry = entries[key]!;
      return {
        label: isAtLeast ? atLeastLabelMap[key] : labelMap[key],
        wins: entry.wins,
        total: entry.total,
        winRate: entry.winRate,
      };
    });

export function VoidGrubsSection({ data }: VoidGrubsSectionProps) {
  const t = useTranslations();
  const tableHeaders = [
    t("stats.victory.label"),
    t("common.wins"),
    t("common.games"),
    t("stats.victory.winRate"),
  ];
  const labelMap: Record<string, string> = {
    one: t("stats.victory.grubOne"),
    two: t("stats.victory.grubTwo"),
    three: t("stats.victory.grubThree"),
  };
  const atLeastLabelMap: Record<string, string> = {
    one: t("stats.victory.grubOnePlus"),
    two: t("stats.victory.grubTwoPlus"),
    three: t("stats.victory.grubThreePlus"),
  };

  const exactRows = buildRows(data.exact, labelMap, atLeastLabelMap);
  const atLeastRows = buildRows(data.atLeast, labelMap, atLeastLabelMap, true);

  const chartData = [
    {
      label: t("stats.victory.exact1"),
      wins: data.exact.one.wins,
      losses: getLosses(data.exact.one),
    },
    {
      label: t("stats.victory.exact2"),
      wins: data.exact.two.wins,
      losses: getLosses(data.exact.two),
    },
    {
      label: t("stats.victory.exact3"),
      wins: data.exact.three.wins,
      losses: getLosses(data.exact.three),
    },
    {
      label: t("stats.victory.atLeast1"),
      wins: data.atLeast.one.wins,
      losses: getLosses(data.atLeast.one),
    },
    {
      label: t("stats.victory.atLeast2"),
      wins: data.atLeast.two.wins,
      losses: getLosses(data.atLeast.two),
    },
    {
      label: t("stats.victory.atLeast3"),
      wins: data.atLeast.three.wins,
      losses: getLosses(data.atLeast.three),
    },
  ];

  const renderTable = (title: string, rows: VoidGrubRow[]) => (
    <div>
      <p className="text-sm font-semibold mb-2">{title}</p>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              {tableHeaders.map((header) => (
                <TableHead key={header}>{header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.label}>
                <TableCell>{row.label}</TableCell>
                <TableCell>{row.wins}</TableCell>
                <TableCell>{row.total}</TableCell>
                <TableCell className="text-primary">
                  {formatWinRate(row.winRate)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );

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
              {entry.name}: {entry.value}
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
          {t("stats.victory.voidGrubsImpact")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {renderTable(t("stats.victory.exactNumberSecured"), exactRows)}
          {renderTable(t("stats.victory.atLeastThisManySecured"), atLeastRows)}
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -30, bottom: 0 }}
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
              <Legend
                formatter={(value) => (
                  <span className="text-xs text-muted-foreground capitalize">
                    {value}
                  </span>
                )}
              />
              <Bar
                dataKey="losses"
                fill="#f87171"
                radius={[6, 6, 0, 0]}
                barSize={40}
              />
              <Bar
                dataKey="wins"
                fill="#60a5fa"
                radius={[6, 6, 0, 0]}
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
