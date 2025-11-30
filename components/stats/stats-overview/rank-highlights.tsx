import Link from "next/link";
import type { RankHighlight, RankNetWinEntry } from "./index";
import type { Role } from "@/lib/types";

interface RankHighlightsProps {
  movers: RankHighlight[];
  netWins: RankNetWinEntry[];
  roleLabels: Record<Role, string>;
}

export function RankHighlights({
  movers,
  netWins,
  roleLabels,
}: RankHighlightsProps) {
  return (
    <div className="rounded-lg border border-border bg-card/60 p-4 space-y-4 flex-1">
      <div>
        <p className="text-sm font-semibold mb-2">Top Movers</p>
        {movers.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No rank movement recorded yet.
          </p>
        ) : (
          <div className="space-y-2 text-sm">
            {movers.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between">
                <Link
                  href={`/player/${entry.id}`}
                  className="font-medium hover:text-primary transition-colors"
                >
                  {entry.name}
                </Link>
                <span className="text-primary font-semibold">
                  +{entry.changes}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div>
        <p className="text-sm font-semibold mb-2">Net Wins Since Last Change</p>
        {netWins.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Waiting for more games to complete.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {netWins.map((entry) => (
              <Link
                key={`${entry.id}-${entry.role}`}
                href={`/player/${entry.id}`}
                className="rounded-full border border-border px-3 py-1 text-xs font-medium hover:text-primary transition-colors"
              >
                {entry.name} {roleLabels[entry.role]} {entry.wins}/
                {entry.losses}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
