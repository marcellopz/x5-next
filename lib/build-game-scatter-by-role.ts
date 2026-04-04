import { rankAtTime } from "./build-player-rank-history-series";
import type {
  InitialRankPlayer,
  MatchWithId,
  PlayerRankChanges,
  Role,
} from "./types";

const ROLES: Role[] = ["top", "jungle", "mid", "adc", "support"];

/** `ts` matches line chart XAxis dataKey so scatter aligns on the same time scale. */
export type GameScatterPoint = {
  x: number;
  ts: number;
  y: number;
  count: number;
};

function localDateKey(ts: number): string {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function normalizeParticipantRole(raw: string | undefined): Role | null {
  if (!raw) return null;
  const x = raw.toLowerCase();
  if (x === "bottom" || x === "bot") return "adc";
  if ((ROLES as readonly string[]).includes(x)) return x as Role;
  return null;
}

/**
 * One scatter point per (role, local calendar day): x = mean match time that day,
 * y = rank after the last game that day, count = games that day (drives bubble size).
 */
export function buildGameScatterByRole(
  initial: InitialRankPlayer | null,
  rankChanges: PlayerRankChanges | null,
  matches: MatchWithId[],
  summonerId: string | number | undefined
): Record<Role, GameScatterPoint[]> {
  const out = {} as Record<Role, GameScatterPoint[]>;
  for (const r of ROLES) out[r] = [];

  if (!initial || summonerId === undefined || summonerId === "") {
    return out;
  }

  const sid = String(summonerId);
  const buckets = new Map<
    string,
    { role: Role; times: number[] }
  >();

  for (const match of matches) {
    const p = match.participants.find((pr) => String(pr.summonerId) === sid);
    if (!p) continue;
    const role = normalizeParticipantRole(p.role);
    if (!role) continue;
    const ts = new Date(match.date).getTime();
    if (Number.isNaN(ts)) continue;
    const key = `${role}:${localDateKey(ts)}`;
    const cur = buckets.get(key);
    if (cur) cur.times.push(ts);
    else buckets.set(key, { role, times: [ts] });
  }

  for (const { role, times } of buckets.values()) {
    const count = times.length;
    const x = times.reduce((a, b) => a + b, 0) / count;
    const lastTs = Math.max(...times);
    const y = rankAtTime(role, lastTs, initial, rankChanges);
    out[role].push({ x, ts: x, y, count });
  }

  for (const r of ROLES) {
    out[r].sort((a, b) => a.x - b.x);
  }

  return out;
}
