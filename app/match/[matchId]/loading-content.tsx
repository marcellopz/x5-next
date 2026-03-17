"use client";

import { useTranslations } from "@/lib/i18n/locale-context";

export function MatchLoadingContent() {
  const t = useTranslations();
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">{t("loading.loadingMatch")}</p>
      </div>
    </div>
  );
}
