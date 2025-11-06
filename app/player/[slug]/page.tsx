import { redirect } from "next/navigation";
import {
  getPlayer,
  getPlayerList,
  getPlayerInfo,
  getPlayerPairs,
  getPlayerSummary,
} from "@/lib/endpoints";
import { getPlayerByAccountId } from "@/lib/utils";
import { PlayerPageContent } from "@/components/player/player-page-content";
import type { Player, ChampionStats } from "@/lib/types";

interface PlayerPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PlayerPage({ params }: PlayerPageProps) {
  const { slug } = await params;

  // Check if slug is a number (account_id) or a string (name_id)
  const isAccountId = !isNaN(Number(slug));

  let playerKey: string;
  let player: Player | null = null;

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
  } else {
    // It's a name_id
    playerKey = slug;
  }

  // Fetch player data
  player = await getPlayer(playerKey);

  if (!player) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Player Not Found</h1>
          <p className="text-muted-foreground mt-2">
            The player &quot;{playerKey}&quot; could not be found.
          </p>
        </div>
      </div>
    );
  }

  // Determine account_id for fetching player info
  const accountId =
    typeof player.account_id === "number"
      ? player.account_id.toString()
      : player.account_id;

  // Fetch player info first, then fetch pairs and summary
  const playerInfo = await getPlayerInfo(accountId);

  // Fetch all remaining data in parallel
  const [playerPairs, playerSummary] = await Promise.all([
    playerInfo?.summonerId ? getPlayerPairs(playerInfo.summonerId) : null,
    getPlayerSummary(),
  ]);

  // If playerInfo is null, return no data message
  if (!playerInfo) {
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

  // Prepare champion stats array
  const champs = playerInfo.championStats
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

  return (
    <PlayerPageContent
      player={player}
      playerKey={playerKey}
      playerInfo={playerInfo}
      playerPairs={playerPairs}
      playerSummary={playerSummary}
      champs={champs}
    />
  );
}
