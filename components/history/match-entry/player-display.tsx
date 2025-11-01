"use client";

import * as React from "react";
import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { championIds, CHAMPIONICONURL, ITEMICONURL } from "@/lib/resources";
import type { ReducedMatchData } from "@/lib/types";

export interface PlayerDisplayProps {
  participant: ReducedMatchData["participants"][0];
  totalKills: number;
  priority?: boolean;
}

export function PlayerDisplay({
  participant,
  totalKills,
  priority = false,
}: PlayerDisplayProps) {
  const championName =
    championIds[participant.championId as keyof typeof championIds];
  const championIconUrl = `${CHAMPIONICONURL}${participant.championId}.png`;

  const items = [
    participant.stats.item0,
    participant.stats.item1,
    participant.stats.item2,
    participant.stats.item3,
    participant.stats.item4,
    participant.stats.item5,
  ].sort((a, b) => b - a);

  const killParticipation =
    totalKills > 0
      ? Math.round(
          ((participant.stats.kills + participant.stats.assists) / totalKills) *
            100
        )
      : 0;

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] sm:grid-cols-[minmax(0,1fr)_auto_auto] md:grid-cols-[minmax(0,1fr)_auto_auto_auto] lg:grid-cols-[minmax(0,1fr)_150px_auto_auto_auto] xl:grid-cols-[minmax(0,1fr)_200px_auto_auto_auto] gap-2 xl:gap-5 2xl:gap-10 items-center overflow-hidden lg:mr-1">
      {/* Champion Icon & Player Info */}
      <div className="flex items-center gap-2 xl:gap-3 min-w-0 overflow-hidden">
        {/* Champion Icon */}
        <div className="relative shrink-0 w-8 h-8 xl:w-10 xl:h-10">
          <Image
            src={championIconUrl}
            alt={championName || "Champion"}
            width={40}
            height={40}
            className="rounded border border-border w-full h-full"
            priority={priority}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
            }}
          />
          <div className="absolute -bottom-[5px] -right-[6px]">
            <div className="w-5 h-5 xl:w-6 xl:h-6 bg-secondary/80 rounded-full flex items-center justify-center">
              <span className="text-xs xl:text-sm font-medium text-secondary-foreground leading-none">
                {participant.stats.champLevel}
              </span>
            </div>
          </div>
        </div>

        {/* Player Info */}
        <div className="flex flex-col min-w-0 overflow-hidden">
          <Link
            href={`/player/${participant.summonerId}`}
            className="text-xs xl:text-sm font-medium truncate hover:text-primary transition-colors block"
          >
            {participant.summonerName}
          </Link>
          <div className="text-xs xl:text-sm text-muted-foreground truncate">
            {championName || `Champion ${participant.championId}`}
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="hidden lg:grid grid-cols-6 gap-1">
        {items.map((item, index) => (
          <div
            key={`item-${index}`}
            className="w-[24px] h-[24px] xl:w-[32px] xl:h-[32px] rounded-md border border-border bg-muted/20 flex items-center justify-center"
          >
            {item !== 0 && (
              <Image
                src={`${ITEMICONURL}${item}.png`}
                alt={`Item ${item}`}
                width={32}
                height={32}
                className="rounded-md w-full h-full object-cover"
                priority={priority}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* KDA */}
      <div className="flex items-center ml-1">
        <div className="text-xs xl:text-sm font-medium text-center w-12 sm:w-14">
          <div>
            {participant.stats.kills}/{participant.stats.deaths}/
            {participant.stats.assists}
          </div>
          <div className="text-muted-foreground">
            {participant.stats.deaths === 0
              ? "Perfect"
              : (
                  (participant.stats.kills + participant.stats.assists) /
                  participant.stats.deaths
                ).toFixed(1)}
          </div>
        </div>
        <div className="hidden 2xl:block w-8 text-sm text-muted-foreground">
          ({killParticipation}%)
        </div>
      </div>

      {/* CS */}
      <div
        className="text-xs xl:text-sm text-muted-foreground text-right w-10 whitespace-nowrap hidden sm:block"
        title={`${participant.stats.totalCs} Creep Score (minions and monsters killed)`}
      >
        {participant.stats.totalCs} CS
      </div>

      {/* VS */}
      <div
        className="text-xs xl:text-sm text-muted-foreground text-right w-10 whitespace-nowrap hidden md:block"
        title={`${participant.stats.visionScore} Vision Score (wards placed, cleared, etc.)`}
      >
        {participant.stats.visionScore} VS
      </div>
    </div>
  );
}

export default memo(PlayerDisplay);
