import { CollapsibleSection } from "@/components/ui/collapsible-section";
import { GraphCard } from "./graph-card";

export function AnalyticsSection() {
  return (
    <CollapsibleSection title="Activity Analytics">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
        <GraphCard
          title="Games played per month"
          description="Games played per month"
        />
        <GraphCard
          title="Games played by hour of the day"
          description="Games played by hour of the day"
        />
        <GraphCard
          title="Games played by day of the week"
          description="Games played by day of the week"
        />
        <GraphCard
          title="Game duration distribution"
          description="Game duration distribution"
        />
      </div>
    </CollapsibleSection>
  );
}
