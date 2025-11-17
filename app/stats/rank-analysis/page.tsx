import { generatePageMetadata } from "@/lib/metadata";

export const metadata = generatePageMetadata(
  "Rank Analysis",
  "Detailed analysis of player rankings and rank changes"
);

export default function RankAnalysisPage() {
  return (
    <div className="mt-6">
      <div className="text-center py-12 border border-border rounded-lg">
        <p className="text-muted-foreground">
          Rank Analysis content coming soon...
        </p>
      </div>
    </div>
  );
}

