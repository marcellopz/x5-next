"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { ExternalLink } from "lucide-react";
import type { MatchWithId, ReducedParticipant } from "@/lib/types";
import {
  CHAMPIONICONURL,
  ITEMICONURL,
  summonerSpellsUrl,
} from "@/lib/resources";

interface SummaryMatchItemProps {
  match: MatchWithId;
  participant: ReducedParticipant;
}

function formatGameDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

function getDaysSince(date: Date): number {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  return Math.floor(diffInSeconds / 86400);
}

function formatMatchDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year:
      date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
  });
}

function getKDA(kills: number, deaths: number, assists: number): string {
  if (deaths === 0) return "Perfect";
  return ((kills + assists) / deaths).toFixed(2);
}

export function SummaryMatchItem({
  match,
  participant,
}: SummaryMatchItemProps) {
  const isWin = participant.stats.win;
  const gameDate = new Date(match.date);
  const daysSince = getDaysSince(gameDate);
  const matchDateStr = formatMatchDate(gameDate);
  const kda = getKDA(
    participant.stats.kills,
    participant.stats.deaths,
    participant.stats.assists
  );

  // Get items
  const items = useMemo(() => {
    return [
      participant.stats.item0,
      participant.stats.item1,
      participant.stats.item2,
      participant.stats.item3,
      participant.stats.item4,
      participant.stats.item5,
    ].filter((item) => item > 0);
  }, [participant.stats]);

  // Sort teams by role
  const sortedParticipants = useMemo(() => {
    const roleOrder: { [key: string]: number } = {
      top: 1,
      jungle: 2,
      mid: 3,
      adc: 4,
      support: 5,
    };

    return [...match.participants].sort((a, b) => {
      const aRole = roleOrder[a.role?.toLowerCase() || ""] || 99;
      const bRole = roleOrder[b.role?.toLowerCase() || ""] || 99;
      return aRole - bRole;
    });
  }, [match.participants]);

  const blueTeam = sortedParticipants.filter((p) => p.teamId === 100);
  const redTeam = sortedParticipants.filter((p) => p.teamId === 200);

  // Always show 6 item slots
  const itemSlots = useMemo(() => {
    const slots = [...items];
    while (slots.length < 6) {
      slots.push(0);
    }
    return slots.slice(0, 6);
  }, [items]);

  return (
    <div
      className={`px-2 pt-1 pb-2 rounded-lg ${
        isWin
          ? "bg-green-500/10 border border-green-500/35"
          : "bg-red-500/10 border border-red-500/35"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-1 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="capitalize font-semibold text-foreground">
            {participant.role}
          </span>
          <span>•</span>
          <span>
            {matchDateStr} ({daysSince}d ago)
          </span>
          <span>•</span>
          <span>{formatGameDuration(match.gameDuration)}</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`font-semibold ${
              isWin ? "text-green-500" : "text-red-500"
            }`}
          >
            {isWin ? "Victory" : "Defeat"}
          </div>
          <Link
            href={`/match/${match.matchId}`}
            className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md border border-input bg-background px-2 py-1 text-xs font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-6"
            title="View match details"
          >
            Details
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-wrap items-center justify-between">
        {/* Champion/Spells and KDA - Stay together on first row on small screens */}
        <div className="flex items-center justify-evenly sm:flex-1 sm:justify-between gap-2 sm:gap-6 w-full sm:w-auto">
          {/* Champion and Spells - Responsive width */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 w-[70px] sm:w-[90px] lg:w-[100px]">
            <div className="relative">
              <Image
                src={`${CHAMPIONICONURL}${participant.championId}.png`}
                alt={participant.championName}
                width={60}
                height={60}
                className="rounded border border-border/60 lg:h-16 lg:w-16"
              />
            </div>
            {/* Spells */}
            <div className="flex flex-col gap-0.5 sm:gap-1">
              {participant.spellsIds?.[0] &&
                summonerSpellsUrl[
                  participant.spellsIds[0] as keyof typeof summonerSpellsUrl
                ] && (
                  <Image
                    src={
                      summonerSpellsUrl[
                        participant
                          .spellsIds[0] as keyof typeof summonerSpellsUrl
                      ]
                    }
                    alt="Summoner spell 1"
                    width={27}
                    height={27}
                    className="rounded-sm border border-border/60"
                  />
                )}
              {participant.spellsIds?.[1] &&
                summonerSpellsUrl[
                  participant.spellsIds[1] as keyof typeof summonerSpellsUrl
                ] && (
                  <Image
                    src={
                      summonerSpellsUrl[
                        participant
                          .spellsIds[1] as keyof typeof summonerSpellsUrl
                      ]
                    }
                    alt="Summoner spell 2"
                    width={27}
                    height={27}
                    className="rounded-sm border border-border/60"
                  />
                )}
            </div>
          </div>

          {/* KDA Stats - Responsive width */}
          <div className="flex flex-col gap-0.5 sm:w-[80px] items-center justify-center">
            <div className="text-xs sm:text-sm lg:text-base font-semibold text-foreground text-center whitespace-nowrap">
              {participant.stats.kills} / {participant.stats.deaths} /{" "}
              {participant.stats.assists}
            </div>
            <div className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground text-center">
              {kda} KDA
            </div>
          </div>
        </div>

        {/* Items and Teams - Wrap together to second row on small screens */}
        <div className="flex flex-wrap items-center justify-evenly gap-2 sm:gap-3 w-full sm:w-auto sm:flex-nowrap sm:flex-3">
          {/* Items - Responsive width grid */}
          <div className="grid grid-cols-3 xl:grid-cols-6 gap-1.5 p-1 sm:p-1.5">
            {itemSlots.map((item, index) => (
              <div
                key={index}
                className="w-6 h-6 sm:w-8 sm:h-8 xl:w-10 xl:h-10 bg-background/50 rounded overflow-hidden flex items-center justify-center border border-border/60"
              >
                {item > 0 && (
                  <Image
                    src={`${ITEMICONURL}${item}.png`}
                    alt={`Item ${item}`}
                    width={32}
                    height={32}
                    className="w-full h-full xl:w-9 xl:h-9"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Teams - Responsive widths */}
          <div className="flex items-start gap-1.5 sm:gap-3 sm:w-auto min-w-0">
            {/* Blue Team */}
            <div className="flex flex-col gap-0.5 w-[70px] sm:w-[90px] md:w-[100px] lg:w-[110px] min-w-0">
              {blueTeam.map((p) => (
                <div
                  key={p.participantId}
                  className="flex items-center gap-0.5 sm:gap-1 min-w-0"
                >
                  <Image
                    src={`${CHAMPIONICONURL}${p.championId}.png`}
                    alt={p.championName}
                    width={14}
                    height={14}
                    className="rounded shrink-0 sm:w-4 sm:h-4 border border-border/60"
                  />
                  <Link
                    href={`/player/${p.summonerId}`}
                    className={`text-[10px] sm:text-xs truncate hover:text-primary transition-colors ${
                      p.summonerId === participant.summonerId
                        ? "font-semibold text-foreground"
                        : "text-muted-foreground"
                    }`}
                    title={p.summonerName}
                  >
                    {p.summonerName}
                  </Link>
                </div>
              ))}
            </div>

            {/* Red Team */}
            <div className="flex flex-col gap-0.5 w-[70px] sm:w-[90px] md:w-[100px] lg:w-[110px] min-w-0">
              {redTeam.map((p) => (
                <div
                  key={p.participantId}
                  className="flex items-center gap-0.5 sm:gap-1 min-w-0"
                >
                  <Image
                    src={`${CHAMPIONICONURL}${p.championId}.png`}
                    alt={p.championName}
                    width={14}
                    height={14}
                    className="rounded shrink-0 sm:w-4 sm:h-4 border border-border/60"
                  />
                  <Link
                    href={`/player/${p.summonerId}`}
                    className={`text-[10px] sm:text-xs truncate hover:text-primary transition-colors ${
                      p.summonerId === participant.summonerId
                        ? "font-semibold text-foreground"
                        : "text-muted-foreground"
                    }`}
                    title={p.summonerName}
                  >
                    {p.summonerName}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
