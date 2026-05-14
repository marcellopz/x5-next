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
import { useTranslations } from "@/lib/i18n/locale-context";

interface MatchDisplayProps {
  matchResults: MatchmakingResult | null;
}

/**
 * Pick N matches to display from the source set.
 *
 * When `varietyEnabled` is true, runs a greedy selection that minimizes how
 * often each player ends up in the same role across the displayed set, while
 * preserving randomness via the initial shuffle (so re-rolls produce different
 * options). When disabled, returns a plain random shuffle of N matches.
 */
function pickDisplayedMatches(
  source: MatchResult[],
  n: number,
  varietyEnabled: boolean
): MatchResult[] {
  if (source.length === 0 || n <= 0) return [];

  const shuffled = [...source].sort(() => Math.random() - 0.5);
  if (!varietyEnabled || shuffled.length <= n) {
    return shuffled.slice(0, n);
  }

  // roleCount[accountId][roleIndex] -> number of times this player has been
  // assigned to that role across already-picked matches.
  const roleCount = new Map<number | string, number[]>();

  function costOf(match: MatchResult): number {
    let s = 0;
    for (let i = 0; i < match.pairings.length; i++) {
      const roleIdx = i % 5;
      const counts = roleCount.get(match.pairings[i].account_id);
      if (counts) s += counts[roleIdx];
    }
    return s;
  }

  function applyMatch(match: MatchResult) {
    for (let i = 0; i < match.pairings.length; i++) {
      const roleIdx = i % 5;
      const playerId = match.pairings[i].account_id;
      let counts = roleCount.get(playerId);
      if (!counts) {
        counts = [0, 0, 0, 0, 0];
        roleCount.set(playerId, counts);
      }
      counts[roleIdx] += 1;
    }
  }

  const selected: MatchResult[] = [];
  const usedIndices = new Set<number>();

  // Seed pick: first match from the shuffled order keeps the result random.
  selected.push(shuffled[0]);
  usedIndices.add(0);
  applyMatch(shuffled[0]);

  while (selected.length < n) {
    let bestIdx = -1;
    let bestCost = Infinity;
    for (let i = 0; i < shuffled.length; i++) {
      if (usedIndices.has(i)) continue;
      const c = costOf(shuffled[i]);
      // Strictly less-than keeps ties broken by shuffle order (i.e., random).
      if (c < bestCost) {
        bestCost = c;
        bestIdx = i;
      }
    }
    if (bestIdx === -1) break;
    selected.push(shuffled[bestIdx]);
    usedIndices.add(bestIdx);
    applyMatch(shuffled[bestIdx]);
  }

  return selected;
}

export function MatchDisplay({ matchResults }: MatchDisplayProps) {
  const t = useTranslations();
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
      setMatches(
        pickDisplayedMatches(
          sourceMatches,
          config.matchOptions,
          config.roleVariety.enabled
        )
      );
    } else {
      setMatches([]);
    }
  }, [sourceMatches, config.matchOptions, config.roleVariety.enabled]);

  // Regenerate/reshuffle the displayed matches
  const handleRegenerate = useCallback(() => {
    if (sourceMatches.length > 0) {
      setMatches(
        pickDisplayedMatches(
          sourceMatches,
          config.matchOptions,
          config.roleVariety.enabled
        )
      );
    }
  }, [sourceMatches, config.matchOptions, config.roleVariety.enabled]);

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
      const textToCopy = `${matchText}\n\n${window.location.href}`;
      await navigator.clipboard.writeText(textToCopy);
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
        <h3 className="text-base font-semibold">{t("matchmaking.matchResults")}</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRegenerate}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            {t("matchmaking.regenerate")}
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
                {t("matchmaking.copied")}
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                {t("matchmaking.copy")}
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
            {t("matchmaking.noMatchesFound")}
          </div>
        )}
      </Card>
    </div>
  );
}
