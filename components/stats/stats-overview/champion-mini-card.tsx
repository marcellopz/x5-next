"use client";

import Image from "next/image";
import Link from "next/link";
import { CHAMPIONICONURL } from "@/lib/resources";
import type { ChampionSpotlightEntry } from "./types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ChampionMiniCardProps {
  champion: ChampionSpotlightEntry | null;
}

export function ChampionMiniCard({ champion }: ChampionMiniCardProps) {
  if (!champion) {
    return (
      <div className="lg:col-span-2 rounded-lg border border-dashed border-border bg-card/40 p-6 text-center text-sm text-muted-foreground">
        Select a champion to see details.
      </div>
    );
  }

  const losses = champion.picks - champion.wins;
  const winRate =
    champion.picks > 0
      ? ((champion.wins / champion.picks) * 100).toFixed(1)
      : "0.0";
  const presence = champion.presence ? champion.presence.toFixed(1) : "0.0";
  const kda = (
    (champion.kills + champion.assists) /
    Math.max(champion.deaths, 1)
  ).toFixed(2);

  const playedByEntries = Object.values(champion.playedBy)
    .sort((a, b) => b.numberOfGames - a.numberOfGames)
    .slice(0, 3);

  return (
    <div className="lg:col-span-2 rounded-lg border border-border bg-card/60 p-5 space-y-5">
      <div className="flex gap-4 items-center">
        <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-border shrink-0">
          <Image
            src={`${CHAMPIONICONURL}${champion.championId}.png`}
            alt={champion.championName}
            fill
            sizes="64px"
            className="object-cover"
          />
        </div>
        <div>
          <p className="text-lg font-semibold">{champion.championName}</p>
          <p className="text-sm text-muted-foreground">
            {champion.picks} picks · {champion.wins}/{losses} W/L
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-sm">
        <StatBlock label="Win Rate" value={`${winRate}%`} />
        <StatBlock label="KDA" value={kda} />
        <StatBlock label="Presence" value={`${presence}%`} />
        <StatBlock label="Bans" value={champion.bans.toString()} />
        <StatBlock
          label="Avg K/D/A"
          value={`${champion.kills.toFixed(1)}/${champion.deaths.toFixed(
            1
          )}/${champion.assists.toFixed(1)}`}
        />
        <StatBlock label="Avg CS" value={champion.creepsKilled.toFixed(1)} />
      </div>

      {playedByEntries.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Played By
          </p>
          <div className="border border-border rounded-lg overflow-hidden">
            <Table compact>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Player</TableHead>
                  <TableHead className="text-xs text-center">Games</TableHead>
                  <TableHead className="text-xs text-center">W/L</TableHead>
                  <TableHead className="text-xs text-center">CS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {playedByEntries.map((player) => {
                  const lossesByPlayer = player.numberOfGames - player.wins;
                  return (
                    <TableRow key={player.summonerId}>
                      <TableCell className="text-xs">
                        <Link
                          href={`/player/${player.summonerId}`}
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {player.gameName}
                        </Link>
                        <span className="text-muted-foreground text-[10px] ml-1">
                          #{player.tagLine}
                        </span>
                      </TableCell>
                      <TableCell className="text-center text-xs">
                        {player.numberOfGames}
                      </TableCell>
                      <TableCell className="text-center text-xs">
                        <span className="text-green-400">{player.wins}</span>
                        {" / "}
                        <span className="text-red-400">{lossesByPlayer}</span>
                      </TableCell>
                      <TableCell className="text-center text-xs">
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
    </div>
  );
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-base font-semibold">{value}</p>
    </div>
  );
}
