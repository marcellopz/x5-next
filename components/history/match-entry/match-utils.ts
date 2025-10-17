import { ReducedParticipant } from "@/lib/types";

export function formatMatchDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export function formatMatchDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function sortParticipantsByRole(
  participants: ReducedParticipant[]
): ReducedParticipant[] {
  return participants.sort((a, b) => {
    const roleOrder = ["top", "jungle", "mid", "adc", "support"];
    return roleOrder.indexOf(a.role) - roleOrder.indexOf(b.role);
  });
}
