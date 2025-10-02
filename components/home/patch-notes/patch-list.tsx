import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PatchEntry } from "./patch-entry";
import { GroupedChangesByDate } from "@/lib/utils";

interface PatchListProps {
  groupedChanges: GroupedChangesByDate;
  maxEntries?: number;
}

export function PatchList({ groupedChanges, maxEntries = 4 }: PatchListProps) {
  const recentDates = Object.keys(groupedChanges).slice(0, maxEntries);

  if (recentDates.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">No recent changes</div>
    );
  }

  return (
    <>
      {recentDates.map((date) => (
        <PatchEntry key={date} date={date} changes={groupedChanges[date]} />
      ))}
      <div className="pt-2">
        <Link href="/patch-notes">
          <Button variant="outline" className="w-full" size="sm">
            Show More
          </Button>
        </Link>
      </div>
    </>
  );
}
