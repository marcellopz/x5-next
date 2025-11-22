export interface StatRouteInfo {
  title: string;
  description: string;
}

export const statRoutes: Record<string, StatRouteInfo> = {
  "mvp-table": {
    title: "MVP Table",
    description: "Players with the most wins in the most recent games",
  },
  "role-player-stats": {
    title: "Role Player Stats",
    description:
      "Average statistics for players by their roles (Top, Jungle, Mid, ADC, Support)",
  },
  "role-champion-stats": {
    title: "Role Champion Stats",
    description: "Champion performance statistics broken down by role",
  },
  "champion-stats": {
    title: "Champion Stats",
    description: "Overall champion statistics and performance metrics",
  },
  "rank-analysis": {
    title: "Rank Analysis",
    description: "Detailed analysis of player rankings and rank changes",
  },
  "victory-statistics": {
    title: "Victory Statistics",
    description: "Win rates, victory patterns, and match outcome analytics",
  },
};
