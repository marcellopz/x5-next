"use client";

import { SelectedPlayersSection } from "./selected-players-section";
import { StickyProgressBar } from "./sticky-progress-bar";
import { AvailablePlayersSection } from "./available-players-section";
import { NavigationSection } from "./navigation-section";
import { useTranslations } from "@/lib/i18n/locale-context";

interface PlayerSelectionStepProps {
  onNext: () => void;
}

export function PlayerSelectionStep({ onNext }: PlayerSelectionStepProps) {
  const t = useTranslations();
  return (
    <div className="space-y-6">
      {/* Description */}
      <div>
        <p className="text-muted-foreground">
          {t("matchmaking.chooseParticipants")}
        </p>
      </div>

      {/* Selected Players */}
      <SelectedPlayersSection />

      {/* Sticky Progress Bar */}
      <StickyProgressBar />

      {/* Available Players */}
      <AvailablePlayersSection />

      {/* Navigation */}
      <NavigationSection onNext={onNext} />
    </div>
  );
}
