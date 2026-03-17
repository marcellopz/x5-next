export interface StatRouteInfo {
  titleKey: string;
  descriptionKey: string;
}

export const statRoutes: Record<string, StatRouteInfo> = {
  "mvp-table": {
    titleKey: "stats.mvpTable.title",
    descriptionKey: "stats.mvpTable.description",
  },
  "player-stats": {
    titleKey: "stats.playerStats.title",
    descriptionKey: "stats.playerStats.description",
  },
  "champion-stats": {
    titleKey: "stats.championStats.title",
    descriptionKey: "stats.championStats.description",
  },
  "rank-analysis": {
    titleKey: "stats.rankAnalysis.title",
    descriptionKey: "stats.rankAnalysis.description",
  },
  "victory-statistics": {
    titleKey: "stats.victoryStatistics.title",
    descriptionKey: "stats.victoryStatistics.description",
  },
  "map-side-comparison": {
    titleKey: "stats.mapSideComparison.title",
    descriptionKey: "stats.mapSideComparison.description",
  },
};
