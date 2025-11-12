import { PatchEntry } from "@/components/home/hero-section/patch-notes/patch-entry";
import { GroupedChangesByDate } from "@/lib/utils";

interface PatchNotesListProps {
  groupedChanges: GroupedChangesByDate;
  selectedPlayerNameId?: string | null;
}

export function PatchNotesList({
  groupedChanges,
  selectedPlayerNameId,
}: PatchNotesListProps) {
  const dates = Object.keys(groupedChanges).sort().reverse(); // Most recent first

  if (dates.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-muted-foreground">No patch notes found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {dates.map((date) => (
        <PatchEntry
          key={date}
          date={date}
          changes={groupedChanges[date]}
          selectedPlayerNameId={selectedPlayerNameId}
        />
      ))}
    </div>
  );
}
