"use client";

import { Button } from "@/components/ui/button";
import { useMatchmaking } from "../matchmaking-context";
import { useTranslations } from "@/lib/i18n/locale-context";

interface NavigationSectionProps {
  onNext: () => void;
}

export function NavigationSection({ onNext }: NavigationSectionProps) {
  const t = useTranslations();
  const { selectedPlayers } = useMatchmaking();
  const canProceed = selectedPlayers.length === 10;

  return (
    <div className="flex justify-end">
      <Button onClick={onNext} disabled={!canProceed} className="min-w-32">
        {t("matchmaking.nextStep")}
      </Button>
    </div>
  );
}
