"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslations } from "@/lib/i18n/locale-context";
import type { PlayerRankChangeStats, PlayerList, Role } from "@/lib/types";
import { RankChangesTable } from "./rank-changes-table";
import { WinLossByRoleTable } from "./win-loss-by-role-table";

type ViewMode = "changes" | "winloss" | "susceptibility";
type SusceptibilityLevel = "review" | "almostGuaranteed";

interface SusceptiblePlayer {
  nameId: string;
  rank: number;
  wins: number;
  loses: number;
  totalGames: number;
  winRate: number;
  level: SusceptibilityLevel;
}

interface SusceptibilityBuckets {
  review: SusceptiblePlayer[];
  almostGuaranteed: SusceptiblePlayer[];
}

interface LaneSusceptibility {
  role: Role;
  progression: SusceptibilityBuckets;
  regression: SusceptibilityBuckets;
}

interface RankAnalysisProps {
  data: PlayerRankChangeStats;
  playerList: PlayerList | null;
}

const roles: Role[] = ["top", "jungle", "mid", "adc", "support"];

function formatWinRate(winRate: number): string {
  return `${winRate.toFixed(1)}%`;
}

function getProgressionLevel(
  wins: number,
  loses: number,
  totalGames: number,
  winRate: number
): SusceptibilityLevel | null {
  const almostGuaranteed =
    (totalGames >= 5 && winRate > 70) || (wins === 4 && loses === 0);

  if (almostGuaranteed) return "almostGuaranteed";

  const reducedSampleProgression = wins === 3 && loses <= 2;
  const review = (winRate >= 60 && winRate <= 70) || reducedSampleProgression;

  return review ? "review" : null;
}

function getRegressionLevel(
  wins: number,
  loses: number,
  totalGames: number,
  winRate: number
): SusceptibilityLevel | null {
  const almostGuaranteed =
    (totalGames >= 5 && winRate < 30) || (wins === 0 && loses === 4);

  if (almostGuaranteed) return "almostGuaranteed";

  const reducedSampleRegression = wins <= 2 && loses === 3;
  const review = (winRate >= 30 && winRate <= 40) || reducedSampleRegression;

  return review ? "review" : null;
}

function sortProgression(players: SusceptiblePlayer[]): SusceptiblePlayer[] {
  return [...players].sort(
    (a, b) => b.winRate - a.winRate || b.totalGames - a.totalGames
  );
}

function sortRegression(players: SusceptiblePlayer[]): SusceptiblePlayer[] {
  return [...players].sort(
    (a, b) => a.winRate - b.winRate || b.totalGames - a.totalGames
  );
}

function buildSusceptibilityByLane(data: PlayerRankChangeStats): LaneSusceptibility[] {
  return roles.map((role) => {
    const progressionReview: SusceptiblePlayer[] = [];
    const progressionGuaranteed: SusceptiblePlayer[] = [];
    const regressionReview: SusceptiblePlayer[] = [];
    const regressionGuaranteed: SusceptiblePlayer[] = [];

    const roleEntries = data.win_loses_since_last_change[role];

    for (const [nameId, stats] of Object.entries(roleEntries)) {
      const totalGames = stats.wins + stats.loses;
      if (totalGames === 0) continue;

      const winRate = (stats.wins / totalGames) * 100;
      const playerData = {
        nameId,
        rank: stats.rank,
        wins: stats.wins,
        loses: stats.loses,
        totalGames,
        winRate,
      };

      const progressionLevel = getProgressionLevel(
        stats.wins,
        stats.loses,
        totalGames,
        winRate
      );
      const regressionLevel = getRegressionLevel(
        stats.wins,
        stats.loses,
        totalGames,
        winRate
      );

      if (progressionLevel === "review") {
        progressionReview.push({ ...playerData, level: "review" });
      }
      if (progressionLevel === "almostGuaranteed") {
        progressionGuaranteed.push({
          ...playerData,
          level: "almostGuaranteed",
        });
      }
      if (regressionLevel === "review") {
        regressionReview.push({ ...playerData, level: "review" });
      }
      if (regressionLevel === "almostGuaranteed") {
        regressionGuaranteed.push({
          ...playerData,
          level: "almostGuaranteed",
        });
      }
    }

    return {
      role,
      progression: {
        review: sortProgression(progressionReview),
        almostGuaranteed: sortProgression(progressionGuaranteed),
      },
      regression: {
        review: sortRegression(regressionReview),
        almostGuaranteed: sortRegression(regressionGuaranteed),
      },
    };
  });
}

function SusceptibilityList({
  players,
  getPlayerName,
  t,
}: {
  players: SusceptiblePlayer[];
  getPlayerName: (nameId: string) => string;
  t: (key: string) => string;
}) {
  if (players.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {players.map((player) => (
        <div
          key={`${player.nameId}-${player.level}-${player.wins}-${player.loses}`}
          className="w-fit max-w-full rounded-lg border border-border px-3 py-2"
        >
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
            <Link
              href={`/player/${player.nameId}`}
              className="font-semibold hover:text-primary"
            >
              {getPlayerName(player.nameId)} ({player.rank}):
            </Link>
            <span className="text-xs text-muted-foreground">
              {player.wins}/{player.loses}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatWinRate(player.winRate)}
            </span>
            <span className="text-xs text-muted-foreground">
              {player.totalGames} {t("stats.gamesLabel")}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function SusceptibilityCategory({
  title,
  reviewPlayers,
  guaranteedPlayers,
  getPlayerName,
  t,
  titleClassName,
}: {
  title: string;
  reviewPlayers: SusceptiblePlayer[];
  guaranteedPlayers: SusceptiblePlayer[];
  getPlayerName: (nameId: string) => string;
  t: (key: string) => string;
  titleClassName: string;
}) {
  const hasCandidates = reviewPlayers.length > 0 || guaranteedPlayers.length > 0;
  if (!hasCandidates) return null;

  return (
    <div className="space-y-3">
      <h4 className={cn("text-sm font-semibold", titleClassName)}>{title}</h4>
      <div className="space-y-3">
        {reviewPlayers.length > 0 && (
          <div>
            <p className="text-xs font-medium mb-2 text-muted-foreground">
              {t("stats.requiresTechnicalReview")}
            </p>
            <SusceptibilityList
              players={reviewPlayers}
              getPlayerName={getPlayerName}
              t={t}
            />
          </div>
        )}
        {guaranteedPlayers.length > 0 && (
          <div>
            <p className="text-xs font-medium mb-2 text-muted-foreground">
              {t("stats.almostGuaranteed")}
            </p>
            <SusceptibilityList
              players={guaranteedPlayers}
              getPlayerName={getPlayerName}
              t={t}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export function RankAnalysis({ data, playerList }: RankAnalysisProps) {
  const t = useTranslations();
  const [viewMode, setViewMode] = useState<ViewMode>("susceptibility");
  const susceptibilityByLane = buildSusceptibilityByLane(data);

  const getPlayerName = (nameId: string): string => {
    if (!playerList || !playerList[nameId]) {
      return nameId;
    }
    return playerList[nameId].name;
  };

  return (
    <div className="space-y-6">
      {/* View Mode Toggle */}
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={viewMode === "susceptibility" ? "default" : "outline"}
          onClick={() => setViewMode("susceptibility")}
          className={cn(
            "transition-colors rounded-xl!",
            viewMode === "susceptibility" && "ring-2 ring-primary/50"
          )}
        >
          {t("stats.rankChangeSusceptibilityTitle")}
        </Button>
        <Button
          size="sm"
          variant={viewMode === "winloss" ? "default" : "outline"}
          onClick={() => setViewMode("winloss")}
          className={cn(
            "transition-colors rounded-xl!",
            viewMode === "winloss" && "ring-2 ring-primary/50"
          )}
        >
          {t("stats.winLossSinceRankChange")}
        </Button>
        <Button
          size="sm"
          variant={viewMode === "changes" ? "default" : "outline"}
          onClick={() => setViewMode("changes")}
          className={cn(
            "transition-colors rounded-xl!",
            viewMode === "changes" && "ring-2 ring-primary/50"
          )}
        >
          {t("stats.rankChanges")}
        </Button>
      </div>

      {/* Content */}
      {viewMode === "susceptibility" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-x-6 gap-y-6">
          {susceptibilityByLane.map((laneStats) => {
            const hasProgression =
              laneStats.progression.review.length > 0 ||
              laneStats.progression.almostGuaranteed.length > 0;
            const hasRegression =
              laneStats.regression.review.length > 0 ||
              laneStats.regression.almostGuaranteed.length > 0;

            return (
              <div
                key={laneStats.role}
                className={cn(
                  "p-0 md:pl-6",
                  "md:border-l md:border-border/70 md:nth-[2n+1]:border-l-0 md:nth-[2n+1]:pl-0",
                  "xl:border-l xl:border-border/70 xl:nth-[2n+1]:border-l xl:nth-[2n+1]:pl-6 xl:nth-[3n+1]:border-l-0 xl:nth-[3n+1]:pl-0",
                  "2xl:border-l 2xl:border-border/70 2xl:nth-[3n+1]:border-l 2xl:nth-[3n+1]:pl-6 2xl:nth-[5n+1]:border-l-0 2xl:nth-[5n+1]:pl-0"
                )}
              >
                <h3 className="text-base font-semibold mb-4">
                  {t(`roles.${laneStats.role}`)}
                </h3>

                <div className="space-y-4">
                  {!hasProgression && !hasRegression && (
                    <p className="text-sm text-muted-foreground">
                      {t("stats.noPlayersForRole")}
                    </p>
                  )}

                  {hasProgression && (
                    <SusceptibilityCategory
                      title={t("stats.progressionCandidates")}
                      reviewPlayers={laneStats.progression.review}
                      guaranteedPlayers={laneStats.progression.almostGuaranteed}
                      getPlayerName={getPlayerName}
                      t={t}
                      titleClassName="text-green-500"
                    />
                  )}

                  {hasRegression && (
                    <div className={cn(hasProgression && "pt-4 border-t border-border/70")}>
                      <SusceptibilityCategory
                        title={t("stats.regressionCandidates")}
                        reviewPlayers={laneStats.regression.review}
                        guaranteedPlayers={laneStats.regression.almostGuaranteed}
                        getPlayerName={getPlayerName}
                        t={t}
                        titleClassName="text-red-500"
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {viewMode === "changes" && (
        <RankChangesTable
          data={data.number_of_changes}
          getPlayerName={getPlayerName}
        />
      )}

      {viewMode === "winloss" && (
        <WinLossByRoleTable
          data={data.win_loses_since_last_change}
          getPlayerName={getPlayerName}
        />
      )}
    </div>
  );
}
