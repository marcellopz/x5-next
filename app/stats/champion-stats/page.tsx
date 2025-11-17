import { generatePageMetadata } from "@/lib/metadata";

export const metadata = generatePageMetadata(
  "Champion Stats",
  "Overall champion statistics and performance metrics"
);

export default function ChampionStatsPage() {
  return (
    <div className="mt-6">
      <div className="text-center py-12 border border-border rounded-lg">
        <p className="text-muted-foreground">
          Champion Stats content coming soon...
        </p>
      </div>
    </div>
  );
}
