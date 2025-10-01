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
