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

export function DragonsOverview({ data }: DragonsOverviewProps) {
  const t = useTranslations();
  const countLabels: Record<string, string> = {
    one: t("stats.victory.dragonCountOne"),
    two: t("stats.victory.dragonCountTwo"),
    three: t("stats.victory.dragonCountThree"),
    four: t("stats.victory.dragonCountFour"),
  };

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
        <span>{t("stats.victory.exactCount")}</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="w-3 h-3 rounded-full bg-[#34d399]" />
        <span>{t("stats.victory.atLeast")}</span>
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
          {t("stats.victory.dragonControlOverview")}
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
                  name={t("stats.victory.exactCount")}
                  fill="#38bdf8"
                  radius={[6, 6, 0, 0]}
                  barSize={22}
                />
                <Bar
                  dataKey="atLeast"
                  name={t("stats.victory.atLeast")}
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
                  <TableHead>{t("stats.victory.dragonsSecured")}</TableHead>
                  <TableHead className="text-center">{t("stats.victory.exactWR")}</TableHead>
                  <TableHead className="text-center">{t("stats.victory.atLeastWR")}</TableHead>
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
            <p className="text-sm text-muted-foreground">{t("stats.victory.dragonSoul")}</p>
            <p className="text-2xl font-semibold mt-1">
              {formatWinRate(dragonSoul.winRate)}
            </p>
            <p className="text-xs text-muted-foreground">
              {t("stats.victory.winsOutOfGames").replace("{{wins}}", String(dragonSoul.wins)).replace("{{total}}", String(dragonSoul.total))}
            </p>
          </div>
          <div className="border border-border rounded-lg p-4 bg-muted/30">
            <p className="text-sm text-muted-foreground">{t("stats.victory.averageDragons")}</p>
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
              {t("stats.victory.weightedAverageAcrossGames")}
            </p>
          </div>
          <div className="border border-border rounded-lg p-4 bg-muted/30">
            <p className="text-sm text-muted-foreground">{t("stats.victory.highControl")}</p>
            <p className="text-2xl font-semibold mt-1">
              {formatWinRate(data.atLeast.three.winRate)}
            </p>
            <p className="text-xs text-muted-foreground">
              {t("stats.victory.winsInGames").replace("{{wins}}", String(data.atLeast.three.wins)).replace("{{total}}", String(data.atLeast.three.total))}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
