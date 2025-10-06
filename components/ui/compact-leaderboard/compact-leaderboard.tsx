"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface LeaderboardItem {
  id: string;
  label: string;
  value: string | number;
  subtitle?: string;
}

interface CompactLeaderboardProps {
  items: LeaderboardItem[];
  title?: string;
  initialCount?: number;
  maxCount?: number;
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  expandedAction?: {
    label: string;
    onClick: () => void;
  };
  collapsedAction?: {
    label: string;
    onClick: () => void;
  };
  renderItem?: (item: LeaderboardItem, index: number) => React.ReactNode;
}

export function CompactLeaderboard({
  items,
  title,
  initialCount = 3,
  maxCount = 6,
  expanded: controlledExpanded,
  onExpandedChange,
  expandedAction,
  collapsedAction,
  renderItem,
}: CompactLeaderboardProps) {
  const [internalExpanded, setInternalExpanded] = useState(false);

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

  const displayedItems = expanded
    ? items.slice(0, maxCount)
    : items.slice(0, initialCount);
  const hasMore = items.length > initialCount;

  const getPositionNumber = (index: number) => {
    return `${index + 1}.`;
  };

  const defaultRenderItem = (item: LeaderboardItem, index: number) => (
    <div
      key={item.id}
      className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-accent transition-colors"
    >
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <span className="text-sm font-bold text-primary w-3">
          {getPositionNumber(index)}
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-sm truncate">{item.label}</div>
          {item.subtitle && (
            <div className="text-xs text-muted-foreground truncate">
              {item.subtitle}
            </div>
          )}
        </div>
      </div>
      <span className="text-sm font-semibold ml-2">{item.value}</span>
    </div>
  );

  return (
    <Card>
      {title && (
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </CardHeader>
      )}

      <CardContent className={cn(title ? "" : "pt-6", "px-3! pb-3!")}>
        <div className="space-y-1">
          {displayedItems
            .slice(0, initialCount)
            .map((item, index) =>
              renderItem
                ? renderItem(item, index)
                : defaultRenderItem(item, index)
            )}
        </div>

        {/* Animated expandable section */}
        <div
          className={`grid transition-all duration-300 ease-in-out ${
            expanded && hasMore
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="space-y-1 mt-1">
              {displayedItems
                .slice(initialCount)
                .map((item, index) =>
                  renderItem
                    ? renderItem(item, index + initialCount)
                    : defaultRenderItem(item, index + initialCount)
                )}
            </div>
          </div>
        </div>

        {hasMore && (
          <div className="mt-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleToggle}
              className="w-full text-xs"
            >
              {expanded ? "Show Less" : "Show More"}
            </Button>

            {/* Animated action buttons */}
            <div
              className={`grid transition-all duration-300 ease-in-out ${
                expanded
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="space-y-2 mt-2">
                  {expandedAction && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={expandedAction.onClick}
                      className="w-full text-xs"
                    >
                      {expandedAction.label}
                    </Button>
                  )}

                  {collapsedAction && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={collapsedAction.onClick}
                      className="w-full text-xs"
                    >
                      {collapsedAction.label}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {!hasMore && items.length === 0 && (
          <div className="text-sm text-muted-foreground text-center py-4">
            No items to display
          </div>
        )}
      </CardContent>
    </Card>
  );
}
