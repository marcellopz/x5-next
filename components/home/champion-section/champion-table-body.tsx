"use client";

import { useMemo } from "react";
import Image from "next/image";
import {
  TableBody,
  TableCell,
  TableRow,
  useTableData,
} from "@/components/ui/table";
import { CHAMPIONICONURL } from "@/lib/resources";

interface ProcessedChampion {
  championId: number;
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

interface ChampionTableBodyProps {
  currentPage: number;
  itemsPerPage: number;
}

export function ChampionTableBody({
  currentPage,
  itemsPerPage,
}: ChampionTableBodyProps) {
  // Get sorted data from table context
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const sortedData = (useTableData() as ProcessedChampion[]) || [];

  // Apply pagination to the sorted data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, itemsPerPage]);

  const startIndex = (currentPage - 1) * itemsPerPage;

  return (
    <TableBody>
      {paginatedData.map((champion, index) => (
        <TableRow key={champion.championId}>
          <TableCell className="font-medium">
            {startIndex + index + 1}
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-2 whitespace-nowrap">
              <div className="relative w-8 h-8 rounded-md overflow-hidden shrink-0 bg-muted border-2 border-border">
                <Image
                  src={`${CHAMPIONICONURL}${champion.championId}.png`}
                  alt={champion.championName}
                  fill
                  sizes="28px"
                  className="object-cover"
                />
              </div>
              <span className="font-semibold">{champion.championName}</span>
            </div>
          </TableCell>
          <TableCell className="whitespace-nowrap font-semibold text-primary">
            {champion.presence}
          </TableCell>
          <TableCell className="whitespace-nowrap">{champion.picks}</TableCell>
          <TableCell className="whitespace-nowrap">{champion.bans}</TableCell>
          <TableCell className="whitespace-nowrap">
            <span className="text-green-500 text-sm">{champion.wins}</span>
            {" / "}
            <span className="text-red-500 text-sm">{champion.losses}</span>
          </TableCell>
          <TableCell className="whitespace-nowrap">
            {champion.winRate}
          </TableCell>
          <TableCell className="whitespace-nowrap">{champion.kda}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}
