import { getPlayerList } from "@/lib/endpoints";
import FormContainer from "@/components/matchmaking/form-container";
import { generatePageMetadata } from "@/lib/metadata";
import { getLocale, getTranslations, t } from "@/lib/i18n";

export async function generateMetadata() {
  const locale = await getLocale();
  const trans = getTranslations(locale);
  return generatePageMetadata(
    t(trans, "pages.matchmaking"),
    t(trans, "pages.matchmakingDescription")
  );
}

export default async function MatchmakingPage() {
  const playerList = await getPlayerList();

  // Convert playerList object to array and filter out hidden players
  const players = playerList ? Object.values(playerList) : [];

  return <FormContainer players={players} />;
}
