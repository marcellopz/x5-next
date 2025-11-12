import { generatePageMetadata } from "@/lib/metadata";

export const metadata = generatePageMetadata(
  "Stats",
  "Overall statistics, leaderboards, and analytics"
);

export default function StatsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Stats</h1>
        </div>
      </div>
    </div>
  );
}
