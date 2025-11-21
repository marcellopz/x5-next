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
import { Checkbox } from "@/components/ui/checkbox";
import {
  loadPlayerAction,
  updatePlayerAction,
  getPlayersListAction,
} from "@/app/admin/actions";
import type { Player } from "@/lib/types";

interface EditPlayerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type PlayerWithNameId = Player & { name_id: string };

export function EditPlayerDialog({
  open,
  onOpenChange,
}: EditPlayerDialogProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerWithNameId | null>(
    null
  );
  const [originalNameId, setOriginalNameId] = useState<string>("");
  const [playersList, setPlayersList] = useState<PlayerWithNameId[]>([]);
  const [loadingPlayers, setLoadingPlayers] = useState(false);
  const [formData, setFormData] = useState({
    account_id: "",
    name: "",
    name_id: "",
    adc: "",
    jungle: "",
    mid: "",
    support: "",
    top: "",
    hide: false,
    photoB64: "",
  });
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [loadingPlayer, setLoadingPlayer] = useState(false);

  // Load players list when dialog opens
  useEffect(() => {
    if (open) {
      loadPlayersList();
    } else {
      // Reset state when dialog closes
      setSelectedPlayer(null);
      setOriginalNameId("");
      setFormData({
        account_id: "",
        name: "",
        name_id: "",
        adc: "",
        jungle: "",
        mid: "",
        support: "",
        top: "",
        hide: false,
        photoB64: "",
      });
    }
  }, [open]);

  const loadPlayersList = async () => {
    setLoadingPlayers(true);
    setError(null);
    try {
      const result = await getPlayersListAction();
      if (result?.error) {
        setError(result.error);
      } else if (result?.players) {
        setPlayersList(result.players);
      }
    } catch {
      setError("Failed to load players list");
    } finally {
      setLoadingPlayers(false);
    }
  };

  const handlePlayerClick = async (player: PlayerWithNameId) => {
    setLoadingPlayer(true);
    setError(null);

    try {
      const result = await loadPlayerAction(player.name_id);
      if (result?.error) {
        setError(result.error);
      } else if (result?.player) {
        const loadedPlayer = result.player;
        setSelectedPlayer(player);
        setOriginalNameId(loadedPlayer.name_id);
        setFormData({
          account_id: loadedPlayer.account_id || "",
          name: loadedPlayer.name,
          name_id: loadedPlayer.name_id,
          adc: loadedPlayer.adc,
          jungle: loadedPlayer.jungle,
          mid: loadedPlayer.mid,
          support: loadedPlayer.support,
          top: loadedPlayer.top,
          hide: loadedPlayer.hide || false,
          photoB64: loadedPlayer.photoB64 || "",
        });
      } else {
        setError("Player not found");
      }
    } catch {
      setError("Failed to load player");
    } finally {
      setLoadingPlayer(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!originalNameId) {
      setError("Please load a player first");
      return;
    }

    startTransition(async () => {
      const result = await updatePlayerAction(originalNameId, formData);
      if (result?.error) {
        setError(result.error);
      } else {
        // Reload players list and go back to list view
        await loadPlayersList();
        setSelectedPlayer(null);
        setOriginalNameId("");
        setFormData({
          account_id: "",
          name: "",
          name_id: "",
          adc: "",
          jungle: "",
          mid: "",
          support: "",
          top: "",
          hide: false,
          photoB64: "",
        });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Player</DialogTitle>
          <DialogDescription>
            {selectedPlayer
              ? `Editing ${selectedPlayer.name}`
              : "Select a player to edit"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 overflow-x-auto">
          {!selectedPlayer ? (
            /* Players List View */
            <div className="space-y-4">
              {loadingPlayers ? (
                <div className="text-center py-8">Loading players...</div>
              ) : playersList.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No players found
                </div>
              ) : (
                <div className="border rounded-lg overflow-hidden border-border">
                  <div className="max-h-[60vh] overflow-y-auto">
                    <table className="w-full">
                      <thead className="bg-muted sticky top-0">
                        <tr>
                          <th className="text-left p-3 text-sm font-medium">
                            Name ID
                          </th>
                          <th className="text-left p-3 text-sm font-medium">
                            Name
                          </th>
                          <th className="text-left p-3 text-sm font-medium">
                            Account ID
                          </th>
                          <th className="text-center p-3 text-sm font-medium">
                            Top
                          </th>
                          <th className="text-center p-3 text-sm font-medium">
                            Jungle
                          </th>
                          <th className="text-center p-3 text-sm font-medium">
                            Mid
                          </th>
                          <th className="text-center p-3 text-sm font-medium">
                            ADC
                          </th>
                          <th className="text-center p-3 text-sm font-medium">
                            Support
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {playersList.map((player) => (
                          <tr
                            key={player.name_id}
                            onClick={() => handlePlayerClick(player)}
                            className="border-t cursor-pointer hover:bg-muted/50 transition-colors border-border"
                          >
                            <td className="p-3 text-sm">{player.name_id}</td>
                            <td className="p-3 text-sm font-medium">
                              {player.name}
                            </td>
                            <td className="p-3 text-sm">
                              {player.account_id || "-"}
                            </td>
                            <td className="p-3 text-sm text-center">
                              {player.top}
                            </td>
                            <td className="p-3 text-sm text-center">
                              {player.jungle}
                            </td>
                            <td className="p-3 text-sm text-center">
                              {player.mid}
                            </td>
                            <td className="p-3 text-sm text-center">
                              {player.adc}
                            </td>
                            <td className="p-3 text-sm text-center">
                              {player.support}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              {error && (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}
            </div>
          ) : (
            /* Edit Form View */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Player Name"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name_id">Name ID</Label>
                  <Input
                    id="name_id"
                    value={formData.name_id}
                    onChange={(e) =>
                      setFormData({ ...formData, name_id: e.target.value })
                    }
                    placeholder="name_id"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account_id">Account ID</Label>
                  <Input
                    id="account_id"
                    value={formData.account_id}
                    onChange={(e) =>
                      setFormData({ ...formData, account_id: e.target.value })
                    }
                    placeholder="Account ID"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Role Rankings</Label>
                <div className="grid grid-cols-5 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor="top" className="text-xs">
                      Top
                    </Label>
                    <Input
                      id="top"
                      type="number"
                      value={formData.top}
                      onChange={(e) =>
                        setFormData({ ...formData, top: e.target.value })
                      }
                      placeholder="0"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="jungle" className="text-xs">
                      Jungle
                    </Label>
                    <Input
                      id="jungle"
                      type="number"
                      value={formData.jungle}
                      onChange={(e) =>
                        setFormData({ ...formData, jungle: e.target.value })
                      }
                      placeholder="0"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="mid" className="text-xs">
                      Mid
                    </Label>
                    <Input
                      id="mid"
                      type="number"
                      value={formData.mid}
                      onChange={(e) =>
                        setFormData({ ...formData, mid: e.target.value })
                      }
                      placeholder="0"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="adc" className="text-xs">
                      ADC
                    </Label>
                    <Input
                      id="adc"
                      type="number"
                      value={formData.adc}
                      onChange={(e) =>
                        setFormData({ ...formData, adc: e.target.value })
                      }
                      placeholder="0"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="support" className="text-xs">
                      Support
                    </Label>
                    <Input
                      id="support"
                      type="number"
                      value={formData.support}
                      onChange={(e) =>
                        setFormData({ ...formData, support: e.target.value })
                      }
                      placeholder="0"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="photoB64">Photo (Base64) - Optional</Label>
                <textarea
                  id="photoB64"
                  value={formData.photoB64}
                  onChange={(e) =>
                    setFormData({ ...formData, photoB64: e.target.value })
                  }
                  placeholder="Enter base64 encoded photo string"
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hide"
                  checked={formData.hide}
                  onChange={(e) =>
                    setFormData({ ...formData, hide: e.target.checked })
                  }
                />
                <Label htmlFor="hide" className="cursor-pointer">
                  Hide Player
                </Label>
              </div>

              {error && (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSelectedPlayer(null);
                    setError(null);
                  }}
                >
                  Back
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending || loadingPlayer}>
                  {isPending ? "Updating..." : "Update Player"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
