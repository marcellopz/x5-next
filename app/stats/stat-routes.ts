export interface StatRouteInfo {
  title: string;
  description: string;
}

export const statRoutes: Record<string, StatRouteInfo> = {
  "mvp-table": {
    title: "MVP Table",
    description: "Most valuable players based on performance metrics",
  },
  "role-player-stats": {
    title: "Role Player Stats",
    description: "Statistics for players by their roles",
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

