import {
  getInitialRankChangeLog,
  getPlayerList,
  getRankChangeLog,
} from "@/lib/endpoints";
import { PatchNotesPageContent } from "@/components/patch-notes/patch-notes-page-content";
import { Player } from "@/lib/types";

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
