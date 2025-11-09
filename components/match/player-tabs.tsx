"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CHAMPIONICONURL } from "@/lib/resources";
import { formatNumber } from "./match-utils";

interface PlayerTabsProps {
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

const Tab = ({
  setTabState,
  tabState,
  n,
  champId,
}: {
  setTabState: (n: number) => void;
  tabState: number;
  n: number;
  champId: number;
}) => (
  <button
    onClick={() => setTabState(n)}
    className={`flex-1 h-12 flex items-center justify-center transition-colors ${
      tabState === n
        ? "border-l border-r border-b-0 border-border bg-background/50 font-semibold"
        : "bg-accent/70 border-l border-r border-b border-border/50 hover:bg-background/10"
    }`}
  >
    <div className="px-4">
      <Image
        src={`${CHAMPIONICONURL}${champId}.png`}
        width={40}
        height={40}
        alt={`Champion icon ${champId}`}
        className="rounded border border-border/60"
        unoptimized
      />
    </div>
  </button>
);

const StatBox = ({
  number,
  text,
}: {
  number: string | number;
  text: string;
}) => (
  <div className="w-1/5 min-w-[100px] h-24 text-center py-4">
    <p className="text-2xl font-semibold text-foreground">
      {formatNumber(number)}
    </p>
    <p className="text-base text-muted-foreground">{text}</p>
  </div>
);

const SummonerNameCell = ({
  summonerName,
  tagLine,
}: {
  summonerName: string;
  tagLine?: string;
}) => {
  return (
    <div
      className="flex items-baseline gap-1.5 mt-5 ml-10"
      title={tagLine ? `${summonerName}#${tagLine}` : summonerName}
    >
      <span className="text-2xl font-medium">{summonerName}</span>
      {tagLine && <span className="text-xl opacity-30">#{tagLine}</span>}
    </div>
  );
};

export function PlayerTabs({ matchData }: PlayerTabsProps) {
  const [tabState, setTabState] = useState(0);

  const match = matchData as MatchData | null | undefined;

  if (!match || !match.participants || match.participants.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground text-sm">No match data available</p>
      </div>
    );
  }

  const curr_p = match.participants[tabState];

  if (!curr_p.identity) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground text-sm">
          Player identity not available
        </p>
      </div>
    );
  }

  const kda =
    curr_p.stats.deaths > 0
      ? (
          (curr_p.stats.kills + curr_p.stats.assists) /
          curr_p.stats.deaths
        ).toFixed(2)
      : (curr_p.stats.kills + curr_p.stats.assists).toFixed(2);

  const damagePerKill =
    curr_p.stats.kills > 0
      ? (curr_p.stats.totalDamageDealtToChampions / curr_p.stats.kills).toFixed(
          2
        )
      : "0";

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className="flex flex-wrap">
        {match.participants.map((p, i) => (
          <Tab
            key={i}
            champId={p.championId}
            n={i}
            setTabState={setTabState}
            tabState={tabState}
          />
        ))}
      </div>
      <div className="border-l border-r border-border p-4">
        <Link
          href={`/player/${curr_p.identity.player.summonerId}`}
          className="hover:text-primary transition-colors"
        >
          <SummonerNameCell
            summonerName={curr_p.identity.player.gameName}
            tagLine={curr_p.identity.player.tagLine}
          />
        </Link>

        <div className="flex flex-wrap gap-4 p-4">
          <StatBox number={kda} text="KDA" />
          <StatBox number={curr_p.stats.doubleKills} text="Double Kills" />
          <StatBox number={curr_p.stats.tripleKills} text="Triple Kills" />
          <StatBox number={curr_p.stats.quadraKills} text="Quadra Kills" />
          <StatBox number={curr_p.stats.pentaKills} text="Penta Kills" />
          <StatBox number={damagePerKill} text="Damage Per Kill" />
          <StatBox
            number={curr_p.stats.totalDamageDealtToChampions}
            text="Damage To Champions"
          />
          <StatBox
            number={curr_p.stats.damageDealtToTurrets}
            text="Damage To Turrets"
          />
          <StatBox
            number={curr_p.stats.largestKillingSpree}
            text="Largest Killing Spree"
          />
          <StatBox number={curr_p.stats.goldEarned} text="Gold Earned" />
          <StatBox number={curr_p.stats.wardsKilled} text="Wards Destroyed" />
          <StatBox number={curr_p.stats.wardsPlaced} text="Wards Placed" />
          <StatBox number={curr_p.stats.visionScore} text="Vision Score" />
          <StatBox
            number={curr_p.stats.visionWardsBoughtInGame}
            text="Vision Wards Bought"
          />
          <StatBox number={curr_p.stats.totalHeal} text="Total Healing" />
          <StatBox
            number={curr_p.stats.totalDamageTaken}
            text="Total Damage Taken"
          />
        </div>
      </div>
    </div>
  );
}
