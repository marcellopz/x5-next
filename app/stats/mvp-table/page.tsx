import { generatePageMetadata } from "@/lib/metadata";

export const metadata = generatePageMetadata(
  "MVP Table",
  "Most valuable players based on performance metrics"
);

export default function MVPTablePage() {
  return (
    <div className="mt-6">
      <div className="text-center py-12 border border-border rounded-lg">
        <p className="text-muted-foreground">
          MVP Table content coming soon...
        </p>
      </div>
    </div>
  );
}
