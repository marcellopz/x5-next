"use client";

import { useTranslations } from "@/lib/i18n/locale-context";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  useTableData,
} from "@/components/ui/table";

interface RankChangesTableProps {
  data: { [name_id: string]: number };
  getPlayerName: (nameId: string) => string;
}

function RankChangesTableRows({
  getPlayerName,
  t,
}: {
  getPlayerName: (nameId: string) => string;
  t: (key: string) => string;
}) {
  const sortedData = useTableData() as Array<{
    nameId: string;
    changes: number;
  }>;

  return (
    <>
      {sortedData.length === 0 ? (
        <TableRow>
          <TableCell colSpan={3} className="text-center text-muted-foreground">
            {t("stats.noRankChangesFound")}
          </TableCell>
        </TableRow>
      ) : (
        sortedData.map((item, index) => (
          <TableRow key={item.nameId}>
            <TableCell className="font-medium">{index + 1}</TableCell>
            <TableCell className="font-semibold">
              {getPlayerName(item.nameId)}
            </TableCell>
            <TableCell className="text-center">{item.changes}</TableCell>
          </TableRow>
        ))
      )}
    </>
  );
}

export function RankChangesTable({
  data,
  getPlayerName,
}: RankChangesTableProps) {
  const t = useTranslations();
  const tableData = Object.entries(data).map(([nameId, changes]) => ({
    nameId,
    changes,
  }));

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{t("stats.totalRankChanges")}</h2>
      <Table
        data={tableData}
        sortConfig={{
          nameId: (item) => getPlayerName(item.nameId),
          changes: (item) => item.changes,
        }}
        initialSort={{ column: "changes", direction: "desc" }}
      >
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">#</TableHead>
            <TableHead sortable sortKey="nameId">
              {t("stats.mvpTablePlayer")}
            </TableHead>
            <TableHead sortable sortKey="changes" className="text-center">
              {t("stats.totalChanges")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <RankChangesTableRows getPlayerName={getPlayerName} t={t} />
        </TableBody>
      </Table>
    </div>
  );
}
