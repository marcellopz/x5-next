"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Copy, Check } from "lucide-react";
import type { MatchResult } from "@/lib/matchmaking-algorithm";

interface MatchDisplayProps {
  matches: MatchResult[];
}

export function MatchDisplay({ matches }: MatchDisplayProps) {
  const [copied, setCopied] = useState(false);

  const formatMatchText = (matches: MatchResult[]): string => {
    return matches
      .map((match, index) => {
        const roleOrder = ["Top", "Jungle", "Mid", "Adc", "Support"];
        const roleLabels = ["Top:", "Jng:", "Mid:", "Adc:", "Sup:"];

        const roleLines = roleOrder.map((role, roleIndex) => {
          const [player1, player2] = match.pairingsRoles[role];
          return `${roleLabels[roleIndex].padEnd(6)} ${player1.name.padEnd(
            10
          )} (${player1.rank}) x (${player2.rank}) ${player2.name}`;
        });

        const totalScore = match.matchScore.blue + match.matchScore.red;
        const scoreLine = `Score: ${match.matchScore.blue} x ${match.matchScore.red} -> ${totalScore}`;

        return `Match ${index + 1}:\n${roleLines.join("\n")}\n${scoreLine}`;
      })
      .join("\n\n");
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(formatMatchText(matches));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const matchText = formatMatchText(matches);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Match Cards */}
      <div className="space-y-2">
        {matches.map((match, index) => (
          <MatchCard key={index} match={match} matchNumber={index + 1} />
        ))}
      </div>

      {/* Text Output */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold">Match Text Output</h3>
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

        <Card className="p-3">
          <textarea
            value={matchText}
            readOnly
            className="w-full font-mono text-sm bg-muted/50 border-0"
            style={{
              fontFamily: "monospace",
              height: `${Math.max(
                200,
                matchText.split("\n").length * 23 + 20
              )}px`,
            }}
          />
        </Card>
      </div>
    </div>
  );
}

interface MatchCardProps {
  match: MatchResult;
  matchNumber: number;
}

function MatchCard({ match, matchNumber }: MatchCardProps) {
  const roleOrder = ["Top", "Jungle", "Mid", "Adc", "Support"];
  const roleLabels = ["Top", "Jng", "Mid", "Adc", "Sup"];

  return (
    <Card className="p-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">Match {matchNumber}</h3>
        <div className="text-xs text-muted-foreground">
          {match.matchScore.blue} vs {match.matchScore.red}
        </div>
      </div>

      <table className="w-full text-xs table-fixed">
        <colgroup>
          <col className="w-[15%]" />
          <col className="w-[35%]" />
          <col className="w-[10%]" />
          <col className="w-[40%]" />
        </colgroup>
        <tbody>
          {roleOrder.map((role, index) => {
            const [player1, player2] = match.pairingsRoles[role];
            return (
              <tr
                key={role}
                className="border-b border-border/50 last:border-b-0"
              >
                <td className="py-1 font-medium">{roleLabels[index]}</td>
                <td className="py-1 text-right pr-2">
                  <span className="font-medium">
                    ({player1.rank}) {player1.name}
                  </span>
                </td>
                <td className="py-1 text-center">
                  <span className="text-muted-foreground font-bold">vs</span>
                </td>
                <td className="py-1 text-left pl-2">
                  <span className="font-medium">
                    {player2.name} ({player2.rank})
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="mt-2 pt-1 border-t border-border">
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Total</span>
          <span className="font-semibold text-xs">
            {match.matchScore.blue + match.matchScore.red}
          </span>
        </div>
      </div>
    </Card>
  );
}
