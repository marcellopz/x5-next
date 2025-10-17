"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { championIds, CHAMPIONICONURL, ITEMICONURL } from "@/lib/resources";
import type { ReducedMatchData } from "@/lib/types";

export interface PlayerDisplayProps {
  participant: ReducedMatchData["participants"][0];
}

export function PlayerDisplay({ participant }: PlayerDisplayProps) {
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

  return (
    <div className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[auto_1fr_150px_auto] lg:grid-cols-[auto_1fr_150px_auto_auto] xl:grid-cols-[auto_1fr_150px_auto_auto_auto] gap-1 sm:gap-2 items-center min-w-0 lg:mr-1">
      {/* Champion Icon */}
      <div className="relative flex-shrink-0">
        <Image
          src={championIconUrl}
          alt={championName || "Champion"}
          width={32}
          height={32}
          className="rounded border border-border"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
          }}
        />
        <div className="absolute -bottom-[5px] -right-[6px]">
          <div className="w-5 h-5 bg-secondary/80 rounded-full flex items-center justify-center">
            <span className="text-xs font-medium text-secondary-foreground leading-none">
              {participant.stats.champLevel}
            </span>
          </div>
        </div>
      </div>

      {/* Player Info */}
      <div className="min-w-0">
        <Link
          href={`/player/${participant.summonerId}`}
          className="text-xs font-medium truncate hover:text-primary transition-colors block"
        >
          {participant.summonerName}
        </Link>
        <div className="text-xs text-muted-foreground truncate">
          {championName || `Champion ${participant.championId}`}
        </div>
      </div>

      {/* Items */}
      <div className="hidden md:grid grid-cols-6 gap-1">
        {items.map((item, index) => (
          <div
            key={`item-${index}`}
            className="w-[24px] h-[24px] rounded-md border border-border bg-muted/20 flex items-center justify-center"
          >
            {item !== 0 && (
              <Image
                src={`${ITEMICONURL}${item}.png`}
                alt={`Item ${item}`}
                width={24}
                height={24}
                className="rounded-md w-full h-full object-cover"
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
      <div className="text-xs font-medium text-center w-8 sm:w-10 md:w-12">
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

      {/* CS */}
      <div
        className="text-xs text-muted-foreground text-right w-10 whitespace-nowrap hidden lg:block"
        title={`${participant.stats.totalCs} Creep Score (minions and monsters killed)`}
      >
        {participant.stats.totalCs} CS
      </div>

      {/* VS */}
      <div
        className="text-xs text-muted-foreground text-right w-10 whitespace-nowrap hidden xl:block"
        title={`${participant.stats.visionScore} Vision Score (wards placed, cleared, etc.)`}
      >
        {participant.stats.visionScore} VS
      </div>
    </div>
  );
}
