"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "@/lib/i18n/locale-context";
import { logoutAction } from "./actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AddPlayerDialog } from "@/components/admin/dialogs/add-player-dialog";
import { EditPlayerDialog } from "@/components/admin/dialogs/edit-player-dialog";
import { BatchRoleEditDialog } from "@/components/admin/dialogs/batch-role-edit-dialog";
import { ViewMatchesDialog } from "@/components/admin/dialogs/view-matches-dialog";

export default function AdminDashboard() {
  const t = useTranslations();
  const [addPlayerOpen, setAddPlayerOpen] = useState(false);
  const [editPlayerOpen, setEditPlayerOpen] = useState(false);
  const [batchRoleEditOpen, setBatchRoleEditOpen] = useState(false);
  const [viewMatchesOpen, setViewMatchesOpen] = useState(false);
  const [isRevalidating, startRevalidation] = useTransition();
  const [revalidateMessage, setRevalidateMessage] = useState<string | null>(
    null
  );

  const handleRevalidate = () => {
    setRevalidateMessage(null);
    startRevalidation(async () => {
      try {
        const response = await fetch("/api/revalidate", {
          method: "POST",
        });

        const data = await response.json();

        if (!response.ok) {
          setRevalidateMessage(
            t("admin.errorPrefix") + (data.error || t("admin.failedToRevalidate"))
          );
        } else {
          setRevalidateMessage(t("admin.revalidatedSuccess"));
          setTimeout(() => setRevalidateMessage(null), 3000);
        }
      } catch (error) {
        setRevalidateMessage(
          t("admin.errorPrefix") +
            (error instanceof Error ? error.message : t("admin.failedToRevalidate"))
        );
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">{t("admin.dashboard")}</h1>
        <form action={logoutAction}>
          <Button type="submit" variant="destructive">
            {t("admin.logout")}
          </Button>
        </form>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("admin.players")}</CardTitle>
            <CardDescription>{t("admin.managePlayers")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              onClick={() => setAddPlayerOpen(true)}
              className="w-full"
              variant="default"
            >
              {t("admin.addPlayer")}
            </Button>
            <Button
              onClick={() => setEditPlayerOpen(true)}
              className="w-full"
              variant="outline"
            >
              {t("admin.editPlayer")}
            </Button>
            <Button
              onClick={() => setBatchRoleEditOpen(true)}
              className="w-full"
              variant="outline"
            >
              {t("admin.batchRoleEdit")}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("admin.matches")}</CardTitle>
            <CardDescription>{t("admin.viewManageMatches")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => setViewMatchesOpen(true)}
              className="w-full"
              variant="default"
            >
              {t("admin.viewMatches")}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("admin.cacheManagement")}</CardTitle>
            <CardDescription>{t("admin.revalidateDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              onClick={handleRevalidate}
              className="w-full"
              variant="outline"
              disabled={isRevalidating}
            >
              {isRevalidating ? t("admin.revalidating") : t("admin.revalidateAllPaths")}
            </Button>
            {revalidateMessage && (
              <div
                className={`rounded-md p-3 text-sm ${
                  revalidateMessage.startsWith(t("admin.errorPrefix"))
                    ? "bg-destructive/10 text-destructive"
                    : "bg-emerald-500/10 text-emerald-400"
                }`}
              >
                {revalidateMessage}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      <AddPlayerDialog open={addPlayerOpen} onOpenChange={setAddPlayerOpen} />
      <EditPlayerDialog
        open={editPlayerOpen}
        onOpenChange={setEditPlayerOpen}
      />
      <BatchRoleEditDialog
        open={batchRoleEditOpen}
        onOpenChange={setBatchRoleEditOpen}
      />
      <ViewMatchesDialog
        open={viewMatchesOpen}
        onOpenChange={setViewMatchesOpen}
      />
    </div>
  );
}
