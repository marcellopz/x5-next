import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { InitialRanksData, RankChangeLog } from "@/lib/types";
import { groupChangesByDate } from "@/lib/utils";
import { PatchStats } from "./patch-stats";
import { PatchList } from "./patch-list";

interface PatchNotesProps {
  rankChangeLog: RankChangeLog | null;
  initialRankChangeLog: InitialRanksData | null;
}

export default function PatchNotes({
  rankChangeLog,
  initialRankChangeLog,
}: PatchNotesProps) {
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

  return (
    <Card className="h-[520px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Patch Notes</CardTitle>
        <PatchStats
          patches={Object.keys(groupedChanges).length}
          buffs={buffs}
          nerfs={nerfs}
          newPlayers={newPlayers}
        />
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto space-y-4">
          <PatchList groupedChanges={groupedChanges} maxEntries={4} />
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
