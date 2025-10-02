import Link from "next/link";
import { Movie } from "@/types";
import { Film, Clock } from "lucide-react";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link href={`/movies/${movie._id}`}>
      <div className="group relative border border-gray-800 rounded-2xl p-6 hover:border-[#6c47ff] transition-all duration-500 bg-gradient-to-br from-gray-900/80 via-gray-900/50 to-gray-900/30 backdrop-blur-sm hover:shadow-2xl hover:shadow-[#6c47ff]/30 hover:-translate-y-2 overflow-hidden">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#6c47ff]/0 via-[#06b6d4]/0 to-[#ec4899]/0 group-hover:from-[#6c47ff]/10 group-hover:via-[#06b6d4]/5 group-hover:to-[#ec4899]/10 rounded-2xl transition-all duration-500" />

        {/* Accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#6c47ff] via-[#06b6d4] to-[#ec4899] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#6c47ff]/20 to-[#6c47ff]/5 group-hover:from-[#6c47ff]/30 group-hover:to-[#06b6d4]/10 transition-all duration-300">
                <Film className="w-5 h-5 text-[#6c47ff] group-hover:text-[#06b6d4] transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold group-hover:bg-gradient-to-r group-hover:from-[#6c47ff] group-hover:to-[#06b6d4] group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 truncate">
                  {movie.title}
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  Regissert av{" "}
                  <span className="font-medium text-gray-300 group-hover:text-[#06b6d4] transition-colors">
                    {movie.director}
                  </span>
                </p>
              </div>
            </div>
            <span className="text-lg font-semibold text-gray-400 group-hover:text-[#ec4899] transition-colors ml-2">
              {movie.releaseYear}
            </span>
          </div>

          {movie.description && (
            <p className="text-sm text-gray-500 line-clamp-2 mb-4 group-hover:text-gray-400 transition-colors">
              {movie.description}
            </p>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-gray-800/80 to-gray-800/40 text-gray-300 border border-gray-700/50 group-hover:border-[#6c47ff]/50 group-hover:bg-gradient-to-r group-hover:from-[#6c47ff]/20 group-hover:to-[#06b6d4]/10 transition-all">
              {movie.genre}
            </span>
            {movie.runtime && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-gray-800/80 to-gray-800/40 text-gray-300 border border-gray-700/50 group-hover:border-[#ec4899]/50 group-hover:bg-gradient-to-r group-hover:from-[#ec4899]/20 group-hover:to-[#f59e0b]/10 transition-all">
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
