"use client";

interface MatchDetailsProps {
  date: Date;
  gameDuration: number;
  gameId: string;
}

function formatGameDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

function timeSince(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}m ago`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}h ago`;
  }
  const days = Math.floor(diffInSeconds / 86400);
  return `${days}d ago`;
}

export function MatchDetails({
  date,
  gameDuration,
  gameId,
}: MatchDetailsProps) {
  return (
    <div className="bg-background/30 border border-border rounded-lg p-4 mb-4">
      <div className="flex flex-col gap-2 text-sm text-muted-foreground">
        <p>
          Match played{" "}
          {date.toLocaleDateString(undefined, {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            hour12: false,
          })}{" "}
          ({timeSince(date)})
        </p>
        <p>Game Duration: {formatGameDuration(gameDuration)}</p>
        <p>Match ID: {gameId}</p>
      </div>
    </div>
  );
}
