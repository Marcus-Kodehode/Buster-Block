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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Filmanmeldelser</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Utforsk og del dine meninger om filmer
          </p>
        </div>

        {userId && (
          <Link
            href="/movies/new"
            className="bg-[#6c47ff] text-white rounded-lg px-6 py-3 font-medium hover:bg-[#5639cc] transition"
          >
            Legg til film
          </Link>
        )}
      </div>

      {movies.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">
            Ingen filmer lagt til ennå
          </p>
          {userId && (
            <Link
              href="/movies/new"
              className="text-[#6c47ff] hover:underline font-medium"
            >
              Bli den første til å legge til en film
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
