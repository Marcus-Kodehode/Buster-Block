/*
 * File: components/MovieCard.tsx
 * Location: Reusable component for displaying movie information in a card format
 */

import Link from "next/link";
import { Movie } from "@/types";
import { Film, Clock } from "lucide-react";
import { useT } from "@/components/I18nProvider"; // 👈

interface MovieCardProps {
  movie: Movie;
}

function genreSlug(genre?: string) {
  if (!genre) return "default";
  return genre.trim().toLowerCase().replace(/\s+/g, "-");
}

export default function MovieCard({ movie }: MovieCardProps) {
  const t = useT(); // 👈
  const slug = genreSlug(movie.genre);

  return (
    <Link href={`/movies/${movie._id}`}>
      <div
        className="movie-card group relative rounded-2xl p-6 overflow-hidden backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl min-h-[280px] flex flex-col"
        data-genre={slug}
      >
        {/* Overlays */}
        <div className="overlay absolute inset-0 rounded-2xl pointer-events-none" />
        <div className="accent-line absolute top-0 left-0 right-0 h-1" />

        {/* Content */}
        <div className="content flex-1 flex flex-col">
          <div className="flex items-start gap-3 mb-4">
            <div className="icon-wrap p-2.5 rounded-xl transition-all duration-300 flex-shrink-0">
              <Film className="icon w-5 h-5 transition-colors" />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="title text-xl font-bold line-clamp-2 leading-tight transition-all duration-300 group-hover:bg-clip-text group-hover:text-transparent mb-2">
                {movie.title}
              </h3>

              <p className="text-sm text-gray-400 truncate">
                {t("movie.directedBy")}{" "}
                <span className="director font-medium text-gray-300 transition-colors">
                  {movie.director}
                </span>
              </p>
            </div>

            <span className="year flex-shrink-0 text-base font-semibold text-gray-400 transition-colors">
              {movie.releaseYear}
            </span>
          </div>

          {movie.description && (
            <p className="desc text-sm text-gray-500 line-clamp-3 mb-4 leading-relaxed group-hover:text-gray-400 transition-colors flex-1">
              {movie.description}
            </p>
          )}

          <div className="flex items-center gap-2 mt-auto">
            <span className="badge inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap">
              {movie.genre}
            </span>

            {movie.runtime && (
              <span className="runtime-badge inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap">
                <Clock className="w-3 h-3 flex-shrink-0" />
                {movie.runtime}
                {t("movie.minutes")}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

/*
 * This component renders a movie card with a consistent layout, including:
 * - Movie title and year
 * - Description with line clamping
 * - Genre badge
 * - Runtime information
 * - Interactive hover effects and animations
 * - Links to individual movie pages
 */
