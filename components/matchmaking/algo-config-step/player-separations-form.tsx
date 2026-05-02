"use client";

import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { useMatchmaking } from "../matchmaking-context";
import { useTranslations } from "@/lib/i18n/locale-context";

interface PlayerSeparationsFormProps {
  enabled: boolean;
}

export function PlayerSeparationsForm({ enabled }: PlayerSeparationsFormProps) {
  const t = useTranslations();
  const { selectedPlayers, config, setConfig } = useMatchmaking();

  const addPair = () => {
    setConfig((prev) => ({
      ...prev,
      playerSeparations: {
        ...prev.playerSeparations,
        pairs: [
          ...prev.playerSeparations.pairs,
          { id: `rivals-${Date.now()}`, player1: "", player2: "" },
        ],
      },
    }));
  };

  const removePair = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      playerSeparations: {
        ...prev.playerSeparations,
        pairs: prev.playerSeparations.pairs.filter((pair) => pair.id !== id),
      },
    }));
  };

  const updatePair = (
    id: string,
    field: "player1" | "player2",
    value: string
  ) => {
    setConfig((prev) => ({
      ...prev,
      playerSeparations: {
        ...prev.playerSeparations,
        pairs: prev.playerSeparations.pairs.map((pair) =>
          pair.id === id ? { ...pair, [field]: value } : pair
        ),
      },
    }));
  };

  const getPairKey = (player1: string, player2: string) => {
    return [player1, player2].sort().join("|");
  };

  const hasDuplicatePair = (pairId: string, player1: string, player2: string) => {
    if (!player1 || !player2) return false;
    const pairKey = getPairKey(player1, player2);
    return config.playerSeparations.pairs.some(
      (pair) =>
        pair.id !== pairId &&
        pair.player1 &&
        pair.player2 &&
        getPairKey(pair.player1, pair.player2) === pairKey
    );
  };

  if (!enabled) return null;

  return (
    <div className="space-y-3">
      {config.playerSeparations.pairs.length === 0 && (
        <p className="text-sm text-muted-foreground">
          {t("matchmaking.addRivalPairHint")}
        </p>
      )}

      {config.playerSeparations.pairs.map((pair) => {
        const samePlayer = pair.player1 !== "" && pair.player1 === pair.player2;
        const duplicatePair = hasDuplicatePair(pair.id, pair.player1, pair.player2);

        return (
          <div key={pair.id} className="space-y-2">
            <div className="flex items-center gap-2">
              <Select
                value={pair.player1}
                onChange={(e) => updatePair(pair.id, "player1", e.target.value)}
                className="flex-1"
              >
                <option value="">{t("matchmaking.selectFirstRival")}</option>
                {selectedPlayers.map((player) => (
                  <option key={player.name_id} value={player.name_id}>
                    {player.name}
                  </option>
                ))}
              </Select>

              <span className="text-muted-foreground">{t("matchmaking.vs")}</span>

              <Select
                value={pair.player2}
                onChange={(e) => updatePair(pair.id, "player2", e.target.value)}
                className="flex-1"
              >
                <option value="">{t("matchmaking.selectSecondRival")}</option>
                {selectedPlayers.map((player) => (
                  <option key={player.name_id} value={player.name_id}>
                    {player.name}
                  </option>
                ))}
              </Select>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removePair(pair.id)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {samePlayer && (
              <p className="text-xs text-destructive">
                {t("matchmaking.rivalPairCannotMatchSamePlayer")}
              </p>
            )}
            {!samePlayer && duplicatePair && (
              <p className="text-xs text-destructive">
                {t("matchmaking.rivalPairDuplicate")}
              </p>
            )}
          </div>
        );
      })}

      <Button type="button" variant="outline" size="sm" onClick={addPair}>
        <Plus className="h-4 w-4 mr-2" />
        {t("matchmaking.addRivalPair")}
      </Button>
    </div>
  );
}
