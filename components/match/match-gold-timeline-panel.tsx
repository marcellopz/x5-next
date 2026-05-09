import { getCondensedMatchTimeline } from "@/lib/endpoints";
import { MatchGoldTimelineChart } from "./match-gold-timeline-chart";

interface MatchGoldTimelinePanelProps {
  matchId: string;
  matchData: unknown;
}

export async function MatchGoldTimelinePanel({
  matchId,
  matchData,
}: MatchGoldTimelinePanelProps) {
  const timeline = await getCondensedMatchTimeline(matchId);
  const participantChampionMap = Object.fromEntries(
    ((matchData as { participants?: Array<{ participantId: number; championId: number }> })
      ?.participants ?? [])
      .map((participant) => [participant.participantId, participant.championId])
  ) as Record<number, number>;

  if (!timeline || timeline.points.length === 0) {
    return (
      <div className="h-full border border-border rounded-lg p-6 flex items-center justify-center bg-accent/20">
        <p className="text-sm text-muted-foreground">Gold timeline data not available</p>
      </div>
    );
  }

  return (
    <MatchGoldTimelineChart
      timeline={timeline}
      participantChampionMap={participantChampionMap}
    />
  );
}
