"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

type SortDirection = "asc" | "desc" | "none";

interface TableProps<T = unknown>
  extends React.HTMLAttributes<HTMLTableElement> {
  compact?: boolean;
  data?: T[];
  sortConfig?: Record<string, (item: T) => string | number>;
  initialSort?: {
    column: string;
    direction: SortDirection;
  };
  checkboxConfig?: {
    enabled: boolean;
    selectedItems?: Set<string | number>;
    onSelectionChange?: (selectedItems: Set<string | number>) => void;
    getItemId?: (item: T) => string | number;
  };
}

interface TableContextType {
  compact: boolean;
  sortColumn?: string;
  sortDirection?: SortDirection;
  onSort?: (column: string) => void;
  sortedData?: unknown[];
  checkboxConfig?: {
    enabled: boolean;
    selectedItems?: Set<string | number>;
    onSelectionChange?: (selectedItems: Set<string | number>) => void;
    getItemId?: (item: unknown) => string | number;
  };
}

const TableContext = React.createContext<TableContextType>({
  compact: false,
});

// Hook to access sorted data
export const useTableData = () => {
  const context = React.useContext(TableContext);
  return context.sortedData || [];
};

const Table = <T extends object>({
  className,
  compact = false,
  data = [],
  sortConfig = {},
  initialSort,
  checkboxConfig,
  children,
  ...props
}: TableProps<T>) => {
  const [sortColumn, setSortColumn] = React.useState<string>(
    initialSort?.column || ""
  );
  const [sortDirection, setSortDirection] = React.useState<SortDirection>(
    initialSort?.direction || "none"
  );

  // Sorting logic
  const sortedData = React.useMemo(() => {
    if (sortDirection === "none" || !sortColumn || !sortConfig[sortColumn]) {
      return data;
    }

    return [...data].sort((a, b) => {
      const aValue = sortConfig[sortColumn](a);
      const bValue = sortConfig[sortColumn](b);

      // Handle string vs number comparison
      if (typeof aValue === "string" && typeof bValue === "string") {
        const comparison = aValue
          .toLowerCase()
          .localeCompare(bValue.toLowerCase());
        return sortDirection === "asc" ? comparison : -comparison;
      } else {
        const comparison = (aValue as number) - (bValue as number);
        return sortDirection === "asc" ? comparison : -comparison;
      }
    });
  }, [data, sortColumn, sortDirection, sortConfig]);

  // Handle sort click
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      // Cycle through: asc -> desc -> none
      setSortDirection((prev) => {
        switch (prev) {
          case "none":
            return "asc";
          case "asc":
            return "desc";
          case "desc":
            return "none";
          default:
            return "asc";
        }
      });
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  return (
    <TableContext.Provider
      value={{
        compact,
        sortColumn,
        sortDirection,
        onSort: handleSort,
        sortedData,
        checkboxConfig: checkboxConfig as TableContextType["checkboxConfig"],
      }}
    >
      <div className="relative w-full">
        <div className="overflow-auto border border-border rounded-lg">
          <table className={cn("w-full text-sm", className)} {...props}>
            {children}
          </table>
        </div>
      </div>
    </TableContext.Provider>
  );
};
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn(
      "bg-muted/50 [&_tr]:border-b [&_tr]:border-border",
      className
    )}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t border-border bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  selectable?: boolean;
  itemId?: string | number;
}

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, selectable = false, itemId, onClick, ...props }, ref) => {
    const { checkboxConfig } = React.useContext(TableContext);

    const handleRowClick = (e: React.MouseEvent<HTMLTableRowElement>) => {
      // Don't trigger row selection if clicking on a checkbox or button
      if (
        (e.target as HTMLElement).closest('input[type="checkbox"]') ||
        (e.target as HTMLElement).closest("button")
      ) {
        return;
      }

      if (
        selectable &&
        checkboxConfig?.enabled &&
        itemId &&
        checkboxConfig.onSelectionChange
      ) {
        const isChecked = checkboxConfig.selectedItems?.has(itemId) || false;
        const newSelection = new Set(checkboxConfig.selectedItems);

        if (isChecked) {
          newSelection.delete(itemId);
        } else {
          newSelection.add(itemId);
        }

        checkboxConfig.onSelectionChange(newSelection);
      }

      onClick?.(e);
    };

    return (
      <tr
        ref={ref}
        className={cn(
          "border-b border-border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
          ((selectable && checkboxConfig?.enabled) || onClick) &&
            "cursor-pointer",
          className
        )}
        onClick={handleRowClick}
        {...props}
      />
    );
  }
);
TableRow.displayName = "TableRow";

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  sortable?: boolean;
  sortKey?: string;
}

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  (
    { className, sortable = false, sortKey, children, onClick, ...props },
    ref
  ) => {
    const { compact, sortColumn, sortDirection, onSort } =
      React.useContext(TableContext);

    const handleClick = (e: React.MouseEvent<HTMLTableCellElement>) => {
      if (sortable && sortKey && onSort) {
        onSort(sortKey);
      }
      onClick?.(e);
    };

    const getSortIcon = () => {
      if (!sortable || !sortKey || sortColumn !== sortKey) return null;

      switch (sortDirection) {
        case "asc":
          return <span className="ml-1 text-xs">▲</span>;
        case "desc":
          return <span className="ml-1 text-xs">▼</span>;
        default:
          return null;
      }
    };

    const isCentered = className?.includes("text-center");

    return (
      <th
        ref={ref}
        className={cn(
          compact
            ? "h-8 px-2 align-middle font-medium text-muted-foreground whitespace-nowrap [&:has([role=checkbox])]:pr-0"
            : "h-12 px-4 align-middle font-medium text-muted-foreground whitespace-nowrap [&:has([role=checkbox])]:pr-0",
          isCentered ? "text-center" : "text-left",
          sortable && "cursor-pointer hover:bg-muted/50 select-none",
          className
        )}
        onClick={handleClick}
        {...props}
      >
        <div
          className={cn("flex items-center", isCentered && "justify-center")}
        >
          {children}
          {getSortIcon()}
        </div>
      </th>
    );
  }
);
TableHead.displayName = "TableHead";

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  sortValue?: string | number;
}

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, sortValue, ...props }, ref) => {
    const { compact } = React.useContext(TableContext);
    return (
      <td
        ref={ref}
        className={cn(
          compact
            ? "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0"
            : "p-4 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0",
          className
        )}
        data-sort-value={sortValue}
        {...props}
      />
    );
  }
);
TableCell.displayName = "TableCell";

// Checkbox-specific components
const CheckboxTableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => {
  const { checkboxConfig, sortedData, compact } =
    React.useContext(TableContext);

  if (!checkboxConfig?.enabled) return null;

  const allSelected =
    sortedData &&
    sortedData.length > 0 &&
    sortedData.every((item) => {
      const id = checkboxConfig.getItemId?.(item);
      return id && checkboxConfig.selectedItems?.has(id);
    });

  const someSelected =
    sortedData &&
    sortedData.length > 0 &&
    sortedData.some((item) => {
      const id = checkboxConfig.getItemId?.(item);
      return id && checkboxConfig.selectedItems?.has(id);
    });

  const handleSelectAll = () => {
    if (!checkboxConfig.onSelectionChange || !sortedData) return;

    const newSelection = new Set(checkboxConfig.selectedItems);

    if (allSelected) {
      // Deselect all
      sortedData.forEach((item) => {
        const id = checkboxConfig.getItemId?.(item);
        if (id) newSelection.delete(id);
      });
    } else {
      // Select all
      sortedData.forEach((item) => {
        const id = checkboxConfig.getItemId?.(item);
        if (id) newSelection.add(id);
      });
    }

    checkboxConfig.onSelectionChange(newSelection);
  };

  return (
    <th
      ref={ref}
      className={cn(
        compact
          ? "h-8 w-8 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0"
          : "h-12 w-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    >
      <Checkbox
        checked={allSelected}
        ref={(el) => {
          if (el) el.indeterminate = Boolean(someSelected && !allSelected);
        }}
        onChange={handleSelectAll}
      />
    </th>
  );
});
CheckboxTableHead.displayName = "CheckboxTableHead";

const CheckboxTableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement> & {
    itemId: string | number;
  }
>(({ className, itemId, ...props }, ref) => {
  const { checkboxConfig, compact } = React.useContext(TableContext);

  if (!checkboxConfig?.enabled) return null;

  const isChecked = checkboxConfig.selectedItems?.has(itemId) || false;

  const handleChange = () => {
    if (!checkboxConfig.onSelectionChange) return;

    const newSelection = new Set(checkboxConfig.selectedItems);
    if (isChecked) {
      newSelection.delete(itemId);
    } else {
      newSelection.add(itemId);
    }

    checkboxConfig.onSelectionChange(newSelection);
  };

  return (
    <td
      ref={ref}
      className={cn(
        compact
          ? "h-8 w-8 px-4 text-left align-middle [&:has([role=checkbox])]:pr-0"
          : "h-12 w-12 px-4 text-left align-middle [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    >
      <Checkbox checked={isChecked} onChange={handleChange} />
    </td>
  );
});
CheckboxTableCell.displayName = "CheckboxTableCell";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  CheckboxTableHead,
  CheckboxTableCell,
};
