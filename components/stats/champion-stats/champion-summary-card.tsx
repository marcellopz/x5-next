"use client";

import { cn } from "@/lib/utils";
import { useTranslations } from "@/lib/i18n/locale-context";

interface ChampionSummaryCardProps {
  className?: string;
  picked: number;
  neverPicked: number;
}

export function ChampionStatsSummaryCard({
  className,
  picked,
  neverPicked,
}: ChampionSummaryCardProps) {
  const t = useTranslations();
  return (
    <div
      className={cn(
        "max-w-md rounded-lg border border-border/60 bg-card/60 px-4 py-3",
        className
      )}
    >
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">
          {t("stats.championOverview")}
        </p>
        <div className="space-y-1 text-sm">
          <p>
            <span className="text-muted-foreground">
              {t("stats.championsPickedOnce")}
            </span>{" "}
            <span className="font-semibold text-foreground">{picked}</span>
          </p>
          <p>
            <span className="text-muted-foreground">
              {t("stats.championsNeverPicked")}
            </span>{" "}
            <span className="font-semibold text-foreground">{neverPicked}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
