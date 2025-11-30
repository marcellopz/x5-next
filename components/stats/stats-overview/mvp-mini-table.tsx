import Link from "next/link";
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
  if (rows.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card/60 p-4 text-sm text-muted-foreground">
        MVP leaderboard coming soon.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12 text-center">#</TableHead>
          <TableHead>Player</TableHead>
          <TableHead className="text-center">Wins</TableHead>
          <TableHead className="text-center">Rating</TableHead>
          <TableHead className="text-center">Games</TableHead>
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
