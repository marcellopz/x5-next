"use client";

import { useState, useMemo, useEffect, useLayoutEffect, useRef } from "react";
import { FormStepper } from "./form-stepper";
import { PlayerSelectionStep } from "./player-selection-step";
import { AlgoConfigStep } from "./algo-config-step";
import { ResultsStep } from "./results-step";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MatchmakingProvider, useMatchmaking } from "./matchmaking-context";
import type { Player } from "@/lib/types";
import { Button } from "../ui/button";
import { ChevronLeft } from "lucide-react";
import { useTranslations } from "@/lib/i18n/locale-context";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  decodeMatchmakingStateFromQuery,
  encodeMatchmakingStateToQuery,
  MATCHMAKING_QUERY_KEYS,
} from "./url-state";

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
  const [currentStep, setCurrentStep] = useState(1);
  const {
    players,
    selectedPlayerIds,
    config,
    hydrateMatchmakingState,
  } = useMatchmaking();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasHydratedFromUrlRef = useRef(false);
  const initialQueryStringRef = useRef(searchParams.toString());

  useLayoutEffect(() => {
    if (hasHydratedFromUrlRef.current) {
      return;
    }
    const query = new URLSearchParams(initialQueryStringRef.current);
    const decoded = decodeMatchmakingStateFromQuery(query, players);
    hydrateMatchmakingState({
      wildcardPlayers: decoded.wildcardPlayers,
      selectedPlayerIds: decoded.selectedPlayerIds,
      config: decoded.config,
    });
    setCurrentStep(decoded.step);
    hasHydratedFromUrlRef.current = true;
  }, [hydrateMatchmakingState, players]);

  useEffect(() => {
    if (!hasHydratedFromUrlRef.current) {
      return;
    }

    const mergedParams = new URLSearchParams(searchParams.toString());
    MATCHMAKING_QUERY_KEYS.forEach((key) => mergedParams.delete(key));

    const encodedMatchmakingState = encodeMatchmakingStateToQuery({
      step: currentStep,
      selectedPlayerIds,
      players,
      config,
    });
    encodedMatchmakingState.forEach((value, key) => {
      mergedParams.set(key, value);
    });

    const nextQueryString = mergedParams.toString();
    const currentQueryString = searchParams.toString();
    if (nextQueryString === currentQueryString) {
      return;
    }

    const nextUrl = nextQueryString ? `${pathname}?${nextQueryString}` : pathname;
    router.replace(nextUrl, { scroll: false });
  }, [config, currentStep, pathname, players, router, searchParams, selectedPlayerIds]);

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
