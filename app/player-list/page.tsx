import { getPlayerList, getPlayerSummary } from "@/lib/endpoints";
import { PlayerListPageContent } from "@/components/player-list/player-list-page-content";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata = generatePageMetadata(
  "Player List",
  "All registered players with win rates and role rankings"
);

export default async function PlayerListPage() {
  const [playerList, playerSummary] = await Promise.all([
    getPlayerList(),
    getPlayerSummary(),
  ]);

  return (
    <PlayerListPageContent
      playerList={playerList}
      playerSummary={playerSummary}
    />
  );
}
