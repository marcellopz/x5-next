"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Copy, Check, RotateCcw } from "lucide-react";
import type {
  MatchResult,
  MatchmakingResult,
} from "@/lib/matchmaking-algorithm";
import { useMatchmaking } from "../matchmaking-context";

interface MatchDisplayProps {
  matchResults: MatchmakingResult | null;
}

export function MatchDisplay({ matchResults }: MatchDisplayProps) {
  const [copied, setCopied] = useState(false);
  const { config } = useMatchmaking();

  // Get the source matches (filteredMatches if available, otherwise allMatches)
  const sourceMatches = useMemo(() => {
    if (!matchResults?.success) return [];
    return matchResults.filteredMatches.length > 0
      ? matchResults.filteredMatches
      : [];
  }, [matchResults]);

  // State to hold the currently displayed matches (shuffled selection)
  const [matches, setMatches] = useState<MatchResult[]>([]);

  // Initialize matches when sourceMatches or config changes
  useEffect(() => {
    if (sourceMatches.length > 0) {
      // Shuffle and select N matches
      const shuffled = [...sourceMatches].sort(() => Math.random() - 0.5);
      setMatches(shuffled.slice(0, config.matchOptions));
    } else {
      setMatches([]);
    }
  }, [sourceMatches, config.matchOptions]);

  // Regenerate/reshuffle the displayed matches
  const handleRegenerate = useCallback(() => {
    if (sourceMatches.length > 0) {
      // Shuffle and select N matches
      const shuffled = [...sourceMatches].sort(() => Math.random() - 0.5);
      setMatches(shuffled.slice(0, config.matchOptions));
    }
  }, [sourceMatches, config.matchOptions]);

  // Memoize the formatted match text since it's expensive to compute
  const matchText = useMemo(() => {
    const roleOrder = ["Top", "Jungle", "Mid", "Adc", "Support"];
    const roleLabels = ["Top:", "Jng:", "Mid:", "Adc:", "Sup:"];
    const biggestNameLength = Math.max(
      ...matches.map((match) =>
        Math.max(
          ...Object.values(match.pairingsRoles).flatMap((role) =>
            role.map((player) => player.name.length)
          )
        )
      )
    );

    return matches
      .map((match, index) => {
        const roleLines = roleOrder.map((role, roleIndex) => {
          const [player1, player2] = match.pairingsRoles[role];
          return `${roleLabels[roleIndex].padEnd(5)} ${player1.name.padStart(
            biggestNameLength + 1
          )} (${player1.rank}) x (${player2.rank}) ${player2.name}`;
        });

        const totalScore = match.matchScore.blue + match.matchScore.red;
        const scoreLine = `Score: ${match.matchScore.blue} x ${match.matchScore.red} -> ${totalScore}`;

        return `Match ${index + 1}:\n${roleLines.join("\n")}\n${scoreLine}`;
      })
      .join("\n\n");
  }, [matches]);

  // Memoize the copy function to avoid recreating it on every render
  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(matchText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  }, [matchText]);

  // Memoize textarea height calculation
  const textareaHeight = useMemo(
    () => Math.max(200, matchText.split("\n").length * 20 + 20),
    [matchText]
  );

  return (
    <div className="flex flex-col items-center space-y-3 w-full max-w-[370px] mx-auto">
      <div className="flex items-center justify-between w-full">
        <h3 className="text-base font-semibold">Match Results</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRegenerate}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Rebola
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
            className="flex items-center gap-2"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy
              </>
            )}
          </Button>
        </div>
      </div>

      <Card className="p-3 w-full">
        {matches.length > 0 ? (
          <textarea
            value={matchText}
            readOnly
            className="w-full font-mono text-sm bg-muted/50 border-0"
            style={{
              fontFamily: "monospace",
              height: `${textareaHeight}px`,
            }}
          />
        ) : (
          <div className="text-sm text-muted-foreground italic">
            No matches found
          </div>
        )}
      </Card>
    </div>
  );
}
