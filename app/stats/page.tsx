import { generatePageMetadata } from "@/lib/metadata";
import {
  getSummarizedOverallData,
  getChampionsAverageRoleStats,
  getPlayersAverageRoleStats,
  getVictoryStatistics,
  getPlayerRankChangeStats,
  getPlayerList,
  getMVPPlayers,
  getChampionOVerallData,
  getNumberOfGames,
} from "@/lib/endpoints";
import { GeneralSummaryCard } from "@/components/stats/stats-overview/general-summary-card";
import { StatsOverview } from "@/components/stats/stats-overview";
import {
  extractChampionData,
  extractPlayerHighlights,
  extractPlayerStatSets,
  extractVictoryHighlight,
  extractMapSummary,
  extractRankTopMovers,
  extractRankNetWins,
  extractMvpRows,
} from "./utils";

export const metadata = generatePageMetadata(
  "Stats",
  "Overall statistics, leaderboards, and analysis"
);

export default async function StatsPage() {
  const [
    summarizedOverallData,
    championsAverageRoleStats,
    playersAverageRoleStats,
    victoryStatistics,
    playerRankChangeStats,
    playerList,
    mvpPlayers,
    championsOverAllData,
    numberOfGames,
  ] = await Promise.all([
    getSummarizedOverallData(),
    getChampionsAverageRoleStats(),
    getPlayersAverageRoleStats(),
    getVictoryStatistics(),
    getPlayerRankChangeStats(),
    getPlayerList(),
    getMVPPlayers(),
    getChampionOVerallData(),
    getNumberOfGames(),
  ]);

  const generalStats =
    summarizedOverallData && playerList
      ? {
          numberOfGames: summarizedOverallData.numberOfGames ?? 0,
          totalPlayers: Object.values(playerList).filter((p) => !p.hide).length,
        }
      : null;

  const { spotlight, neverPicked } = extractChampionData(
    championsAverageRoleStats,
    championsOverAllData,
    numberOfGames ?? summarizedOverallData?.numberOfGames ?? 1
  );

  const playerHighlights = extractPlayerHighlights(playersAverageRoleStats);
  const playerStatSets = extractPlayerStatSets(playersAverageRoleStats);
  const victoryHighlight = extractVictoryHighlight(victoryStatistics);
  const mapSummary = extractMapSummary(summarizedOverallData);
  const rankTopMovers = extractRankTopMovers(playerRankChangeStats, playerList);
  const rankNetWins = extractRankNetWins(playerRankChangeStats, playerList);
  const mvpRows = extractMvpRows(mvpPlayers);

  return (
    <>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Statistics</h1>
          <p className="text-sm text-muted-foreground">
            A snapshot of how teams and players are performing across the split.
          </p>
        </div>
        {generalStats ? (
          <div className="w-full lg:w-auto">
            <GeneralSummaryCard
              matches={generalStats.numberOfGames}
              players={generalStats.totalPlayers}
            />
          </div>
        ) : null}
      </div>

      <StatsOverview
        championSpotlight={spotlight}
        neverPickedChampions={neverPicked}
        playerHighlights={playerHighlights}
        playerStatSets={playerStatSets}
        victoryHighlight={victoryHighlight}
        mapSummary={mapSummary}
        rankTopMovers={rankTopMovers}
        rankNetWins={rankNetWins}
        mvpRows={mvpRows}
      />
    </>
  );
}
