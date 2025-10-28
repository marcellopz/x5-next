"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface FormStepperProps {
  currentStep: number;
  steps: {
    title: string;
    description: string;
  }[];
}

export function FormStepper({ currentStep, steps }: FormStepperProps) {
  return (
    <div className="w-full bg-card border-border rounded-lg border p-4 sm:p-6">
      <div className="flex items-center">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <React.Fragment key={stepNumber}>
              {/* Step Circle */}
              <div className="flex flex-col items-center flex-1">
                <div
                  className={cn(
                    "flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                    isCompleted || isCurrent
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground/30 bg-background text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    stepNumber
                  )}
                </div>
                {/* Step Title */}
                <div className="mt-2 text-center">
                  <p
                    className={cn(
                      "text-xs sm:text-sm font-medium",
                      isCurrent || isCompleted
                        ? "text-primary"
                        : "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground hidden sm:block">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 mx-2 sm:mx-4">
                  <div
                    className={cn(
                      "h-0.5 w-full transition-colors",
                      stepNumber < currentStep
                        ? "bg-primary"
                        : "bg-muted-foreground/30"
                    )}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
