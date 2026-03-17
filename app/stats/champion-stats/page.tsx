import { generatePageMetadata } from "@/lib/metadata";
import { statRoutes } from "../stat-routes";
import { t, getLocale, getTranslations } from "@/lib/i18n";
import {
  getChampionOVerallData,
  getChampionsAverageRoleStats,
  getNumberOfGames,
} from "@/lib/endpoints";
import { ChampionStats } from "@/components/stats/champion-stats";
import { ChampionStatsHeader } from "@/components/stats/champion-stats/champion-stats-header";
import { championIds } from "@/lib/resources";
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

export async function generateMetadata() {
  const locale = await getLocale();
  const trans = getTranslations(locale);
  return generatePageMetadata(
    t(trans, statRoutes["champion-stats"].titleKey),
    t(trans, statRoutes["champion-stats"].descriptionKey)
  );
}

export default async function ChampionStatsPage() {
  const locale = await getLocale();
  const trans = getTranslations(locale);
  const championsOverAllData = await getChampionOVerallData();
  const championsAverageRoleStats = await getChampionsAverageRoleStats();
  const numberOfGames = await getNumberOfGames();

  if (!championsAverageRoleStats) {
    return <div>{t(trans, "stats.noChampionStatsFound")}</div>;
  }

  const completedChampionsRoleStats = completeChampionsRoleStats(
    championsAverageRoleStats,
    championsOverAllData,
    numberOfGames ?? 1
  );

  const allChampions = Object.values(completedChampionsRoleStats.all ?? {});
  const pickedChampions = allChampions.filter(
    (champ) => champ.picks > 0
  ).length;
  const totalChampions = Object.keys(championIds).length;
  const neverPickedChampionsCount = Math.max(
    totalChampions - pickedChampions,
    0
  );

  // Get list of never-picked champions
  const pickedChampionIds = new Set(
    allChampions
      .filter((champ) => champ.picks > 0)
      .map((champ) => champ.championId)
  );
  const neverPickedChampions = Object.entries(championIds)
    .filter(([id]) => !pickedChampionIds.has(id))
    .map(([id, name]) => ({
      championId: id,
      championName: name,
    }))
    .sort((a, b) => a.championName.localeCompare(b.championName));

  return (
    <div className="space-y-6">
      <ChampionStatsHeader
        picked={pickedChampions}
        neverPicked={neverPickedChampionsCount}
      />
      <ChampionStats
        data={completedChampionsRoleStats}
        neverPickedChampions={neverPickedChampions}
      />
    </div>
  );
}
