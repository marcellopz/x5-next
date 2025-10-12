import { db } from "../firebase-admin";
import type {
  AllReducedData,
  InitialRanksData,
  MatchWithId,
  Player,
  PlayerList,
  PlayerRankChanges,
  PlayerSummary,
  RankChangeLog,
  RoleLeaderboardData,
  SummarizedOverallData,
} from "../types";

// Internal function to fetch players from Firebase
export async function _getPlayerList(): Promise<PlayerList | null> {
  try {
    const snapshot = await db.ref("players").once("value");
    const data = snapshot.val();
    return data as PlayerList | null;
  } catch (error) {
    console.error("Error fetching player list:", error);
    throw error;
  }
}

// Internal function to fetch rank change log from Firebase
export async function _getRankChangeLog(): Promise<RankChangeLog | null> {
  try {
    const snapshot = await db.ref("player-rank-change-log").once("value");
    const data = snapshot.val();
    return data as RankChangeLog | null;
  } catch (error) {
    console.error("Error fetching rank change log:", error);
    throw error;
  }
}

// Internal function to fetch a single player from Firebase
export async function _getPlayer(nameId: string): Promise<Player | null> {
  try {
    const snapshot = await db.ref(`players/${nameId}`).once("value");
    const data = snapshot.val();
    return data as Player | null;
  } catch (error) {
    console.error(`Error fetching player ${nameId}:`, error);
    throw error;
  }
}

// Internal function to fetch player rank changes from Firebase
export async function _getPlayerRankChanges(
  nameId: string
): Promise<PlayerRankChanges | null> {
  try {
    const snapshot = await db
      .ref(`player-rank-change-log/${nameId}`)
      .once("value");
    const data = snapshot.val();
    return data as PlayerRankChanges | null;
  } catch (error) {
    console.error(`Error fetching rank changes for ${nameId}:`, error);
    throw error;
  }
}

// Internal function to fetch summarized overall data from Firebase
export async function _getSummarizedOverallData(): Promise<SummarizedOverallData | null> {
  try {
    const snapshot = await db
      .ref(`pre-processed-data/overall-stats`)
      .once("value");
    const data = snapshot.val();
    return data as SummarizedOverallData | null;
  } catch (error) {
    console.error(`Error fetching summarized overall data:`, error);
    throw error;
  }
}

// Internal function to fetch initial rank change log from Firebase
export async function _getInitialRankChangeLog(): Promise<InitialRanksData | null> {
  try {
    const snapshot = await db.ref("player-initial-ranks").once("value");
    const data = snapshot.val();
    return data as InitialRanksData | null;
  } catch (error) {
    console.error(`Error fetching initial rank change log:`, error);
    throw error;
  }
}

// Internal function to fetch player summary data from Firebase
export async function _getPlayerSummary(): Promise<PlayerSummary | null> {
  try {
    const snapshot = await db
      .ref("pre-processed-data/player-summary")
      .once("value");
    const data = snapshot.val();
    return data as PlayerSummary | null;
  } catch (error) {
    console.error(`Error fetching player summary:`, error);
    throw error;
  }
}

// Internal function to fetch all reduced data from Firebase
// Returns an array of matches sorted by date (newest first) with matchId included
export async function _getAllReducedData(): Promise<MatchWithId[]> {
  try {
    const snapshot = await db
      .ref("pre-processed-data/all-reduced")
      .once("value");
    const data = snapshot.val();

    if (!data) return [];

    // Transform object to array with matchId and sort by date (newest first)
    const matchesArray: MatchWithId[] = Object.entries(
      data as AllReducedData
    ).map(
      ([matchId, matchData]) =>
        ({
          matchId,
          ...matchData,
        } as MatchWithId)
    );

    matchesArray.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return matchesArray;
  } catch (error) {
    console.error(`Error fetching all reduced data:`, error);
    throw error;
  }
}

// Internal function to fetch role leaderboard data from Firebase
export async function _getRoleLeaderboardData(): Promise<RoleLeaderboardData | null> {
  try {
    const snapshot = await db
      .ref("pre-processed-data/role-leaderboard")
      .once("value");
    const data = snapshot.val();
    return data as RoleLeaderboardData | null;
  } catch (error) {
    console.error(`Error fetching role leaderboard data:`, error);
    throw error;
  }
}
