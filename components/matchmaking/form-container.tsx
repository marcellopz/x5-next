"use client";

import { useState, useMemo } from "react";
import { FormStepper } from "./form-stepper";
import { PlayerSelectionStep } from "./player-selection-step";
import { AlgoConfigStep } from "./algo-config-step";
import { ResultsStep } from "./results-step";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MatchmakingProvider, useMatchmaking } from "./matchmaking-context";
import type { Player } from "@/lib/types";
import { Button } from "../ui/button";
import { RefreshCcwIcon, ChevronLeft } from "lucide-react";
import { getPlayerList } from "@/lib/endpoints";
import { useTranslations } from "@/lib/i18n/locale-context";

interface FormContainerProps {
  players: Player[];
}

function FormContent() {
  const t = useTranslations();
  const steps = useMemo(
    () => [
      { title: t("matchmaking.playerSelection"), description: t("matchmaking.playerSelectionDescription") },
      { title: t("matchmaking.matchmakingRules"), description: t("matchmaking.matchmakingRulesDescription") },
      { title: t("matchmaking.results"), description: t("matchmaking.resultsDescription") },
    ],
    [t]
  );
  const buttonText = (isRefreshing: number) => {
    switch (isRefreshing) {
      case 0:
        return t("matchmaking.refreshPlayers");
      case 1:
        return t("matchmaking.refreshing");
      case 2:
        return t("matchmaking.refreshed");
      default:
        return t("matchmaking.refreshPlayers");
    }
  };
  const [currentStep, setCurrentStep] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(0); // 0: not refreshing, 1: refreshing, 2: error, 3: refreshed
  const { setPlayers, setRefreshIndex } = useMatchmaking();

  const handleRefresh = () => {
    setRefreshIndex((prev: number) => prev + 1);
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
              <div className="flex items-center gap-2">
                {currentStep > 1 && (
                  <Button variant="ghost" size="icon" onClick={handlePrevious}>
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                )}
                <h3>{steps[currentStep - 1].title}</h3>
              </div>
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
