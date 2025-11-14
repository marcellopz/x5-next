"use server";

import { redirect } from "next/navigation";
import {
  verifyAdminPassword,
  setAdminSession,
  clearAdminSession,
  isAdminAuthenticated,
} from "@/lib/admin-auth";
import { db } from "@/lib/firebase-admin";
import type { Player, PlayerList, RankChangeEntry } from "@/lib/types";

/**
 * Server action to handle admin login
 */
export async function loginAction(formData: FormData) {
  const password = formData.get("password") as string;

  if (!password) {
    return { error: "Password is required" };
  }

  if (!verifyAdminPassword(password)) {
    return { error: "Invalid password" };
  }

  await setAdminSession();
  redirect("/admin");
}

/**
 * Server action to handle admin logout
 */
export async function logoutAction() {
  await clearAdminSession();
  redirect("/admin/login");
}

/**
 * Server action to check authentication status
 */
export async function checkAuthAction(): Promise<boolean> {
  return await isAdminAuthenticated();
}

/**
 * Server action to get all players
 */
export async function getPlayersListAction() {
  // Check authentication
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return { error: "Unauthorized" };
  }

  try {
    const playersRef = db.ref("players");
    const playersSnapshot = await playersRef.once("value");
    const playersData = playersSnapshot.val() as PlayerList | null;

    if (!playersData) {
      return { success: true, players: [] };
    }

    // Convert to array with name_id
    const playersArray = Object.entries(playersData).map(
      ([nameId, player]) => ({
        ...player,
        name_id: nameId, // Ensure name_id is set (may overwrite if player already has it)
      })
    );

    return { success: true, players: playersArray };
  } catch (error) {
    console.error("Error loading players list:", error);
    return {
      error: error instanceof Error ? error.message : "Failed to load players",
    };
  }
}

/**
 * Server action to add a new player
 */
export async function addPlayerAction(formData: {
  account_id: string;
  name: string;
  name_id: string;
  adc: string;
  jungle: string;
  mid: string;
  support: string;
  top: string;
  hide: boolean;
  photoB64: string;
}) {
  // Check authentication
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return { error: "Unauthorized" };
  }

  try {
    // Validate required fields
    if (!formData.name || !formData.name_id) {
      return { error: "Name and name_id are required" };
    }

    // Convert account_id to number if provided
    let accountId: number | undefined;
    if (formData.account_id && formData.account_id.trim() !== "") {
      accountId = parseInt(formData.account_id, 10);
      if (isNaN(accountId)) {
        return { error: "Account ID must be a valid number" };
      }
    }

    // Convert role rankings to numbers
    const adc = parseInt(formData.adc, 10);
    const jungle = parseInt(formData.jungle, 10);
    const mid = parseInt(formData.mid, 10);
    const support = parseInt(formData.support, 10);
    const top = parseInt(formData.top, 10);

    if (
      isNaN(adc) ||
      isNaN(jungle) ||
      isNaN(mid) ||
      isNaN(support) ||
      isNaN(top)
    ) {
      return { error: "All role rankings must be valid numbers" };
    }

    // Prepare player data
    const playerData: Player = {
      name: formData.name,
      name_id: formData.name_id,
      adc,
      jungle,
      mid,
      support,
      top,
    };

    // Only include account_id if it's provided
    if (accountId !== undefined) {
      playerData.account_id = accountId;
    }

    if (formData.hide) {
      playerData.hide = true;
    }

    // Use name_id as the key (or fallback to name.toLowerCase())
    const playerKey = formData.name_id || formData.name.toLowerCase();

    // Set player data
    const playerRef = db.ref(`players/${playerKey}`);
    await playerRef.set(playerData);

    // Set initial rank with timestamp
    const initialRankData = {
      ...playerData,
      timestamp: Date.now(),
    };
    const initialRankRef = db.ref(`player-initial-ranks/${playerKey}`);
    await initialRankRef.set(initialRankData);

    // Add photo if provided
    if (formData.photoB64 && formData.photoB64.trim() !== "") {
      const photoName = formData.name.toLowerCase();
      const photoRef = db.ref(`player-data/${photoName}/photo`);
      await photoRef.set(formData.photoB64);
    }

    return { success: true };
  } catch (error) {
    console.error("Error adding player:", error);
    return {
      error: error instanceof Error ? error.message : "Failed to add player",
    };
  }
}

/**
 * Server action to load a player by name_id
 */
export async function loadPlayerAction(nameId: string) {
  // Check authentication
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return { error: "Unauthorized" };
  }

  try {
    if (!nameId || nameId.trim() === "") {
      return { error: "Name ID is required" };
    }

    // Get player data
    const playerRef = db.ref(`players/${nameId}`);
    const playerSnapshot = await playerRef.once("value");
    const playerData = playerSnapshot.val() as Player | null;

    if (!playerData) {
      return { error: "Player not found" };
    }

    // Get photo if it exists
    let photoB64 = "";
    try {
      const photoName = playerData.name.toLowerCase();
      const photoRef = db.ref(`player-data/${photoName}/photo`);
      const photoSnapshot = await photoRef.once("value");
      photoB64 = photoSnapshot.val() || "";
    } catch {
      // Photo doesn't exist, that's okay
    }

    return {
      success: true,
      player: {
        ...playerData,
        account_id: playerData.account_id?.toString() || "",
        adc: playerData.adc.toString(),
        jungle: playerData.jungle.toString(),
        mid: playerData.mid.toString(),
        support: playerData.support.toString(),
        top: playerData.top.toString(),
        photoB64,
      },
    };
  } catch (error) {
    console.error("Error loading player:", error);
    return {
      error: error instanceof Error ? error.message : "Failed to load player",
    };
  }
}

/**
 * Server action to update an existing player
 */
export async function updatePlayerAction(
  originalNameId: string,
  formData: {
    account_id: string;
    name: string;
    name_id: string;
    adc: string;
    jungle: string;
    mid: string;
    support: string;
    top: string;
    hide: boolean;
    photoB64: string;
  }
) {
  // Check authentication
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return { error: "Unauthorized" };
  }

  try {
    // Validate required fields
    if (!formData.name || !formData.name_id) {
      return { error: "Name and name_id are required" };
    }

    // Load original player data to compare rank changes
    const originalPlayerRef = db.ref(`players/${originalNameId}`);
    const originalPlayerSnapshot = await originalPlayerRef.once("value");
    const originalPlayer = originalPlayerSnapshot.val() as Player | null;

    if (!originalPlayer) {
      return { error: "Original player not found" };
    }

    // Convert account_id to number if provided
    let accountId: number | undefined;
    if (formData.account_id && formData.account_id.trim() !== "") {
      accountId = parseInt(formData.account_id, 10);
      if (isNaN(accountId)) {
        return { error: "Account ID must be a valid number" };
      }
    }

    // Convert role rankings to numbers
    const adc = parseInt(formData.adc, 10);
    const jungle = parseInt(formData.jungle, 10);
    const mid = parseInt(formData.mid, 10);
    const support = parseInt(formData.support, 10);
    const top = parseInt(formData.top, 10);

    if (
      isNaN(adc) ||
      isNaN(jungle) ||
      isNaN(mid) ||
      isNaN(support) ||
      isNaN(top)
    ) {
      return { error: "All role rankings must be valid numbers" };
    }

    // Prepare updated player data
    const playerData: Player = {
      name: formData.name,
      name_id: formData.name_id,
      adc,
      jungle,
      mid,
      support,
      top,
    };

    // Only include account_id if it's provided
    if (accountId !== undefined) {
      playerData.account_id = accountId;
    }

    if (formData.hide) {
      playerData.hide = true;
    }

    // Use name_id as the key (or fallback to name.toLowerCase())
    const playerKey = formData.name_id || formData.name.toLowerCase();

    // Update player data
    const playerRef = db.ref(`players/${playerKey}`);
    await playerRef.set(playerData);

    // Create rank change logs for any changed roles
    const roles: Array<"top" | "jungle" | "mid" | "adc" | "support"> = [
      "top",
      "jungle",
      "mid",
      "adc",
      "support",
    ];

    const rankChanges: RankChangeEntry[] = roles
      .filter((role) => originalPlayer[role] !== playerData[role])
      .map((role) => ({
        player: playerData.name,
        name_id: playerData.name_id,
        role,
        oldRank: originalPlayer[role],
        newRank: playerData[role],
        timestamp: Date.now(),
        type: "rank_change",
      }));

    // Save rank change logs
    for (const change of rankChanges) {
      const logRef = db.ref(
        `player-rank-change-log/${playerData.name_id}/${change.role}`
      );
      await logRef.push(change);
    }

    // Update photo if provided
    if (formData.photoB64 && formData.photoB64.trim() !== "") {
      const photoName = formData.name.toLowerCase();
      const photoRef = db.ref(`player-data/${photoName}/photo`);
      await photoRef.set(formData.photoB64);
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating player:", error);
    return {
      error: error instanceof Error ? error.message : "Failed to update player",
    };
  }
}

/**
 * Server action to batch update role rankings for multiple players
 */
export async function batchRoleEditAction(
  updates: Array<{
    nameId: string;
    role: "top" | "jungle" | "mid" | "adc" | "support";
    rank: number;
  }>,
  batchDescription: string
) {
  // Check authentication
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return { error: "Unauthorized" };
  }

  try {
    if (!batchDescription || batchDescription.trim() === "") {
      return { error: "Batch description is required" };
    }

    if (updates.length === 0) {
      return { error: "No updates provided" };
    }

    // Use the same timestamp for all entries in this batch
    const batchTimestamp = Date.now();

    // Process each update
    for (const update of updates) {
      // Load current player data
      const playerRef = db.ref(`players/${update.nameId}`);
      const playerSnapshot = await playerRef.once("value");
      const player = playerSnapshot.val() as Player | null;

      if (!player) {
        console.warn(`Player ${update.nameId} not found, skipping`);
        continue;
      }

      // Get old rank for this role
      const oldRank = player[update.role];

      // Only update if rank actually changed
      if (oldRank === update.rank) {
        continue;
      }

      // Update player data
      const updatedPlayer: Player = {
        ...player,
        [update.role]: update.rank,
      };
      await playerRef.set(updatedPlayer);

      // Create rank change log entry with shared timestamp
      const rankChangeEntry: RankChangeEntry = {
        player: player.name,
        name_id: player.name_id,
        role: update.role,
        oldRank,
        newRank: update.rank,
        timestamp: batchTimestamp,
        type: "rank_change",
        batch_description: batchDescription,
      };

      // Save rank change log
      const logRef = db.ref(
        `player-rank-change-log/${player.name_id}/${update.role}`
      );
      await logRef.push(rankChangeEntry);
    }

    return { success: true };
  } catch (error) {
    console.error("Error batch updating roles:", error);
    return {
      error:
        error instanceof Error ? error.message : "Failed to batch update roles",
    };
  }
}
