/*
 * File: app/HomeClient.tsx
 * Location: Client-side component for the home page with movie listing and filtering
 */

"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import MovieCard from "@/components/MovieCard";
import MovieFilters, { FilterState } from "@/components/MovieFilters";
import type { Movie } from "@/types";
import type { ReviewStats, OverallStats } from "@/types";
import { Film, Sparkles, Star, MessageSquare } from "lucide-react";

// i18n
import { useI18n, useT } from "@/components/I18nProvider";

interface HomeClientProps {
  movies: Movie[];
  userId: string | null;
  perMovie?: ReviewStats[];
  overall?: OverallStats;
}

export default function HomeClient({
  movies,
  userId,
  perMovie = [],
  overall,
}: HomeClientProps) {
  const { locale } = useI18n();
  const t = useT();

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    genre: "",
    sortBy: "newest",
    yearRange: [1888, new Date().getFullYear() + 5],
  });

  const availableGenres = useMemo(() => {
    const genres = new Set(movies.map((m) => m.genre));
    return Array.from(genres).sort((a, b) => a.localeCompare(b, locale));
  }, [movies, locale]);

  const filteredMovies = useMemo(() => {
    let result = [...movies];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (movie) =>
          movie.title.toLowerCase().includes(q) ||
          movie.director.toLowerCase().includes(q) ||
          movie.genre.toLowerCase().includes(q)
      );
    }

    if (filters.genre) {
      result = result.filter((movie) => movie.genre === filters.genre);
    }

    result = result.filter(
      (movie) =>
        movie.releaseYear >= filters.yearRange[0] &&
        movie.releaseYear <= filters.yearRange[1]
    );

    switch (filters.sortBy) {
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "oldest":
        result.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case "title-asc":
        result.sort((a, b) => a.title.localeCompare(b.title, locale));
        break;
      case "title-desc":
        result.sort((a, b) => b.title.localeCompare(a.title, locale));
        break;
      case "year-desc":
        result.sort((a, b) => b.releaseYear - a.releaseYear);
        break;
      case "year-asc":
        result.sort((a, b) => a.releaseYear - b.releaseYear);
        break;
    }

    return result;
  }, [movies, filters, locale]);

  // Map med pr-film stats for rask tilgang i MovieCard
  const statsMap = useMemo(() => {
    const m = new Map<string, ReviewStats>();
    perMovie.forEach((s) => m.set(s.movieId, s));
    return m;
  }, [perMovie]);

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div className="space-y-3">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-[#06b6d4] to-[#ec4899] bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-3 duration-700 pb-2">
            {t("home.title")}
          </h1>
          <p className="text-gray-400 text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#06b6d4]" />
            {t("common.tagline")}
          </p>
        </div>

        {userId && (
          <Link
            href="/movies/new"
            className="relative group bg-gradient-to-r from-[#1e40af] to-[#1e3a8a] text-white rounded-xl px-8 py-4 font-semibold hover:shadow-2xl hover:shadow-[#1e40af]/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#1e3a8a] to-[#1e40af] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative flex items-center gap-2">
              <Film className="w-5 h-5" />
              {t("home.addMovie")}
            </span>
          </Link>
        )}
      </div>

      {/* Stats-panel */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="border border-gray-800 rounded-xl p-4 bg-gray-900/40">
          <div className="text-sm text-gray-500">{t("home.title")}</div>
          <div className="text-2xl font-bold mt-1">
            {overall?.totalMovies ?? movies.length}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {t("home.showing", { count: movies.length, total: movies.length })}
          </div>
        </div>
        <div className="border border-gray-800 rounded-xl p-4 bg-gray-900/40">
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#06b6d4]" />{" "}
            {t("reviews.title")}
          </div>
          <div className="text-2xl font-bold mt-1">
            {overall?.totalReviews ?? 0}
          </div>
          <div className="text-xs text-gray-500 mt-1"> </div>
        </div>
        <div className="border border-gray-800 rounded-xl p-4 bg-gray-900/40">
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500" /> Avg
          </div>
          <div className="text-2xl font-bold mt-1">
            {overall?.avgRating ?? "–"}
          </div>
          <div className="text-xs text-gray-500 mt-1">/ 5</div>
        </div>
      </div>

      {movies.length === 0 ? (
        <div className="relative text-center py-20 border border-gray-800 rounded-2xl bg-gradient-to-br from-gray-900/50 via-[#1e40af]/5 to-gray-900/50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#1e40af]/5 via-transparent to-[#fbbf24]/5 animate-pulse" />
          <div className="relative">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <Image
                src="/logo.png"
                alt="Buster Block"
                fill
                className="object-contain opacity-50"
              />
            </div>
            <p className="text-gray-400 text-lg mb-6">{t("home.noMovies")}</p>
            {userId && (
              <Link
                href="/movies/new"
                className="inline-block bg-gradient-to-r from-[#1e40af] to-[#fbbf24] bg-clip-text text-transparent font-semibold text-lg hover:from-[#fbbf24] hover:to-[#1e40af] transition-all"
              >
                {t("home.beFirst")}
              </Link>
            )}
          </div>
        </div>
      ) : (
        <>
          <MovieFilters
            onFilterChange={setFilters}
            availableGenres={availableGenres}
          />

          {filteredMovies.length === 0 ? (
            <div className="text-center py-16 border border-gray-800 rounded-xl bg-gray-900/30">
              <p className="text-gray-400 text-lg">{t("home.noMatches")}</p>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-500 mb-4">
                {t("home.showing", {
                  count: filteredMovies.length,
                  total: movies.length,
                })}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMovies.map((movie) => (
                  <MovieCard
                    key={movie._id}
                    movie={movie}
                    stats={statsMap.get(movie._id) || undefined}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/*
 * This client component handles:
 * - Movie filtering and sorting functionality
 * - Display of movie grid with responsive layout
 * - Genre extraction and filtering options
 * - Empty state handling
 * - Movie count display
 * - Integration with MovieCard and MovieFilters components
 * - Add movie button for authenticated users
 */
