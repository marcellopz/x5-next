import { GroupedChangesByDate, sortPatchChanges } from "@/lib/utils";

interface PatchEntryProps {
  date: string;
  changes: GroupedChangesByDate[string];
}

export function PatchEntry({ date, changes }: PatchEntryProps) {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Sort changes using the helper function
  const sortedChanges = sortPatchChanges(changes);

  return (
    <div className="rounded-xl border-border border p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="inline-flex items-center justify-center rounded-md bg-primary/20 px-2 py-0.5 text-[10px] font-semibold text-primary ring-1 ring-primary/30">
          v{date}
        </span>
        <span className="text-xs text-muted-foreground">{formattedDate}</span>
      </div>
      <div className="border-t border-border pt-3">
        <div className="space-y-2">
          {sortedChanges.map((change) => (
            <div
              key={change.changeId}
              className="flex items-center gap-2 text-sm"
            >
              {change.type === "new_player" ? (
                <>
                  <span className="inline-flex items-center justify-center rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-medium text-emerald-400 ring-1 ring-emerald-500/30">
                    NEW
                  </span>
                  <span className="font-medium">{change.name}</span>
                  <span className="text-muted-foreground">joined</span>
                </>
              ) : (
                <>
                  <span className="inline-flex items-center justify-center rounded bg-primary/20 px-1.5 py-0.5 text-[10px] font-medium text-primary ring-1 ring-primary/30 uppercase">
                    {change.role}
                  </span>
                  <span className="font-medium">{change.player}</span>
                  <span
                    className={`font-medium ${
                      change.newRank > change.oldRank
                        ? "text-emerald-400"
                        : "text-red-400"
                    }`}
                  >
                    {change.oldRank}
                  </span>
                  <span
                    className={`${
                      change.newRank > change.oldRank
                        ? "text-emerald-400"
                        : "text-red-400"
                    }`}
                  >
                    →
                  </span>
                  <span
                    className={`font-medium ${
                      change.newRank > change.oldRank
                        ? "text-emerald-400"
                        : "text-red-400"
                    }`}
                  >
                    {change.newRank}
                  </span>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
