"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  useTableData,
} from "@/components/ui/table";
import { PlayerMvpPerformanceInGames } from "@/lib/types";
import { ScoreBadge } from "@/components/ui/score-badge";
import Link from "next/link";

interface MVPTableProps {
  players: PlayerMvpPerformanceInGames[];
}

function MVPTableRows() {
  const sortedPlayers = useTableData() as PlayerMvpPerformanceInGames[];

  return (
    <>
      {sortedPlayers.map((player, index) => (
        <TableRow key={player.gameName}>
          <TableCell className="text-center text-muted-foreground">
            {index + 1}
          </TableCell>
          <TableCell>
            <Link
              href={`/player/${player.summonerId}`}
              className="hover:text-primary transition-colors font-medium"
            >
              {player.gameName}
            </Link>
          </TableCell>
          <TableCell className="text-center">{player.wins}</TableCell>
          <TableCell className="text-center">
            <ScoreBadge score={player.meanScore} />
          </TableCell>
          <TableCell className="text-center">{player.numberOfGames}</TableCell>
          <TableCell className="text-center">
            {player.rolesWins.top.numberOfGames > 0
              ? `${player.rolesWins.top.wins}/${player.rolesWins.top.numberOfGames}`
              : "-"}
          </TableCell>
          <TableCell className="text-center">
            {player.rolesWins.jungle.numberOfGames > 0
              ? `${player.rolesWins.jungle.wins}/${player.rolesWins.jungle.numberOfGames}`
              : "-"}
          </TableCell>
          <TableCell className="text-center">
            {player.rolesWins.mid.numberOfGames > 0
              ? `${player.rolesWins.mid.wins}/${player.rolesWins.mid.numberOfGames}`
              : "-"}
          </TableCell>
          <TableCell className="text-center">
            {player.rolesWins.adc.numberOfGames > 0
              ? `${player.rolesWins.adc.wins}/${player.rolesWins.adc.numberOfGames}`
              : "-"}
          </TableCell>
          <TableCell className="text-center">
            {player.rolesWins.support.numberOfGames > 0
              ? `${player.rolesWins.support.wins}/${player.rolesWins.support.numberOfGames}`
              : "-"}
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

export function MVPTable({ players }: MVPTableProps) {
  return (
    <Table
      data={players}
      sortConfig={{
        wins: (player) => player.wins,
        meanScore: (player) => player.meanScore,
        numberOfGames: (player) => player.numberOfGames,
        gameName: (player) => player.gameName,
      }}
      initialSort={{ column: "wins", direction: "desc" }}
    >
      <TableHeader>
        <TableRow>
          <TableHead className="w-12 text-center">#</TableHead>
          <TableHead sortable sortKey="gameName">
            Player
          </TableHead>
          <TableHead sortable sortKey="wins" className="text-center">
            Wins
          </TableHead>
          <TableHead sortable sortKey="meanScore" className="text-center">
            Mean Score
          </TableHead>
          <TableHead sortable sortKey="numberOfGames" className="text-center">
            Games
          </TableHead>
          <TableHead className="text-center">Top</TableHead>
          <TableHead className="text-center">Jungle</TableHead>
          <TableHead className="text-center">Mid</TableHead>
          <TableHead className="text-center">ADC</TableHead>
          <TableHead className="text-center">Support</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <MVPTableRows />
      </TableBody>
    </Table>
  );
}
