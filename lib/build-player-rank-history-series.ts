import type { InitialRankPlayer, PlayerRankChanges, Role } from "./types";

const ROLES: Role[] = ["top", "jungle", "mid", "adc", "support"];

export type RankHistoryChartRow = {
  ts: number;
  top: number;
  jungle: number;
  mid: number;
  adc: number;
  support: number;
};

export function rankAtTime(
  role: Role,
  t: number,
  initial: InitialRankPlayer,
  rankChanges: PlayerRankChanges | null
): number {
  let r = initial[role];
  const entries = rankChanges?.[role];
  if (!entries) return r;
  const list = Object.values(entries).sort((a, b) => a.timestamp - b.timestamp);
  for (const ch of list) {
    if (ch.timestamp <= t) r = ch.newRank;
    else break;
  }
  return r;
}

/**
 * Step-style rank history: one row per time where any role's rank may change.
 * Requires initial ranks; merges all role rank-change timestamps.
 */
export function buildPlayerRankHistorySeries(
  initial: InitialRankPlayer | null,
  rankChanges: PlayerRankChanges | null
): RankHistoryChartRow[] {
  if (!initial) return [];

  const changeTimes = new Set<number>();
  for (const role of ROLES) {
    const entries = rankChanges?.[role];
    if (!entries) continue;
    for (const ch of Object.values(entries)) {
      changeTimes.add(ch.timestamp);
    }
  }

  const sortedTimes = [...changeTimes].sort((a, b) => a - b);
  const now = Date.now();

  if (sortedTimes.length === 0) {
    const dayMs = 86_400_000;
    const t0 = initial.timestamp ?? now - dayMs;
    const appendNow = t0 < now;
    const row = (ts: number) => ({
      ts,
      top: rankAtTime("top", ts, initial, rankChanges),
      jungle: rankAtTime("jungle", ts, initial, rankChanges),
      mid: rankAtTime("mid", ts, initial, rankChanges),
      adc: rankAtTime("adc", ts, initial, rankChanges),
      support: rankAtTime("support", ts, initial, rankChanges),
    });
    if (!appendNow) {
      return [row(t0)];
    }
    return [row(t0), row(now)];
  }

  const dayMs = 86_400_000;
  const startPad =
    initial.timestamp !== undefined
      ? Math.min(initial.timestamp, sortedTimes[0] - 1)
      : sortedTimes[0] - dayMs;

  const allTimes = [startPad, ...sortedTimes];
  let uniqueSorted = [...new Set(allTimes)].sort((a, b) => a - b);
  const lastTs = uniqueSorted[uniqueSorted.length - 1]!;
  if (lastTs < now) {
    uniqueSorted = [...uniqueSorted, now];
  }

  return uniqueSorted.map((ts) => ({
    ts,
    top: rankAtTime("top", ts, initial, rankChanges),
    jungle: rankAtTime("jungle", ts, initial, rankChanges),
    mid: rankAtTime("mid", ts, initial, rankChanges),
    adc: rankAtTime("adc", ts, initial, rankChanges),
    support: rankAtTime("support", ts, initial, rankChanges),
  }));
}
