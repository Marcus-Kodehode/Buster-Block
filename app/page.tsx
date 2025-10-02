import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import MovieCard from "@/components/MovieCard";
import connectDB from "@/lib/mongodb";
import Movie from "@/lib/models/Movie";
import type { Movie as MovieType } from "@/types";

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
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent">
            Filmanmeldelser
          </h1>
          <p className="text-gray-400 text-lg">
            Utforsk og del dine meninger om filmer
          </p>
        </div>

        {userId && (
          <Link
            href="/movies/new"
            className="relative group bg-[#6c47ff] text-white rounded-xl px-8 py-4 font-semibold hover:bg-[#5639cc] transition-all duration-300 shadow-lg shadow-[#6c47ff]/25 hover:shadow-[#6c47ff]/40 hover:-translate-y-0.5"
          >
            Legg til film
          </Link>
        )}
      </div>

      {movies.length === 0 ? (
        <div className="text-center py-20 border border-gray-800 rounded-2xl bg-gradient-to-b from-gray-900/50 to-gray-900/20">
          <p className="text-gray-400 text-lg mb-6">
            Ingen filmer lagt til ennå
          </p>
          {userId && (
            <Link
              href="/movies/new"
              className="inline-block text-[#6c47ff] hover:text-[#5639cc] font-semibold text-lg hover:underline transition-colors"
            >
              Bli den første til å legge til en film →
            </Link>
          )}
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
