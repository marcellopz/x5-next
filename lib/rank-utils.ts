import type {
  InitialRanksData,
  RankChangeLog,
  RankChangeEntry,
  Role,
  PlayerList,
  Player,
  MatchParticipantIdentity,
} from "./types";
import { getPlayerByAccountId } from "./utils";

/**
 * Calculates the rank of a player for a specific role at a given timestamp
 * @param nameId - The player's name_id
 * @param role - The role to get the rank for
 * @param timestamp - The timestamp to calculate the rank at (in milliseconds)
 * @param initialRanks - The initial ranks data
 * @param rankChangeLog - The rank change log data
 * @returns The rank at the given timestamp, or null if not found
 */
export function calculateRankAtTimestamp(
  nameId: string,
  role: Role,
  timestamp: number,
  initialRanks: InitialRanksData | null,
  rankChangeLog: RankChangeLog | null
): number | null {
  // Get initial rank for this player and role
  const initialRankData = initialRanks?.[nameId];
  if (!initialRankData) {
    return null;
  }

  const initialRank = initialRankData[role];
  if (initialRank === undefined) {
    return null;
  }

  // Get rank changes for this player and role
  const playerRankChanges = rankChangeLog?.[nameId];
  if (!playerRankChanges) {
    return initialRank;
  }

  const roleChanges = playerRankChanges[role];
  if (!roleChanges) {
    return initialRank;
  }

  // Convert roleChanges object to array and sort by timestamp
  const changes: RankChangeEntry[] = Object.values(roleChanges).sort(
    (a, b) => a.timestamp - b.timestamp
  );

  // Find the most recent rank change before or at the target timestamp
  let currentRank = initialRank;
  for (const change of changes) {
    if (change.timestamp <= timestamp) {
      currentRank = change.newRank;
    } else {
      // We've passed the target timestamp, stop looking
      break;
    }
  }

  return currentRank;
}

/**
 * Converts a PlayerList object to an array of Player objects, filtering out hidden players
 * @param playerList - The player list object
 * @returns Array of Player objects
 */
export function getPlayerArray(playerList: PlayerList | null): Player[] {
  return playerList
    ? Object.values(playerList).filter((player) => !player.hide)
    : [];
}

/**
 * Calculates player ranks for all participants in a match
 * @param participantIdentities - Array of participant identities from the match
 * @param matchRoles - Map of summonerId to role for the match
 * @param matchTimestamp - The timestamp of the match (gameCreationDate), or null/undefined if not available
 * @param initialRanks - The initial ranks data
 * @param rankChangeLog - The rank change log data
 * @param playerList - The player list data
 * @returns Record mapping summonerId (as string) to role ranks, or empty object if no timestamp
 */
export function calculateMatchPlayerRanks(
  participantIdentities: MatchParticipantIdentity[],
  matchRoles: Record<string, string> | null,
  matchTimestamp: number | null | undefined,
  initialRanks: InitialRanksData | null,
  rankChangeLog: RankChangeLog | null,
  playerList: PlayerList | null
): Record<string, Record<Role, number | null>> {
  // Return empty object if no timestamp is provided
  if (!matchTimestamp) {
    return {};
  }

  const playerRanks: Record<string, Record<Role, number | null>> = {};
  const playerArray = getPlayerArray(playerList);

  for (const identity of participantIdentities) {
    if (!identity.player?.summonerId) {
      continue;
    }

    // Convert summonerId to number for lookup (account_id)
    const accountId = Number(identity.player.summonerId);
    if (isNaN(accountId)) {
      continue;
    }

    const player = getPlayerByAccountId(playerArray, accountId);
    if (!player) {
      continue;
    }

    const nameId = player.name_id;

    // Get the role for this player from matchRoles
    const summonerIdStr = identity.player.summonerId.toString();
    const role = matchRoles?.[summonerIdStr] as Role | undefined;

    if (!role) {
      continue;
    }

    // Calculate rank at match timestamp
    const rank = calculateRankAtTimestamp(
      nameId,
      role,
      matchTimestamp,
      initialRanks,
      rankChangeLog
    );

    if (!playerRanks[summonerIdStr]) {
      playerRanks[summonerIdStr] = {} as Record<Role, number | null>;
    }
    playerRanks[summonerIdStr][role] = rank;
  }

  return playerRanks;
}
