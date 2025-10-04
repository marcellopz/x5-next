"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { championIds, CHAMPIONICONURL } from "@/lib/resources";
import type { MatchData } from "@/lib/types";

export interface PlayerDisplayProps {
  participant: MatchData["participants"][0];
}

export function PlayerDisplay({ participant }: PlayerDisplayProps) {
  const championName =
    championIds[participant.championId as keyof typeof championIds];
  const championIconUrl = `${CHAMPIONICONURL}${participant.championId}.png`;

  return (
    <div className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[auto_1fr_auto_auto] lg:grid-cols-[auto_1fr_auto_auto_auto] gap-2 items-center min-w-0">
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
        <div className="absolute -bottom-1 -right-1">
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

      {/* KDA */}
      <div className="text-xs font-medium text-right w-10">
        {participant.stats.kills}/{participant.stats.deaths}/
        {participant.stats.assists}
      </div>

      {/* CS */}
      <div
        className="text-xs text-muted-foreground text-right w-12 hidden md:block"
        title={`${participant.stats.totalCs} Creep Score (minions and monsters killed)`}
      >
        {participant.stats.totalCs} CS
      </div>

      {/* VS */}
      <div
        className="text-xs text-muted-foreground text-right w-10 hidden lg:block"
        title={`${participant.stats.visionScore} Vision Score (wards placed, cleared, etc.)`}
      >
        {participant.stats.visionScore} VS
      </div>
    </div>
  );
}
