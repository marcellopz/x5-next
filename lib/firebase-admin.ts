import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";
import type {
  AllReducedData,
  InitialRanksData,
  Player,
  PlayerList,
  PlayerRankChanges,
  PlayerSummary,
  RankChangeLog,
  SummarizedOverallData,
} from "./types";

// Initialize Firebase Admin SDK
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

// Get Realtime Database instance
export const db = getDatabase();

// Fetches all players from the "players" collection
export async function getPlayerList(): Promise<PlayerList | null> {
  try {
    const snapshot = await db.ref("players").once("value");
    const data = snapshot.val();
    return data as PlayerList | null;
  } catch (error) {
    console.error("Error fetching player list:", error);
    throw error;
  }
}

// Fetches all rank change history from "player-rank-change-log" collection
export async function getRankChangeLog(): Promise<RankChangeLog | null> {
  try {
    const snapshot = await db.ref("player-rank-change-log").once("value");
    const data = snapshot.val();
    return data as RankChangeLog | null;
  } catch (error) {
    console.error("Error fetching rank change log:", error);
    throw error;
  }
}

// Fetches a single player by their name_id (e.g., "grilha", "pedro")
export async function getPlayer(nameId: string): Promise<Player | null> {
  try {
    const snapshot = await db.ref(`players/${nameId}`).once("value");
    const data = snapshot.val();
    return data as Player | null;
  } catch (error) {
    console.error(`Error fetching player ${nameId}:`, error);
    throw error;
  }
}

// Fetches rank change history for a specific player by their name_id
export async function getPlayerRankChanges(
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

// Fetches pre-processed overall statistics and analytics data
export async function getSummarizedOverallData(): Promise<SummarizedOverallData | null> {
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

// Fetches initial rank change log
export async function getInitialRankChangeLog(): Promise<InitialRanksData | null> {
  try {
    const snapshot = await db.ref("player-initial-ranks").once("value");
    const data = snapshot.val();
    return data as InitialRanksData | null;
  } catch (error) {
    console.error(`Error fetching initial rank change log:`, error);
    throw error;
  }
}

// Fetches player summary data from pre-processed-data/player-summary
export async function getPlayerSummary(): Promise<PlayerSummary | null> {
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

// Fetches all reduced data from pre-processed-data/all-reduced
export async function getAllReducedData(): Promise<AllReducedData | null> {
  try {
    const snapshot = await db
      .ref("pre-processed-data/all-reduced")
      .once("value");
    const data = snapshot.val();
    return data as AllReducedData | null;
  } catch (error) {
    console.error(`Error fetching all reduced data:`, error);
    throw error;
  }
}
