"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { TeamSideStats } from "@/lib/types";

// Alias for consistency (TeamSideStats now includes all fields)
export type ExtendedTeamSideStats = TeamSideStats;

interface StatsTableProps {
  title: string;
  stats: Array<{
    key: keyof ExtendedTeamSideStats;
    label: string;
  }>;
  redSide: ExtendedTeamSideStats;
  blueSide: ExtendedTeamSideStats;
}

export function StatsTable({
  title,
  stats,
  redSide,
  blueSide,
}: StatsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Stat</TableHead>
              <TableHead className="text-center text-blue-400!">
                Blue Side
              </TableHead>
              <TableHead className="text-center text-red-400">
                Red Side
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stats.map(({ key, label }) => {
              const redValue = (redSide[key] as number) ?? 0;
              const blueValue = (blueSide[key] as number) ?? 0;
              const total = redValue + blueValue;
              const redPercentage =
                total > 0 ? ((redValue / total) * 100).toFixed(1) : "0.0";
              const bluePercentage =
                total > 0 ? ((blueValue / total) * 100).toFixed(1) : "0.0";

              return (
                <TableRow key={key}>
                  <TableCell className="font-medium">{label}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-blue-400 font-semibold">
                        {blueValue}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {bluePercentage}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-red-400 font-semibold">
                        {redValue}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {redPercentage}%
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
