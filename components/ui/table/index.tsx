"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

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
}

interface TableContextType<T = unknown> {
  compact: boolean;
  sortColumn?: string;
  sortDirection?: SortDirection;
  onSort?: (column: string) => void;
  sortedData?: T[];
}

const TableContext = React.createContext<TableContextType>({
  compact: false,
});

// Hook to access sorted data
export const useTableData = () => {
  const context = React.useContext(TableContext);
  return context.sortedData || [];
};

const Table = React.forwardRef<HTMLTableElement, TableProps<unknown>>(
  (
    {
      className,
      compact = false,
      data = [],
      sortConfig = {},
      initialSort,
      children,
      ...props
    },
    ref
  ) => {
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
        }}
      >
        <div className="relative w-full">
          <div className="overflow-auto border border-border rounded-lg">
            <table
              ref={ref}
              className={cn("w-full text-sm", className)}
              {...props}
            >
              {children}
            </table>
          </div>
        </div>
      </TableContext.Provider>
    );
  }
);
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

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b border-border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
));
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

    return (
      <th
        ref={ref}
        className={cn(
          compact
            ? "h-8 px-2 text-left align-middle font-medium text-muted-foreground whitespace-nowrap [&:has([role=checkbox])]:pr-0"
            : "h-12 px-4 text-left align-middle font-medium text-muted-foreground whitespace-nowrap [&:has([role=checkbox])]:pr-0",
          sortable && "cursor-pointer hover:bg-muted/50 select-none",
          className
        )}
        onClick={handleClick}
        {...props}
      >
        <div className="flex items-center">
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

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
};
