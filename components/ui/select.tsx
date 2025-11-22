import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectGroup {
  label: string;
  options: SelectOption[];
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  placeholder?: string;
  /**
   * Structured groups of options. If provided, this will be used instead of children.
   * Each group will be rendered as an optgroup with its options.
   */
  groups?: SelectGroup[];
  /**
   * Simple options array. If provided along with groups, these will be rendered first (before groups).
   * If groups is not provided, these will be rendered as regular options.
   */
  options?: SelectOption[];
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, placeholder, children, groups, options, ...props }, ref) => {
    const renderOptions = () => {
      // If groups or options are provided, use structured format
      if (groups || options) {
        return (
          <>
            {/* Render simple options first if provided */}
            {options?.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
            {/* Render grouped options */}
            {groups?.map((group, groupIndex) => (
              <optgroup key={groupIndex} label={group.label}>
                {group.options.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                  >
                    {option.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </>
        );
      }

      // Otherwise, render children (backward compatibility)
      return children;
    };

    return (
      <div className="relative">
        <select
          className={cn(
            "flex w-full appearance-none rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-10 px-3 py-2 pr-8",
            className
          )}
          ref={ref}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {renderOptions()}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select };
