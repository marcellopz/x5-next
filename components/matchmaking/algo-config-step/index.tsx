"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
import { useEffect } from "react";
import { BasicConfigSection } from "./basic-config-section";
import { PresetLanesForm } from "./preset-lanes-form";
import { AvoidRolesForm } from "./avoid-roles-form";
import { PlayerCombosForm } from "./player-combos-form";
import { useMatchmaking } from "../matchmaking-context";

interface AlgoConfigStepProps {
  onPrevious: () => void;
  onNext: () => void;
}

export function AlgoConfigStep({ onPrevious, onNext }: AlgoConfigStepProps) {
  const { config, setConfig, expandedSections, setExpandedSections } =
    useMatchmaking();

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  // Auto-expand sections when their features are enabled
  useEffect(() => {
    const sectionsToExpand: string[] = [];

    if (config.presetLanes.usePresetLanes) {
      sectionsToExpand.push("presetLanes");
    }

    if (config.avoidRoles.enabled) {
      sectionsToExpand.push("avoidRoles");
    }

    if (config.playerCombos.enabled) {
      sectionsToExpand.push("playerCombos");
    }

    // Only update if there are changes to avoid infinite loops
    const currentSections = expandedSections.sort();
    const newSections = sectionsToExpand.sort();

    if (JSON.stringify(currentSections) !== JSON.stringify(newSections)) {
      setExpandedSections(sectionsToExpand);
    }
  }, [
    config.presetLanes.usePresetLanes,
    config.avoidRoles.enabled,
    config.playerCombos.enabled,
    expandedSections,
    setExpandedSections,
  ]);

  return (
    <div className="space-y-6 mt-2">
      {/* Basic Configuration Settings */}
      <BasicConfigSection
        matchOptions={config.matchOptions}
        tolerance={config.tolerance}
        onMatchOptionsChange={(value) =>
          setConfig((prev) => ({ ...prev, matchOptions: value }))
        }
        onToleranceChange={(value) =>
          setConfig((prev) => ({ ...prev, tolerance: value }))
        }
      />

      {/* Advanced Options */}
      <Card>
        <CardHeader>
          <CardTitle>Advanced Options</CardTitle>
          <CardDescription>
            Additional configuration settings (coming soon)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Use Pre-set Lanes */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="flex-1">
                <Checkbox
                  id="usePresetLanes"
                  checked={config.presetLanes.usePresetLanes}
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    setConfig((prev) => ({
                      ...prev,
                      presetLanes: {
                        ...prev.presetLanes,
                        usePresetLanes: isChecked,
                      },
                    }));
                    // Auto-expand section when checked
                    if (
                      isChecked &&
                      !expandedSections.includes("presetLanes")
                    ) {
                      setExpandedSections((prev) => [...prev, "presetLanes"]);
                    }
                  }}
                  label="Use pre-set lanes"
                />
              </div>
              <button
                onClick={() => toggleSection("presetLanes")}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    expandedSections.includes("presetLanes") ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>
            {expandedSections.includes("presetLanes") && (
              <div className="ml-6 pl-6 border-l border-border">
                <PresetLanesForm enabled={config.presetLanes.usePresetLanes} />
              </div>
            )}
          </div>

          {/* Avoid Roles for Players */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="flex-1">
                <Checkbox
                  id="avoidRoles"
                  checked={config.avoidRoles.enabled}
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    setConfig((prev) => ({
                      ...prev,
                      avoidRoles: {
                        ...prev.avoidRoles,
                        enabled: isChecked,
                        rules:
                          isChecked && prev.avoidRoles.rules.length === 0
                            ? [{ playerId: "", lane: "top" }]
                            : prev.avoidRoles.rules,
                      },
                    }));
                    // Auto-expand section when checked
                    if (isChecked && !expandedSections.includes("avoidRoles")) {
                      setExpandedSections((prev) => [...prev, "avoidRoles"]);
                    }
                  }}
                  label="Avoid roles for players"
                />
              </div>
              <button
                onClick={() => toggleSection("avoidRoles")}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    expandedSections.includes("avoidRoles") ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>
            {expandedSections.includes("avoidRoles") && (
              <div className="ml-6 pl-6 border-l border-border">
                <AvoidRolesForm enabled={config.avoidRoles.enabled} />
              </div>
            )}
          </div>

          {/* Set Player Combos */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="flex-1">
                <Checkbox
                  id="setPlayerCombos"
                  checked={config.playerCombos.enabled}
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    setConfig((prev) => ({
                      ...prev,
                      playerCombos: {
                        ...prev.playerCombos,
                        enabled: isChecked,
                        combos:
                          isChecked && prev.playerCombos.combos.length === 0
                            ? [{ id: `combo-${Date.now()}`, players: [] }]
                            : prev.playerCombos.combos,
                      },
                    }));
                    // Auto-expand section when checked
                    if (
                      isChecked &&
                      !expandedSections.includes("playerCombos")
                    ) {
                      setExpandedSections((prev) => [...prev, "playerCombos"]);
                    }
                  }}
                  label="Set player combos"
                />
              </div>
              <button
                onClick={() => toggleSection("playerCombos")}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    expandedSections.includes("playerCombos")
                      ? "rotate-180"
                      : ""
                  }`}
                />
              </button>
            </div>
            {expandedSections.includes("playerCombos") && (
              <div className="ml-6 pl-6 border-l border-border">
                <PlayerCombosForm enabled={config.playerCombos.enabled} />
              </div>
            )}
          </div>

          <p className="text-xs text-muted-foreground italic">
            These options will be implemented in future updates
          </p>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        <Button onClick={onNext} className="min-w-32">
          Next Step
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
