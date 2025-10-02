import { GroupedChangesByDate } from "@/lib/utils";

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

  return (
    <div className="rounded-xl border border-primary/30 p-4">
      <div className="mb-2 flex items-center gap-2">
        <span className="inline-flex items-center justify-center rounded-md bg-primary/20 px-2 py-0.5 text-[10px] font-semibold text-primary ring-1 ring-primary/30">
          v{date}
        </span>
        <span className="text-xs text-muted-foreground">{formattedDate}</span>
      </div>
      <ul className="list-disc space-y-1 pl-5 text-sm">
        {changes.slice(0, 3).map((change) => (
          <li key={change.changeId}>
            {change.type === "new_player" ? (
              <span>
                <span className="font-medium">New player joined:</span>
                <span className="text-muted-foreground"> — {change.name}</span>
              </span>
            ) : (
              <span>
                <span className="font-medium">
                  {change.newRank > change.oldRank ? "Buff" : "Nerf"} for{" "}
                  {change.player}
                </span>
                <span className="text-muted-foreground">
                  {" "}
                  — {change.role} rank {change.oldRank} → {change.newRank}
                </span>
              </span>
            )}
          </li>
        ))}
        {changes.length > 3 && (
          <li className="text-xs text-muted-foreground">
            +{changes.length - 3} more changes...
          </li>
        )}
      </ul>
    </div>
  );
}
