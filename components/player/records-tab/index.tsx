"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "@/lib/i18n/locale-context";
import { usePlayerData } from "../player-data-context";
import type { RecordEntry } from "@/lib/types";

interface RecordTag {
  key: string;
  titleKey: string;
  format?: (value: number) => string;
}

const RECORDS_TAG_KEYS: RecordTag[] = [
  { key: "kills", titleKey: "records.kills", format: undefined },
  { key: "deaths", titleKey: "records.deaths", format: undefined },
  { key: "assists", titleKey: "records.assists", format: undefined },
  { key: "cs", titleKey: "records.cs", format: undefined },
  { key: "csPerMin", titleKey: "records.csPerMinute", format: (v) => v.toFixed(2) },
  { key: "damage", titleKey: "records.damage", format: undefined },
  { key: "damageTaken", titleKey: "records.damageTaken", format: undefined },
  { key: "multiKill", titleKey: "records.multiKill", format: undefined },
  { key: "killingSpree", titleKey: "records.killingSpree", format: undefined },
  { key: "longestGame", titleKey: "records.longestGame", format: (v) => `${(v / 60).toFixed(1)} min` },
  { key: "shortestGame", titleKey: "records.shortestGame", format: (v) => `${(v / 60).toFixed(1)} min` },
  { key: "visionScore", titleKey: "records.visionScore", format: undefined },
];

interface RecordBoxProps {
  title: string;
  value: string | number;
  win: boolean;
  gameId: string;
  viewMatchLabel: string;
  winLabel: string;
  lossLabel: string;
}

function RecordBox({ title, value, win, gameId, viewMatchLabel, winLabel, lossLabel }: RecordBoxProps) {
  return (
    <div className="bg-background/30 border border-border rounded-lg p-3 w-[200px] h-[100px] flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <p className="text-base text-muted-foreground">{title}</p>
        <Link
          href={`/match/${gameId}`}
          className="inline-flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground transition-colors p-1"
          title={viewMatchLabel}
        >
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="flex items-end justify-between mt-auto">
        <p
          className={`text-sm ${win ? "text-green-500/60" : "text-red-500/60"}`}
        >
          {win ? winLabel : lossLabel}
        </p>
        <p className="text-3xl font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}

export function PlayerRecordsTab() {
  const { playerInfo } = usePlayerData();
  const records = playerInfo?.records;

  const t = useTranslations();
  if (!records) {
    return (
      <div className="p-4">
        <p className="text-muted-foreground text-sm text-center py-8">
          {t("records.noRecordsAvailable")}
        </p>
      </div>
    );
  }

  const viewMatchLabel = t("records.viewMatch");
  const winLabel = t("common.victory");
  const lossLabel = t("common.defeat");
  return (
    <div className="p-4">
      <div className="flex flex-wrap gap-3 justify-center">
        {RECORDS_TAG_KEYS.map((tag) => {
          const record = records[tag.key as keyof typeof records] as
            | RecordEntry
            | undefined;

          if (!record) return null;

          const value = tag.format ? tag.format(record.n) : record.n;

          return (
            <RecordBox
              key={tag.key}
              title={t(tag.titleKey)}
              value={value}
              win={record.win}
              gameId={record.gameId}
              viewMatchLabel={viewMatchLabel}
              winLabel={winLabel}
              lossLabel={lossLabel}
            />
          );
        })}
      </div>
    </div>
  );
}
