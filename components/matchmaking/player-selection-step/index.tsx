"use client";

import { SelectedPlayersSection } from "./selected-players-section";
import { StickyProgressBar } from "./sticky-progress-bar";
import { AvailablePlayersSection } from "./available-players-section";
import { NavigationSection } from "./navigation-section";

interface PlayerSelectionStepProps {
  onNext: () => void;
}

export function PlayerSelectionStep({ onNext }: PlayerSelectionStepProps) {
  return (
    <div className="space-y-6">
      {/* Description */}
      <div>
        <p className="text-muted-foreground">
          Choose the players who will participate in this match
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
