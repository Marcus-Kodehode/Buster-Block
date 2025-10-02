"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";

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
  const currentYear = new Date().getFullYear();
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    genre: "",
    sortBy: "newest",
    yearRange: [1888, currentYear + 5],
  });

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFilterChange(updated);
  };

  const resetFilters = () => {
    const defaultFilters: FilterState = {
      search: "",
      genre: "",
      sortBy: "newest",
      yearRange: [1888, currentYear + 5],
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  const hasActiveFilters =
    filters.search ||
    filters.genre ||
    filters.sortBy !== "newest" ||
    filters.yearRange[0] !== 1888 ||
    filters.yearRange[1] !== currentYear + 5;

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Søk etter tittel, regissør eller sjanger..."
          value={filters.search}
          onChange={(e) => updateFilters({ search: e.target.value })}
          className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-800 rounded-xl focus:ring-2 focus:ring-[#6c47ff] focus:border-transparent transition-all placeholder:text-gray-600 hover:border-gray-700"
        />
      </div>

      {/* Filter toggle button */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg hover:border-gray-700 transition-all"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filtre og sortering
        </button>

        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-gray-300 transition-colors"
          >
            <X className="w-4 h-4" />
            Nullstill
          </button>
        )}
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="border border-gray-800 rounded-xl p-6 bg-gray-900/30 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
          {/* Genre filter */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-300">
              Sjanger
            </label>
            <select
              value={filters.genre}
              onChange={(e) => updateFilters({ genre: e.target.value })}
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-gray-800 rounded-xl focus:ring-2 focus:ring-[#6c47ff] focus:border-transparent transition-all text-gray-300 cursor-pointer hover:border-gray-700"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 0.75rem center",
                backgroundSize: "1.5em 1.5em",
                paddingRight: "2.5rem",
              }}
            >
              <option value="" className="bg-[#0a0a0a] text-gray-300">
                Alle sjangere
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
          </div>

          {/* Sort by */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-300">
              Sorter etter
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) =>
                updateFilters({
                  sortBy: e.target.value as FilterState["sortBy"],
                })
              }
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-gray-800 rounded-xl focus:ring-2 focus:ring-[#6c47ff] focus:border-transparent transition-all text-gray-300 cursor-pointer hover:border-gray-700"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 0.75rem center",
                backgroundSize: "1.5em 1.5em",
                paddingRight: "2.5rem",
              }}
            >
              <option value="newest" className="bg-[#0a0a0a] text-gray-300">
                Nyeste først
              </option>
              <option value="oldest" className="bg-[#0a0a0a] text-gray-300">
                Eldste først
              </option>
              <option value="title-asc" className="bg-[#0a0a0a] text-gray-300">
                Tittel (A-Å)
              </option>
              <option value="title-desc" className="bg-[#0a0a0a] text-gray-300">
                Tittel (Å-A)
              </option>
              <option value="year-desc" className="bg-[#0a0a0a] text-gray-300">
                Utgivelsesår (nyest)
              </option>
              <option value="year-asc" className="bg-[#0a0a0a] text-gray-300">
                Utgivelsesår (eldst)
              </option>
            </select>
          </div>

          {/* Year range */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-300">
              Utgivelsesår: {filters.yearRange[0]} - {filters.yearRange[1]}
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
