"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { RulesSummary } from "./rules-summary";

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
  return (
    <div className="space-y-6 mt-2">
      <RulesSummary />

      {/* Results content will go here */}

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
