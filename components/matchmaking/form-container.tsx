"use client";

import { useState } from "react";
import { FormStepper } from "./form-stepper";
import { PlayerSelectionStep } from "./player-selection-step";
import { AlgoConfigStep } from "./algo-config-step";
import { ResultsStep } from "./results-step";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MatchmakingProvider, useMatchmaking } from "./matchmaking-context";
import { generateMatches } from "@/lib/matchmaking-algorithm";
import type { Player } from "@/lib/types";

interface FormContainerProps {
  players: Player[];
}

const steps = [
  {
    title: "Player Selection",
    description: "Choose participants",
  },
  {
    title: "Matchmaking Rules",
    description: "Configure matchmaking rules",
  },
  {
    title: "Results",
    description: "View generated teams",
  },
];

function FormContent() {
  const [currentStep, setCurrentStep] = useState(1);
  const { selectedPlayers, config, setMatchResults } = useMatchmaking();

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleRegenerate = () => {
    if (selectedPlayers.length === 10) {
      const results = generateMatches(selectedPlayers, config);
      setMatchResults(results);
    } else {
      console.error("Need exactly 10 players to generate matches");
    }
  };

  const handleFinish = () => {
    // TODO: Implement finish logic (save to database, etc.)
    console.log("Finishing matchmaking...");
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <FormStepper currentStep={currentStep} steps={steps} />

      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].title}</CardTitle>
        </CardHeader>
        <CardContent className="py-8">
          {currentStep === 1 && <PlayerSelectionStep onNext={handleNext} />}

          {currentStep === 2 && (
            <AlgoConfigStep onPrevious={handlePrevious} onNext={handleNext} />
          )}

          {currentStep === 3 && (
            <ResultsStep
              onPrevious={handlePrevious}
              onRegenerate={handleRegenerate}
              onFinish={handleFinish}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function FormContainer({ players }: FormContainerProps) {
  return (
    <MatchmakingProvider players={players}>
      <FormContent />
    </MatchmakingProvider>
  );
}

export default FormContainer;
