"use client";

import { getTimeElapsed } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useLocale, useTranslations } from "@/lib/i18n/locale-context";

interface TimeSinceLastMatchProps {
  mostRecentGameTimestamp: number | undefined;
  description: string;
}

export function TimeSinceLastMatch({
  mostRecentGameTimestamp,
  description,
}: TimeSinceLastMatchProps) {
  const { locale } = useLocale();
  const t = useTranslations();
  const timeSinceLastMatch = mostRecentGameTimestamp
    ? getTimeElapsed(mostRecentGameTimestamp, locale)
    : t("common.unknown");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t("common.timeSinceLastMatch")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-primary mb-1">
          {timeSinceLastMatch}
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
