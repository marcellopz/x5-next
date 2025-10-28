"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { NumberStepper } from "@/components/ui/number-stepper";

interface BasicConfigSectionProps {
  matchOptions: number;
  tolerance: number;
  onMatchOptionsChange: (value: number) => void;
  onToleranceChange: (value: number) => void;
}

export function BasicConfigSection({
  matchOptions,
  tolerance,
  onMatchOptionsChange,
  onToleranceChange,
}: BasicConfigSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Configuration Settings</CardTitle>
        <CardDescription>Configure matchmaking parameters</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <div className="space-y-2">
            <Label>Match Options</Label>
            <NumberStepper
              value={matchOptions}
              onChange={onMatchOptionsChange}
              min={1}
              max={10}
            />
            <p className="text-xs text-muted-foreground">
              Number of team combinations
            </p>
          </div>

          <div className="space-y-2">
            <Label>Tolerance</Label>
            <NumberStepper
              value={tolerance}
              onChange={onToleranceChange}
              min={0}
              max={10}
            />
            <p className="text-xs text-muted-foreground">
              Skill balance variance
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
