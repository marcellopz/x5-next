"use client";

import { SideStatBox } from "@/components/stats/map-side-comparison/side-stat-box";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { MapSummary, MapObjectiveKey } from "./types";

const objectiveRows: Array<{ key: MapObjectiveKey; label: string }> = [
  { key: "firstBlood", label: "First Bloods" },
  { key: "towerKills", label: "Turrets Destroyed" },
  { key: "baronKills", label: "Barons Killed" },
  { key: "dragonKills", label: "Dragons Killed" },
  { key: "voidGrubs", label: "Void Grubs" },
  { key: "riftHeraldKills", label: "Rift Heralds" },
  { key: "atakhan", label: "Atakhans Claimed" },
];

export function MapPreview({ data }: { data: MapSummary | null }) {
  if (!data) {
    return (
      <div className="rounded-lg border border-dashed border-border/60 bg-card/40 p-4 text-sm text-muted-foreground">
        Map side data coming soon.
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 gap-4">
      <div className="grid grid-cols-2 gap-4">
        <SideStatBox
          title="Match Wins"
          blueSideStat={data.wins.blue}
          redSideStat={data.wins.red}
        />
        <SideStatBox
          title="Total Kills"
          blueSideStat={data.kills.blue}
          redSideStat={data.kills.red}
        />
      </div>

      <Table compact>
        <TableHeader>
          <TableRow>
            <TableHead>Objective</TableHead>
            <TableHead className="text-center text-blue-400!">
              Blue side
            </TableHead>
            <TableHead className="text-center text-red-400">Red side</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {objectiveRows.map(({ key, label }) => {
            const objective = data.objectives[key];
            const redValue = objective?.red ?? 0;
            const blueValue = objective?.blue ?? 0;
            const total = redValue + blueValue || 1;
            const redPercent = ((redValue / total) * 100).toFixed(1);
            const bluePercent = ((blueValue / total) * 100).toFixed(1);

            return (
              <TableRow key={key}>
                <TableCell className="font-medium">{label}</TableCell>
                <TableCell className="text-center">
                  <div className="flex flex-col items-center">
                    <span className="text-blue-400 font-semibold">
                      {blueValue}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {bluePercent}%
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex flex-col items-center">
                    <span className="text-red-400 font-semibold">
                      {redValue}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {redPercent}%
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
