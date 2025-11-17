import { generatePageMetadata } from "@/lib/metadata";

export const metadata = generatePageMetadata(
  "Victory Statistics",
  "Win rates, victory patterns, and match outcome analytics"
);

export default function VictoryStatisticsPage() {
  return (
    <div className="mt-6">
      <div className="text-center py-12 border border-border rounded-lg">
        <p className="text-muted-foreground">
          Victory Statistics content coming soon...
        </p>
      </div>
    </div>
  );
}
