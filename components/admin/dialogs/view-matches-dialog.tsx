"use client";

import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ViewMatchesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewMatchesDialog({
  open,
  onOpenChange,
}: ViewMatchesDialogProps) {
  const [matchId, setMatchId] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [matches, setMatches] = useState<unknown[]>([]);

  const handleSearch = async () => {
    setError(null);
    setMatches([]);

    startTransition(async () => {
      try {
        // TODO: Implement searchMatchesAction
        // const result = await searchMatchesAction(matchId);
        // if (result?.error) {
        //   setError(result.error);
        // } else {
        //   setMatches(result.matches || []);
        // }
        console.log("Search matches:", matchId);
        // Placeholder
        setMatches([]);
      } catch (err) {
        setError("Failed to search matches");
        console.error(err);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>View Matches</DialogTitle>
          <DialogDescription>Search and view match data</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-md bg-muted/50 border border-border p-4">
            <div className="flex items-start gap-3">
              <div className="shrink-0">
                <svg
                  className="h-5 w-5 text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-foreground mb-1">
                  Feature Coming Soon
                </h4>
                <p className="text-sm text-muted-foreground">
                  Match viewing and editing functionality is not yet
                  implemented. This feature will be available in a future
                  update.
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="match-id">Match ID</Label>
            <div className="flex gap-2">
              <Input
                id="match-id"
                value={matchId}
                onChange={(e) => setMatchId(e.target.value)}
                placeholder="Enter match ID (e.g., match123)"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSearch();
                  }
                }}
              />
              <Button type="button" onClick={handleSearch} disabled={isPending}>
                {isPending ? "Searching..." : "Search"}
              </Button>
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {matches.length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Found {matches.length} match(es)
              </p>
              {/* TODO: Display matches in a table or list */}
              <div className="rounded-md border border-border p-4">
                <p className="text-sm text-muted-foreground">
                  Match list will be displayed here
                </p>
              </div>
            </div>
          ) : (
            !isPending &&
            matchId && (
              <div className="rounded-md border border-border p-4 text-center">
                <p className="text-sm text-muted-foreground">
                  No matches found
                </p>
              </div>
            )
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
