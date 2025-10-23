import { PlayerCarousel } from "./player-carousel";
import { PatchNotes } from "./patch-notes";
import type { RankChangeLog, InitialRanksData, Player } from "@/lib/types";

interface HeroSectionProps {
  initialRankChangeLog: InitialRanksData | null;
  rankChangeLog: RankChangeLog | null;
  playerList: Player[] | null;
}

export function HeroSection({
  initialRankChangeLog,
  rankChangeLog,
  playerList,
}: HeroSectionProps) {
  const initialIndex =
    playerList && playerList.length > 0
      ? Math.floor(Math.random() * playerList.length)
      : 0;

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="lg:col-span-2 overflow-hidden">
        <PlayerCarousel playerList={playerList} initialIndex={initialIndex} />
      </div>
      <PatchNotes
        initialRankChangeLog={initialRankChangeLog}
        rankChangeLog={rankChangeLog}
      />
    </div>
  );
}
