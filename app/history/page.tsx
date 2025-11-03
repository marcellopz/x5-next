import { getAllReducedData, getPlayerList } from "@/lib/endpoints";
import { MatchesContainer } from "@/components/history/matches-container";
import { Player } from "@/lib/types";

export default async function History() {
  const [matches, allPlayersObject] = await Promise.all([
    getAllReducedData(),
    getPlayerList(),
  ]);
  const playerList: Player[] = allPlayersObject
    ? Object.values(allPlayersObject)
    : [];

  return <MatchesContainer matches={matches} playerList={playerList} />;
}
