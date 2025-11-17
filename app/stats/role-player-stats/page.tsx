import { generatePageMetadata } from "@/lib/metadata";

export const metadata = generatePageMetadata(
  "Role Player Stats",
  "Statistics for players by their roles"
);

export default function RolePlayerStatsPage() {
  return (
    <div className="mt-6">
      <div className="text-center py-12 border border-border rounded-lg">
        <p className="text-muted-foreground">
          Role Player Stats content coming soon...
        </p>
      </div>
    </div>
  );
}
