import Image from "next/image";
import { CHAMPIONICONURL } from "@/lib/resources";
import type { NeverPickedChampion } from "./types";

interface NeverPickedGridProps {
  champions: NeverPickedChampion[];
}

export function NeverPickedGrid({ champions }: NeverPickedGridProps) {
  if (champions.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border border-border bg-card/60 flex flex-col">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <p className="text-sm font-semibold">
          Champions that were never picked
        </p>
        <span className="text-xs text-muted-foreground">
          {champions.length} total
        </span>
      </div>
      <div className="flex-1 overflow-y-auto max-h-96 p-3 pr-2">
        <div className="grid grid-cols-6 sm:grid-cols-7 lg:grid-cols-10 xl:grid-cols-12 gap-2">
          {champions.map((champion) => (
            <div
              key={champion.championId}
              className="rounded-lg border border-border bg-muted/40 p-1.5"
            >
              <div className="relative w-full aspect-square overflow-hidden rounded-md bg-background/50">
                <Image
                  src={`${CHAMPIONICONURL}${champion.championId}.png`}
                  alt={champion.championName}
                  fill
                  sizes="96px"
                  className="object-cover opacity-70"
                />
              </div>
              <p className="mt-1 text-[11px] font-medium text-center line-clamp-1 text-muted-foreground">
                {champion.championName}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
