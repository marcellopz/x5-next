"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  TableBody,
  TableCell,
  TableRow,
  useTableData,
} from "@/components/ui/table";
import { CHAMPIONICONURL } from "@/lib/resources";

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

interface ChampionsTableBodyProps {
  isAllRole: boolean;
  selectedChampionId: string | null;
  onSelectChampion: (championId: string) => void;
}

export function ChampionsTableBody({
  isAllRole,
  selectedChampionId,
  onSelectChampion,
}: ChampionsTableBodyProps) {
  // Get sorted data from table context
  const sortedData = (useTableData() as ProcessedChampion[]) || [];

  return (
    <TableBody>
      {sortedData.length === 0 ? (
        <TableRow>
          <TableCell
            colSpan={isAllRole ? 8 : 6}
            className="text-center text-muted-foreground"
          >
            No champions found
          </TableCell>
        </TableRow>
      ) : (
        sortedData.map((champion, index) => (
          <TableRow
            key={champion.championId}
            onClick={() => onSelectChampion(champion.championId)}
            className={cn(
              "cursor-pointer",
              selectedChampionId === champion.championId && "bg-muted"
            )}
          >
            <TableCell className="font-medium">{index + 1}</TableCell>
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
            {isAllRole && (
              <TableCell className="whitespace-nowrap font-semibold text-primary text-center">
                {champion.presence}
              </TableCell>
            )}
            <TableCell className="whitespace-nowrap text-center">
              {champion.picks}
            </TableCell>
            {isAllRole && (
              <TableCell className="whitespace-nowrap text-center">
                {champion.bans}
              </TableCell>
            )}
            <TableCell className="whitespace-nowrap text-center">
              <span className="text-green-400 text-sm">{champion.wins}</span>
              {" / "}
              <span className="text-red-400 text-sm">{champion.losses}</span>
            </TableCell>
            <TableCell className="whitespace-nowrap text-center">
              {champion.winRate}
            </TableCell>
            <TableCell className="whitespace-nowrap text-center">
              {champion.kda}
            </TableCell>
          </TableRow>
        ))
      )}
    </TableBody>
  );
}
