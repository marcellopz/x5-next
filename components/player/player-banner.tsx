"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { getChampionSplash } from "@/lib/resources";
import { PlayerCard } from "@/components/ui/player-card";
import type { Player, PlayerInfo, ChampionStats } from "@/lib/types";
import { WinRateCircularProgress } from "@/components/ui/win-rate-circular-progress";
import { usePlayerPage } from "./player-page-context";

interface PlayerBannerProps {
  champs: ChampionStats[];
  playerInfo: PlayerInfo;
  player: Player;
}

const roles = ["top", "jungle", "mid", "adc", "support"];
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

export function PlayerBanner({
  champs,
  playerInfo,
  player,
}: PlayerBannerProps) {
  const { filteredRole, setFilteredRole } = usePlayerPage();

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
      className="relative rounded-lg overflow-hidden"
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
        <div className="flex flex-col md:flex-row gap-6 items-center">
          {/* Left Section: Player Card and Info */}
          <div className="flex flex-col md:flex-row gap-2 items-start">
            {/* Player Card */}
            <PlayerCard player={player} />

            {/* Player Info */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 bg-background/30 p-1 rounded-lg">
                <div className="flex gap-1">
                  <h1 className="text-3xl font-bold text-foreground">
                    {playerInfo.summonerName || player.name}
                  </h1>
                  {playerInfo.tagLine && (
                    <p className="text-foreground/90 flex items-end mb-0.5">
                      #{playerInfo.tagLine}
                    </p>
                  )}
                </div>
                <button
                  onClick={handleOpggRedirect}
                  className="ml-2 hover:opacity-80 transition-opacity"
                >
                  <Image
                    src="/opgg.png"
                    alt="OP.GG"
                    width={24}
                    height={24}
                    className="cursor-pointer"
                  />
                </button>
              </div>
              <div className="flex">
                <h4 className="text-foreground/90 text-lg bg-background/30 p-2 rounded-lg">
                  {playerInfo.numberOfMatches || 0} matches
                </h4>
              </div>
            </div>
          </div>

          {/* Right Section: Stats */}
          <div className="flex flex-row gap-3 items-center ml-auto">
            {/* Win Rate Circle */}
            {playerInfo.winRate !== undefined && (
              <div className="flex items-center justify-center rounded-lg border-2 border-border/50 bg-[hsl(220,60%,7%)]/50 p-4">
                <WinRateCircularProgress
                  value={playerInfo.winRate}
                  size={176}
                />
              </div>
            )}

            {/* Role Stats */}
            <div className="flex flex-col gap-1">
              {roles.map((role, i) => {
                const roleMatch = playerInfo.roleMatches?.[role] ?? {
                  games: 0,
                  wins: 0,
                };

                const winRate =
                  roleMatch.games > 0 ? roleMatch.wins / roleMatch.games : 0;
                const losses = roleMatch.games - roleMatch.wins;

                return (
                  <button
                    key={role}
                    onClick={() => handleRoleClick(role)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg border-2 transition-all",
                      filteredRole === role
                        ? "border-primary bg-primary/20"
                        : "border-border/50 bg-[hsl(220,60%,7%)]/50 hover:bg-[hsl(220,60%,7%)]/70"
                    )}
                  >
                    <Image
                      src={roleIcons[i]}
                      alt={role}
                      width={32}
                      height={32}
                    />
                    <div className="text-foreground text-sm flex-1">
                      <p className="font-semibold">
                        {floatToPercentageString(winRate)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {roleMatch.wins}W {losses}L
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
