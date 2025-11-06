"use client";

import * as React from "react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  useTableData,
} from "@/components/ui/table";
import type { PlayerList, PlayerSummary } from "@/lib/types";
import { useRouter } from "next/navigation";

// Define sort configuration for each column
type PlayerWithNameId = {
  nameId: string;
  account_id: number;
  name: string;
  top: number;
  jungle: number;
  mid: number;
  adc: number;
  support: number;
  hide?: boolean;
};

// Function to get win rate color based on percentage
function getWinRateColor(winRate: number): string {
  const percentage = winRate * 100;

  if (percentage >= 50) {
    // Green gradient from 50% to 70%+
    const intensity = Math.min((percentage - 50) / 20, 1); // 0 to 1
    // Base color at 50%: soft white, gradually to moderate green at 70%+
    const red = Math.round(220 - 160 * intensity); // 220 -> 60
    const green = Math.round(220 - 20 * intensity); // 220 -> 200
    const blue = Math.round(220 - 140 * intensity); // 220 -> 80
    return `rgb(${red}, ${green}, ${blue})`;
  } else {
    // Red gradient from 50% to 30%-
    const intensity = Math.min((50 - percentage) / 20, 1); // 0 to 1
    // Base color at 50%: soft white, gradually to moderate red at 30%-
    const red = Math.round(220 - 20 * intensity); // 220 -> 200
    const green = Math.round(220 - 140 * intensity); // 220 -> 80
    const blue = Math.round(220 - 140 * intensity); // 220 -> 80
    return `rgb(${red}, ${green}, ${blue})`;
  }
}

interface PlayerListTableProps {
  playerList: PlayerList | null;
  playerSummary: PlayerSummary | null;
}

export function PlayerListTable({
  playerList,
  playerSummary,
}: PlayerListTableProps) {
  // Convert playerList object to array for easier processing
  const filteredPlayers = React.useMemo(() => {
    return playerList
      ? Object.entries(playerList)
          .map(([nameId, player]) => ({
            nameId,
            ...player,
          }))
          .filter((player) => {
            // Filter out hidden players
            if (player.hide === true) return false;

            // Get summary data to check for 0 games
            const summaryData = playerSummary?.[player.account_id.toString()];

            // Filter out players with 0 games
            return (summaryData?.numberOfMatches || 0) > 0;
          })
      : [];
  }, [playerList, playerSummary]);

  const sortConfig = React.useMemo(
    () => ({
      name: (player: PlayerWithNameId) => player.name || player.nameId,
      winRate: (player: PlayerWithNameId) => {
        const summaryData = playerSummary?.[player.account_id.toString()];
        return summaryData?.winRate || 0;
      },
      summonerName: (player: PlayerWithNameId) => {
        const summaryData = playerSummary?.[player.account_id.toString()];
        return summaryData?.summonerName || "";
      },
      matches: (player: PlayerWithNameId) => {
        const summaryData = playerSummary?.[player.account_id.toString()];
        return summaryData?.numberOfMatches || 0;
      },
      top: (player: PlayerWithNameId) => player.top,
      jungle: (player: PlayerWithNameId) => player.jungle,
      mid: (player: PlayerWithNameId) => player.mid,
      adc: (player: PlayerWithNameId) => player.adc,
      support: (player: PlayerWithNameId) => player.support,
    }),
    [playerSummary]
  );

  return (
    <Table
      compact={false}
      data={filteredPlayers}
      sortConfig={
        sortConfig as Record<string, (item: unknown) => string | number>
      }
      initialSort={{
        column: "matches",
        direction: "desc",
      }}
    >
      <PlayerTableContent playerSummary={playerSummary} />
    </Table>
  );
}

// Separate component to access sorted data from table context
function PlayerTableContent({
  playerSummary,
}: {
  playerSummary: PlayerSummary | null;
}) {
  const sortedPlayers = useTableData() as PlayerWithNameId[];
  const router = useRouter();
  return (
    <>
      <TableHeader>
        <TableRow>
          <TableHead sortable sortKey="name">
            Name
          </TableHead>
          <TableHead sortable sortKey="winRate">
            Win Rate
          </TableHead>
          <TableHead>{/* OP.GG column - no header text */}</TableHead>
          <TableHead sortable sortKey="summonerName">
            Summoner Name
          </TableHead>
          <TableHead sortable sortKey="matches">
            Matches
          </TableHead>
          <TableHead
            sortable
            sortKey="top"
            className="text-center w-16 min-w-16"
          >
            <Image
              src="/top.png"
              alt="Top"
              width={20}
              height={20}
              className="w-5 h-5 mx-auto"
            />
          </TableHead>
          <TableHead
            sortable
            sortKey="jungle"
            className="text-center w-16 min-w-16"
          >
            <Image
              src="/jungle.png"
              alt="Jungle"
              width={20}
              height={20}
              className="w-5 h-5 mx-auto"
            />
          </TableHead>
          <TableHead
            sortable
            sortKey="mid"
            className="text-center w-16 min-w-16"
          >
            <Image
              src="/mid.png"
              alt="Mid"
              width={20}
              height={20}
              className="w-5 h-5 mx-auto"
            />
          </TableHead>
          <TableHead
            sortable
            sortKey="adc"
            className="text-center w-16 min-w-16"
          >
            <Image
              src="/bot.png"
              alt="Bot"
              width={20}
              height={20}
              className="w-5 h-5 mx-auto"
            />
          </TableHead>
          <TableHead
            sortable
            sortKey="support"
            className="text-center w-16 min-w-16"
          >
            <Image
              src="/supp.png"
              alt="Support"
              width={20}
              height={20}
              className="w-5 h-5 mx-auto"
            />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedPlayers.length > 0 ? (
          sortedPlayers.map((player) => {
            // Get summary data for this player using account_id as key
            const summaryData = playerSummary?.[player.account_id.toString()];

            return (
              <TableRow
                key={player.nameId}
                onClick={() => {
                  router.push(`/player/${player.nameId}`);
                }}
              >
                <TableCell className="font-medium">
                  {player.name || player.nameId}
                </TableCell>
                <TableCell className="pl-6">
                  {summaryData && typeof summaryData.winRate === "number" ? (
                    <span
                      className="font-bold"
                      style={{ color: getWinRateColor(summaryData.winRate) }}
                    >
                      {`${(summaryData.winRate * 100).toFixed(1)}%`}
                    </span>
                  ) : (
                    <span className="font-bold">-</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {summaryData?.summonerName && summaryData?.tagLine ? (
                    <a
                      href={`https://www.op.gg/summoners/br/${encodeURIComponent(
                        summaryData.summonerName
                      )}-${encodeURIComponent(summaryData.tagLine)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block hover:scale-105 transition-transform duration-50"
                    >
                      <Image
                        src="/opgg.png"
                        alt="OP.GG Profile"
                        width={20}
                        height={20}
                        className="w-5 h-5"
                      />
                    </a>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {summaryData?.summonerName ? (
                    <>
                      {summaryData.summonerName}
                      <span className="text-muted-foreground opacity-70">
                        #{summaryData.tagLine}
                      </span>
                    </>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell className="pl-8">
                  {summaryData?.numberOfMatches || "-"}
                </TableCell>
                <TableCell className="text-center w-16 min-w-16">
                  {player.top}
                </TableCell>
                <TableCell className="text-center w-16 min-w-16">
                  {player.jungle}
                </TableCell>
                <TableCell className="text-center w-16 min-w-16">
                  {player.mid}
                </TableCell>
                <TableCell className="text-center w-16 min-w-16">
                  {player.adc}
                </TableCell>
                <TableCell className="text-center w-16 min-w-16">
                  {player.support}
                </TableCell>
              </TableRow>
            );
          })
        ) : (
          <TableRow>
            <TableCell colSpan={9} className="h-24 text-center">
              No players found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </>
  );
}
