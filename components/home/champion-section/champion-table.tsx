"use client";

import { useState, useMemo } from "react";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import type { ChampionStats } from "@/lib/types";
import { ChampionTableBody } from "./champion-table-body";
import { useTranslations } from "@/lib/i18n/locale-context";

interface ProcessedChampion {
  championId: string;
  championName: string;
  picks: number;
  bans: number;
  wins: number;
  losses: number;
  winRate: string;
  winRateValue: number;
  kda: string;
  kdaValue: number;
  presence: string;
  presenceValue: number;
}

interface ChampionTableProps {
  data: ChampionStats[];
  totalGames: number;
  itemsPerPage?: number;
}

export function ChampionTable({
  data,
  totalGames,
  itemsPerPage = 7,
}: ChampionTableProps) {
  const t = useTranslations();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // Transform data
  const processedData = useMemo<ProcessedChampion[]>(() => {
    return data.map((champion) => {
      const presence =
        totalGames > 0
          ? ((champion.picks + champion.bans) / totalGames) * 100
          : 0;
      const winRate =
        champion.picks > 0 ? (champion.wins / champion.picks) * 100 : 0;
      const losses = champion.picks - champion.wins;
      const kdaValue =
        champion.deaths > 0
          ? (champion.kills + champion.assists) / champion.deaths
          : champion.kills + champion.assists;

      return {
        championId: champion.championId,
        championName: champion.championName,
        picks: champion.picks,
        bans: champion.bans,
        wins: champion.wins,
        losses,
        winRate: winRate.toFixed(0) + "%",
        winRateValue: winRate,
        kda: kdaValue.toFixed(2),
        kdaValue,
        presence: presence.toFixed(1) + "%",
        presenceValue: presence,
      };
    });
  }, [data, totalGames]);

  // Filter champions based on search query
  const filteredData = processedData.filter((champion) =>
    champion.championName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort configuration for the Table component
  const sortConfig: Record<string, (item: unknown) => string | number> =
    useMemo(
      () => ({
        championName: (item: unknown) =>
          (item as ProcessedChampion).championName,
        presence: (item: unknown) => (item as ProcessedChampion).presenceValue,
        picks: (item: unknown) => (item as ProcessedChampion).picks,
        bans: (item: unknown) => (item as ProcessedChampion).bans,
        winRate: (item: unknown) => (item as ProcessedChampion).winRateValue,
        kda: (item: unknown) => (item as ProcessedChampion).kdaValue,
      }),
      []
    );

  // Pagination calculations
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  return (
    <Card className="flex-1 flex flex-col min-w-0">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <CardTitle className="text-base">
            {t("home.highestPresenceChampions")}
          </CardTitle>
          <div className="w-full sm:w-auto">
            <Input
              placeholder={t("home.searchChampionsPlaceholder")}
              value={searchQuery}
              onChange={handleSearchChange}
              startIcon={<Search className="h-4 w-4" />}
              compact
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col align-middle justify-center py-2! overflow-hidden">
        <div className="w-full overflow-x-auto">
          <Table
            compact
            className="min-w-full"
            data={filteredData}
            sortConfig={sortConfig}
            initialSort={{ column: "presence", direction: "desc" }}
          >
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead sortable sortKey="championName">
                  {t("common.champion")}
                </TableHead>
                <TableHead sortable sortKey="presence">
                  {t("home.presence")}
                </TableHead>
                <TableHead sortable sortKey="picks">
                  {t("home.picks")}
                </TableHead>
                <TableHead sortable sortKey="bans">
                  {t("home.bans")}
                </TableHead>
                <TableHead>W/L</TableHead>
                <TableHead sortable sortKey="winRate">
                  {t("home.winRate")}
                </TableHead>
                <TableHead sortable sortKey="kda">
                  {t("common.kda")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <ChampionTableBody
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
            />
          </Table>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
        <div className="text-sm text-muted-foreground">
          {t("home.showingChampions")
            .replace("{{start}}", String(startIndex + 1))
            .replace("{{end}}", String(Math.min(endIndex, filteredData.length)))
            .replace("{{total}}", String(filteredData.length))}
          {searchQuery &&
            ` (${t("home.filteredFrom").replace("{{total}}", String(data.length))})`}
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            {t("home.previous")}
          </Button>
          <div className="text-sm font-medium whitespace-nowrap">
            {t("home.pageOf")
              .replace("{{current}}", String(currentPage))
              .replace("{{total}}", String(totalPages))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            {t("home.next")}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
