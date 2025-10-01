import { RankChangeLog } from "@/lib/types";

export function RecentChanges({
  rankChangeLog,
}: {
  rankChangeLog: RankChangeLog | null;
}) {
  console.log(rankChangeLog);

  return (
    <div className="rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm h-[450px]">
      <h3 className="text-lg font-semibold mb-4">Recent Changes</h3>
      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">
          Recent rank changes will appear here
        </div>
        <div className="text-sm text-muted-foreground">
          Placeholder for rank change entries
        </div>
        <div className="text-sm text-muted-foreground">More changes...</div>
      </div>
    </div>
  );
}
