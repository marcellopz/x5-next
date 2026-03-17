"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  CheckboxTableCell,
} from "@/components/ui/table";
import { Player } from "@/lib/types";
import Image from "next/image";
import { useTranslations } from "@/lib/i18n/locale-context";

interface PlayersTableProps {
  players: Player[];
  selectedPlayers: Player[];
  onSelectionChange: (newSelection: Set<string | number>) => void;
}

export function PlayersTable({
  players,
  selectedPlayers,
  onSelectionChange,
}: PlayersTableProps) {
  const t = useTranslations();
  // Convert selectedPlayers to Set for checkbox functionality
  const selectedPlayerIds = new Set(
    selectedPlayers.map((player) => player.account_id)
  );

  const handleCheckboxChange = (newSelection: Set<string | number>) => {
    onSelectionChange(newSelection);
  };

  return (
    <div className="mt-4">
      <Table
        compact
        data={players}
        checkboxConfig={{
          enabled: true,
          selectedItems: selectedPlayerIds,
          onSelectionChange: handleCheckboxChange,
          getItemId: (player: Player) => player.account_id,
        }}
      >
        <TableHeader>
          <TableRow>
            <TableHead className="w-12"></TableHead>
            <TableHead>Player</TableHead>
            <TableHead className="text-center">
              <Image
                src="/top.png"
                alt={t("roles.top")}
                width={20}
                height={20}
                sizes="20px"
                className="min-w-5 h-5 mx-auto"
              />
            </TableHead>
            <TableHead className="text-center">
              <Image
                src="/jungle.png"
                alt={t("roles.jungle")}
                width={20}
                height={20}
                sizes="20px"
                className="min-w-5 h-5 mx-auto"
              />
            </TableHead>
            <TableHead className="text-center">
              <Image
                src="/mid.png"
                alt={t("roles.mid")}
                width={20}
                height={20}
                sizes="20px"
                className="min-w-5 h-5 mx-auto"
              />
            </TableHead>
            <TableHead className="text-center">
              <Image
                src="/bot.png"
                alt={t("roles.adc")}
                width={20}
                height={20}
                sizes="20px"
                className="min-w-5 h-5 mx-auto"
              />
            </TableHead>
            <TableHead className="text-center">
              <Image
                src="/supp.png"
                alt={t("roles.support")}
                width={20}
                height={20}
                sizes="20px"
                className="min-w-5 h-5 mx-auto"
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {players.map((player) => {
            const isSelected = selectedPlayers.some(
              (selected) => selected.account_id === player.account_id
            );

            return (
              <TableRow
                key={player.account_id}
                className={isSelected ? "bg-primary/10" : ""}
                selectable
                itemId={player.account_id}
              >
                <CheckboxTableCell itemId={player.account_id} />
                <TableCell>
                  <span className="font-medium">{player.name}</span>
                </TableCell>
                <TableCell className="text-center">{player.top}</TableCell>
                <TableCell className="text-center">{player.jungle}</TableCell>
                <TableCell className="text-center">{player.mid}</TableCell>
                <TableCell className="text-center">{player.adc}</TableCell>
                <TableCell className="text-center">{player.support}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
