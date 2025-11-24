import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  useTableData,
} from "@/components/ui/table";
import Link from "next/link";
import useIsMobile from "@/lib/hooks/useIsMobile";

interface RolePlayerStatsTableProps {
  statLabel: string;
  statDescription?: string;
  rows: Array<{
    id: string;
    summonerId: string;
    name: string;
    tagLine?: string;
    numberOfGames: number;
    rawValue: number;
    formattedValue: string;
  }>;
}

export function RolePlayerStatsTable({
  statLabel,
  statDescription,
  rows,
}: RolePlayerStatsTableProps) {
  const isMobile = useIsMobile();
  if (!rows.length) {
    return (
      <p className="text-sm text-muted-foreground">
        No players available for this combination yet.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <Table
        data={rows}
        sortConfig={{
          player: (row) => row.name,
          stat: (row) => row.rawValue,
          games: (row) => row.numberOfGames,
        }}
        compact={isMobile}
        initialSort={{ column: "stat", direction: "desc" }}
      >
        <RolePlayerStatsTableContent
          statLabel={statLabel}
          statDescription={statDescription}
        />
      </Table>
    </div>
  );
}

function RolePlayerStatsTableContent({
  statLabel,
  statDescription,
}: {
  statLabel: string;
  statDescription?: string;
}) {
  const sortedRows = useTableData() as RolePlayerStatsTableProps["rows"];

  return (
    <>
      <TableHeader>
        <TableRow>
          <TableHead sortable sortKey="player">
            Player
          </TableHead>
          <TableHead className="text-center" sortable sortKey="stat">
            <div className="flex flex-col items-center gap-0.5">
              <span>{statLabel}</span>
              {statDescription && (
                <span className="text-xs font-normal text-muted-foreground">
                  {statDescription}
                </span>
              )}
            </div>
          </TableHead>
          <TableHead className="text-center" sortable sortKey="games">
            Games
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedRows.length > 0 ? (
          sortedRows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>
                <div className="flex gap-1 h-full items-center">
                  <Link href={`/player/${row.summonerId}`}>
                    <span className="font-medium hover:text-primary">
                      {row.name}
                    </span>
                  </Link>
                  {row.tagLine && (
                    <span className="text-xs text-muted-foreground">
                      #{row.tagLine}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-center font-semibold">
                {row.formattedValue}
              </TableCell>
              <TableCell className="text-center text-muted-foreground">
                {row.numberOfGames}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={3} className="text-center py-6 text-sm">
              No players available for this selection.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </>
  );
}
