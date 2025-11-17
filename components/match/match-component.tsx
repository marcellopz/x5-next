import React from "react";
import Image from "next/image";
import Link from "next/link";
import { processMatchData, ProcessedTeam } from "./process-single-match-data";
import {
  formatNumber,
  floatToPercentageString,
  capitalizeFirstLetter,
} from "./match-utils";
import {
  CHAMPIONICONURL,
  ITEMICONURL,
  summonerSpells,
  summonerSpellsUrl,
  baronWinUrl,
  baronLoseUrl,
  dragonWinUrl,
  dragonLoseUrl,
  turretWinUrl,
  turretLoseUrl,
} from "@/lib/resources";
import { Role } from "@/lib/types";

interface MatchComponentProps {
  matchData: unknown;
  matchRoles: Record<string, string> | null;
  playerRanks: Record<string, Record<Role, number | null>>;
}

interface Participant {
  participantId: number;
  teamId: number;
  championId: number;
  championName: string;
  spell1Id: number;
  spell2Id: number;
  stats: {
    kills: number;
    deaths: number;
    assists: number;
    win: boolean;
    champLevel: number;
    goldEarned: number;
    totalMinionsKilled: number;
    neutralMinionsKilled: number;
    visionScore: number;
    item0: number;
    item1: number;
    item2: number;
    item3: number;
    item4: number;
    item5: number;
  };
  identity?: {
    player: {
      summonerId: string | number;
      gameName: string;
      tagLine?: string;
    };
  };
}

interface Team {
  teamId: number;
  baronKills: number;
  dragonKills: number;
  towerKills: number;
  bans: Array<{ championId: number }>;
}

interface MatchData {
  participants: Participant[];
  participantIdentities: Array<{
    participantId: number;
    player: {
      summonerId: string | number;
      gameName: string;
      tagLine?: string;
    };
  }>;
  teams: Team[];
}

const KDA = ({
  kills,
  deaths,
  assists,
}: {
  kills: number;
  deaths: number;
  assists: number;
}) => (
  <div className="flex items-center gap-2 text-muted-foreground justify-center">
    <span className="text-foreground">{kills}</span>
    <span>/</span>
    <span className="text-red-500">{deaths}</span>
    <span>/</span>
    <span className="text-foreground">{assists}</span>
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
      className="flex items-baseline gap-1 justify-center"
      title={tagLine ? `${summonerName}#${tagLine}` : summonerName}
    >
      <span className="text-base font-medium whitespace-nowrap">
        {summonerName}
      </span>
      {tagLine && <span className="text-sm opacity-30">#{tagLine}</span>}
    </div>
  );
};

const BaronDragonTurretBans = ({
  win,
  baron,
  dragon,
  turret,
  bans,
}: {
  win: boolean;
  baron: number;
  dragon: number;
  turret: number;
  bans: Array<{ championId: number }>;
}) => {
  const baronIcon = win ? baronWinUrl : baronLoseUrl;
  const dragonIcon = win ? dragonWinUrl : dragonLoseUrl;
  const turretIcon = win ? turretWinUrl : turretLoseUrl;

  return (
    <div className="flex items-center justify-between p-2 bg-accent/60 border-border border-b">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Image
            src={baronIcon}
            alt="Baron Nashor icon"
            width={20}
            height={20}
          />
          <span className="text-sm">{baron}</span>
        </div>
        <div className="flex items-center gap-2">
          <Image src={dragonIcon} alt="Dragon icon" width={20} height={20} />
          <span className="text-sm">{dragon}</span>
        </div>
        <div className="flex items-center gap-2">
          <Image src={turretIcon} alt="Turret icon" width={20} height={20} />
          <span className="text-sm">{turret}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm opacity-30">Bans:</span>
        <div className="flex gap-1">
          {bans.map((ban, i) => (
            <React.Fragment key={i}>
              {i === 3 && <div className="w-px h-10 bg-border mx-1.5" />}
              <div className="w-10 h-10 bg-background rounded border border-border/60 overflow-hidden">
                <Image
                  src={`${CHAMPIONICONURL}${ban.championId}.png`}
                  alt={`Banned champion icon ${ban.championId}`}
                  width={36}
                  height={36}
                  className="w-full h-full object-contain"
                  unoptimized
                />
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

const ItemsSection = ({ player }: { player: Participant }) => {
  const itemList = [
    player.stats.item0,
    player.stats.item1,
    player.stats.item2,
    player.stats.item3,
    player.stats.item4,
    player.stats.item5,
  ];
  const filteredList = itemList.filter((i) => i > 0);
  while (filteredList.length < 6) {
    filteredList.push(0);
  }

  return (
    <div className="flex flex-wrap gap-1 justify-center w-[130px]">
      {filteredList.map((item, i) => (
        <div
          key={i}
          className="w-9 h-9 bg-background/50 rounded border border-border/60 overflow-hidden flex items-center justify-center"
        >
          {item > 0 && (
            <Image
              src={`${ITEMICONURL}${item}.png`}
              alt={`Item icon ${item}`}
              width={31}
              height={31}
              className="w-full h-full object-contain"
              unoptimized
              title={`Item ${item}`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

const PlayerRow = ({
  player,
  playerRank,
  role,
  totalKills,
}: {
  player: Participant & {
    identity?: {
      player: {
        summonerId: string | number;
        gameName: string;
        tagLine?: string;
      };
    };
  };
  playerRank: number | null;
  role?: string;
  totalKills: number;
}) => {
  const spell1Url =
    summonerSpellsUrl[player.spell1Id as keyof typeof summonerSpellsUrl];
  const spell2Url =
    summonerSpellsUrl[player.spell2Id as keyof typeof summonerSpellsUrl];

  const killParticipation =
    totalKills > 0
      ? (player.stats.kills + player.stats.assists) / totalKills
      : 0;

  return (
    <div className="flex items-center gap-3 p-2 border-b border-border flex-wrap justify-between">
      {/* Champion + spells icons */}
      <div className="flex items-center gap-1.5 shrink-0">
        <div className="relative">
          <div className="absolute flex bottom-0.5 right-0.5 p-1 rounded-lg bg-background/70 z-10">
            <span className="text-sm leading-none">
              {player.stats.champLevel}
            </span>
          </div>
          <Image
            src={`${CHAMPIONICONURL}${player.championId}.png`}
            width={70}
            height={70}
            alt={`${player.championName} champion icon`}
            className="rounded border border-border/60"
            unoptimized
          />
        </div>
        <div className="flex flex-col gap-2">
          {spell1Url && (
            <Image
              src={spell1Url}
              alt={`${
                summonerSpells[
                  player.spell1Id as keyof typeof summonerSpells
                ] || "Summoner Spell 1"
              } icon`}
              width={30}
              height={30}
              className="rounded border border-border/60"
              unoptimized
            />
          )}
          {spell2Url && (
            <Image
              src={spell2Url}
              alt={`${
                summonerSpells[
                  player.spell2Id as keyof typeof summonerSpells
                ] || "Summoner Spell 2"
              } icon`}
              width={30}
              height={30}
              className="rounded border border-border/60"
              unoptimized
            />
          )}
        </div>
      </div>

      {/* Name, KDA, Position */}
      <div className="flex flex-col items-center gap-1 w-36 text-center shrink-0">
        {player.identity?.player && (
          <Link
            href={`/player/${player.identity.player.summonerId}`}
            className="hover:text-primary transition-colors"
          >
            <SummonerNameCell
              summonerName={player.identity.player.gameName}
              tagLine={player.identity.player.tagLine}
            />
          </Link>
        )}
        <KDA
          kills={player.stats.kills}
          deaths={player.stats.deaths}
          assists={player.stats.assists}
        />
        {role && (
          <p className="text-sm opacity-50">
            {capitalizeFirstLetter(role)} {playerRank ? `(${playerRank})` : ""}
          </p>
        )}
      </div>

      {/* General information */}
      <div className="flex flex-col items-center gap-1 text-sm text-center w-40 shrink-0">
        <p>
          Lv {player.stats.champLevel} | {formatNumber(player.stats.goldEarned)}{" "}
          G
        </p>
        <p>
          {player.stats.totalMinionsKilled + player.stats.neutralMinionsKilled}{" "}
          CS | {player.stats.visionScore} VS
        </p>
        <p>Kill Participation: {floatToPercentageString(killParticipation)}</p>
      </div>

      {/* Items */}
      <ItemsSection player={player} />
    </div>
  );
};

const roles = {
  top: 1,
  jungle: 2,
  mid: 3,
  adc: 4,
  support: 5,
};

const TeamMatch = ({
  team,
  matchRoles,
  playerRanks,
}: {
  team: ProcessedTeam | null;
  matchRoles: Record<string, string> | null;
  playerRanks: Record<string, Record<Role, number | null>>;
}) => {
  const sortedPlayers = (() => {
    if (!team) return [];
    if (!matchRoles) return team.players;
    return [...team.players].sort(
      (a, b) =>
        (roles[
          (matchRoles[a.identity?.player.summonerId] ??
            "") as keyof typeof roles
        ] ?? 999) -
        (roles[
          (matchRoles[b.identity?.player.summonerId] ??
            "") as keyof typeof roles
        ] ?? 999)
    );
  })();

  if (!team) return null;

  return (
    <div className="text-lg">
      {/* Team header */}
      <div className="flex items-center justify-between p-2">
        <div className="flex items-center gap-2">
          <span>Team {team.teamId / 100}:</span>
          {team.win ? (
            <span className="text-green-500 font-semibold">Victory</span>
          ) : (
            <span className="text-red-500 font-semibold">Defeat</span>
          )}
        </div>
        <KDA
          kills={team.stats.kills}
          deaths={team.stats.deaths}
          assists={team.stats.assists}
        />
      </div>

      {/* Objectives and bans */}
      <BaronDragonTurretBans
        baron={team.teamStats.baronKills}
        dragon={team.teamStats.dragonKills}
        turret={team.teamStats.towerKills}
        win={team.teamId === 100}
        bans={team.teamStats.bans}
      />

      {/* Players */}
      <div>
        {sortedPlayers.map(
          (
            player: Participant & {
              identity?: {
                player: {
                  summonerId: string | number;
                  gameName: string;
                  tagLine?: string;
                };
              };
            }
          ) => {
            const role =
              matchRoles?.[
                player.identity?.player.summonerId?.toString() as string
              ];
            const playerRank =
              playerRanks[
                player.identity?.player.summonerId?.toString() as string
              ]?.[role as Role];
            return (
              <PlayerRow
                playerRank={playerRank}
                key={player.participantId}
                player={player}
                role={
                  player.identity?.player.summonerId
                    ? matchRoles?.[player.identity.player.summonerId.toString()]
                    : undefined
                }
                totalKills={team.stats.kills}
              />
            );
          }
        )}
      </div>
    </div>
  );
};

export function MatchComponent({
  matchData,
  matchRoles,
  playerRanks,
}: MatchComponentProps) {
  const match = matchData as MatchData | null | undefined;
  const { blueTeam, redTeam } = processMatchData(match);

  if (!match || !blueTeam || !redTeam) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="text-muted-foreground text-sm">No match data available</p>
      </div>
    );
  }

  return (
    <div className="mt-4 border border-border rounded-lg overflow-hidden">
      <div className="flex flex-col xl:flex-row">
        <div className="flex-1 border-b lg:border-b-0 lg:border-r border-border">
          <TeamMatch
            team={blueTeam}
            matchRoles={matchRoles}
            playerRanks={playerRanks}
          />
        </div>
        <div className="flex-1">
          <TeamMatch
            team={redTeam}
            matchRoles={matchRoles}
            playerRanks={playerRanks}
          />
        </div>
      </div>
    </div>
  );
}
