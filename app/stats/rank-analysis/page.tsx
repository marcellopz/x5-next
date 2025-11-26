import { generatePageMetadata } from "@/lib/metadata";
import { statRoutes } from "../stat-routes";
import { getPlayerRankChangeStats, getPlayerList } from "@/lib/endpoints";
import { RankAnalysis } from "@/components/stats/rank-analysis";

export const metadata = generatePageMetadata(
  statRoutes["rank-analysis"].title,
  statRoutes["rank-analysis"].description
);

export default async function RankAnalysisPage() {
  const [playerRankChangeStats, playerList] = await Promise.all([
    getPlayerRankChangeStats(),
    getPlayerList(),
  ]);

  if (!playerRankChangeStats) {
    return (
      <div className="mt-6">
        <div className="text-center py-12 border border-border rounded-lg">
          <p className="text-muted-foreground">
            No rank change statistics available
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <RankAnalysis data={playerRankChangeStats} playerList={playerList} />
    </div>
  );
}
