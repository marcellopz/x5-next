import { generatePageMetadata } from "@/lib/metadata";
import { statRoutes } from "../stat-routes";
import {
  getChampionOVerallData,
  getChampionsAverageRoleStats,
  getNumberOfGames,
} from "@/lib/endpoints";
import { ChampionStats } from "@/components/stats/champion-stats";
import type {
  ChampionsAverageRoleStats,
  ChampionStats as ChampionStatsType,
} from "@/lib/types";

function completeChampionsRoleStats(
  championsAverageRoleStats: ChampionsAverageRoleStats,
  championsOverAllData: Record<string, ChampionStatsType> | null,
  totalGames: number
): ChampionsAverageRoleStats {
  if (!championsOverAllData) {
    return championsAverageRoleStats;
  }

  // Only update the "all" property with presence and bans
  Object.entries(championsAverageRoleStats.all).forEach(
    ([championId, champion]) => {
      const championData = championsOverAllData[championId];
      if (championData) {
        champion.presence =
          (championData.picks + championData.bans) / totalGames;
        champion.bans = championData.bans;
      }
    }
  );

  return championsAverageRoleStats;
}

export const metadata = generatePageMetadata(
  statRoutes["champion-stats"].title,
  statRoutes["champion-stats"].description
);

export default async function ChampionStatsPage() {
  const championsOverAllData = await getChampionOVerallData();
  const championsAverageRoleStats = await getChampionsAverageRoleStats();
  const numberOfGames = await getNumberOfGames();

  if (!championsAverageRoleStats) {
    return <div>No champions average role stats found</div>;
  }

  const completedChampionsRoleStats = completeChampionsRoleStats(
    championsAverageRoleStats,
    championsOverAllData,
    numberOfGames ?? 1
  );

  return <ChampionStats data={completedChampionsRoleStats} />;
}
