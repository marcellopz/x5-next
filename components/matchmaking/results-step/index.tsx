"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { RulesSummary } from "./rules-summary";
import { MatchDisplay } from "./match-display";
import { useMatchmaking } from "../matchmaking-context";

interface ResultsStepProps {
  onPrevious: () => void;
  onRegenerate: () => void;
  onFinish: () => void;
}

export function ResultsStep({
  onPrevious,
  onRegenerate,
  onFinish,
}: ResultsStepProps) {
  const { matchResults } = useMatchmaking();

  console.log(matchResults);

  return (
    <div className="space-y-6 mt-2">
      <RulesSummary />

      {/* Match Results */}
      {matchResults?.success && matchResults.matches.length > 0 ? (
        <MatchDisplay matches={matchResults.matches} />
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p>No matches generated yet.</p>
          <p className="text-sm mt-1">
            Click &quot;Regenerate&quot; to create matches.
          </p>
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onRegenerate}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Regenerate
          </Button>
          <Button onClick={onFinish}>Finish</Button>
        </div>
      </div>
    </div>
  );
}
