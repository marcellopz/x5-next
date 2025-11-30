import Image from "next/image";
import { PlaceholderCard } from "./placeholder-card";
import type { ChampionPresenceEntry } from "./index";
import { CHAMPIONICONURL } from "@/lib/resources";

export function ChampionPresenceList({
  entries,
}: {
  entries: ChampionPresenceEntry[];
}) {
  if (entries.length === 0) {
    return <PlaceholderCard message="Presence data coming soon" />;
  }

  return (
    <div className="rounded-lg border border-border/60 bg-card/60">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
        <h4 className="text-sm font-semibold">Top Presence (All Roles)</h4>
        <span className="text-xs text-muted-foreground">Pick + Ban Rate</span>
      </div>
      <div className="divide-y divide-border/60">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="flex items-center justify-between px-4 py-3 gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="relative h-8 w-8 overflow-hidden rounded-full bg-muted">
                <Image
                  src={`${CHAMPIONICONURL}${entry.id}.png`}
                  alt={entry.name}
                  fill
                  sizes="32px"
                />
              </div>
              <div>
                <p className="text-sm font-semibold">{entry.name}</p>
                <p className="text-xs text-muted-foreground">
                  {entry.picks} picks • {entry.bans} bans
                </p>
              </div>
            </div>
            <span className="text-sm font-semibold text-primary">
              {(entry.presence * 100).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
