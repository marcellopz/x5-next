"use client";

import { usePathname } from "next/navigation";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { statRoutes } from "./stat-routes";

export function StatsHeader() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  // Check if we're on a sub-route (not the main /stats page)
  const isSubRoute = segments.length > 1 && segments[0] === "stats";
  const currentRoute = isSubRoute ? segments[1] : null;

  if (!isSubRoute) {
    return null;
  }

  const routeInfo = currentRoute ? statRoutes[currentRoute] : null;

  const breadcrumbItems = [
    { label: "Statistics", href: "/stats" },
    ...(routeInfo ? [{ label: routeInfo.title }] : []),
  ];

  const pageTitle = routeInfo?.title || "Statistics";
  const pageDescription = routeInfo?.description;

  if (currentRoute === "champion-stats") {
    return <Breadcrumb items={breadcrumbItems} className="mb-4" />;
  }

  return (
    <>
      <Breadcrumb items={breadcrumbItems} className="mb-4" />
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">{pageTitle}</h1>
        {pageDescription && (
          <p className="text-sm text-muted-foreground">{pageDescription}</p>
        )}
      </div>
    </>
  );
}
