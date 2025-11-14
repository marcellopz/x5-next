"use client";

import { useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Search, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Player } from "@/lib/types";
import { CHAMPIONICONURL, championIds } from "@/lib/resources";
import Image from "next/image";

interface FilterOption {
  id: string;
  name: string;
  type: "player" | "champion";
}

interface MatchesFilterProps {
  className?: string;
  playerList: Player[];
  searchQuery: string;
  isDropdownOpen: boolean;
  onInputChange: (value: string) => void;
  onInputFocus: () => void;
  onInputBlur: () => void;
  onOptionClick: (
    filter:
      | { type: "player"; accountId: number }
      | { type: "champion"; championName: string }
  ) => void;
}

export function MatchesFilter({
  className,
  playerList,
  searchQuery,
  isDropdownOpen,
  onInputChange,
  onInputFocus,
  onInputBlur,
  onOptionClick,
}: MatchesFilterProps) {
  const allOptions: FilterOption[] = useMemo(() => {
    const options: FilterOption[] = [];
    playerList.forEach((player) => {
      options.push({
        id: player.account_id?.toString() ?? "",
        name: player.name,
        type: "player",
      });
    });
    Object.entries(championIds).forEach(([id, name]) => {
      options.push({
        id: id.toString(),
        name,
        type: "champion",
      });
    });
    return options;
  }, [playerList]);

  const autocompleteOptions: FilterOption[] = useMemo(() => {
    return allOptions.filter((option) =>
      option.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allOptions, searchQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onInputChange(e.target.value);
  };

  const handleOptionClick = (option: FilterOption) => {
    if (option.type === "player") {
      onOptionClick({ type: "player", accountId: Number(option.id) });
    } else {
      onOptionClick({ type: "champion", championName: option.name });
    }
  };

  return (
    <div className={cn("relative w-full", className)}>
      <Input
        type="text"
        placeholder="Search players or champions..."
        value={searchQuery}
        onChange={handleInputChange}
        onFocus={onInputFocus}
        onBlur={onInputBlur}
        startIcon={<Search className="h-4 w-4" />}
        className="w-full"
        autoFocus
      />

      {/* Autocomplete Dropdown */}
      {isDropdownOpen && autocompleteOptions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-auto">
          <div className="p-1">
            {autocompleteOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => handleOptionClick(option)}
                className="w-full text-left px-3 py-2 rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-2"
              >
                {option.type === "player" ? (
                  <User className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Image
                    src={`${CHAMPIONICONURL}${option.id}.png`}
                    alt={option.name}
                    width={36}
                    height={36}
                    className="rounded-md border border-border"
                  />
                )}
                <span className="flex-1">{option.name}</span>
                <span className="text-xs text-muted-foreground capitalize">
                  {option.type}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Empty state when searching but no results */}
      {isDropdownOpen &&
        searchQuery.length > 0 &&
        autocompleteOptions.length === 0 && (
          <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg">
            <div className="p-3 text-center text-sm text-muted-foreground">
              No matches found
            </div>
          </div>
        )}
    </div>
  );
}
