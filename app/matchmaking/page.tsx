import { getPlayerList } from "@/lib/endpoints";
import FormContainer from "@/components/matchmaking/form-container";

export default async function MatchmakingPage() {
  const playerList = await getPlayerList();

  // Convert playerList object to array and filter out hidden players
  const players = playerList
    ? Object.values(playerList).filter((player) => !player.hide)
    : [];

  return <FormContainer players={players} />;
}
