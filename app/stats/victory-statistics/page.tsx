import { generatePageMetadata } from "@/lib/metadata";
import { statRoutes } from "../stat-routes";
import { getVictoryStatistics } from "@/lib/endpoints";
import { VictoryStatisticsView } from "@/components/stats/victory-statistics";

export const metadata = generatePageMetadata(
  statRoutes["victory-statistics"].title,
  statRoutes["victory-statistics"].description
);

export default async function VictoryStatisticsPage() {
  const victoryStats = await getVictoryStatistics();

  if (!victoryStats) {
    return (
      <div className="mt-6">
        <div className="text-center py-12 border border-border rounded-lg">
          <p className="text-muted-foreground">
            No victory statistics available at the moment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <VictoryStatisticsView data={victoryStats} />
    </div>
  );
}
