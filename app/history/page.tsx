import { getAllReducedData, getPlayerList } from "@/lib/endpoints";
import { MatchesContainer } from "@/components/history/matches-container";
import { Player } from "@/lib/types";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata = generatePageMetadata(
  "Match History",
  "Browse and search through all match history"
);

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
