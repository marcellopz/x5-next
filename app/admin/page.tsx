"use client";

import { useState } from "react";
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
