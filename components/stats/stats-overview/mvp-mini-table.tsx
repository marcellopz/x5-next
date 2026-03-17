"use client";

import Link from "next/link";
import { useTranslations } from "@/lib/i18n/locale-context";
import type { MvpRow } from "./index";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScoreBadge } from "@/components/ui/score-badge";

export function MvpMiniTable({ rows }: { rows: MvpRow[] }) {
  const t = useTranslations();
  if (rows.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card/60 p-4 text-sm text-muted-foreground">
        {t("stats.mvpLeaderboardComingSoon")}
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12 text-center">#</TableHead>
          <TableHead>{t("stats.mvpTablePlayer")}</TableHead>
          <TableHead className="text-center">{t("common.wins")}</TableHead>
          <TableHead className="text-center">{t("stats.mvpTableRating")}</TableHead>
          <TableHead className="text-center">{t("common.games")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row, index) => (
          <TableRow key={row.name}>
            <TableCell className="text-center text-muted-foreground">
              {index + 1}
            </TableCell>
            <TableCell className="font-medium">
              <Link
                href={`/player/${row.summonerId}`}
                className="hover:text-primary transition-colors"
              >
                {row.name}
              </Link>
            </TableCell>
            <TableCell className="text-center">{row.wins}</TableCell>
            <TableCell className="text-center">
              <ScoreBadge score={row.score} />
            </TableCell>
            <TableCell className="text-center">{row.games}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
