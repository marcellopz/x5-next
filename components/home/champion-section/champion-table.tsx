"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CHAMPIONICONURL } from "@/lib/resources";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import type { ChampionData } from "./champion-table-data";

interface ChampionTableProps {
  data: ChampionData[];
  itemsPerPage?: number;
}

export function ChampionTable({ data, itemsPerPage = 7 }: ChampionTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter champions based on search query
  const filteredData = data.filter((champion) =>
    champion.champion.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentChampions = filteredData.slice(startIndex, endIndex);

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
            Highest Presence Champions
          </CardTitle>
          <div className="w-full sm:w-auto">
            <Input
              placeholder="Search champions..."
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
          <Table compact className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead className="whitespace-nowrap">Champion</TableHead>
                <TableHead className="whitespace-nowrap">Games</TableHead>
                <TableHead className="whitespace-nowrap">W/L</TableHead>
                <TableHead className="whitespace-nowrap">Win Rate</TableHead>
                <TableHead className="whitespace-nowrap">KDA</TableHead>
                <TableHead className="whitespace-nowrap">Avg Damage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentChampions.map((champion) => (
                <TableRow key={champion.rank}>
                  <TableCell className="font-medium">{champion.rank}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <div className="relative w-8 h-8 rounded-md overflow-hidden flex-shrink-0 bg-muted border-2 border-border">
                        <Image
                          src={`${CHAMPIONICONURL}${champion.championId}.png`}
                          alt={champion.champion}
                          fill
                          sizes="28px"
                          className="object-cover"
                        />
                      </div>
                      <span className="font-semibold">{champion.champion}</span>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {champion.games}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <span className="text-green-500 text-sm">
                      {champion.wins}
                    </span>
                    {" / "}
                    <span className="text-red-500 text-sm">
                      {champion.losses}
                    </span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {champion.winRate}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {champion.kda}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {champion.avgDamage}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
        <div className="text-sm text-muted-foreground">
          Showing {startIndex + 1}-{Math.min(endIndex, filteredData.length)} of{" "}
          {filteredData.length} champions
          {searchQuery && ` (filtered from ${data.length})`}
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <div className="text-sm font-medium whitespace-nowrap">
            Page {currentPage} of {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
