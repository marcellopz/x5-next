import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MiniStatCardProps {
  title: string;
  value: string | number;
  description?: string;
}

export function MiniStatCard({
  title,
  value,
  description = "description",
}: MiniStatCardProps) {
  return (
    <Card className="h-full border-primary/30 flex flex-col justify-center gap-2 hover:border-primary/50 hover:bg-secondary/90 cursor-default">
      <CardHeader style={{ padding: "12px 16px 0 16px" }}>
        <CardTitle style={{ fontSize: "16px" }}>{title}</CardTitle>
      </CardHeader>
      <CardContent
        className="flex flex-col justify-between"
        style={{ padding: "0 16px 12px 16px" }}
      >
        <div className="text-lg font-semibold text-primary whitespace-nowrap truncate">
          {value}
        </div>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

export default MiniStatCard;
