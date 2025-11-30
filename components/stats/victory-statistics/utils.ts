import type { StatEntry } from "@/lib/types";

export interface ObjectiveStat {
  label: string;
  entry: StatEntry;
  description?: string;
}

export const formatWinRate = (value?: number | null) =>
  `${Number(value ?? 0).toFixed(1)}%`;

export const getLosses = (entry: StatEntry) =>
  Math.max(entry.total - entry.wins, 0);

export const mapObjectiveStat = (label: string, entry: StatEntry) => ({
  label,
  winRate: entry.winRate ?? 0,
  wins: entry.wins ?? 0,
  total: entry.total ?? 0,
  losses: getLosses(entry),
});
