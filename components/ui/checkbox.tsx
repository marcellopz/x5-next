"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, disabled, checked, ...props }, ref) => {
    const generatedId = React.useId();
    const checkboxId = id || generatedId;

    return (
      <div className="flex items-center space-x-2">
        <div className="relative inline-flex items-center">
          <input
            type="checkbox"
            id={checkboxId}
            ref={ref}
            checked={checked}
            disabled={disabled}
            className={cn(
              "peer h-4 w-4 shrink-0 appearance-none rounded-sm border-2 border-border",
              "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "cursor-pointer transition-all",
              checked && "border-primary bg-primary",
              className
            )}
            {...props}
          />
          {checked && (
            <Check
              className={cn(
                "absolute inset-0 h-3 w-3 m-auto text-primary-foreground pointer-events-none"
              )}
            />
          )}
        </div>
        {label && (
          <label
            htmlFor={checkboxId}
            className={cn(
              "text-sm font-medium leading-none cursor-pointer select-none",
              disabled && "cursor-not-allowed opacity-70"
            )}
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
