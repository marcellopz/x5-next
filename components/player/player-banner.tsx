"use client";

import { useMemo } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { getChampionSplash } from "@/lib/resources";
import { PlayerCard } from "@/components/ui/player-card";
import type { Player, PlayerInfo, ChampionStats } from "@/lib/types";
import { WinRateCircularProgress } from "@/components/ui/win-rate-circular-progress";
import { getLatestRankChangeEntryPerRole } from "@/lib/rank-utils";
import { usePlayerData } from "./player-data-context";
import { useTranslations } from "@/lib/i18n/locale-context";

interface PlayerBannerProps {
  champs: ChampionStats[];
  playerInfo: PlayerInfo;
  player: Player | null;
}

const roles = ["top", "jungle", "mid", "adc", "support"] as const;
const roleIcons = [
  "/top.png",
  "/jungle.png",
  "/mid.png",
  "/bot.png",
  "/supp.png",
];

function floatToPercentageString(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

// Size variants configuration
type SizeVariant = "sm" | "md" | "lg";
interface SizeConfig {
  nameSize: string;
  tagSize: string;
  iconSize: number;
  matchesTextSize: string;
  matchesNumberSize: string;
}

const sizeConfigs: Record<SizeVariant, SizeConfig> = {
  sm: {
    nameSize: "text-3xl",
    tagSize: "",
    iconSize: 24,
    matchesTextSize: "text-lg",
    matchesNumberSize: "text-xl",
  },
  md: {
    nameSize: "text-2xl",
    tagSize: "text-sm",
    iconSize: 20,
    matchesTextSize: "text-base",
    matchesNumberSize: "text-lg",
  },
  lg: {
    nameSize: "text-3xl",
    tagSize: "",
    iconSize: 24,
    matchesTextSize: "text-lg",
    matchesNumberSize: "text-xl",
  },
};

// Player Info Component
interface PlayerInfoSectionProps {
  playerInfo: PlayerInfo;
  player: Player | null;
  onOpggClick: () => void;
  variant: SizeVariant;
}

function PlayerInfoSection({
  playerInfo,
  player,
  onOpggClick,
  variant,
}: PlayerInfoSectionProps) {
  const t = useTranslations();
  const config = sizeConfigs[variant];
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3 bg-background/30 py-1 px-2 rounded-lg">
        <div className="flex gap-1">
          <h1 className={cn("font-bold text-foreground", config.nameSize)}>
            {playerInfo.summonerName || player?.name || t("common.unknownPlayer")}
          </h1>
          {playerInfo.tagLine && (
            <p
              className={cn(
                "text-foreground/90 flex items-end mb-0.5",
                config.tagSize
              )}
            >
              #{playerInfo.tagLine}
            </p>
          )}
        </div>
        <button
          onClick={onOpggClick}
          className="hover:opacity-80 transition-opacity"
        >
          <Image
            src="/opgg.png"
          alt="OP.GG"
          width={config.iconSize}
          height={config.iconSize}
          sizes="24px"
          className="cursor-pointer brightness-0 invert"
          />
        </button>
      </div>
      <div className="flex">
        <h4
          className={cn(
            "bg-background/30 py-1 px-2 rounded-lg",
            config.matchesTextSize
          )}
        >
          <span
            className={cn("text-primary font-bold", config.matchesNumberSize)}
          >
            {playerInfo.numberOfMatches || 0}
          </span>{" "}
          <span className="text-foreground">matches</span>
        </h4>
      </div>
    </div>
  );
}

// Win Rate Display Component
interface WinRateDisplayProps {
  winRate: number;
  numberOfMatches?: number;
  roleMatches?: {
    [role: string]: {
      games: number;
      wins: number;
    };
  };
}

function WinRateDisplay({
  winRate,
  numberOfMatches,
  roleMatches,
}: WinRateDisplayProps) {
  // Calculate total matches from roleMatches if numberOfMatches is undefined
  const totalMatches =
    numberOfMatches ??
    (roleMatches
      ? Object.values(roleMatches).reduce((sum, role) => sum + role.games, 0)
      : undefined);

  const wins =
    totalMatches !== undefined ? Math.round(totalMatches * winRate) : undefined;
  const losses =
    totalMatches !== undefined && wins !== undefined
      ? totalMatches - wins
      : undefined;

  return (
    <div className="flex items-center justify-center rounded-lg border-2 border-border/50 bg-[hsl(220,60%,7%)]/50 p-4">
      <WinRateCircularProgress
        value={winRate}
        size={176}
        wins={wins}
        losses={losses}
      />
    </div>
  );
}

// Role Stats Component
interface RoleStatsListProps {
  playerInfo: PlayerInfo;
  filteredRole: string;
  onRoleClick: (role: string) => void;
  containerClassName?: string;
}

function RoleStatsList({
  playerInfo,
  filteredRole,
  onRoleClick,
  containerClassName,
}: RoleStatsListProps) {
  const t = useTranslations();
  const { winLoseSinceLastChangeByRole, rankChanges } = usePlayerData();
  const latestByRole = useMemo(
    () => getLatestRankChangeEntryPerRole(rankChanges),
    [rankChanges]
  );

  return (
    <div className={cn("flex flex-col gap-1", containerClassName)}>
      {roles.map((role, i) => {
        const roleMatch = playerInfo.roleMatches?.[role] ?? {
          games: 0,
          wins: 0,
        };

        const winRate =
          roleMatch.games > 0 ? roleMatch.wins / roleMatch.games : 0;
        const losses = roleMatch.games - roleMatch.wins;

        const sinceStats = winLoseSinceLastChangeByRole[role];
        const latestChange = latestByRole[role];

        let sinceColTitle: string;
        let sinceRankLine: string;
        let sinceRecordLine: string;

        if (!sinceStats) {
          sinceColTitle = t("playerBanner.noRankChangeYet");
          sinceRankLine = "—";
          sinceRecordLine = "—";
        } else {
          sinceColTitle = t("playerBanner.winRateSinceRankChange");
          const wins = sinceStats.wins;
          const lossCount = sinceStats.loses;
          const sinceGames = wins + lossCount;
          sinceRecordLine =
            sinceGames > 0
              ? `${wins}W ${lossCount}L (${floatToPercentageString(wins / sinceGames)})`
              : "0W 0L";
          if (latestChange) {
            sinceRankLine = t("playerBanner.sinceRankChange")
              .replace("{{from}}", String(latestChange.oldRank))
              .replace("{{to}}", String(latestChange.newRank));
          } else {
            sinceRankLine = t("playerBanner.sinceRankAt").replace(
              "{{rank}}",
              String(sinceStats.rank)
            );
          }
        }

        return (
          <button
            key={role}
            type="button"
            title={sinceColTitle}
            onClick={() => onRoleClick(role)}
            className={cn(
              "flex w-full min-w-0 items-stretch gap-2 rounded-lg border-2 px-3 py-2 text-left transition-all",
              filteredRole === role
                ? "border-primary bg-primary/20"
                : "border-border/50 bg-[hsl(220,60%,7%)]/50 hover:bg-[hsl(220,60%,7%)]/70"
            )}
          >
            <div className="flex size-8 shrink-0 items-center justify-center self-center">
              <Image
                src={roleIcons[i]}
                alt={role}
                width={32}
                height={32}
                sizes="32px"
              />
            </div>
            <div className="flex min-h-11 min-w-0 flex-1 flex-col justify-center gap-0.5 text-foreground text-base">
              <p className="whitespace-nowrap text-center font-semibold tabular-nums leading-none px-1">
                {floatToPercentageString(winRate)}
              </p>
              <p className="whitespace-nowrap text-center text-xs leading-none text-muted-foreground tabular-nums">
                {roleMatch.wins}W {losses}L
              </p>
            </div>
            <div
              className="w-px shrink-0 self-stretch bg-border/70"
              aria-hidden
            />
            <div
              className="flex min-h-11 min-w-20 shrink-0 flex-col justify-center gap-0.5 text-right leading-tight"
              title={sinceColTitle}
            >
              <p className="whitespace-nowrap text-center text-[10px] font-medium leading-none text-muted-foreground/90 tabular-nums sm:text-[11px]">
                {sinceRankLine}
              </p>
              <p className="whitespace-nowrap text-center text-[10px] leading-none text-muted-foreground/80 tabular-nums sm:text-[11px]">
                {sinceRecordLine}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export function PlayerBanner({
  champs,
  playerInfo,
  player,
}: PlayerBannerProps) {
  const { filteredRole, setFilteredRole } = usePlayerData();

  const handleOpggRedirect = () => {
    const region = "br";
    const summonerName = playerInfo.summonerName || "";
    const tagLine = playerInfo.tagLine || "";
    const opggUrl = `https://www.op.gg/summoners/${region}/${summonerName}-${tagLine}`;
    window.open(opggUrl, "_blank");
  };

  const handleRoleClick = (role: string) => {
    const newRole = filteredRole === role ? "" : role;
    setFilteredRole(newRole);
  };

  const backgroundImage =
    champs.length > 0 && champs[0].championId
      ? getChampionSplash(Number(champs[0].championId))
      : undefined;

  return (
    <div
      className="relative overflow-hidden"
      style={{
        backgroundImage: backgroundImage
          ? `url(${backgroundImage})`
          : undefined,
        backgroundSize: "cover",
        backgroundPositionY: "20%",
        backgroundPositionX: "center",
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/30" />

      <div className="relative z-10 p-6">
        {/* sm: Stacked layout */}
        <div className="flex flex-col md:hidden gap-6 items-center">
          <div className="flex justify-center">
            <PlayerCard player={player} />
          </div>
          <div className="flex flex-col gap-2 items-center">
            <PlayerInfoSection
              playerInfo={playerInfo}
              player={player}
              onOpggClick={handleOpggRedirect}
              variant="sm"
            />
          </div>
          {playerInfo.winRate !== undefined && (
            <WinRateDisplay
              winRate={playerInfo.winRate}
              numberOfMatches={playerInfo.numberOfMatches}
              roleMatches={playerInfo.roleMatches}
            />
          )}
          <RoleStatsList
            playerInfo={playerInfo}
            filteredRole={filteredRole}
            onRoleClick={handleRoleClick}
            containerClassName="w-full max-w-53"
          />
        </div>

        {/* md: Two-row layout */}
        <div className="hidden md:flex lg:hidden flex-col gap-6">
          <div className="flex flex-row gap-2 items-start justify-center">
            <PlayerCard player={player} />
            <PlayerInfoSection
              playerInfo={playerInfo}
              player={player}
              onOpggClick={handleOpggRedirect}
              variant="md"
            />
          </div>
          <div className="flex flex-row gap-3 items-center justify-center">
            {playerInfo.winRate !== undefined && (
              <WinRateDisplay
                winRate={playerInfo.winRate}
                numberOfMatches={playerInfo.numberOfMatches}
              />
            )}
            <RoleStatsList
              playerInfo={playerInfo}
              filteredRole={filteredRole}
              onRoleClick={handleRoleClick}
            />
          </div>
        </div>

        {/* lg+: Single-row layout */}
        <div className="hidden lg:flex flex-row gap-6 items-center">
          <div className="flex flex-row gap-2 items-start">
            <PlayerCard player={player} />
            <PlayerInfoSection
              playerInfo={playerInfo}
              player={player}
              onOpggClick={handleOpggRedirect}
              variant="lg"
            />
          </div>
          <div className="flex flex-row gap-3 xl:gap-6 items-center ml-auto">
            {playerInfo.winRate !== undefined && (
              <WinRateDisplay
                winRate={playerInfo.winRate}
                numberOfMatches={playerInfo.numberOfMatches}
              />
            )}
            <RoleStatsList
              playerInfo={playerInfo}
              filteredRole={filteredRole}
              onRoleClick={handleRoleClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
