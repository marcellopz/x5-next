import React from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  useTableData,
} from "@/components/ui/table";

interface RolePlayerStatsTableProps {
  statLabel: string;
  rows: Array<{
    id: string;
    name: string;
    tagLine?: string;
    numberOfGames: number;
    rawValue: number;
    formattedValue: string;
  }>;
}

export function RolePlayerStatsTable({
  statLabel,
  rows,
}: RolePlayerStatsTableProps) {
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
        initialSort={{ column: "stat", direction: "desc" }}
      >
        <RolePlayerStatsTableContent statLabel={statLabel} />
      </Table>
    </div>
  );
}

function RolePlayerStatsTableContent({ statLabel }: { statLabel: string }) {
  const sortedRows = useTableData() as RolePlayerStatsTableProps["rows"];

  return (
    <>
      <TableHeader>
        <TableRow>
          <TableHead sortable sortKey="player">
            Player
          </TableHead>
          <TableHead className="text-center" sortable sortKey="stat">
            {statLabel}
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
                <div className="flex gap-2">
                  <span className="font-medium">{row.name}</span>
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
