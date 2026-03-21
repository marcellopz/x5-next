import { generatePageMetadata } from "@/lib/metadata";
import Link from "next/link";
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
import { statRoutes } from "./stat-routes";
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
import { getLocale, getTranslations, t } from "@/lib/i18n";

export async function generateMetadata() {
  const locale = await getLocale();
  const trans = getTranslations(locale);
  return generatePageMetadata(
    t(trans, "stats.title"),
    t(trans, "stats.description")
  );
}

export default async function StatsPage() {
  const locale = await getLocale();
  const trans = getTranslations(locale);
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
  const victoryHighlight = extractVictoryHighlight(victoryStatistics, (key) =>
    t(trans, key)
  );
  const mapSummary = extractMapSummary(summarizedOverallData);
  const rankTopMovers = extractRankTopMovers(playerRankChangeStats, playerList);
  const rankNetWins = extractRankNetWins(playerRankChangeStats, playerList);
  const mvpRows = extractMvpRows(mvpPlayers);
  const statRouteLinks = Object.entries(statRoutes).map(([slug, info]) => ({
    href: `/stats/${slug}`,
    label: t(trans, info.titleKey),
  }));

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2 min-w-0 flex-1">
            <h1 className="text-2xl font-bold tracking-tight">
              {t(trans, "stats.title")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t(trans, "stats.description")}
            </p>
          </div>
          {generalStats ? (
            <div className="w-full lg:w-auto lg:shrink-0">
              <GeneralSummaryCard
                matches={generalStats.numberOfGames}
                players={generalStats.totalPlayers}
                labels={{
                  matches: t(trans, "stats.summaryCardMatches"),
                  players: t(trans, "stats.summaryCardPlayers"),
                }}
              />
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2">
          {statRouteLinks.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className="rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground hover:bg-accent/50"
            >
              {route.label}
            </Link>
          ))}
        </div>
      </div>

      <StatsOverview
        t={(key) => t(trans, key)}
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
