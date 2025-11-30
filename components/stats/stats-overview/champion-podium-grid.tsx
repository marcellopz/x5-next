import { cn } from "@/lib/utils";
import type { ChampionPodium } from "./index";
import { PlaceholderCard } from "./placeholder-card";
import type { Role } from "@/lib/types";

interface ChampionPodiumGridProps {
  podiums: ChampionPodium[];
  roleLabels: Record<Role, string>;
}

export function ChampionPodiumGrid({
  podiums,
  roleLabels,
}: ChampionPodiumGridProps) {
  if (podiums.length === 0) {
    return <PlaceholderCard message="Champion podium data coming soon" />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {podiums.map((podium) => (
        <div
          key={podium.role}
          className="rounded-lg border border-border/60 bg-card/60 p-4 space-y-3"
        >
          <p className="text-sm font-medium text-muted-foreground uppercase">
            {roleLabels[podium.role]} Lane
          </p>
          <div className="flex items-end gap-2">
            {podium.entries.map((entry, index) => {
              const maxPicks = podium.entries[0]?.picks || 1;
              const height = Math.max(
                40,
                Math.round((entry.picks / maxPicks) * 80)
              );
              return (
                <div key={entry.id} className="flex-1">
                  <div
                    className={cn(
                      "rounded-t-lg bg-primary/20 border border-primary/30 flex flex-col items-center justify-end",
                      index === 0 && "bg-primary/30"
                    )}
                    style={{ height }}
                  >
                    <span className="text-xs font-semibold text-primary">
                      #{index + 1}
                    </span>
                  </div>
                  <div className="mt-2 text-center">
                    <p className="text-sm font-semibold">{entry.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {entry.picks} picks • {entry.winRate.toFixed(1)}% WR
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
