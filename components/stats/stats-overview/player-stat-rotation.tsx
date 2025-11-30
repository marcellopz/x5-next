"use client";

import { useEffect, useMemo, useState } from "react";
import type { Role } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

interface PlayerStatRow {
  name: string;
  summonerId?: string;
  tagLine?: string;
  valueLabel: string;
  detail?: string;
}

interface PlayerStatSet {
  id: string;
  role: Role;
  title: string;
  subtitle: string;
  rows: PlayerStatRow[];
}

interface PlayerStatRotationProps {
  statSets: PlayerStatSet[];
}

export function PlayerStatRotation({ statSets }: PlayerStatRotationProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Group stat sets by role
  const groupedByRole = useMemo(() => {
    const grouped: Record<Role, PlayerStatSet[]> = {
      top: [],
      jungle: [],
      mid: [],
      adc: [],
      support: [],
    };

    statSets.forEach((set) => {
      grouped[set.role].push(set);
    });

    return grouped;
  }, [statSets]);

  // Create pairs of stat sets from the same role
  const statPairs = useMemo(() => {
    const pairs: Array<[PlayerStatSet, PlayerStatSet]> = [];

    // First, try to pair stats from the same role (if a role has 2+ stats)
    Object.values(groupedByRole).forEach((sets) => {
      if (sets.length >= 2) {
        // Pair sets from the same role
        for (let i = 0; i < sets.length - 1; i += 2) {
          pairs.push([sets[i], sets[i + 1]]);
        }
      }
    });

    // If no same-role pairs exist, pair roles together
    if (pairs.length === 0) {
      const rolesWithStats: Array<{ role: Role; set: PlayerStatSet }> = [];
      Object.entries(groupedByRole).forEach(([role, sets]) => {
        sets.forEach((set) => {
          rolesWithStats.push({ role: role as Role, set });
        });
      });

      // Pair roles together
      for (let i = 0; i < rolesWithStats.length - 1; i += 2) {
        pairs.push([rolesWithStats[i].set, rolesWithStats[i + 1].set]);
      }
    }

    return pairs;
  }, [groupedByRole]);

  useEffect(() => {
    if (statPairs.length <= 1) return;
    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % statPairs.length);
    }, 7000);
    return () => clearInterval(id);
  }, [statPairs.length]);

  if (statPairs.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border/60 bg-card/40 p-4 text-sm text-muted-foreground">
        Player stat spotlights will appear once data is available.
      </div>
    );
  }

  const activePair = statPairs[Math.min(activeIndex, statPairs.length - 1)];
  const [leftSet, rightSet] = activePair;

  return (
    <div className="rounded-lg border border-border bg-card/60">
      <div className="grid gap-4 md:grid-cols-2 p-4">
        {[leftSet, rightSet].map((set) => (
          <div key={set.id} className="flex flex-col">
            <div className="mb-3">
              <p className="text-sm font-semibold">{set.title}</p>
              <p className="text-xs text-muted-foreground">{set.subtitle}</p>
            </div>
            <div className="flex-1">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Player</TableHead>
                    <TableHead className="text-right">Metric</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {set.rows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center text-sm">
                        No data for this metric.
                      </TableCell>
                    </TableRow>
                  ) : (
                    set.rows.map((row) => (
                      <TableRow key={`${set.id}-${row.name}`}>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Link
                              href={`/player/${row.summonerId}`}
                              className="text-sm font-semibold hover:text-primary transition-colors"
                            >
                              <span className="font-semibold">{row.name}</span>
                            </Link>
                            {row.tagLine && (
                              <span className="text-xs text-muted-foreground">
                                #{row.tagLine}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="flex items-center gap-2">
                          <p className="font-semibold">{row.valueLabel}</p>
                          <span className="text-xs text-muted-foreground">
                            ({row.detail})
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
