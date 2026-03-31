"use client";

import { Search, Filter as FilterIcon } from "lucide-react";
import React from "react";

// Interfaces to define how the Parent component talks to this Child component
export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterGroup {
  id: string; // e.g., 'category', 'status', 'brand'
  placeholder: string; // e.g., 'All Categories'
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
}

interface FilterBarProps {
  // Search Configuration
  searchValue: string;
  onSearchChange: (val: string) => void;
  searchPlaceholder?: string;

  // Dynamic Dropdown Filters Configuration
  filters?: FilterGroup[];

  // Sorting Configuration
  sortOptions?: FilterOption[];
  sortValue?: string;
  onSortChange?: (val: string) => void;

  // Pagination / Items Per Page
  itemsPerPage?: number;
  onItemsPerPageChange?: (val: number) => void;
}

export default function FilterBar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  filters = [],
  sortOptions = [],
  sortValue = "",
  onSortChange,
  itemsPerPage,
  onItemsPerPageChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
      
      {/* 1. Items Per Page (If provided) */}
      {itemsPerPage && onItemsPerPageChange && (
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-bold text-slate-400 uppercase">Show</span>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none text-sm focus:border-cyan-500 cursor-pointer w-full md:w-auto"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={9999}>All</option>
          </select>
        </div>
      )}

      {/* 2. Dynamic Filters (Dropdowns) */}
      {filters.length > 0 && (
        <div className="flex items-center gap-2 w-full md:w-auto">
          <FilterIcon size={14} className="text-slate-400 hidden md:block" />
          {filters.map((filter) => (
            <select
              key={filter.id}
              value={filter.value}
              onChange={(e) => filter.onChange(e.target.value)}
              className="w-full md:w-auto p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none text-sm focus:border-cyan-500 cursor-pointer"
            >
              <option value="">{filter.placeholder}</option>
              {filter.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ))}
        </div>
      )}

      {/* 3. Sort By (If provided) */}
      {sortOptions.length > 0 && onSortChange && (
        <select
          value={sortValue}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full md:w-auto p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none text-sm focus:border-cyan-500 cursor-pointer"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}

      {/* 4. Search Bar */}
      <div className="relative w-full md:w-64">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          size={16}
        />
        <input
          placeholder={searchPlaceholder}
          className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none text-sm transition-all"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
}