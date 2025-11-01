"use client";

import { useState } from "react";
import { FormStepper } from "./form-stepper";
import { PlayerSelectionStep } from "./player-selection-step";
import { AlgoConfigStep } from "./algo-config-step";
import { ResultsStep } from "./results-step";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MatchmakingProvider, useMatchmaking } from "./matchmaking-context";
import type { Player } from "@/lib/types";
import { Button } from "../ui/button";
import { RefreshCcwIcon } from "lucide-react";
import { getPlayerList } from "@/lib/endpoints";

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

const buttonText = (isRefreshing: number) => {
  switch (isRefreshing) {
    case 0:
      return "Refresh Players";
    case 1:
      return "Refreshing...";
    case 2:
      return "Refreshed";
    default:
      return "Refresh Players";
  }
};

function FormContent() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(0); // 0: not refreshing, 1: refreshing, 2: error, 3: refreshed
  const { setPlayers } = useMatchmaking();

  const handleRefresh = () => {
    setIsRefreshing(1);
    getPlayerList()
      .then((newPlayers) => {
        if (newPlayers) {
          setPlayers(Object.values(newPlayers));
          setIsRefreshing(3);
        } else {
          setIsRefreshing(2); // Error
        }
      })
      .catch(() => {
        setIsRefreshing(2); // Error
      })
      .finally(() => {
        setTimeout(() => {
          setIsRefreshing(0);
        }, 1000);
      });
  };

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

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <FormStepper currentStep={currentStep} steps={steps} />

      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center justify-between">
              <h3>{steps[currentStep - 1].title}</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing === 1}
              >
                <RefreshCcwIcon className="h-4 w-4" />
                {buttonText(isRefreshing)}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="py-8">
          {currentStep === 1 && <PlayerSelectionStep onNext={handleNext} />}

          {currentStep === 2 && (
            <AlgoConfigStep onPrevious={handlePrevious} onNext={handleNext} />
          )}

          {currentStep === 3 && <ResultsStep onPrevious={handlePrevious} />}
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
