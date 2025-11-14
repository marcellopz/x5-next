"use client";

import { useState, useTransition, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Player } from "@/lib/types";
import { getPlayersListAction, batchRoleEditAction } from "@/app/admin/actions";

interface BatchRoleEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Role = "adc" | "jungle" | "mid" | "support" | "top";

interface PlayerWithEditableRank extends Player {
  editedRank?: number;
}

export function BatchRoleEditDialog({
  open,
  onOpenChange,
}: BatchRoleEditDialogProps) {
  const [selectedRole, setSelectedRole] = useState<Role>("adc");
  const [players, setPlayers] = useState<PlayerWithEditableRank[]>([]);
  const [batchDescription, setBatchDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Fetch players when dialog opens
  useEffect(() => {
    if (open) {
      fetchPlayers();
    }
  }, [open]);

  const fetchPlayers = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getPlayersListAction();
      if (result?.error) {
        setError(result.error);
      } else if (result?.players) {
        const playersArray = result.players
          .filter((player) => !player.hide) // Filter out hidden players
          .map((player) => ({
            ...player,
            editedRank: undefined, // Start empty
          }))
          .sort((a, b) => a.name.localeCompare(b.name)); // Sort by name
        setPlayers(playersArray);
      }
    } catch (err) {
      setError("Failed to load players");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Reset edited ranks when role changes
  useEffect(() => {
    setPlayers((prev) =>
      prev.map((player) => ({
        ...player,
        editedRank: undefined, // Reset to empty when role changes
      }))
    );
    setBatchDescription(""); // Reset description when role changes
  }, [selectedRole]);

  const handleRankChange = (nameId: string, newRank: string) => {
    if (newRank === "") {
      setPlayers((prev) =>
        prev.map((player) =>
          player.name_id === nameId
            ? { ...player, editedRank: undefined }
            : player
        )
      );
      return;
    }
    const rankValue = parseInt(newRank, 10);
    setPlayers((prev) =>
      prev.map((player) =>
        player.name_id === nameId
          ? { ...player, editedRank: isNaN(rankValue) ? undefined : rankValue }
          : player
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Validate description
    if (!batchDescription || batchDescription.trim() === "") {
      setError("Batch description is required");
      return;
    }

    // Get players with changed ranks
    const updates = players
      .filter(
        (player) =>
          player.editedRank !== undefined &&
          player.editedRank !== player[selectedRole]
      )
      .map((player) => ({
        nameId: player.name_id,
        role: selectedRole,
        rank: player.editedRank!,
      }));

    if (updates.length === 0) {
      setError("No changes detected");
      return;
    }

    startTransition(async () => {
      const result = await batchRoleEditAction(
        updates,
        batchDescription.trim()
      );
      if (result?.error) {
        setError(result.error);
      } else {
        // Reload players to show updated ranks
        await fetchPlayers();
        // Reset edited ranks and description after successful update
        setPlayers((prev) =>
          prev.map((player) => ({
            ...player,
            editedRank: undefined,
          }))
        );
        setBatchDescription("");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Batch Role Edit</DialogTitle>
          <DialogDescription>
            Update role rankings for multiple players
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <select
              id="role"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as Role)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="top">Top</option>
              <option value="jungle">Jungle</option>
              <option value="mid">Mid</option>
              <option value="adc">ADC</option>
              <option value="support">Support</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="batch-description">
              Batch Description <span className="text-destructive">*</span>
            </Label>
            <Input
              id="batch-description"
              value={batchDescription}
              onChange={(e) => setBatchDescription(e.target.value)}
              placeholder="Enter a description for this batch edit"
              required
            />
            <p className="text-xs text-muted-foreground">
              This description will be added to all rank change logs created by
              this batch edit.
            </p>
          </div>

          {loading ? (
            <div className="py-8 text-center text-muted-foreground">
              Loading players...
            </div>
          ) : error ? (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          ) : (
            <div className="border border-border rounded-lg overflow-hidden">
              <Table compact>
                <TableHeader>
                  <TableRow>
                    <TableHead>Player Name</TableHead>
                    <TableHead>Player ID</TableHead>
                    <TableHead className="w-24">Current Rank</TableHead>
                    <TableHead className="w-32">New Rank</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {players.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center text-muted-foreground"
                      >
                        No players found
                      </TableCell>
                    </TableRow>
                  ) : (
                    players.map((player) => (
                      <TableRow key={player.name_id}>
                        <TableCell className="font-medium">
                          {player.name}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {player.name_id}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {player[selectedRole]}
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={player.editedRank ?? ""}
                            onChange={(e) =>
                              handleRankChange(player.name_id, e.target.value)
                            }
                            className="w-full"
                            min="0"
                            placeholder={player[selectedRole].toString()}
                            compact
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {error && !loading && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || loading}>
              {isPending ? "Updating..." : "Update Players"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
