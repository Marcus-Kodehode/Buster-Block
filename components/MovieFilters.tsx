// components/MovieFilters.tsx
"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useT } from "@/components/I18nProvider"; // 👈

interface MovieFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  availableGenres: string[];
}

export interface FilterState {
  search: string;
  genre: string;
  sortBy:
    | "newest"
    | "oldest"
    | "title-asc"
    | "title-desc"
    | "year-asc"
    | "year-desc";
  yearRange: [number, number];
}

export default function MovieFilters({
  onFilterChange,
  availableGenres,
}: MovieFiltersProps) {
  const t = useT(); // 👈
  const currentYear = new Date().getFullYear();
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    genre: "",
    sortBy: "year-desc",
    yearRange: [1888, currentYear + 5],
  });

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFilterChange(updated);
  };

  const resetFilters = () => {
    const def: FilterState = {
      search: "",
      genre: "",
      sortBy: "year-desc",
      yearRange: [1888, currentYear + 5],
    };
    setFilters(def);
    onFilterChange(def);
  };

  const hasActiveFilters =
    filters.search ||
    filters.genre ||
    filters.sortBy !== "year-desc" ||
    filters.yearRange[0] !== 1888 ||
    filters.yearRange[1] !== currentYear + 5;

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder={t("filters.searchPlaceholder")} // 👈
          value={filters.search}
          onChange={(e) => updateFilters({ search: e.target.value })}
          className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-800 rounded-xl focus:ring-2 focus:ring-[#6c47ff] focus:border-transparent placeholder:text-gray-600 hover:border-gray-700"
        />
      </div>

      {/* Toggle + reset */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg hover:border-gray-700"
        >
          <SlidersHorizontal className="w-4 h-4" />
          {t("filters.filtersButton")}
        </button>

        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-gray-300"
          >
            <X className="w-4 h-4" />
            {t("filters.reset")}
          </button>
        )}
      </div>

      {/* Panel */}
      {showFilters && (
        <div className="border border-gray-800 rounded-xl p-6 bg-gray-900/30 space-y-6">
          {/* Genre */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-300">
              {t("filters.genre")}
            </label>

            <div className="relative">
              <select
                value={filters.genre}
                onChange={(e) => updateFilters({ genre: e.target.value })}
                className="w-full appearance-none pr-10 px-4 py-3 bg-[#0a0a0a] border border-gray-800 rounded-xl focus:ring-2 focus:ring-[#6c47ff] focus:border-transparent text-gray-300 cursor-pointer hover:border-gray-700"
              >
                <option value="" className="bg-[#0a0a0a] text-gray-300">
                  {t("filters.allGenres")}
                </option>
                {availableGenres.map((genre) => (
                  <option
                    key={genre}
                    value={genre}
                    className="bg-[#0a0a0a] text-gray-300"
                  >
                    {genre}
                  </option>
                ))}
              </select>

              {/* vår chevron */}
              <svg
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Sort */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-300">
              {t("filters.sortBy")}
            </label>

            <div className="relative">
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  updateFilters({
                    sortBy: e.target.value as FilterState["sortBy"],
                  })
                }
                className="w-full appearance-none pr-10 px-4 py-3 bg-[#0a0a0a] border border-gray-800 rounded-xl focus:ring-2 focus:ring-[#6c47ff] focus:border-transparent text-gray-300 cursor-pointer hover:border-gray-700"
              >
                <option
                  value="year-desc"
                  className="bg-[#0a0a0a] text-gray-300"
                >
                  {t("filters.yearNewest")}
                </option>
                <option value="year-asc" className="bg-[#0a0a0a] text-gray-300">
                  {t("filters.yearOldest")}
                </option>
                <option
                  value="title-asc"
                  className="bg-[#0a0a0a] text-gray-300"
                >
                  {t("filters.titleAsc")}
                </option>
                <option
                  value="title-desc"
                  className="bg-[#0a0a0a] text-gray-300"
                >
                  {t("filters.titleDesc")}
                </option>
                <option value="newest" className="bg-[#0a0a0a] text-gray-300">
                  {t("filters.addedLast")}
                </option>
                <option value="oldest" className="bg-[#0a0a0a] text-gray-300">
                  {t("filters.addedFirst")}
                </option>
              </select>

              <svg
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Year range */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-300">
              {t("filters.yearRange", {
                min: filters.yearRange[0],
                max: filters.yearRange[1],
              })}
            </label>
            <div className="space-y-2">
              <input
                type="range"
                min={1888}
                max={currentYear + 5}
                value={filters.yearRange[0]}
                onChange={(e) =>
                  updateFilters({
                    yearRange: [parseInt(e.target.value), filters.yearRange[1]],
                  })
                }
                className="w-full accent-[#6c47ff]"
              />
              <input
                type="range"
                min={1888}
                max={currentYear + 5}
                value={filters.yearRange[1]}
                onChange={(e) =>
                  updateFilters({
                    yearRange: [filters.yearRange[0], parseInt(e.target.value)],
                  })
                }
                className="w-full accent-[#06b6d4]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/*
 * This component provides a comprehensive filtering interface for movies.
 * It includes functionality for:
 * - Text search for titles, directors, and genres
 * - Genre filtering from available genres
 * - Sorting options (by year, title, date added)
 * - Year range selection with dual sliders
 * - Filter state management and reset capabilities
 */
