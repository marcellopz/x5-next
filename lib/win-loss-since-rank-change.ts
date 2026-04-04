import type { PlayerRankChangeStats, Role, WinLoseSinceLastChange } from "./types";

const ROLES: Role[] = ["top", "jungle", "mid", "adc", "support"];

/** Per-role preprocessed W/L since last rank change for one player (same source as /stats/rank-analysis). */
export type WinLoseSinceLastChangeByRole = Record<
  Role,
  WinLoseSinceLastChange | null
>;

export function getWinLoseSinceLastChangeByRole(
  stats: PlayerRankChangeStats | null,
  nameId: string
): WinLoseSinceLastChangeByRole {
  const byRole = stats?.win_loses_since_last_change;
  const result = {} as WinLoseSinceLastChangeByRole;

  for (const role of ROLES) {
    result[role] = byRole?.[role]?.[nameId] ?? null;
  }

  return result;
}
