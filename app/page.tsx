import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import MovieCard from "@/components/MovieCard";
import connectDB from "@/lib/mongodb";
import Movie from "@/lib/models/Movie";
import type { Movie as MovieType } from "@/types";
import { Film, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { userId } = await auth();

  let movies: MovieType[] = [];

  try {
    await connectDB();
    const rawMovies = await Movie.find({}).sort({ createdAt: -1 });

    movies = rawMovies.map((movie) => ({
      _id: movie._id.toString(),
      title: movie.title,
      director: movie.director,
      releaseYear: movie.releaseYear,
      genre: movie.genre,
      description: movie.description,
      runtime: movie.runtime,
      createdBy: movie.createdBy,
      createdAt: movie.createdAt.toISOString(),
      updatedAt: movie.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching movies:", error);
  }

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div className="space-y-3">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-[#06b6d4] to-[#ec4899] bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-3 duration-700">
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
            className="relative group bg-gradient-to-r from-[#6c47ff] to-[#06b6d4] text-white rounded-xl px-8 py-4 font-semibold hover:shadow-2xl hover:shadow-[#6c47ff]/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#06b6d4] to-[#ec4899] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative flex items-center gap-2">
              <Film className="w-5 h-5" />
              Legg til film
            </span>
          </Link>
        )}
      </div>

      {movies.length === 0 ? (
        <div className="relative text-center py-20 border border-gray-800 rounded-2xl bg-gradient-to-br from-gray-900/50 via-[#6c47ff]/5 to-gray-900/50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#6c47ff]/5 via-transparent to-[#06b6d4]/5 animate-pulse" />
          <div className="relative">
            <Film className="w-16 h-16 text-[#6c47ff] mx-auto mb-4 opacity-50" />
            <p className="text-gray-400 text-lg mb-6">
              Ingen filmer lagt til ennå
            </p>
            {userId && (
              <Link
                href="/movies/new"
                className="inline-block bg-gradient-to-r from-[#6c47ff] to-[#06b6d4] bg-clip-text text-transparent font-semibold text-lg hover:from-[#06b6d4] hover:to-[#ec4899] transition-all"
              >
                Bli den første til å legge til en film →
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}
