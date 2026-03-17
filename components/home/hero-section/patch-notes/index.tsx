import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { InitialRanksData, RankChangeLog } from "@/lib/types";
import { groupChangesByDate } from "@/lib/utils";
import { PatchStats } from "./patch-stats";
import { PatchList } from "./patch-list";
import { getLocale, getTranslations, t } from "@/lib/i18n";

interface PatchNotesProps {
  rankChangeLog: RankChangeLog | null;
  initialRankChangeLog: InitialRanksData | null;
}

export default async function PatchNotes({
  rankChangeLog,
  initialRankChangeLog,
}: PatchNotesProps) {
  const locale = await getLocale();
  const trans = getTranslations(locale);
  const groupedChanges = groupChangesByDate(
    rankChangeLog,
    initialRankChangeLog
  );

  // Calculate consolidated stats
  let buffs = 0;
  let nerfs = 0;
  let newPlayers = 0;

  Object.values(groupedChanges).forEach((changes) => {
    changes.forEach((change) => {
      if (change.type === "new_player") {
        newPlayers++;
      } else if (change.type === "rank_change") {
        if (change.newRank > change.oldRank) {
          buffs++;
        } else {
          nerfs++;
        }
      }
    });
  });

  const labels = {
    patches: t(trans, "home.patches"),
    buffs: t(trans, "home.buffs"),
    nerfs: t(trans, "home.nerfs"),
    players: t(trans, "home.players"),
  };
  const entryLabels = {
    newBadge: t(trans, "home.newPlayerBadge"),
    joined: t(trans, "home.joined"),
  };
  const listLabels = {
    noRecentChanges: t(trans, "home.noRecentChanges"),
    showMore: t(trans, "common.showMore"),
  };

  return (
    <Card className="h-[520px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{t(trans, "home.patchNotesTitle")}</CardTitle>
        <PatchStats
          patches={Object.keys(groupedChanges).length}
          buffs={buffs}
          nerfs={nerfs}
          newPlayers={newPlayers}
          labels={labels}
        />
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto space-y-4">
          <PatchList
            groupedChanges={groupedChanges}
            maxEntries={4}
            listLabels={listLabels}
            entryLabels={entryLabels}
          />
        </div>
      </CardContent>
    </Card>
  );
}

// Named export for backwards compatibility
export { PatchNotes };

// Export individual components for reuse
export { PatchStats } from "./patch-stats";
export { PatchEntry } from "./patch-entry";
export { PatchList } from "./patch-list";
