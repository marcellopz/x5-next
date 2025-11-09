"use client";

import { useMemo } from "react";
import Image from "next/image";
import { usePlayerData } from "../player-data-context";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  useTableData,
} from "@/components/ui/table";
import { CHAMPIONICONURL } from "@/lib/resources";
import type { ChampionStats } from "@/lib/types";

function formatNumber(num: number | string): string {
  const numValue = typeof num === "string" ? parseFloat(num) : num;
  if (isNaN(numValue)) return "0";
  return numValue.toLocaleString("en-US");
}

function floatToPercentageString(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

function getKDA(kills: number, deaths: number, assists: number): number {
  if (deaths === 0) return Infinity;
  return (kills + assists) / deaths;
}

interface WinRateProgressBarProps {
  winRate: number;
  numberOfMatches: number;
}

function WinRateProgressBar({
  winRate,
  numberOfMatches,
}: WinRateProgressBarProps) {
  const numberOfWins = Math.round(winRate * numberOfMatches);
  const numberOfLosses = numberOfMatches - numberOfWins;

  return (
    <div className="relative w-full h-4 bg-red-500/30 rounded overflow-hidden">
      <div
        className="absolute inset-0 bg-blue-500/60 rounded-l"
        style={{ width: `${winRate * 100}%` }}
      />
      <div className="absolute inset-0 flex items-center justify-between px-1 text-[10px] font-medium z-10">
        <span className="text-foreground">{numberOfWins}W</span>
        <span className="text-foreground">{numberOfLosses}L</span>
      </div>
    </div>
  );
}

export function PlayerChampionsTab() {
  const { champs } = usePlayerData();

  const championsArray = useMemo(() => {
    return champs.map((champ) => ({
      ...champ,
      id: champ.championId,
      numberOfMatches: champ.numberOfMatches ?? champ.picks ?? 0,
      winRate:
        champ.winRate ??
        champ.wins / (champ.numberOfMatches ?? champ.picks ?? 1),
      kda: champ.kda ?? getKDA(champ.kills, champ.deaths, champ.assists),
    }));
  }, [champs]);

  const sortConfig = useMemo(() => {
    return {
      championName: (
        champ: ChampionStats & {
          id: string;
          numberOfMatches: number;
          winRate: number;
          kda: number;
        }
      ) => champ.championName,
      numberOfMatches: (
        champ: ChampionStats & {
          id: string;
          numberOfMatches: number;
          winRate: number;
          kda: number;
        }
      ) => champ.numberOfMatches,
      winRate: (
        champ: ChampionStats & {
          id: string;
          numberOfMatches: number;
          winRate: number;
          kda: number;
        }
      ) => champ.winRate,
      kda: (
        champ: ChampionStats & {
          id: string;
          numberOfMatches: number;
          winRate: number;
          kda: number;
        }
      ) => (isFinite(champ.kda) ? champ.kda : 999999),
      gold: (
        champ: ChampionStats & {
          id: string;
          numberOfMatches: number;
          winRate: number;
          kda: number;
        }
      ) => champ.AveragePerMatch?.goldEarned ?? 0,
      cs: (
        champ: ChampionStats & {
          id: string;
          numberOfMatches: number;
          winRate: number;
          kda: number;
        }
      ) => champ.AveragePerMatch?.creepScore ?? 0,
      damage: (
        champ: ChampionStats & {
          id: string;
          numberOfMatches: number;
          winRate: number;
          kda: number;
        }
      ) => champ.AveragePerMatch?.damageToChampions ?? 0,
      tanked: (
        champ: ChampionStats & {
          id: string;
          numberOfMatches: number;
          winRate: number;
          kda: number;
        }
      ) => champ.AveragePerMatch?.damageTaken ?? 0,
      selfMitigated: (
        champ: ChampionStats & {
          id: string;
          numberOfMatches: number;
          winRate: number;
          kda: number;
        }
      ) => champ.AveragePerMatch?.damageSelfMitigates ?? 0,
      visionScore: (
        champ: ChampionStats & {
          id: string;
          numberOfMatches: number;
          winRate: number;
          kda: number;
        }
      ) => champ.AveragePerMatch?.visionScore ?? 0,
      wardsBought: (
        champ: ChampionStats & {
          id: string;
          numberOfMatches: number;
          winRate: number;
          kda: number;
        }
      ) => champ.AveragePerMatch?.visionWardsBought ?? 0,
    };
  }, []);

  return (
    <div className="p-4">
      <Table
        compact
        data={championsArray}
        sortConfig={sortConfig}
        initialSort={{ column: "numberOfMatches", direction: "desc" }}
      >
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]"></TableHead>
            <TableHead sortable sortKey="championName">
              Champion
            </TableHead>
            <TableHead
              sortable
              sortKey="numberOfMatches"
              className="text-center"
            >
              Picked
            </TableHead>
            <TableHead sortable sortKey="kda" className="text-center">
              KDA
            </TableHead>
            <TableHead sortable sortKey="gold" className="text-center">
              Gold
            </TableHead>
            <TableHead sortable sortKey="cs" className="text-center">
              CS
            </TableHead>
            <TableHead sortable sortKey="damage" className="text-center">
              Damage Dealt
            </TableHead>
            <TableHead sortable sortKey="tanked" className="text-center">
              Damage Taken
            </TableHead>
            <TableHead sortable sortKey="selfMitigated" className="text-center">
              Damage Self Mitigated
            </TableHead>
            <TableHead sortable sortKey="visionScore" className="text-center">
              Vision Score
            </TableHead>
            <TableHead sortable sortKey="wardsBought" className="text-center">
              Wards Bought
            </TableHead>
          </TableRow>
        </TableHeader>
        <ChampionsTableBody championsArray={championsArray} />
      </Table>
    </div>
  );
}

function ChampionsTableBody({
  championsArray,
}: {
  championsArray: Array<
    ChampionStats & {
      id: string;
      numberOfMatches: number;
      winRate: number;
      kda: number;
    }
  >;
}) {
  const sortedData = useTableData() as typeof championsArray;
  const dataToRender = sortedData.length > 0 ? sortedData : championsArray;

  return (
    <TableBody>
      {dataToRender.map((champ) => {
        const kda = isFinite(champ.kda) ? champ.kda : Infinity;
        const avg = champ.AveragePerMatch;

        return (
          <TableRow key={champ.id}>
            <TableCell className="text-center">
              <div className="flex justify-center w-[50px]">
                <Image
                  src={`${CHAMPIONICONURL}${champ.championId}.png`}
                  alt={champ.championName}
                  width={50}
                  height={50}
                  className="w-[50px] h-[50px] object-contain"
                  unoptimized
                />
              </div>
            </TableCell>
            <TableCell className="font-medium">{champ.championName}</TableCell>
            <TableCell>
              <div className="flex items-center gap-3 justify-center">
                <div className="w-[100px]">
                  <WinRateProgressBar
                    winRate={champ.winRate}
                    numberOfMatches={champ.numberOfMatches}
                  />
                </div>
                <span className="text-sm w-[50px] text-center">
                  {floatToPercentageString(champ.winRate)}
                </span>
              </div>
            </TableCell>
            <TableCell className="text-center">
              <div>
                <div className="font-semibold">
                  {isFinite(kda) ? `${kda.toFixed(1)}:1` : "∞:1"}
                </div>
                <div className="text-xs text-muted-foreground">
                  {avg?.kills?.toFixed(1) ?? "0"} /{" "}
                  {avg?.deaths?.toFixed(1) ?? "0"} /{" "}
                  {avg?.assists?.toFixed(1) ?? "0"}
                </div>
              </div>
            </TableCell>
            <TableCell className="text-center">
              {formatNumber(avg?.goldEarned?.toFixed(0) ?? "0")}
            </TableCell>
            <TableCell className="text-center">
              {avg?.creepScore?.toFixed(1) ?? "0"}
            </TableCell>
            <TableCell className="text-center">
              {formatNumber(avg?.damageToChampions?.toFixed(0) ?? "0")}
            </TableCell>
            <TableCell className="text-center">
              {formatNumber(avg?.damageTaken?.toFixed(0) ?? "0")}
            </TableCell>
            <TableCell className="text-center">
              {formatNumber(avg?.damageSelfMitigates?.toFixed(0) ?? "0")}
            </TableCell>
            <TableCell className="text-center">
              {avg?.visionScore?.toFixed(1) ?? "0"}
            </TableCell>
            <TableCell className="text-center">
              {avg?.visionWardsBought?.toFixed(1) ?? "0"}
            </TableCell>
          </TableRow>
        );
      })}
    </TableBody>
  );
}
