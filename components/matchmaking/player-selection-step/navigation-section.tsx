"use client";

import { Button } from "@/components/ui/button";
import { useMatchmaking } from "../matchmaking-context";

interface NavigationSectionProps {
  onNext: () => void;
}

export function NavigationSection({ onNext }: NavigationSectionProps) {
  const { selectedPlayers } = useMatchmaking();
  const canProceed = selectedPlayers.length === 10;

  return (
    <div className="flex justify-end">
      <Button onClick={onNext} disabled={!canProceed} className="min-w-32">
        Next Step
      </Button>
    </div>
  );
}
