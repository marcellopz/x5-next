"use client";

import Image from "next/image";
import { PlaceholderCard } from "./placeholder-card";
import type { ChampionPresenceEntry } from "./index";
import { CHAMPIONICONURL } from "@/lib/resources";
import { useTranslations } from "@/lib/i18n/locale-context";

export function ChampionPresenceList({
  entries,
}: {
  entries: ChampionPresenceEntry[];
}) {
  const t = useTranslations();
  if (entries.length === 0) {
    return <PlaceholderCard message={t("stats.presenceDataComingSoon")} />;
  }

  return (
    <div className="rounded-lg border border-border/60 bg-card/60">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
        <h4 className="text-sm font-semibold">{t("stats.topPresenceAllRoles")}</h4>
        <span className="text-xs text-muted-foreground">{t("stats.pickBanRate")}</span>
      </div>
      <div className="divide-y divide-border/60">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="flex items-center justify-between px-4 py-3 gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="relative h-8 w-8 overflow-hidden rounded-full bg-muted">
                <Image
                  src={`${CHAMPIONICONURL}${entry.id}.png`}
                  alt={entry.name}
                  fill
                  sizes="32px"
                />
              </div>
              <div>
                <p className="text-sm font-semibold">{entry.name}</p>
                <p className="text-xs text-muted-foreground">
                  {entry.picks} {t("home.picks").toLowerCase()} • {entry.bans} {t("home.bans").toLowerCase()}
                </p>
              </div>
            </div>
            <span className="text-sm font-semibold text-primary">
              {(entry.presence * 100).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
