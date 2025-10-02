import Link from "next/link";
import { Movie } from "@/types";
import { Film } from "lucide-react";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link href={`/movies/${movie._id}`}>
      <div className="group relative border border-gray-800 rounded-xl p-6 hover:border-[#6c47ff] transition-all duration-300 bg-gradient-to-b from-gray-900/50 to-gray-900/20 backdrop-blur-sm hover:shadow-2xl hover:shadow-[#6c47ff]/20 hover:-translate-y-1">
        <div className="absolute inset-0 bg-gradient-to-br from-[#6c47ff]/0 to-[#6c47ff]/0 group-hover:from-[#6c47ff]/5 group-hover:to-transparent rounded-xl transition-all duration-300" />

        <div className="relative">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="p-2 rounded-lg bg-gray-800/50 group-hover:bg-[#6c47ff]/10 transition-colors">
                <Film className="w-5 h-5 text-gray-400 group-hover:text-[#6c47ff] transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold group-hover:text-[#6c47ff] transition-colors truncate">
                  {movie.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Regissert av{" "}
                  <span className="font-medium text-gray-300">
                    {movie.director}
                  </span>
                </p>
              </div>
            </div>
            <span className="text-lg font-semibold text-gray-400 group-hover:text-[#6c47ff] transition-colors ml-2">
              {movie.releaseYear}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gray-800/50 text-gray-300 border border-gray-700/50 group-hover:border-[#6c47ff]/50 group-hover:bg-[#6c47ff]/10 transition-all">
              {movie.genre}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
