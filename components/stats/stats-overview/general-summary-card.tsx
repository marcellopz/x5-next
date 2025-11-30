interface GeneralSummaryCardProps {
  matches: number;
  players: number;
}

export function GeneralSummaryCard({
  matches,
  players,
}: GeneralSummaryCardProps) {
  return (
    <div className="rounded-lg border border-border/60 bg-card/60 p-4 w-full lg:w-auto">
      <div className="flex items-center gap-6">
        <div className="flex-1 min-w-12">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Matches
          </p>
          <p className="text-2xl font-semibold">{matches.toLocaleString()}</p>
        </div>
        <div className="h-10 w-px bg-border/60" />
        <div className="flex-1 min-w-12">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Players
          </p>
          <p className="text-2xl font-semibold">{players.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
