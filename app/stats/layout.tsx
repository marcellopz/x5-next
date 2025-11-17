import Link from "next/link";
import { ReactNode } from "react";

interface StatsLayoutProps {
  children: ReactNode;
}

export const statRoutes: Record<string, string> = {
  "mvp-table": "MVP Table",
  "role-player-stats": "Role Player Stats",
  "role-champion-stats": "Role Champion Stats",
  "champion-stats": "Champion Stats",
  "rank-analysis": "Rank Analysis",
  "victory-statistics": "Victory Statistics",
};

export default function StatsLayout({ children }: StatsLayoutProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">{children}</div>
    </div>
  );
}

export function StatsBreadcrumb({ currentPage }: { currentPage?: string }) {
  return (
    <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
      <Link href="/stats" className="hover:text-foreground transition-colors">
        Statistics
      </Link>
      {currentPage && (
        <>
          <span>/</span>
          <span className="text-foreground">
            {statRoutes[currentPage] || currentPage}
          </span>
        </>
      )}
    </nav>
  );
}

export function StatsPageTitle({ title }: { title: string }) {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
    </div>
  );
}
