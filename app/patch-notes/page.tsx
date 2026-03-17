import {
  getInitialRankChangeLog,
  getPlayerList,
  getRankChangeLog,
} from "@/lib/endpoints";
import { PatchNotesPageContent } from "@/components/patch-notes/patch-notes-page-content";
import { Player } from "@/lib/types";
import { generatePageMetadata } from "@/lib/metadata";
import { getLocale, getTranslations, t } from "@/lib/i18n";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const trans = getTranslations(locale);
  return generatePageMetadata(
    t(trans, "pages.patchNotes"),
    t(trans, "pages.patchNotesDescription")
  );
}

export default async function PatchNotesPage() {
  const [rankChangeLog, initialRankChangeLog, allPlayersObject] =
    await Promise.all([
      getRankChangeLog(),
      getInitialRankChangeLog(),
      getPlayerList(),
    ]);

  const playerList: Player[] = allPlayersObject
    ? Object.values(allPlayersObject).filter((player) => !player.hide)
    : [];

  return (
    <PatchNotesPageContent
      rankChangeLog={rankChangeLog}
      initialRankChangeLog={initialRankChangeLog}
      playerList={playerList}
    />
  );
}
