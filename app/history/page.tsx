import { getAllReducedData, getPlayerList } from "@/lib/endpoints";
import { MatchesContainer } from "@/components/history/matches-container";
import { Player } from "@/lib/types";
import { generatePageMetadata } from "@/lib/metadata";
import { getLocale, getTranslations, t } from "@/lib/i18n";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const trans = getTranslations(locale);
  return generatePageMetadata(
    t(trans, "pages.matchHistory"),
    t(trans, "pages.matchHistoryDescription")
  );
}

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
