import { getCondensedMatchTimeline } from "@/lib/endpoints";
import { MatchGoldTimelineChart } from "./match-gold-timeline-chart";

interface MatchGoldTimelinePlaceholderProps {
  matchId: string;
}

export async function MatchGoldTimelinePlaceholder({
  matchId,
}: MatchGoldTimelinePlaceholderProps) {
  const timeline = await getCondensedMatchTimeline(matchId);

  if (!timeline || timeline.points.length === 0) {
    return (
      <div className="h-full border border-border rounded-lg p-6 flex items-center justify-center bg-accent/20">
        <p className="text-sm text-muted-foreground">Gold timeline data not available</p>
      </div>
    );
  }

  return <MatchGoldTimelineChart timeline={timeline} />;
}
