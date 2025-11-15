"use client";

import { useState, useTransition } from "react";
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
            `Error: ${data.error || "Failed to revalidate"}`
          );
        } else {
          setRevalidateMessage("All routes revalidated successfully!");
          // Clear message after 3 seconds
          setTimeout(() => setRevalidateMessage(null), 3000);
        }
      } catch (error) {
        setRevalidateMessage(
          `Error: ${
            error instanceof Error ? error.message : "Failed to revalidate"
          }`
        );
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <form action={logoutAction}>
          <Button type="submit" variant="destructive">
            Logout
          </Button>
        </form>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Players Section */}
        <Card>
          <CardHeader>
            <CardTitle>Players</CardTitle>
            <CardDescription>
              Manage player data and information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              onClick={() => setAddPlayerOpen(true)}
              className="w-full"
              variant="default"
            >
              Add Player
            </Button>
            <Button
              onClick={() => setEditPlayerOpen(true)}
              className="w-full"
              variant="outline"
            >
              Edit Player
            </Button>
            <Button
              onClick={() => setBatchRoleEditOpen(true)}
              className="w-full"
              variant="outline"
            >
              Batch Role Edit
            </Button>
          </CardContent>
        </Card>

        {/* Matches Section */}
        <Card>
          <CardHeader>
            <CardTitle>Matches</CardTitle>
            <CardDescription>View and manage match data</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => setViewMatchesOpen(true)}
              className="w-full"
              variant="default"
            >
              View Matches
            </Button>
          </CardContent>
        </Card>

        {/* Cache Management Section */}
        <Card>
          <CardHeader>
            <CardTitle>Cache Management</CardTitle>
            <CardDescription>
              Revalidate all routes to refresh cached data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              onClick={handleRevalidate}
              className="w-full"
              variant="outline"
              disabled={isRevalidating}
            >
              {isRevalidating ? "Revalidating..." : "Revalidate All Paths"}
            </Button>
            {revalidateMessage && (
              <div
                className={`rounded-md p-3 text-sm ${
                  revalidateMessage.startsWith("Error")
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
