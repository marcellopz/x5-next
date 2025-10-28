"use client";

import { useState } from "react";
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
import { useMatchmaking } from "../matchmaking-context";
import type { Player } from "@/lib/types";

interface WildcardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WildcardDialog({ open, onOpenChange }: WildcardDialogProps) {
  const { addPlayer } = useMatchmaking();
  const [formData, setFormData] = useState({
    name: "",
    top: "1",
    jungle: "1",
    mid: "1",
    adc: "1",
    support: "1",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Create wildcard player with a unique account_id
    const wildcardPlayer: Player = {
      account_id: Date.now(), // Unique ID for wildcard
      name: formData.name,
      name_id: formData.name.toLowerCase().replace(/\s+/g, ""), // Generate name_id
      top: parseInt(formData.top) || 0,
      jungle: parseInt(formData.jungle) || 0,
      mid: parseInt(formData.mid) || 0,
      adc: parseInt(formData.adc) || 0,
      support: parseInt(formData.support) || 0,
      hide: false,
      isWildcard: true,
    };

    addPlayer(wildcardPlayer);

    // Reset form
    setFormData({
      name: "",
      top: "1",
      jungle: "1",
      mid: "1",
      adc: "1",
      support: "1",
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Wildcard Player</DialogTitle>
          <DialogDescription>
            Create a new player entry with custom name and ranks
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Player Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Player Name</Label>
              <Input
                id="name"
                placeholder="Enter player name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="top">Top Rank</Label>
                <Input
                  id="top"
                  type="number"
                  placeholder="0"
                  min="0"
                  value={formData.top}
                  onChange={(e) =>
                    setFormData({ ...formData, top: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="jungle">Jungle Rank</Label>
                <Input
                  id="jungle"
                  type="number"
                  placeholder="0"
                  min="0"
                  value={formData.jungle}
                  onChange={(e) =>
                    setFormData({ ...formData, jungle: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mid">Mid Rank</Label>
                <Input
                  id="mid"
                  type="number"
                  placeholder="0"
                  min="0"
                  value={formData.mid}
                  onChange={(e) =>
                    setFormData({ ...formData, mid: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="adc">ADC Rank</Label>
                <Input
                  id="adc"
                  type="number"
                  placeholder="0"
                  min="0"
                  value={formData.adc}
                  onChange={(e) =>
                    setFormData({ ...formData, adc: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="support">Support Rank</Label>
                <Input
                  id="support"
                  type="number"
                  placeholder="0"
                  min="0"
                  value={formData.support}
                  onChange={(e) =>
                    setFormData({ ...formData, support: e.target.value })
                  }
                  required
                />
              </div>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!formData.name.trim()}>
              Create Player
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
