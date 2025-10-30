"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  small?: boolean;
}

export function CollapsibleSection({
  title,
  children,
  defaultExpanded = true,
  expanded: controlledExpanded,
  onExpandedChange,
  small = false,
}: CollapsibleSectionProps) {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);

  // Determine if component is controlled or uncontrolled
  const isControlled = controlledExpanded !== undefined;
  const expanded = isControlled ? controlledExpanded : internalExpanded;

  const handleToggle = () => {
    const newExpanded = !expanded;
    if (isControlled) {
      onExpandedChange?.(newExpanded);
    } else {
      setInternalExpanded(newExpanded);
    }
  };

  return (
    <div className="flex flex-col">
      <button
        onClick={handleToggle}
        className="flex items-center gap-2 group cursor-pointer w-full"
      >
        <ChevronDown
          className={`${
            small ? "h-4 w-4" : "h-5 w-5"
          } text-muted-foreground group-hover:text-foreground transition-all duration-300 ${
            expanded ? "" : "-rotate-90"
          }`}
        />
        <h2
          className={`${
            small ? "text-base font-medium" : "text-lg font-semibold"
          } tracking-tight group-hover:text-primary transition-colors`}
        >
          {title}
        </h2>
      </button>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          expanded
            ? "grid-rows-[1fr] opacity-100 mt-3"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  );
}
