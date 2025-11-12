import { getPlayerList, getPlayerSummary } from "@/lib/endpoints";
import { PlayerListPageContent } from "@/components/player-list/player-list-page-content";

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
