import { CollapsibleSection } from "@/components/ui/collapsible-section";
import { GraphCard } from "./graph-card";
import { activityGraphs } from "./graph-data";

export function ActivitySection() {
  return (
    <CollapsibleSection title="Activity Analytics">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
        {activityGraphs.map((graph, index) => (
          <GraphCard
            key={index}
            title={graph.title}
            description={graph.description}
          />
        ))}
      </div>
    </CollapsibleSection>
  );
}
