"use client";

import { getTimeElapsed } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface TimeSinceLastMatchProps {
  mostRecentGameTimestamp: number | undefined;
  description: string;
}

export function TimeSinceLastMatch({
  mostRecentGameTimestamp,
  description,
}: TimeSinceLastMatchProps) {
  const timeSinceLastMatch = mostRecentGameTimestamp
    ? getTimeElapsed(mostRecentGameTimestamp)
    : "Unknown";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Time since last match</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-primary mb-1">
          {timeSinceLastMatch}
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
