import { generatePageMetadata } from "@/lib/metadata";

export const metadata = generatePageMetadata(
  "Role Champion Stats",
  "Champion performance statistics broken down by role"
);

export default function RoleChampionStatsPage() {
  return (
    <div className="mt-6">
      <div className="text-center py-12 border border-border rounded-lg">
        <p className="text-muted-foreground">
          Role Champion Stats content coming soon...
        </p>
      </div>
    </div>
  );
}
