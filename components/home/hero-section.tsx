import { PlayerCarousel } from "./player-carousel";
import { PatchNotes } from "./patch-notes";
import type { RankChangeLog, InitialRanksData } from "@/lib/types";

interface HeroSectionProps {
  initialRankChangeLog: InitialRanksData | null;
  rankChangeLog: RankChangeLog | null;
}

export function HeroSection({
  initialRankChangeLog,
  rankChangeLog,
}: HeroSectionProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <PlayerCarousel />
      </div>
      <div>
        <PatchNotes
          initialRankChangeLog={initialRankChangeLog}
          rankChangeLog={rankChangeLog}
        />
      </div>
    </div>
  );
}
