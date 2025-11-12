import { getPlayerList } from "@/lib/endpoints";
import FormContainer from "@/components/matchmaking/form-container";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata = generatePageMetadata(
  "Matchmaking",
  "Create balanced teams with advanced algorithms"
);

export default async function MatchmakingPage() {
  const playerList = await getPlayerList();

  // Convert playerList object to array and filter out hidden players
  const players = playerList ? Object.values(playerList) : [];

  return <FormContainer players={players} />;
}
