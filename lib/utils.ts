import type {
  Player,
  RankChangeLog,
  InitialRankPlayer,
  InitialRanksData,
  RankChangeEntry,
} from "./types";

// Simple className utility without external dependencies
export function cn(...classes: (string | undefined | null | boolean)[]) {
  return classes.filter(Boolean).join(" ");
}

// Finds a player by their account_id from the player list
export function getPlayerByAccountId(
  playerList: Player[] | null,
  accountId: number
): Player | null {
  if (!playerList) return null;

  // Search through all players to find one with matching account_id
  for (const player of playerList) {
    if (player.account_id === accountId) {
      return player;
    }
  }

  return null;
}

// Calculates time elapsed since a Unix timestamp, returning the largest applicable unit
export function getTimeElapsed(unixTimestamp: number): string {
  const now = Date.now();
  const diffMs = now - unixTimestamp;

  // Convert to different units
  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // Return the largest applicable unit
  if (days > 0) {
    return `${days} day${days === 1 ? "" : "s"}`;
  } else if (hours > 0) {
    return `${hours} hour${hours === 1 ? "" : "s"}`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes === 1 ? "" : "s"}`;
  } else {
    return "Just now";
  }
}

// Output type for the grouped changes function
export interface GroupedChangesByDate {
  [dateKey: string]: Array<
    | {
        name_id: string;
        newRank: number;
        oldRank: number;
        player: string;
        role: string;
        timestamp: number;
        type: "rank_change";
        changeId: string;
      }
    | (InitialRankPlayer & {
        changeId: string;
        type: "new_player";
      })
  >;
}

// Helper function to sort patch changes by role priority
export function sortPatchChanges(
  changes: GroupedChangesByDate[string]
): GroupedChangesByDate[string] {
  // Define role order
  const roleOrder = ["top", "jungle", "mid", "adc", "support"];

  return [...changes].sort((a, b) => {
    // New players come first
    if (a.type === "new_player" && b.type !== "new_player") return -1;
    if (a.type !== "new_player" && b.type === "new_player") return 1;

    // If both are new players, maintain original order
    if (a.type === "new_player" && b.type === "new_player") return 0;

    // If both are rank changes, sort by role order
    if (a.type === "rank_change" && b.type === "rank_change") {
      const aIndex = roleOrder.indexOf(a.role);
      const bIndex = roleOrder.indexOf(b.role);
      return aIndex - bIndex;
    }

    return 0;
  });
}

// Function to group changes by date (4 AM to 4 AM in Brazil timezone)
export function groupChangesByDate(
  logs: RankChangeLog | null,
  newPlayers: InitialRanksData | null = null
): GroupedChangesByDate {
  if (!logs) return {};

  // Flatten all rank changes into a single array
  const allChanges: Array<
    | (RankChangeEntry & { changeId: string; type: "rank_change" })
    | (InitialRankPlayer & { changeId: string; type: "new_player" })
  > = [];

  Object.entries(logs).forEach(([, roles]) => {
    Object.entries(roles).forEach(([, changes]) => {
      Object.entries(changes).forEach(([changeId, change]) => {
        allChanges.push({
          ...change,
          changeId,
          type: "rank_change" as const,
        });
      });
    });
  });

  // Add new players to the changes array
  if (newPlayers) {
    Object.values(newPlayers).forEach((player) => {
      allChanges.push({
        ...player,
        changeId: `new_player_${player.name_id}`,
        type: "new_player" as const,
        timestamp: player.timestamp || 0,
      });
    });
  }

  // Group by adjusted date (4 AM to 4 AM)
  const groupedByDate: { [dateKey: string]: typeof allChanges } = {};

  allChanges.forEach((change) => {
    // Convert timestamp to Date object in Brazil timezone (UTC-3)
    const timestamp = change.timestamp || 0;
    const utcDate = new Date(timestamp);
    const brazilDate = new Date(utcDate.getTime() - 3 * 60 * 60 * 1000); // UTC-3

    // If hour is before 4 AM, consider it part of the previous day
    if (brazilDate.getHours() < 4) {
      brazilDate.setDate(brazilDate.getDate() - 1);
    }

    // Format date as YYYY-MM-DD
    const dateKey = brazilDate.toISOString().split("T")[0];

    if (!groupedByDate[dateKey]) {
      groupedByDate[dateKey] = [];
    }

    groupedByDate[dateKey].push(change);
  });

  // Sort dates and consolidate changes within each date
  const sortedDates = Object.keys(groupedByDate).sort().reverse(); // Most recent first
  const sortedGroupedByDate: GroupedChangesByDate = {};

  sortedDates.forEach((date) => {
    const changesForDate = groupedByDate[date];

    // Separate new players from rank changes
    const newPlayerChanges = changesForDate.filter(
      (change) => change.type === "new_player"
    );
    const rankChanges = changesForDate.filter(
      (change) => change.type === "rank_change"
    );

    // Group rank changes by player+role combination
    const playerRoleGroups: {
      [key: string]: Array<
        RankChangeEntry & { changeId: string; type: "rank_change" }
      >;
    } = {};

    rankChanges.forEach((change) => {
      if (change.type === "rank_change") {
        const key = `${change.name_id}_${change.role}`;
        if (!playerRoleGroups[key]) {
          playerRoleGroups[key] = [];
        }
        playerRoleGroups[key].push(change);
      }
    });

    // Consolidate rank changes for each player+role combination
    const consolidatedRankChanges: Array<
      RankChangeEntry & { changeId: string; type: "rank_change" }
    > = [];

    Object.values(playerRoleGroups).forEach((changes) => {
      // Sort changes by timestamp
      changes.sort((a, b) => a.timestamp - b.timestamp);

      const firstChange = changes[0];
      const lastChange = changes[changes.length - 1];

      // If initial rank equals final rank, ignore this change
      if (firstChange.oldRank === lastChange.newRank) {
        return;
      }

      // Create consolidated change
      consolidatedRankChanges.push({
        ...firstChange,
        newRank: lastChange.newRank,
        changeId: `${firstChange.changeId}_consolidated`,
        timestamp: firstChange.timestamp, // Use first change timestamp for sorting
      });
    });

    // Combine consolidated rank changes with new players
    const allChangesForDate = [...consolidatedRankChanges, ...newPlayerChanges];

    // Sort all changes by timestamp
    sortedGroupedByDate[date] = allChangesForDate.sort(
      (a, b) => (a.timestamp || 0) - (b.timestamp || 0)
    );
  });

  return sortedGroupedByDate;
}
