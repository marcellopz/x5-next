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
    <Card className="h-full max-h-[120px] border-primary/30 flex flex-col justify-center gap-2 hover:border-primary/50 hover:bg-secondary/90 cursor-default">
      <CardHeader style={{ padding: "10px 14px 0 14px" }}>
        <CardTitle style={{ fontSize: "16px" }}>{title}</CardTitle>
      </CardHeader>
      <CardContent
        className="flex flex-col justify-between"
        style={{ padding: "0 14px 10px 14px" }}
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
