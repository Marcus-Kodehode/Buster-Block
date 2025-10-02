"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import MovieCard from "@/components/MovieCard";
import MovieFilters, { FilterState } from "@/components/MovieFilters";
import type { Movie } from "@/types";
import { Film, Sparkles } from "lucide-react";

interface HomeClientProps {
  movies: Movie[];
  userId: string | null;
}

export default function HomeClient({ movies, userId }: HomeClientProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    genre: "",
    sortBy: "newest",
    yearRange: [1888, new Date().getFullYear() + 5],
  });

  const availableGenres = useMemo(() => {
    const genres = new Set(movies.map((m) => m.genre));
    return Array.from(genres).sort();
  }, [movies]);

  const filteredMovies = useMemo(() => {
    let result = [...movies];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (movie) =>
          movie.title.toLowerCase().includes(searchLower) ||
          movie.director.toLowerCase().includes(searchLower) ||
          movie.genre.toLowerCase().includes(searchLower)
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
        result.sort((a, b) => a.title.localeCompare(b.title, "no"));
        break;
      case "title-desc":
        result.sort((a, b) => b.title.localeCompare(a.title, "no"));
        break;
      case "year-desc":
        result.sort((a, b) => b.releaseYear - a.releaseYear);
        break;
      case "year-asc":
        result.sort((a, b) => a.releaseYear - b.releaseYear);
        break;
    }

    return result;
  }, [movies, filters]);

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div className="space-y-3">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-[#06b6d4] to-[#ec4899] bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-3 duration-700 pb-2">
            Filmanmeldelser
          </h1>
          <p className="text-gray-400 text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#06b6d4]" />
            Utforsk og del dine meninger om filmer
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
              Legg til film
            </span>
          </Link>
        )}
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
            <p className="text-gray-400 text-lg mb-6">
              Ingen filmer lagt til ennå
            </p>
            {userId && (
              <Link
                href="/movies/new"
                className="inline-block bg-gradient-to-r from-[#1e40af] to-[#fbbf24] bg-clip-text text-transparent font-semibold text-lg hover:from-[#fbbf24] hover:to-[#1e40af] transition-all"
              >
                Bli den første til å legge til en film →
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
              <p className="text-gray-400 text-lg">
                Ingen filmer matcher dine filtre
              </p>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-500 mb-4">
                Viser {filteredMovies.length} av {movies.length} filmer
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMovies.map((movie) => (
                  <MovieCard key={movie._id} movie={movie} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
