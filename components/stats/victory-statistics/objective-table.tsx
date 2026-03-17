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
import type { ObjectiveStat } from "./utils";
import { formatWinRate } from "./utils";

interface ObjectiveTableProps {
  title: string;
  objectives: ObjectiveStat[];
}

export function ObjectiveTable({ title, objectives }: ObjectiveTableProps) {
  const t = useTranslations();
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("stats.victory.objective")}</TableHead>
              <TableHead className="text-center">{t("common.wins")}</TableHead>
              <TableHead className="text-center">{t("common.games")}</TableHead>
              <TableHead className="text-center">{t("stats.victory.winRate")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {objectives.map((objective) => (
              <TableRow key={objective.label}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{objective.label}</span>
                    {objective.description && (
                      <span className="text-xs text-muted-foreground">
                        {objective.description}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  {objective.entry.wins}
                </TableCell>
                <TableCell className="text-center">
                  {objective.entry.total}
                </TableCell>
                <TableCell className="text-center font-semibold text-primary">
                  {formatWinRate(objective.entry.winRate)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
