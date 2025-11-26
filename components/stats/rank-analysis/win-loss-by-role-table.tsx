"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  useTableData,
} from "@/components/ui/table";
import type { Role } from "@/lib/types";
import Link from "next/link";

interface WinLossByRoleTableProps {
  data: {
    top: { [name_id: string]: { wins: number; loses: number; rank: number } };
    jungle: {
      [name_id: string]: { wins: number; loses: number; rank: number };
    };
    mid: { [name_id: string]: { wins: number; loses: number; rank: number } };
    adc: { [name_id: string]: { wins: number; loses: number; rank: number } };
    support: {
      [name_id: string]: { wins: number; loses: number; rank: number };
    };
  };
  getPlayerName: (nameId: string) => string;
}

const roles: Role[] = ["top", "jungle", "mid", "adc", "support"];

const roleLabels: Record<Role, string> = {
  top: "Top",
  jungle: "Jungle",
  mid: "Mid",
  adc: "ADC",
  support: "Support",
};

function WinLossTableRows({
  getPlayerName,
}: {
  getPlayerName: (nameId: string) => string;
}) {
  const sortedData = useTableData() as Array<{
    nameId: string;
    wins: number;
    loses: number;
    rank: number;
  }>;

  return (
    <>
      {sortedData.length === 0 ? (
        <TableRow>
          <TableCell colSpan={5} className="text-center text-muted-foreground">
            No players found for this role
          </TableCell>
        </TableRow>
      ) : (
        sortedData.map((item) => {
          const winRate =
            item.wins + item.loses > 0
              ? ((item.wins / (item.wins + item.loses)) * 100).toFixed(1)
              : "0.0";
          return (
            <TableRow key={item.nameId}>
              <TableCell className="font-semibold">
                <Link
                  href={`/player/${item.nameId}`}
                  className="hover:text-primary"
                >
                  {getPlayerName(item.nameId)}
                </Link>
                <span className="text-muted-foreground"> ({item.rank})</span>
              </TableCell>
              <TableCell className="text-center">
                <span className="text-green-400">{item.wins}</span>
                {" / "}
                <span className="text-red-400">{item.loses}</span>
              </TableCell>
              <TableCell className="text-center">{winRate}%</TableCell>
            </TableRow>
          );
        })
      )}
    </>
  );
}

function WinLossRoleTable({
  role,
  roleData,
  getPlayerName,
}: {
  role: Role;
  roleData: {
    [name_id: string]: { wins: number; loses: number; rank: number };
  };
  getPlayerName: (nameId: string) => string;
}) {
  const tableData = Object.entries(roleData).map(([nameId, stats]) => ({
    nameId,
    ...stats,
  }));

  return (
    <div className="space-y-2 h-100">
      <h3 className="text-lg font-semibold">{roleLabels[role]}</h3>
      <Table
        // compact
        data={tableData}
        sortConfig={{
          nameId: (item) => getPlayerName(item.nameId),
          wins: (item) => item.wins - item.loses,
          loses: (item) => item.loses,
          rank: (item) => item.rank,
          winRate: (item) =>
            item.wins + item.loses > 0
              ? item.wins / (item.wins + item.loses)
              : 0,
        }}
        initialSort={{ column: "wins", direction: "desc" }}
      >
        <TableHeader>
          <TableRow>
            <TableHead sortable sortKey="nameId">
              Player
            </TableHead>
            <TableHead sortable sortKey="wins" className="text-center">
              W/L
            </TableHead>
            <TableHead sortable sortKey="winRate" className="text-center">
              Win Rate
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <WinLossTableRows getPlayerName={getPlayerName} />
        </TableBody>
      </Table>
    </div>
  );
}

export function WinLossByRoleTable({
  data,
  getPlayerName,
}: WinLossByRoleTableProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Win/Loss Since Last Rank Change</h2>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-5 gap-6 gap-y-12">
        {roles.map((role) => (
          <WinLossRoleTable
            key={role}
            role={role}
            roleData={data[role]}
            getPlayerName={getPlayerName}
          />
        ))}
      </div>
    </div>
  );
}
