"use client";

import { type ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { VictoryStatistics } from "@/lib/types";
import { formatWinRate } from "./utils";
import {
  Flame,
  Droplets,
  Wind,
  Mountain,
  CircuitBoard,
  Biohazard,
} from "lucide-react";

interface DragonTypesSectionProps {
  types: VictoryStatistics["dragons"]["types"];
}

const typeLabels: Record<keyof VictoryStatistics["dragons"]["types"], string> =
  {
    fire: "Infernal",
    water: "Ocean",
    air: "Cloud",
    earth: "Mountain",
    hextech: "Hextech",
    chemtech: "Chemtech",
  };

const rows = [
  { key: "first", label: "First of type" },
  { key: "any", label: "Any of type" },
  { key: "multiple", label: "2+ of type" },
] as const;

const dragonIcons: Record<
  keyof VictoryStatistics["dragons"]["types"],
  ReactNode
> = {
  fire: <Flame className="h-4 w-4 text-orange-400" />,
  water: <Droplets className="h-4 w-4 text-sky-400" />,
  air: <Wind className="h-4 w-4 text-cyan-400" />,
  earth: <Mountain className="h-4 w-4 text-amber-500" />,
  hextech: <CircuitBoard className="h-4 w-4 text-emerald-400" />,
  chemtech: <Biohazard className="h-4 w-4 text-lime-500" />,
};

export function DragonTypesSection({ types }: DragonTypesSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Dragon Types Performance</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {(
          Object.keys(types) as Array<
            keyof VictoryStatistics["dragons"]["types"]
          >
        ).map((typeKey) => (
          <Card key={typeKey}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <span className="p-2 rounded-full bg-muted border border-border">
                  {dragonIcons[typeKey] ?? null}
                </span>
                <span>{typeLabels[typeKey]} Dragon</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Condition</TableHead>
                    <TableHead className="text-center">Wins</TableHead>
                    <TableHead className="text-center">Games</TableHead>
                    <TableHead className="text-center">Win Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row) => {
                    const entry = types[typeKey][row.key];
                    return (
                      <TableRow key={row.key}>
                        <TableCell>{row.label}</TableCell>
                        <TableCell className="text-center">
                          {entry.wins}
                        </TableCell>
                        <TableCell className="text-center">
                          {entry.total}
                        </TableCell>
                        <TableCell className="text-center text-primary">
                          {formatWinRate(entry.winRate)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
