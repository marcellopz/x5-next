export interface StatRouteInfo {
  title: string;
  description: string;
}

export const statRoutes: Record<string, StatRouteInfo> = {
  "mvp-table": {
    title: "MVP Table",
    description: "Players with the most wins in the most recent games",
  },
  "player-stats": {
    title: "Player Stats",
    description: "Average statistics for players by role or overall",
  },
  "champion-stats": {
    title: "Champion Stats",
    description: "Champion performance statistics by role or overall",
  },
  "rank-analysis": {
    title: "Rank Analysis",
    description: "Detailed analysis of player rankings and rank changes",
  },
  "victory-statistics": {
    title: "Victory Statistics",
    description: "Win rates, victory patterns, and match outcome analytics",
  },
  "map-side-comparison": {
    title: "Map Side Comparison",
    description:
      "Compare performance statistics between blue side and red side",
  },
};
