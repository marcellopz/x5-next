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

const FIREBASE_DATABASE_URL = process.env.FIREBASE_DATABASE_URL;

if (!FIREBASE_DATABASE_URL) {
  throw new Error(
    "FIREBASE_DATABASE_URL is not defined in environment variables"
  );
}

// Helper function to fetch data from Firebase REST API with fetch options
async function fetchFromFirebase<T>(
  path: string,
  options?: RequestInit
): Promise<T | null> {
  try {
    const url = `${FIREBASE_DATABASE_URL}/${path}.json`;

    const response = await fetch(url, {
      ...options,
      next: { revalidate: 1 },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data as T | null;
  } catch (error) {
    console.error(`Error fetching data from ${path}:`, error);
    throw error;
  }
}

// Public endpoint functions

// Fetches all players from the "players" collection
export async function getPlayerList(): Promise<PlayerList | null> {
  return fetchFromFirebase<PlayerList>("players");
}

// Fetches all rank change history from "player-rank-change-log" collection
export async function getRankChangeLog(): Promise<RankChangeLog | null> {
  return fetchFromFirebase<RankChangeLog>("player-rank-change-log");
}

// Fetches a single player by their name_id (e.g., "grilha", "pedro")
export async function getPlayer(nameId: string): Promise<Player | null> {
  return fetchFromFirebase<Player>(`players/${nameId}`);
}

// Fetches rank change history for a specific player by their name_id
export async function getPlayerRankChanges(
  nameId: string
): Promise<PlayerRankChanges | null> {
  return fetchFromFirebase<PlayerRankChanges>(
    `player-rank-change-log/${nameId}`
  );
}

// Fetches pre-processed overall statistics and analytics data
export async function getSummarizedOverallData(): Promise<SummarizedOverallData | null> {
  return fetchFromFirebase<SummarizedOverallData>(
    "pre-processed-data/overall-stats"
  );
}

// Fetches initial rank change log
export async function getInitialRankChangeLog(): Promise<InitialRanksData | null> {
  return fetchFromFirebase<InitialRanksData>("player-initial-ranks");
}

// Fetches player summary data from pre-processed-data/player-summary
export async function getPlayerSummary(): Promise<PlayerSummary | null> {
  return fetchFromFirebase<PlayerSummary>("pre-processed-data/player-summary");
}

// Fetches all reduced data from pre-processed-data/all-reduced
export async function getAllReducedData(): Promise<MatchWithId[]> {
  const data = await fetchFromFirebase<AllReducedData>(
    "pre-processed-data/all-reduced",
    {
      cache: "no-store",
    }
  );

  if (!data) return [];

  // Transform object to array with matchId and sort by date (newest first)
  const matchesArray: MatchWithId[] = Object.entries(data).map(
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
}

// Fetches role leaderboard data from pre-processed-data/role-leaderboard
export async function getRoleLeaderboardData(): Promise<RoleLeaderboardData | null> {
  return fetchFromFirebase<RoleLeaderboardData>(
    "pre-processed-data/role-leaderboard"
  );
}
