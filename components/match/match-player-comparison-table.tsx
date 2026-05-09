"use client";

import Image from "next/image";
import Link from "next/link";
import { CHAMPIONICONURL } from "@/lib/resources";
import { formatNumber } from "./match-utils";
import { useTranslations } from "@/lib/i18n/locale-context";

interface MatchPlayerComparisonTableProps {
  matchData: unknown;
}

interface Participant {
  participantId: number;
  championId: number;
  championName: string;
  stats: {
    kills: number;
    deaths: number;
    assists: number;
    doubleKills: number;
    tripleKills: number;
    quadraKills: number;
    pentaKills: number;
    totalDamageDealtToChampions: number;
    damageDealtToTurrets: number;
    largestKillingSpree: number;
    goldEarned: number;
    wardsKilled: number;
    wardsPlaced: number;
    visionScore: number;
    visionWardsBoughtInGame: number;
    totalHeal: number;
    totalDamageTaken: number;
  };
  identity?: {
    player: {
      summonerId: string | number;
      gameName: string;
      tagLine?: string;
    };
  };
}

interface MatchData {
  participants: Participant[];
}

interface StatRow {
  key: string;
  label: string;
  getValue: (participant: Participant) => string | number;
}

const toComparableNumber = (value: string | number): number => {
  if (typeof value === "number") return value;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : Number.NEGATIVE_INFINITY;
};

export function MatchPlayerComparisonTable({
  matchData,
}: MatchPlayerComparisonTableProps) {
  const t = useTranslations();
  const match = matchData as MatchData | null | undefined;

  if (!match || !match.participants || match.participants.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground text-sm">{t("common.noMatchDataAvailable")}</p>
      </div>
    );
  }

  const statRows: StatRow[] = [
    {
      key: "kda",
      label: t("common.kda"),
      getValue: (participant) =>
        participant.stats.deaths > 0
          ? (
              (participant.stats.kills + participant.stats.assists) /
              participant.stats.deaths
            ).toFixed(2)
          : (participant.stats.kills + participant.stats.assists).toFixed(2),
    },
    {
      key: "doubleKills",
      label: t("match.doubleKills"),
      getValue: (participant) => participant.stats.doubleKills,
    },
    {
      key: "tripleKills",
      label: t("match.tripleKills"),
      getValue: (participant) => participant.stats.tripleKills,
    },
    {
      key: "quadraKills",
      label: t("match.quadraKills"),
      getValue: (participant) => participant.stats.quadraKills,
    },
    {
      key: "pentaKills",
      label: t("match.pentaKills"),
      getValue: (participant) => participant.stats.pentaKills,
    },
    {
      key: "damagePerKill",
      label: t("match.damagePerKill"),
      getValue: (participant) =>
        participant.stats.kills > 0
          ? (
              participant.stats.totalDamageDealtToChampions /
              participant.stats.kills
            ).toFixed(2)
          : "0",
    },
    {
      key: "totalDamageDealtToChampions",
      label: t("match.damageToChampions"),
      getValue: (participant) => participant.stats.totalDamageDealtToChampions,
    },
    {
      key: "damageDealtToTurrets",
      label: t("match.damageToTurrets"),
      getValue: (participant) => participant.stats.damageDealtToTurrets,
    },
    {
      key: "largestKillingSpree",
      label: t("match.largestKillingSpree"),
      getValue: (participant) => participant.stats.largestKillingSpree,
    },
    {
      key: "goldEarned",
      label: t("match.goldEarned"),
      getValue: (participant) => participant.stats.goldEarned,
    },
    {
      key: "wardsKilled",
      label: t("match.wardsDestroyed"),
      getValue: (participant) => participant.stats.wardsKilled,
    },
    {
      key: "wardsPlaced",
      label: t("match.wardsPlaced"),
      getValue: (participant) => participant.stats.wardsPlaced,
    },
    {
      key: "visionScore",
      label: t("match.visionScore"),
      getValue: (participant) => participant.stats.visionScore,
    },
    {
      key: "visionWardsBoughtInGame",
      label: t("match.visionWardsBought"),
      getValue: (participant) => participant.stats.visionWardsBoughtInGame,
    },
    {
      key: "totalHeal",
      label: t("match.totalHealing"),
      getValue: (participant) => participant.stats.totalHeal,
    },
    {
      key: "totalDamageTaken",
      label: t("match.totalDamageTaken"),
      getValue: (participant) => participant.stats.totalDamageTaken,
    },
  ];

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] border-collapse">
          <thead>
            <tr className="border-b border-border bg-accent/60">
              <th className="w-44 min-w-44 px-3 py-2 text-left text-xs font-semibold text-foreground">
                {t("common.champion")}
              </th>
              {match.participants.map((participant) => (
                <th
                  key={participant.participantId}
                  className="min-w-[96px] px-2 py-2 text-center"
                >
                  <div className="flex justify-center">
                    <Image
                      src={`${CHAMPIONICONURL}${participant.championId}.png`}
                      width={36}
                      height={36}
                      alt={`${participant.championName} ${participant.championId}`}
                      className="rounded border border-border/60"
                      sizes="36px"
                    />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border/70">
              <td className="px-3 py-2 text-xs font-medium text-muted-foreground">
                Player
              </td>
              {match.participants.map((participant) => {
                const identity = participant.identity?.player;
                const playerDisplay = identity ? identity.gameName : "-";

                return (
                  <td
                    key={`${participant.participantId}-player`}
                    className="px-2 py-2 text-center text-xs"
                  >
                    {identity ? (
                      <Link
                        href={`/player/${identity.summonerId}`}
                        className="font-medium hover:text-primary transition-colors"
                        title={playerDisplay}
                      >
                        {playerDisplay}
                      </Link>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                );
              })}
            </tr>
            {statRows.map((row, rowIndex) =>
              (() => {
                const rowValues = match.participants.map((participant) =>
                  row.getValue(participant)
                );
                const maxValue = Math.max(
                  ...rowValues.map((value) => toComparableNumber(value))
                );

                return (
                  <tr
                    key={row.key}
                    className={
                      rowIndex === statRows.length - 1
                        ? ""
                        : "border-b border-border/70"
                    }
                  >
                    <td className="px-3 py-2 text-xs font-medium text-muted-foreground">
                      {row.label}
                    </td>
                    {match.participants.map((participant, index) => {
                      const value = rowValues[index];
                      const isHighest = toComparableNumber(value) === maxValue;

                      return (
                        <td
                          key={`${participant.participantId}-${row.key}`}
                          className={`px-2 py-2 text-center text-xs font-semibold ${
                            isHighest
                              ? "bg-primary/10 text-primary"
                              : "text-foreground"
                          }`}
                        >
                          {formatNumber(value)}
                        </td>
                      );
                    })}
                  </tr>
                );
              })()
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
