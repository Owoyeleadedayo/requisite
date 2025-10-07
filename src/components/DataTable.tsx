"use client";

import * as React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ListFilter, Search, X, ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Label } from "./ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";

export type Column<T> = {
  key: keyof T;
  label: string;
  render?: (value: any, row: T) => React.ReactNode; //eslint-disable-line @typescript-eslint/no-explicit-any
};

interface DataTableProps<T> {
  columns: any[]; //eslint-disable-line @typescript-eslint/no-explicit-any
  data: any[]; //eslint-disable-line @typescript-eslint/no-explicit-any
  itemsPerPage?: number;
}

export default function DataTable<T extends { id?: string | number }>({
  columns,
  data,
  itemsPerPage = 10,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filteredData, setFilteredData] = React.useState(data);
  const [columnFilters, setColumnFilters] = React.useState<
    Record<string, string[]>
  >({});
  const [rangeFilters, setRangeFilters] = React.useState<Record<string, {min?: number, max?: number}>>({});
  const [showFilterPopover, setShowFilterPopover] = React.useState(false);

  const applyFilters = React.useCallback(() => {
    let filtered = data;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter((row) =>
        columns.some((col) => {
          const value = row[col.key];
          return String(value)
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        })
      );
    }

    // Apply column filters
    Object.entries(columnFilters).forEach(([columnKey, selectedValues]) => {
      if (selectedValues.length > 0) {
        filtered = filtered.filter((row) => {
          const value = String(row[columnKey]);
          return selectedValues.includes(value);
        });
      }
    });
    
    // Apply range filters
    Object.entries(rangeFilters).forEach(([columnKey, range]) => {
      if (range.min !== undefined || range.max !== undefined) {
        filtered = filtered.filter((row) => {
          const value = parseFloat(String(row[columnKey]).replace(/[^\d.-]/g, ''));
          if (isNaN(value)) return true;
          return (!range.min || value >= range.min) && (!range.max || value <= range.max);
        });
      }
    });

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [data, searchQuery, columnFilters, rangeFilters, columns]);

  const handleSearch = () => {
    applyFilters();
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setColumnFilters({});
    setRangeFilters({});
    setFilteredData(data);
    setCurrentPage(1);
  };

  const getUniqueValues = (columnKey: string) => {
    const values = data.map((row) => String(row[columnKey])).filter(Boolean);
    return [...new Set(values)].sort();
  };

  const handleFilterChange = (
    columnKey: string,
    value: string,
    checked: boolean
  ) => {
    setColumnFilters((prev) => {
      const current = prev[columnKey] || [];
      if (checked) {
        return { ...prev, [columnKey]: [...current, value] };
      } else {
        return { ...prev, [columnKey]: current.filter((v) => v !== value) };
      }
    });
  };

  const handleRangeChange = (columnKey: string, type: 'min' | 'max', value: string) => {
    setRangeFilters(prev => ({
      ...prev,
      [columnKey]: {
        ...prev[columnKey],
        [type]: value ? parseFloat(value) : undefined
      }
    }));
  };

  const isRangeColumn = (key: string) => {
    return ['quantityNeeded', 'estimatedUnitPrice', 'createdAt'].includes(key);
  };

  const getMinMaxValues = (columnKey: string) => {
    const values = data.map(row => {
      const val = String(row[columnKey]).replace(/[^\d.-]/g, '');
      return parseFloat(val);
    }).filter(v => !isNaN(v));
    return { min: Math.min(...values), max: Math.max(...values) };
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  React.useEffect(() => {
    setFilteredData(data);
  }, [data]);

  React.useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="w-full">
      <div className="search-filter w-full flex gap-2 mb-8">
        <div className=" search relative w-[100%]">
          <Input
            type="text"
            value={searchQuery}
            placeholder="Search table"
            onKeyPress={handleKeyPress}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#FFFFFF] pl-4 pr-4 py-2 w-full h-12 rounded-md shadow-md"
          />

          {searchQuery && filteredData.length !== data.length ? (
            <Button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer bg-transparent hover:bg-transparent p-0 h-auto"
            >
              <X color="black" size={20} />
            </Button>
          ) : (
            <Button
              onClick={handleSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer bg-transparent hover:bg-transparent p-0 h-auto"
            >
              <Search color="black" size={20} />
            </Button>
          )}
        </div>

        <Popover open={showFilterPopover} onOpenChange={setShowFilterPopover}>
          <PopoverTrigger className="hidden" asChild>
            <Button className="filter h-12 px-6 py-4 bg-[#0F1E7A] text-md text-white cursor-pointer">
              <div className="flex items-center">
                <ListFilter color="white" size={16} />
                <span className="hidden lg:block ml-2">Filter table</span>
                <ChevronDown size={16} className="ml-1" />
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 bg-white p-4">
            <div className="space-y-4">
              <h4 className="font-medium text-sm">Filter by columns</h4>
              {columns
                .filter((col) => col.key !== "_id" && col.key !== "title")
                .map((column) => {
                  const columnKey = String(column.key);
                  
                  if (isRangeColumn(columnKey)) {
                    const { min, max } = getMinMaxValues(columnKey);
                    const currentRange = rangeFilters[columnKey] || {};
                    
                    return (
                      <div key={columnKey} className="space-y-2">
                        <Label className="text-sm font-medium">{column.label}</Label>
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <Input
                              type="number"
                              placeholder={`Min (${min})`}
                              value={currentRange.min || ''}
                              onChange={(e) => handleRangeChange(columnKey, 'min', e.target.value)}
                              className="h-8 text-xs"
                            />
                          </div>
                          <div className="flex-1">
                            <Input
                              type="number"
                              placeholder={`Max (${max})`}
                              value={currentRange.max || ''}
                              onChange={(e) => handleRangeChange(columnKey, 'max', e.target.value)}
                              className="h-8 text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  }
                  
                  const uniqueValues = getUniqueValues(columnKey);
                  const selectedValues = columnFilters[columnKey] || [];

                  return (
                    <div key={columnKey} className="space-y-2">
                      <Label className="text-sm font-medium">{column.label}</Label>
                      <div className="max-h-32 overflow-y-auto space-y-1">
                        {uniqueValues.slice(0, 10).map((value) => (
                          <div key={value} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`${columnKey}-${value}`}
                              checked={selectedValues.includes(value)}
                              onChange={(e) => handleFilterChange(columnKey, value, e.target.checked)}
                              className="w-4 h-4"
                            />
                            <Label htmlFor={`${columnKey}-${value}`} className="text-xs truncate flex-1">
                              {value}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setColumnFilters({});
                    setRangeFilters({});
                    setShowFilterPopover(false);
                  }}
                >
                  Clear
                </Button>
                <Button
                  size="sm"
                  onClick={() => setShowFilterPopover(false)}
                  className="bg-[#0F1E7A]"
                >
                  Apply
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="overflow-x-auto rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead
                  key={String(col.key)}
                  className="whitespace-nowrap text-base font-semibold"
                >
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody className="bg-white">
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <TableRow key={row.id ?? rowIndex}>
                  {columns.map((col) => (
                    <TableCell
                      key={String(col.key)}
                      className="whitespace-nowrap"
                    >
                      {col.render
                        ? col.render(row[col.key], row)
                        : String(row[col.key])}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-start mt-4">
          <Pagination className="!justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationLink
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  className={`cursor-pointer ${
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }`}
                  aria-label="Go to previous page"
                >
                  &lt;
                </PaginationLink>
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}
              <PaginationItem>
                <PaginationLink
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  className={`cursor-pointer ${
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }`}
                  aria-label="Go to next page"
                >
                  &gt;
                </PaginationLink>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
