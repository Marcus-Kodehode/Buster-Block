import Link from "next/link";
import { Movie } from "@/types";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link href={`/movies/${movie._id}`}>
      <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:border-[#6c47ff] hover:shadow-lg transition group">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold group-hover:text-[#6c47ff] transition">
            {movie.title}
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {movie.releaseYear}
          </span>
        </div>

        <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
          Regissert av <span className="font-medium">{movie.director}</span>
        </p>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
            {movie.genre}
          </span>
        </div>
      </div>
    </Link>
  );
}
