import Link from "next/link";
import { Movie } from "@/types";
import { Film, Clock } from "lucide-react";

interface MovieCardProps {
  movie: Movie;
}

/** Normaliserer sjanger-string til en trygg slug */
function genreSlug(genre?: string) {
  if (!genre) return "default";
  return genre.trim().toLowerCase().replace(/\s+/g, "-");
}

export default function MovieCard({ movie }: MovieCardProps) {
  const slug = genreSlug(movie.genre);

  return (
    <Link href={`/movies/${movie._id}`}>
      <div
        className={[
          "movie-card group relative rounded-2xl p-6 overflow-hidden backdrop-blur-sm",
          // Base layout utilities du allerede brukte
          "transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl",
        ].join(" ")}
        data-genre={slug}
        title={`${movie.title} (${movie.releaseYear})`}
      >
        {/* Animated gradient overlay (styres av CSS variabler per sjanger) */}
        <div className="overlay absolute inset-0 rounded-2xl pointer-events-none" />

        {/* Accent line */}
        <div className="accent-line absolute top-0 left-0 right-0 h-1" />

        <div className="relative">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="icon-wrap p-2.5 rounded-xl transition-all duration-300">
                <Film className="icon w-5 h-5 transition-colors" />
              </div>

              <div className="flex-1 min-w-0">
                <h3
                  className="title text-xl font-bold truncate transition-all duration-300
                             group-hover:bg-clip-text group-hover:text-transparent"
                >
                  {movie.title}
                </h3>

                <p className="text-sm text-gray-400 mt-1">
                  Regissert av{" "}
                  <span className="director font-medium text-gray-300">
                    {movie.director}
                  </span>
                </p>
              </div>
            </div>

            <span className="year text-lg font-semibold text-gray-400 ml-2">
              {movie.releaseYear}
            </span>
          </div>

          {movie.description && (
            <p className="desc text-sm text-gray-500 line-clamp-2 mb-4 group-hover:text-gray-400 transition-colors">
              {movie.description}
            </p>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            <span className="badge inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-all">
              {movie.genre}
            </span>

            {movie.runtime && (
              <span className="runtime-badge inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all">
                <Clock className="w-3 h-3" />
                {movie.runtime}min
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
