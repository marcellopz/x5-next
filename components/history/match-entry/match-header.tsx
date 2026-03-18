"use client";

import * as React from "react";
import { memo } from "react";
import Link from "next/link";
import { formatMatchDuration, formatMatchDate } from "./match-utils";
import { ExternalLinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/lib/i18n/locale-context";

interface MatchHeaderProps {
  matchId: string;
  gameDuration: number;
  date: string;
}

export function MatchHeader({ matchId, gameDuration, date }: MatchHeaderProps) {
  const t = useTranslations();
  return (
    <div className="flex items-center justify-between mb-2">
      <div className="text-sm text-muted-foreground flex items-center gap-1">
        <span className=" text-accent-foreground/80">
          {formatMatchDate(date)}
        </span>
        <span>-</span>
        <span className="text-accent-foreground/80">
          {formatMatchDuration(gameDuration)}
        </span>
      </div>
      <Link href={`/match/${matchId}`}>
        <Button
          variant="outline"
          size="xs"
          className="flex items-center gap-1 border-input/70"
        >
          <span className="text-accent-foreground/90 text-xs">
            {t("common.fullMatchDetails")}
          </span>
          <ExternalLinkIcon className="w-3 h-3" />
        </Button>
      </Link>
    </div>
  );
}

export default memo(MatchHeader);
