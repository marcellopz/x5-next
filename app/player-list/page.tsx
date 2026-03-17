import { getPlayerList, getPlayerSummary } from "@/lib/endpoints";
import { PlayerListPageContent } from "@/components/player-list/player-list-page-content";
import { generatePageMetadata } from "@/lib/metadata";
import { getLocale, getTranslations, t } from "@/lib/i18n";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const trans = getTranslations(locale);
  return generatePageMetadata(
    t(trans, "pages.playerList"),
    t(trans, "pages.playerListDescription")
  );
}

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
