import { Badge } from "@/components/ui/badge";

interface RoleBadgeProps {
  role: string;
  count: number;
  totalMatches: number;
}

export function RoleBadge({ role, count, totalMatches }: RoleBadgeProps) {
  const percentage = totalMatches
    ? Math.round((count / totalMatches) * 100)
    : 0;

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-muted-foreground">{role}</span>
      <Badge
        variant="secondary"
        className="justify-center gap-1 text-center flex-col rounded-sm px-1!"
      >
        <span>{count}</span>
        <span className="text-muted-foreground">{percentage}%</span>
      </Badge>
    </div>
  );
}
