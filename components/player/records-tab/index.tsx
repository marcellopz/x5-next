"use client";

import type { PlayerRecords } from "@/lib/types";

interface PlayerRecordsTabProps {
  records?: PlayerRecords;
}

export function PlayerRecordsTab({ records }: PlayerRecordsTabProps) {
  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">Records tab content - Coming soon</p>
      {/* TODO: Implement records tab */}
    </div>
  );
}

