import { Breadcrumb } from "@/components/ui/breadcrumb";
import { statRoutes } from "./stat-routes";
import { t, getTranslations } from "@/lib/i18n";

interface StatsBreadcrumbProps {
  currentPage?: string;
  locale?: "en" | "pt";
}

export function StatsBreadcrumb({ currentPage, locale = "en" }: StatsBreadcrumbProps) {
  const trans = getTranslations(locale);
  const routeInfo = currentPage ? statRoutes[currentPage] : null;
  const items = [
    { label: t(trans, "stats.title"), href: "/stats" },
    ...(routeInfo
      ? [{ label: t(trans, routeInfo.titleKey) }]
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
