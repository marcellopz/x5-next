"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { NumberStepper } from "@/components/ui/number-stepper";
import { useTranslations } from "@/lib/i18n/locale-context";

interface BasicConfigSectionProps {
  matchOptions: number;
  tolerance: number;
  onMatchOptionsChange: (value: number) => void;
  onToleranceChange: (value: number) => void;
}

export function BasicConfigSection({
  matchOptions,
  tolerance,
  onMatchOptionsChange,
  onToleranceChange,
}: BasicConfigSectionProps) {
  const t = useTranslations();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("matchmaking.basicConfigTitle")}</CardTitle>
        <CardDescription>{t("matchmaking.basicConfigDescription")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <div className="space-y-2">
            <Label>{t("matchmaking.matchOptions")}</Label>
            <NumberStepper
              value={matchOptions}
              onChange={onMatchOptionsChange}
              min={1}
              max={10}
            />
            <p className="text-xs text-muted-foreground">
              {t("matchmaking.matchOptionsHelp")}
            </p>
          </div>

          <div className="space-y-2">
            <Label>{t("matchmaking.tolerance")}</Label>
            <NumberStepper
              value={tolerance}
              onChange={onToleranceChange}
              min={0}
              max={10}
            />
            <p className="text-xs text-muted-foreground">
              {t("matchmaking.toleranceHelp")}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
