import * as React from "react";
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

    if (hasStartIcon || hasEndIcon) {
      return (
        <div className="relative w-full">
          {hasStartIcon && (
            <div
              className={cn(
                "absolute top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none",
                compact ? "left-2" : "left-3"
              )}
            >
              {startIcon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              "flex w-full rounded-md border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              compact ? "h-8 px-2 py-1" : "h-10 px-3 py-2",
              hasStartIcon && (compact ? "pl-8" : "pl-10"),
              hasEndIcon && (compact ? "pr-8" : "pr-10"),
              className
            )}
            ref={ref}
            {...props}
          />
          {hasEndIcon && (
            <div
              className={cn(
                "absolute top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none",
                compact ? "right-2" : "right-3"
              )}
            >
              {endIcon}
            </div>
          )}
        </div>
      );
    }

    return (
      <input
        type={type}
        className={cn(
          "flex w-full rounded-md border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          compact ? "h-8 px-2 py-1" : "h-10 px-3 py-2",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
