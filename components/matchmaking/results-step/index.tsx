"use client";

import { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { RulesSummary } from "./rules-summary";
import { MatchDisplay } from "./match-display";
import { useMatchmaking } from "../matchmaking-context";
import { generateMatches } from "@/lib/matchmaking-algorithm";
import { useTranslations } from "@/lib/i18n/locale-context";

interface ResultsStepProps {
  onPrevious: () => void;
}

export function ResultsStep({ onPrevious }: ResultsStepProps) {
  const t = useTranslations();
  const {
    matchResults,
    config,
    selectedPlayers,
    setMatchResults,
    players: allPlayers,
    refreshIndex,
  } = useMatchmaking();

  // Auto-generate matches when entering this step or when relevant data changes
  // Memoize hash calculations for dependency tracking
  const selectedPlayersIds = useMemo(
    () => JSON.stringify(selectedPlayers.map((p) => p.account_id)),
    [selectedPlayers]
  );
  const presetLanesHash = useMemo(
    () => JSON.stringify(config.presetLanes),
    [config.presetLanes]
  );
  const avoidRolesHash = useMemo(
    () => JSON.stringify(config.avoidRoles),
    [config.avoidRoles]
  );
  const playerCombosHash = useMemo(
    () => JSON.stringify(config.playerCombos),
    [config.playerCombos]
  );

  useEffect(() => {
    if (selectedPlayers.length === 10) {
      const results = generateMatches(selectedPlayers, config, allPlayers);
      setMatchResults(results);
    } else {
      // Clear results if we don't have 10 players
      setMatchResults(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedPlayersIds,
    config.matchOptions,
    config.tolerance,
    presetLanesHash,
    avoidRolesHash,
    playerCombosHash,
    setMatchResults,
    refreshIndex,
  ]);

  return (
    <div className="space-y-6 mt-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RulesSummary />

        {/* Match Results */}
        {matchResults?.success ? (
          <MatchDisplay matchResults={matchResults} />
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            {matchResults?.error ? (
              <>
                <p>{t("matchmaking.failedToGenerate")}</p>
                <p className="text-sm mt-1">{matchResults.error}</p>
              </>
            ) : (
              <>
                <p>{t("matchmaking.generatingMatches")}</p>
                <p className="text-sm mt-1">
                  {selectedPlayers.length !== 10
                    ? t("matchmaking.needExactly10").replace("{{count}}", String(selectedPlayers.length))
                    : t("matchmaking.processingCombinations")}
                </p>
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-start">
        <Button variant="outline" onClick={onPrevious}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("matchmaking.previous")}
        </Button>
      </div>
    </div>
  );
}
