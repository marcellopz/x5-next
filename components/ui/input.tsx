"use client";

import * as React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  compact?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, startIcon, endIcon, compact, ...props }, ref) => {
    const hasStartIcon = !!startIcon;
    const hasEndIcon = !!endIcon;
    const isNumberType = type === "number";
    const inputRef = React.useRef<HTMLInputElement>(null);
    const combinedRef = React.useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLInputElement | null>).current =
            node;
        }
      },
      [ref]
    );

    const handleIncrement = () => {
      if (!inputRef.current || !isNumberType) return;
      const input = inputRef.current;
      const currentValue = parseFloat(input.value) || 0;
      const step = parseFloat(input.step) || 1;
      const max = input.max ? parseFloat(input.max) : undefined;
      const newValue = currentValue + step;

      if (max === undefined || newValue <= max) {
        input.value = newValue.toString();
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
      }
    };

    const handleDecrement = () => {
      if (!inputRef.current || !isNumberType) return;
      const input = inputRef.current;
      const currentValue = parseFloat(input.value) || 0;
      const step = parseFloat(input.step) || 1;
      const min = input.min ? parseFloat(input.min) : undefined;
      const newValue = currentValue - step;

      if (min === undefined || newValue >= min) {
        input.value = newValue.toString();
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
      }
    };

    const baseInputClasses = cn(
      "flex w-full rounded-md border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
      compact ? "h-8 px-2 py-1" : "h-10 px-3 py-2",
      // Hide default number input spinners
      isNumberType &&
        "[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]",
      className
    );

    const inputElement = (
      <input
        type={type}
        className={cn(
          baseInputClasses,
          hasStartIcon && (compact ? "pl-8" : "pl-10"),
          hasEndIcon && !isNumberType && (compact ? "pr-8" : "pr-10"),
          isNumberType && (compact ? "pr-8" : "pr-10")
        )}
        ref={combinedRef}
        {...props}
      />
    );

    if (hasStartIcon || hasEndIcon || isNumberType) {
      return (
        <div className="relative w-full">
          {hasStartIcon && (
            <div
              className={cn(
                "absolute top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none z-10",
                compact ? "left-2" : "left-3"
              )}
            >
              {startIcon}
            </div>
          )}
          {inputElement}
          {isNumberType && (
            <div className="absolute right-0 top-0 bottom-0 flex flex-col border-l border-input rounded-r-md overflow-hidden pointer-events-none">
              <button
                type="button"
                onClick={handleIncrement}
                disabled={props.disabled}
                className={cn(
                  "flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed pointer-events-auto",
                  compact ? "h-4 w-6" : "h-5 w-7"
                )}
                tabIndex={-1}
              >
                <ChevronUp
                  className={cn(compact ? "h-3 w-3" : "h-3.5 w-3.5")}
                />
              </button>
              <button
                type="button"
                onClick={handleDecrement}
                disabled={props.disabled}
                className={cn(
                  "flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-t border-input pointer-events-auto",
                  compact ? "h-4 w-6" : "h-5 w-7"
                )}
                tabIndex={-1}
              >
                <ChevronDown
                  className={cn(compact ? "h-3 w-3" : "h-3.5 w-3.5")}
                />
              </button>
            </div>
          )}
          {hasEndIcon && !isNumberType && (
            <div
              className={cn(
                "absolute top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none z-10",
                compact ? "right-2" : "right-3"
              )}
            >
              {endIcon}
            </div>
          )}
        </div>
      );
    }

    return inputElement;
  }
);
Input.displayName = "Input";

export { Input };
