"use client";

import Image from "next/image";
import { CHAMPIONICONURL } from "@/lib/resources";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface NeverPickedChampion {
  championId: string;
  championName: string;
}

interface NeverPickedTableProps {
  champions: NeverPickedChampion[];
}

export function NeverPickedTable({ champions }: NeverPickedTableProps) {
  if (champions.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-muted-foreground">
        No never-picked champions found.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">#</TableHead>
          <TableHead>Champion</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {champions.map((champion, index) => (
          <TableRow key={champion.championId}>
            <TableCell className="text-center text-muted-foreground">
              {index + 1}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-muted shrink-0">
                  <Image
                    src={`${CHAMPIONICONURL}${champion.championId}.png`}
                    alt={champion.championName}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
                <span className="font-medium text-muted-foreground">
                  {champion.championName}
                </span>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
