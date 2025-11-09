"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  useTableData,
} from "@/components/ui/table";
import { getWinRateColor } from "@/components/player-list/player-list-table";

function floatToPercentageString(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

interface Player {
  games: number;
  wins: number;
  summonerName: string;
  summonerId: string;
}

interface WinRateTableProps {
  players: Player[];
  title: string;
}

function WinRateTableBody({ players }: { players: Player[] }) {
  const sortedData = useTableData() as Player[];
  const dataToRender = sortedData.length > 0 ? sortedData : players;

  return (
    <TableBody>
      {dataToRender.map((player) => {
        const winRate = player.games > 0 ? player.wins / player.games : 0;

        return (
          <TableRow key={player.summonerId}>
            <TableCell className="font-medium">
              <Link
                href={`/player/${player.summonerId}`}
                className="hover:text-primary transition-colors"
              >
                {player.summonerName}
              </Link>
            </TableCell>
            <TableCell className="text-center">
              {player.games > 0 ? (
                <span
                  className="font-bold"
                  style={{ color: getWinRateColor(winRate) }}
                >
                  {floatToPercentageString(winRate)}
                </span>
              ) : (
                "-"
              )}
            </TableCell>
            <TableCell className="text-center">{player.games}</TableCell>
          </TableRow>
        );
      })}
    </TableBody>
  );
}

export function WinRateTable({ players, title }: WinRateTableProps) {
  const sortConfig = useMemo(() => {
    return {
      summonerName: (player: Player) => player.summonerName,
      winRate: (player: Player) =>
        player.games > 0 ? player.wins / player.games : 0,
      games: (player: Player) => player.games,
    };
  }, []);

  return (
    <div className="bg-background/30 border border-border rounded-lg p-4 flex-1 min-w-[250px] flex flex-col">
      <h3 className="text-lg font-semibold text-foreground mb-5">{title}</h3>
      <div className="flex-1 overflow-auto max-h-[400px]">
        <Table
          data={players}
          sortConfig={sortConfig}
          initialSort={{ column: "games", direction: "desc" }}
          compact
        >
          <TableHeader>
            <TableRow>
              <TableHead sortable sortKey="summonerName">
                Name
              </TableHead>
              <TableHead sortable sortKey="winRate" className="text-center">
                Win Rate
              </TableHead>
              <TableHead sortable sortKey="games" className="text-center">
                Games
              </TableHead>
            </TableRow>
          </TableHeader>
          <WinRateTableBody players={players} />
        </Table>
      </div>
    </div>
  );
}
