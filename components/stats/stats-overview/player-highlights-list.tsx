import Link from "next/link";
import type { PlayerHighlight } from "./index";
import type { Role } from "@/lib/types";
import { PlaceholderCard } from "./placeholder-card";

interface PlayerHighlightsListProps {
  players: PlayerHighlight[];
  roleLabels: Record<Role, string>;
}

export function PlayerHighlightsList({
  players,
  roleLabels,
}: PlayerHighlightsListProps) {
  if (players.length === 0) {
    return <PlaceholderCard message="Player highlights coming soon" />;
  }

  return (
    <div className="rounded-lg border border-border bg-card/60 divide-y divide-border flex flex-col h-full justify-evenly">
      {players.map((player) => (
        <div
          key={player.role}
          className="flex items-center justify-between p-3.5 gap-3"
        >
          <div>
            <p className="text-xs uppercase text-muted-foreground">
              {roleLabels[player.role]}
            </p>
            <Link
              href={`/player/${player.summonerId}`}
              className="text-sm font-semibold hover:text-primary transition-colors"
            >
              {player.name}
              {player.tagLine && (
                <span className="text-muted-foreground text-xs ml-1">
                  #{player.tagLine}
                </span>
              )}
            </Link>
          </div>
          <div className="text-right flex flex-col">
            <span className="text-sm font-semibold text-primary block">
              {(player.winRate * 100).toFixed(1)}% WR
            </span>
            <span className="text-xs text-muted-foreground">
              {player.games} games
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
