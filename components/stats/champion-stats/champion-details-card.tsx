"use client";

import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type {
  ChampionStatsEntryAll,
  ChampionStatsEntryRole,
} from "@/lib/types";
import { CHAMPIONICONURL } from "@/lib/resources";
import Link from "next/link";

interface ChampionDetailsCardProps {
  champion: (ChampionStatsEntryRole | ChampionStatsEntryAll) | null;
}

function isChampionStatsEntryAll(
  champion: ChampionStatsEntryRole | ChampionStatsEntryAll
): champion is ChampionStatsEntryAll {
  return "bans" in champion && "presence" in champion;
}

export function ChampionDetailsCard({ champion }: ChampionDetailsCardProps) {
  if (!champion) {
    return (
      <Card className="sticky top-20">
        <CardHeader>
          <CardTitle>Select a Champion</CardTitle>
          <CardDescription>
            Click on a champion in the table to view details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground text-center py-8">
            No champion selected
          </div>
        </CardContent>
      </Card>
    );
  }

  const isAllRole = isChampionStatsEntryAll(champion);
  const winRate =
    champion.picks > 0
      ? ((champion.wins / champion.picks) * 100).toFixed(1)
      : "0.0";
  const kda = (
    (champion.kills + champion.assists) /
    Math.max(champion.deaths, 1)
  ).toFixed(2);

  const playedByEntries = Object.values(champion.playedBy).sort(
    (a, b) => b.numberOfGames - a.numberOfGames
  );

  return (
    <Card className="sticky top-20">
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 border-2 border-border">
            <Image
              src={`${CHAMPIONICONURL}${champion.championId}.png`}
              alt={champion.championName}
              fill
              sizes="80px"
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0 space-y-1">
            <CardTitle>{champion.championName}</CardTitle>
            <CardDescription>Champion statistics and details</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Stats */}
        <div>
          <h3 className="text-sm font-semibold mb-3">Overall Statistics</h3>
          <div className="grid grid-cols-4 gap-3">
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Picks</div>
              <div className="text-lg font-semibold">{champion.picks}</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Win/Loss</div>
              <div className="text-lg font-semibold">
                <span className="text-green-300">{champion.wins}</span>{" "}
                <span className="text-muted-foreground">/</span>{" "}
                <span className="text-red-300">
                  {champion.picks - champion.wins}
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Win Rate</div>
              <div className="text-lg font-semibold">{winRate}%</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">KDA</div>
              <div className="text-lg font-semibold">{kda}</div>
            </div>
            {isAllRole && (
              <>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Bans</div>
                  <div className="text-lg font-semibold">{champion.bans}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Presence</div>
                  <div className="text-lg font-semibold">
                    {champion.presence
                      ? (champion.presence * 100).toFixed(1) + "%"
                      : "0.0%"}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Average Stats */}
        <div>
          <h3 className="text-sm font-semibold mb-3">Average Statistics</h3>
          <div className="grid grid-cols-4 gap-3">
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Kills</div>
              <div className="text-sm font-medium">
                {champion.kills.toFixed(2)}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Deaths</div>
              <div className="text-sm font-medium">
                {champion.deaths.toFixed(2)}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Assists</div>
              <div className="text-sm font-medium">
                {champion.assists.toFixed(2)}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">CS</div>
              <div className="text-sm font-medium">
                {champion.creepsKilled.toFixed(1)}
              </div>
            </div>
          </div>
        </div>

        {/* Played By Table */}
        {playedByEntries.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-3">Played By</h3>
            <div className="border border-border rounded-lg overflow-hidden">
              <Table compact>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Player</TableHead>
                    <TableHead className="text-xs text-center">Games</TableHead>
                    <TableHead className="text-xs text-center">
                      Win Rate
                    </TableHead>
                    <TableHead className="text-xs text-center">W/L</TableHead>
                    <TableHead className="text-xs text-center">KDA</TableHead>
                    <TableHead className="text-xs text-center">CS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {playedByEntries.map((player) => {
                    const losses = player.numberOfGames - player.wins;
                    return (
                      <TableRow key={player.summonerId}>
                        <TableCell className="text-xs">
                          <div className="flex items-baseline gap-1">
                            <Link href={`/player/${player.summonerId}`}>
                              <span className="font-medium hover:text-primary">
                                {player.gameName}
                              </span>
                            </Link>
                            <span className="text-muted-foreground text-[10px]">
                              #{player.tagLine}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-center">
                          {player.numberOfGames}
                        </TableCell>
                        <TableCell className="text-xs text-center">
                          {((player.wins / player.numberOfGames) * 100).toFixed(
                            1
                          )}
                          %
                        </TableCell>
                        <TableCell className="text-xs text-center whitespace-nowrap">
                          <span className="text-green-400 text-sm">
                            {player.wins}
                          </span>
                          {" / "}
                          <span className="text-red-400 text-sm">{losses}</span>
                        </TableCell>
                        <TableCell className="text-xs text-center">
                          {player.kda.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-xs text-center">
                          {player.creepScore.toFixed(1)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
