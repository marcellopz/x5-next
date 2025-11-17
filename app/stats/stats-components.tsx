import { Breadcrumb } from "@/components/ui/breadcrumb";
import { statRoutes } from "./stat-routes";

interface StatsBreadcrumbProps {
  currentPage?: string;
}

export function StatsBreadcrumb({ currentPage }: StatsBreadcrumbProps) {
  const routeInfo = currentPage ? statRoutes[currentPage] : null;
  const items = [
    { label: "Statistics", href: "/stats" },
    ...(routeInfo
      ? [{ label: routeInfo.title }]
      : currentPage
      ? [{ label: currentPage }]
      : []),
  ];

  return <Breadcrumb items={items} className="mb-4" />;
}

interface StatsPageTitleProps {
  title: string;
}

export function StatsPageTitle({ title }: StatsPageTitleProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
    </div>
  );
}
