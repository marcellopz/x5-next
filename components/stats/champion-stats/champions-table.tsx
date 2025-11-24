"use client";

import { useMemo } from "react";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type {
  ChampionStatsEntryAll,
  ChampionStatsEntryRole,
} from "@/lib/types";
import { ChampionsTableBody } from "./champions-table-body";

type RoleFilter = "all" | "top" | "jungle" | "mid" | "adc" | "support";

interface ProcessedChampion {
  championId: string;
  championName: string;
  picks: number;
  bans?: number;
  wins: number;
  losses: number;
  winRate: string;
  winRateValue: number;
  kda: string;
  kdaValue: number;
  presence?: string;
  presenceValue?: number;
}

interface ChampionsTableProps {
  champions: Record<string, ChampionStatsEntryRole | ChampionStatsEntryAll>;
  selectedChampionId: string | null;
  onSelectChampion: (championId: string) => void;
  selectedRole: RoleFilter;
}

export function ChampionsTable({
  champions,
  selectedChampionId,
  onSelectChampion,
  selectedRole,
}: ChampionsTableProps) {
  const isAllRole = selectedRole === "all";

  // Process data similar to home table
  const processedData = useMemo<ProcessedChampion[]>(() => {
    return Object.entries(champions).map(([championId, champion]) => {
      const winRate =
        champion.picks > 0 ? (champion.wins / champion.picks) * 100 : 0;
      const losses = champion.picks - champion.wins;
      const kdaValue =
        champion.deaths > 0
          ? (champion.kills + champion.assists) / champion.deaths
          : champion.kills + champion.assists;

      const processed: ProcessedChampion = {
        championId,
        championName: champion.championName,
        picks: champion.picks,
        wins: champion.wins,
        losses,
        winRate: winRate.toFixed(0) + "%",
        winRateValue: winRate,
        kda: kdaValue.toFixed(2),
        kdaValue,
      };

      // Add bans and presence for "all" role
      if (isAllRole && "bans" in champion && "presence" in champion) {
        const presence = champion.presence;
        processed.bans = champion.bans;
        processed.presence = presence
          ? (presence * 100).toFixed(1) + "%"
          : "0.0%";
        processed.presenceValue = presence;
      }

      return processed;
    });
  }, [champions, isAllRole]);

  // Sort configuration
  const sortConfig: Record<string, (item: unknown) => string | number> =
    useMemo(
      () => ({
        championName: (item: unknown) =>
          (item as ProcessedChampion).championName,
        presence: (item: unknown) =>
          (item as ProcessedChampion).presenceValue ?? 0,
        picks: (item: unknown) => (item as ProcessedChampion).picks,
        bans: (item: unknown) => (item as ProcessedChampion).bans ?? 0,
        winRate: (item: unknown) => (item as ProcessedChampion).winRateValue,
        kda: (item: unknown) => (item as ProcessedChampion).kdaValue,
      }),
      []
    );

  return (
    <Table
      compact
      data={processedData}
      sortConfig={sortConfig}
      initialSort={{ column: "picks", direction: "desc" }}
    >
      <TableHeader className="sticky top-0 z-10 bg-muted!">
        <TableRow>
          <TableHead className="w-12">#</TableHead>
          <TableHead sortable sortKey="championName">
            Champion
          </TableHead>
          {isAllRole && (
            <TableHead sortable sortKey="presence" className="text-center">
              Presence
            </TableHead>
          )}
          <TableHead sortable sortKey="picks" className="text-center">
            Picks
          </TableHead>
          {isAllRole && (
            <TableHead sortable sortKey="bans" className="text-center">
              Bans
            </TableHead>
          )}
          <TableHead className="text-center">W/L</TableHead>
          <TableHead sortable sortKey="winRate" className="text-center">
            Win Rate
          </TableHead>
          <TableHead sortable sortKey="kda" className="text-center">
            KDA
          </TableHead>
        </TableRow>
      </TableHeader>
      <ChampionsTableBody
        isAllRole={isAllRole}
        selectedChampionId={selectedChampionId}
        onSelectChampion={onSelectChampion}
      />
    </Table>
  );
}
