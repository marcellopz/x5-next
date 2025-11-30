import Image from "next/image";
import { CHAMPIONICONURL } from "@/lib/resources";
import { cn } from "@/lib/utils";
import type { ChampionSpotlightEntry } from "./types";

interface ChampionPortraitGridProps {
  champions: ChampionSpotlightEntry[];
  selectedId: string;
  onSelect: (championId: string) => void;
}

export function ChampionPortraitGrid({
  champions,
  selectedId,
  onSelect,
}: ChampionPortraitGridProps) {
  return (
    <div className="lg:col-span-3 rounded-lg border border-border bg-card/60 flex flex-col">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <p className="text-sm font-semibold">Picked Champions</p>
        <span className="text-xs text-muted-foreground">
          {champions.length} total
        </span>
      </div>
      <div className="flex-1 overflow-y-auto max-h-100 p-3 pr-2">
        <div className="grid grid-cols-6 sm:grid-cols-7 lg:grid-cols-8 gap-2">
          {champions.map((champion) => {
            const isSelected = champion.championId === selectedId;
            return (
              <button
                key={champion.championId}
                type="button"
                className={cn(
                  "rounded-lg border border-border bg-muted/40 p-1.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-left",
                  isSelected && "border-primary bg-primary/10 shadow-md"
                )}
                onClick={() => onSelect(champion.championId)}
              >
                <div className="relative w-full aspect-square overflow-hidden rounded-md bg-background/50">
                  <Image
                    src={`${CHAMPIONICONURL}${champion.championId}.png`}
                    alt={champion.championName}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>
                <p className="mt-1 text-[11px] text-center text-nowrap line-clamp-1">
                  {champion.championName.length > 9
                    ? champion.championName.slice(0, 7) + "..."
                    : champion.championName}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
