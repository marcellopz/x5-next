// TypeScript Types for Firebase Data

export interface Player {
  account_id: number;
  name: string;
  name_id: string;
  adc: number;
  jungle: number;
  mid: number;
  support: number;
  top: number;
  hide?: boolean; // Some players have this field
}

export interface PlayerList {
  [nameId: string]: Player;
}

export interface RankChangeEntry {
  name_id: string;
  newRank: number;
  oldRank: number;
  player: string;
  role: "adc" | "jungle" | "mid" | "support" | "top";
  timestamp: number;
  type: "rank_change";
}

export interface PlayerRankChanges {
  [role: string]: {
    [entryId: string]: RankChangeEntry;
  };
}

export interface RankChangeLog {
  [nameId: string]: PlayerRankChanges;
}

export interface FirebaseData {
  playerList: PlayerList;
  rankChangeLog: RankChangeLog;
}

// Role type for better type safety
export type Role = "adc" | "jungle" | "mid" | "support" | "top";

// Summarized Overall Data Types
export interface TeamSideStats {
  baronKills: number;
  dragonKills: number;
  firstBaron: number;
  firstBlood: number;
  firstDragon: number;
  firstInhibitor: number;
  firstTower: number;
  riftHeraldKills: number;
  towerKills: number;
  wins: number;
}

export interface ChampionStats {
  assists: number;
  bans: number;
  championId: string;
  championName: string;
  creepsKilled: number;
  deaths: number;
  kills: number;
  picks: number;
  wins: number;
}

export interface GameDurationHistogram {
  [durationRange: string]: number; // e.g., "12-15": 2, "15-18": 2
}

export interface GamesPerMonth {
  [monthKey: string]: number; // e.g., "2025-04": 0, "2025-05": 6
}

export interface SummarizedOverallData {
  blueSide: TeamSideStats;
  redSide: TeamSideStats;
  champions: {
    [championId: string]: ChampionStats;
  };
  gameDurationHistogram: GameDurationHistogram;
  gameDurationTotal: number;
  gamesPerMonth: GamesPerMonth;
  hourlyDistribution: number[]; // Array of 24 numbers (0-23 hours)
  numberOfGames: number;
  weekDayDistribution: number[]; // Array of 7 numbers (Sunday-Saturday)
  mostRecentGameTimestamp: number;
  topRecentPlayer: number;
}

// Initial Ranks Data Types
export interface InitialRankPlayer {
  account_id?: number; // Some players have account_id
  accountId?: number; // Some players have accountId instead
  adc: number;
  jungle: number;
  mid: number;
  name: string;
  name_id: string;
  support: number;
  top: number;
  timestamp?: number; // Some players have timestamp
}

export interface InitialRanksData {
  [nameId: string]: InitialRankPlayer;
}

// Player Summary Data Types
export interface PlayerSummaryData {
  numberOfMatches: number;
  summonerName: string;
  tagLine: string;
  winRate: number;
}

export interface PlayerSummary {
  [accountId: string]: PlayerSummaryData;
}
