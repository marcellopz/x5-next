import { ReactNode } from "react";
import { StatsHeader } from "./stats-header";

interface StatsLayoutProps {
  children: ReactNode;
}

export default function StatsLayout({ children }: StatsLayoutProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <StatsHeader />
        {children}
      </div>
    </div>
  );
}
