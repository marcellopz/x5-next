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
import type { ObjectiveStat } from "./utils";
import { formatWinRate } from "./utils";

interface ObjectiveTableProps {
  title: string;
  objectives: ObjectiveStat[];
}

export function ObjectiveTable({ title, objectives }: ObjectiveTableProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Objective</TableHead>
              <TableHead className="text-center">Wins</TableHead>
              <TableHead className="text-center">Games</TableHead>
              <TableHead className="text-center">Win Rate</TableHead>
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
