"use client";

import * as React from "react";
import { memo } from "react";
import type { ReducedTeamData } from "@/lib/types";
import Image from "next/image";

interface TeamHeaderProps {
  team: ReducedTeamData;
  isWinning: boolean;
  goldEarned: number;
  totalKills: number;
  totalDeaths: number;
  totalAssists: number;
}

export function TeamHeader({
  team,
  isWinning,
  goldEarned,
  totalKills,
  totalDeaths,
  totalAssists,
}: TeamHeaderProps) {
  // Icon sizes
  const ICON_SIZE = 16;
  // const GOLD_ICON_SIZE = 20;

  // CSS filters for coloring icons
  const winningFilter =
    "invert(69%) sepia(58%) saturate(388%) hue-rotate(172deg) brightness(95%) contrast(86%)";
  const losingFilter =
    "invert(55%) sepia(78%) saturate(462%) hue-rotate(314deg) brightness(101%) contrast(91%)";
  const iconFilter = isWinning ? winningFilter : losingFilter;

  return (
    <div
      className={`flex items-center justify-between mb-2 p-1 md:p-2 rounded-md lg:mb-3 text-xs xl:text-sm ${
        isWinning
          ? "bg-blue-500/15 border border-blue-500/30 text-blue-300"
          : "bg-red-500/15 border border-red-500/30 text-red-300"
      }`}
    >
      <span className="font-medium" title={isWinning ? "Victory" : "Defeat"}>
        Team {team.teamId / 100}: {isWinning ? "Victory" : "Defeat"}
      </span>
      <div className="hidden lg:flex items-center gap-4">
        <div className="flex items-center gap-1">
          <Image
            src="/game-entities/icon-dragon.svg"
            alt="Dragons"
            width={ICON_SIZE}
            height={ICON_SIZE}
            className="brightness-0 saturate-100"
            style={{ filter: iconFilter }}
            title="Dragons"
          />
          <span>{team.dragonKills || 0}</span>
        </div>
        <div className="flex items-center gap-1">
          <Image
            src="/game-entities/icon-baron.svg"
            alt="Baron"
            width={ICON_SIZE}
            height={ICON_SIZE}
            className="brightness-0 saturate-100"
            style={{ filter: iconFilter }}
            title="Baron"
          />
          <span>{team.baronKills || 0}</span>
        </div>
        <div className="flex items-center gap-1">
          <Image
            src="/game-entities/icon-tower.svg"
            alt="Towers"
            width={ICON_SIZE}
            height={ICON_SIZE}
            className="brightness-0 saturate-100"
            style={{ filter: iconFilter }}
            title="Towers"
          />
          <span>{team.towerKills || 0}</span>
        </div>
        <div className="flex items-center">
          <Image
            src="/game-entities/icon-gold.svg"
            alt="Gold Earned"
            width={ICON_SIZE * 1.3}
            height={ICON_SIZE * 1.3}
            className="brightness-0 saturate-100"
            style={{ filter: iconFilter }}
            title="Gold Earned"
          />
          <span>{(goldEarned / 1000).toFixed(1) || 0}k</span>
        </div>
      </div>
      <div className="hidden xs:flex font-medium items-center gap-1">
        {totalKills} / {totalDeaths} / {totalAssists}
      </div>
    </div>
  );
}

export default memo(TeamHeader);
