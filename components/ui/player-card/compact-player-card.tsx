import { PlayerCard } from "./player-card";
import { Check } from "lucide-react";
import type { Player } from "@/lib/types";

// Compact card configuration
export const COMPACT_CARD_SCALE = 0.75;
export const COMPACT_CARD_WIDTH = 188; // 250px * 0.75
export const COMPACT_CARD_HEIGHT = 255; // 340px * 0.75

interface CompactPlayerCardProps {
  player: Player;
  className?: string;
  onClick?: () => void;
  selected?: boolean;
}

export function CompactPlayerCard({
  player,
  className = "",
  onClick,
  selected = false,
}: CompactPlayerCardProps) {
  return (
    <div className="relative">
      <div
        className={`cursor-pointer transition-transform ${className}`}
        style={{
          transform: `scale(${COMPACT_CARD_SCALE})`,
          transformOrigin: "top left",
          width: `${COMPACT_CARD_WIDTH}px`,
          height: `${COMPACT_CARD_HEIGHT}px`,
        }}
        onClick={onClick}
      >
        <PlayerCard player={player} />
      </div>
      {selected && (
        <div
          className="absolute top-2 bg-primary text-primary-foreground rounded-full p-1 z-10"
          style={{ left: `${COMPACT_CARD_WIDTH - 26}px` }}
        >
          <Check className="h-3 w-3" />
        </div>
      )}
    </div>
  );
}
