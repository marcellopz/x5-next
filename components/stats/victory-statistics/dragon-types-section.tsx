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
import { useTranslations } from "@/lib/i18n/locale-context";
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

const typeKeys = [
  "fire",
  "water",
  "air",
  "earth",
  "hextech",
  "chemtech",
] as const;

const rowKeys = [
  { key: "first" as const, labelKey: "firstOfType" },
  { key: "any" as const, labelKey: "anyOfType" },
  { key: "multiple" as const, labelKey: "multipleOfType" },
];

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
  const t = useTranslations();
  const typeLabels: Record<keyof VictoryStatistics["dragons"]["types"], string> =
    {
      fire: t("stats.victory.infernal"),
      water: t("stats.victory.ocean"),
      air: t("stats.victory.cloud"),
      earth: t("stats.victory.mountain"),
      hextech: t("stats.victory.hextech"),
      chemtech: t("stats.victory.chemtech"),
    };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">
        {t("stats.victory.dragonTypesPerformance")}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {typeKeys.map((typeKey) => (
          <Card key={typeKey}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <span className="p-2 rounded-full bg-muted border border-border">
                  {dragonIcons[typeKey] ?? null}
                </span>
                <span>
                  {typeLabels[typeKey]} {t("stats.victory.dragon")}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("stats.victory.condition")}</TableHead>
                    <TableHead className="text-center">
                      {t("common.wins")}
                    </TableHead>
                    <TableHead className="text-center">
                      {t("common.games")}
                    </TableHead>
                    <TableHead className="text-center">
                      {t("stats.victory.winRate")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rowKeys.map((row) => {
                    const entry = types[typeKey][row.key];
                    return (
                      <TableRow key={row.key}>
                        <TableCell>
                          {t(`stats.victory.${row.labelKey}`)}
                        </TableCell>
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
