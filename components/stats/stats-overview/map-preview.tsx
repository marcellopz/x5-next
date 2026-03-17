"use client";

import { useTranslations } from "@/lib/i18n/locale-context";
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

export function MapPreview({ data }: { data: MapSummary | null }) {
  const t = useTranslations();
  const objectiveRows: Array<{ key: MapObjectiveKey; label: string }> = [
    { key: "firstBlood", label: t("stats.mapSide.firstBloods") },
    { key: "towerKills", label: t("stats.mapSide.turretsDestroyed") },
    { key: "baronKills", label: t("stats.mapSide.baronsKilled") },
    { key: "dragonKills", label: t("stats.mapSide.dragonsKilled") },
    { key: "voidGrubs", label: t("stats.mapSide.voidGrubs") },
    { key: "riftHeraldKills", label: t("stats.mapSide.riftHeraldsKilled") },
    { key: "atakhan", label: t("stats.mapSide.atakhans") },
  ];

  if (!data) {
    return (
      <div className="rounded-lg border border-dashed border-border/60 bg-card/40 p-4 text-sm text-muted-foreground">
        {t("stats.mapSideDataComingSoon")}
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 gap-4">
      <div className="grid grid-cols-2 gap-4">
        <SideStatBox
          title={t("stats.mapSide.matchWins")}
          blueSideStat={data.wins.blue}
          redSideStat={data.wins.red}
        />
        <SideStatBox
          title={t("stats.mapSide.totalKills")}
          blueSideStat={data.kills.blue}
          redSideStat={data.kills.red}
        />
      </div>

      <Table compact>
        <TableHeader>
          <TableRow>
            <TableHead>{t("stats.victory.objective")}</TableHead>
            <TableHead className="text-center text-blue-400!">
              {t("stats.mapSide.blueSideLower")}
            </TableHead>
            <TableHead className="text-center text-red-400">{t("stats.mapSide.redSideLower")}</TableHead>
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
