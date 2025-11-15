import { redirect } from "next/navigation";
import {
  getPlayer,
  getPlayerList,
  getPlayerInfo,
  getPlayerPairs,
  getPlayerSummary,
  getAllReducedData,
  getPlayerRankChanges,
} from "@/lib/endpoints";
import { getPlayerByAccountId } from "@/lib/utils";
import { PlayerDataProvider } from "@/components/player/player-data-context";
import { PlayerBanner } from "@/components/player/player-banner";
import { PlayerTabs } from "@/components/player/player-tabs";
import { Card } from "@/components/ui/card";
import type { Player, ChampionStats } from "@/lib/types";

interface PlayerLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

/**
 * Generate static params for all players at build time
 * This pregenerates player pages for better performance
 */
export async function generateStaticParams() {
  try {
    const playerList = await getPlayerList();

    if (!playerList) {
      return [];
    }

    // Get all player name_ids (excluding hidden players)
    const params = Object.entries(playerList)
      .filter(([, player]) => !player.hide)
      .map(([nameId]) => ({
        slug: nameId,
      }));

    return params;
  } catch (error) {
    console.error("Error generating static params for players:", error);
    // Return empty array on error to allow dynamic generation
    return [];
  }
}

async function fetchPlayerData(slug: string) {
  // Check if slug is a number (account_id) or a string (name_id)
  const isAccountId = !isNaN(Number(slug));

  let playerKey: string;
  let player: Player | null = null;
  let accountId: string;

  if (isAccountId) {
    // If it's a number, try to find the player by account_id
    const playerList = await getPlayerList();
    if (playerList) {
      const playerArray = Object.values(playerList);
      const foundPlayer = getPlayerByAccountId(playerArray, Number(slug));
      if (foundPlayer) {
        // Redirect to name_id route
        redirect(`/player/${foundPlayer.name_id}`);
      }
    }
    // If not found, use the slug as-is
    playerKey = slug;
    accountId = slug;
  } else {
    // It's a name_id - fetch player data to get account_id
    playerKey = slug;
    player = await getPlayer(playerKey);
    if (!player) {
      return null;
    }
    accountId =
      typeof player.account_id === "number"
        ? player.account_id.toString()
        : player.account_id;
  }

  // Fetch player info and rank changes in parallel (they don't depend on each other)
  const [playerInfo, rankChanges] = await Promise.all([
    getPlayerInfo(accountId),
    getPlayerRankChanges(playerKey),
  ]);

  // Only fetch matches if playerInfo exists and has match data
  // Fetch other data in parallel
  const [playerPairs, playerSummary, allMatches] = await Promise.all([
    playerInfo?.summonerId ? getPlayerPairs(playerInfo.summonerId) : null,
    getPlayerSummary(),
    // Only load all matches if we need to filter them (playerInfo exists)
    playerInfo ? getAllReducedData() : Promise.resolve([]),
  ]);

  // Filter matches for this player using playerMatchesIds or summonerId
  const playerMatches = playerInfo?.playerMatchesIds
    ? allMatches.filter((match) =>
        playerInfo.playerMatchesIds!.includes(match.matchId)
      )
    : playerInfo?.summonerId
    ? allMatches.filter((match) =>
        match.participants.some((p) => p.summonerId === playerInfo.summonerId)
      )
    : [];

  // Prepare champion stats array
  const champs = playerInfo?.championStats
    ? Object.values(playerInfo.championStats).sort((a, b) => {
        const aMatches =
          (a as ChampionStats).numberOfMatches ??
          (a as ChampionStats).picks ??
          0;
        const bMatches =
          (b as ChampionStats).numberOfMatches ??
          (b as ChampionStats).picks ??
          0;
        return bMatches - aMatches;
      })
    : [];

  return {
    player,
    playerInfo,
    playerPairs,
    playerSummary,
    champs,
    matches: playerMatches,
    rankChanges,
  };
}

export default async function PlayerLayout({
  children,
  params,
}: PlayerLayoutProps) {
  const { slug } = await params;
  const data = await fetchPlayerData(slug);

  if (!data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Player Not Found</h1>
          <p className="text-muted-foreground mt-2">
            The player &quot;{slug}&quot; could not be found.
          </p>
        </div>
      </div>
    );
  }

  if (!data.playerInfo) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">No Player Data</h1>
          <p className="text-muted-foreground mt-2">
            Player data is not available for this player.
          </p>
        </div>
      </div>
    );
  }

  const playerSlug =
    data.player?.name_id || data.player?.account_id?.toString() || slug;

  return (
    <PlayerDataProvider
      player={data.player}
      playerInfo={data.playerInfo}
      playerPairs={data.playerPairs}
      playerSummary={data.playerSummary}
      champs={data.champs}
      matches={data.matches}
      rankChanges={data.rankChanges}
    >
      <div className="container mx-auto px-4 py-8">
        <Card className="overflow-clip">
          <div>
            <PlayerBanner
              champs={data.champs}
              playerInfo={data.playerInfo}
              player={data.player}
            />

            <PlayerTabs slug={playerSlug} />

            <div className="border-t border-border" />

            {children}
          </div>
        </Card>
      </div>
    </PlayerDataProvider>
  );
}
