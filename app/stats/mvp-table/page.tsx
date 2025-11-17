import { generatePageMetadata } from "@/lib/metadata";
import { StatsBreadcrumb, StatsPageTitle } from "../layout";
import { notFound } from "next/navigation";

export const metadata = generatePageMetadata(
  "MVP Table",
  "Most valuable players based on performance metrics"
);

export default function MVPTablePage() {
  return (
    <>
      <StatsBreadcrumb currentPage="mvp-table" />
      <StatsPageTitle title="MVP Table" />

      <div className="mt-6">
        <p className="text-muted-foreground mb-4">
          Most valuable players based on performance metrics
        </p>
        <div className="text-center py-12 border border-border rounded-lg">
          <p className="text-muted-foreground">
            MVP Table content coming soon...
          </p>
        </div>
      </div>
    </>
  );
}
