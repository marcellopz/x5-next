import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  linkTo?: string;
}

export function StatsCard({
  title,
  value,
  description,
  linkTo,
}: StatsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="relative text-lg overflow-visible">
          {title}
          {linkTo && (
            <Link
              href={linkTo}
              className="absolute -right-3 -top-2 p-2 hover:bg-muted rounded-full"
            >
              <ChevronRight className="w-5 h-5" />
            </Link>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-primary mb-1">{value}</div>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
