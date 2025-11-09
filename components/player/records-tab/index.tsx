"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { usePlayerData } from "../player-data-context";
import type { RecordEntry } from "@/lib/types";

interface RecordTag {
  key: string;
  title: string;
  format?: (value: number) => string;
}

const RECORDS_TAGS: RecordTag[] = [
  {
    key: "kills",
    title: "Kills",
    format: undefined,
  },
  {
    key: "deaths",
    title: "Deaths",
    format: undefined,
  },
  {
    key: "assists",
    title: "Assists",
    format: undefined,
  },
  {
    key: "cs",
    title: "CS",
    format: undefined,
  },
  {
    key: "csPerMin",
    title: "CS Per Minute",
    format: (v) => v.toFixed(2),
  },
  {
    key: "damage",
    title: "Damage",
    format: undefined,
  },
  {
    key: "damageTaken",
    title: "Damage Taken",
    format: undefined,
  },
  {
    key: "multiKill",
    title: "Multi Kill",
    format: undefined,
  },
  {
    key: "killingSpree",
    title: "Killing Spree",
    format: undefined,
  },
  {
    key: "longestGame",
    title: "Longest Game",
    format: (v) => `${(v / 60).toFixed(1)} min`,
  },
  {
    key: "shortestGame",
    title: "Shortest Game",
    format: (v) => `${(v / 60).toFixed(1)} min`,
  },
  {
    key: "visionScore",
    title: "Vision Score",
    format: undefined,
  },
];

interface RecordBoxProps {
  title: string;
  value: string | number;
  win: boolean;
  gameId: string;
}

function RecordBox({ title, value, win, gameId }: RecordBoxProps) {
  return (
    <div className="bg-background/30 border border-border rounded-lg p-3 w-[200px] h-[100px] flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <p className="text-base text-muted-foreground">{title}</p>
        <Link
          href={`/match/${gameId}`}
          className="inline-flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground transition-colors p-1"
          title="View match"
        >
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="flex items-end justify-between mt-auto">
        <p
          className={`text-sm ${win ? "text-green-500/60" : "text-red-500/60"}`}
        >
          {win ? "Win" : "Loss"}
        </p>
        <p className="text-3xl font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}

export function PlayerRecordsTab() {
  const { playerInfo } = usePlayerData();
  const records = playerInfo?.records;

  if (!records) {
    return (
      <div className="p-4">
        <p className="text-muted-foreground text-sm text-center py-8">
          No records available
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex flex-wrap gap-3 justify-center">
        {RECORDS_TAGS.map((tag) => {
          const record = records[tag.key as keyof typeof records] as
            | RecordEntry
            | undefined;

          if (!record) return null;

          const value = tag.format ? tag.format(record.n) : record.n;

          return (
            <RecordBox
              key={tag.key}
              title={tag.title}
              value={value}
              win={record.win}
              gameId={record.gameId}
            />
          );
        })}
      </div>
    </div>
  );
}
