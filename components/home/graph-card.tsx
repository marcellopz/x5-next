import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface GraphCardProps {
  title: string;
  description?: string;
}

export function GraphCard({ title, description }: GraphCardProps) {
  return (
    <Card className="h-64">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-4xl mb-2">📊</div>
          <p className="text-sm">Graph placeholder</p>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
