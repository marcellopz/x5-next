"use client";

import { usePathname } from "next/navigation";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { statRoutes } from "./stat-routes";
import { useTranslations } from "@/lib/i18n/locale-context";

export function StatsHeader() {
  const pathname = usePathname();
  const t = useTranslations();
  const segments = pathname.split("/").filter(Boolean);

  const isSubRoute = segments.length > 1 && segments[0] === "stats";
  const currentRoute = isSubRoute ? segments[1] : null;

  if (!isSubRoute) {
    return null;
  }

  const routeInfo = currentRoute ? statRoutes[currentRoute] : null;

  const breadcrumbItems = [
    { label: t("stats.title"), href: "/stats" },
    ...(routeInfo ? [{ label: t(routeInfo.titleKey) }] : []),
  ];

  const pageTitle = routeInfo ? t(routeInfo.titleKey) : t("stats.title");
  const pageDescription = routeInfo ? t(routeInfo.descriptionKey) : undefined;

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
