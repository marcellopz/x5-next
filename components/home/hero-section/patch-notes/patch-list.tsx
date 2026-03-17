import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PatchEntry } from "./patch-entry";
import { GroupedChangesByDate } from "@/lib/utils";

interface PatchListProps {
  groupedChanges: GroupedChangesByDate;
  maxEntries?: number;
  listLabels?: { noRecentChanges: string; showMore: string };
  entryLabels?: { newBadge: string; joined: string };
}

export function PatchList({
  groupedChanges,
  maxEntries = 4,
  listLabels = {
    noRecentChanges: "No recent changes",
    showMore: "Show More",
  },
  entryLabels = { newBadge: "NEW", joined: "joined" },
}: PatchListProps) {
  const recentDates = Object.keys(groupedChanges).slice(0, maxEntries);

  if (recentDates.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        {listLabels.noRecentChanges}
      </div>
    );
  }

  return (
    <>
      {recentDates.map((date) => (
        <PatchEntry
          key={date}
          date={date}
          changes={groupedChanges[date]}
          entryLabels={entryLabels}
        />
      ))}
      <div className="pt-2">
        <Link href="/patch-notes">
          <Button variant="outline" className="w-full" size="sm">
            {listLabels.showMore}
          </Button>
        </Link>
      </div>
    </>
  );
}
