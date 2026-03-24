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
import { useTranslations } from "@/lib/i18n/locale-context";
import { useMatchmaking } from "../matchmaking-context";
import type { Player } from "@/lib/types";

interface WildcardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WildcardDialog({ open, onOpenChange }: WildcardDialogProps) {
  const t = useTranslations();
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
    const now = Date.now();
    const normalizedBaseNameId =
      formData.name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "") || "wildcard";

    // Create wildcard player with a unique account_id
    const wildcardPlayer: Player = {
      account_id: now, // Unique ID for wildcard
      name: formData.name,
      name_id: `${normalizedBaseNameId}-${now}`, // Keep unique name_id
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
          <DialogTitle>{t("admin.addWildcardPlayer")}</DialogTitle>
          <DialogDescription>{t("admin.addWildcardDescription")}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t("admin.playerName")}</Label>
              <Input
                id="name"
                placeholder={t("admin.enterPlayerName")}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="top">{t("admin.topRank")}</Label>
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
                <Label htmlFor="jungle">{t("admin.jungleRank")}</Label>
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
                <Label htmlFor="mid">{t("admin.midRank")}</Label>
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
                <Label htmlFor="adc">{t("admin.adcRank")}</Label>
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
                <Label htmlFor="support">{t("admin.supportRank")}</Label>
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
              {t("admin.cancel")}
            </Button>
            <Button type="submit" disabled={!formData.name.trim()}>
              {t("admin.createPlayer")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
