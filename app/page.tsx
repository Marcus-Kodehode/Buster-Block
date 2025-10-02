/*
 * File: app/page.tsx
 * Location: Main page component (server-side) for the Buster Block application
 */

import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import Movie from "@/lib/models/Movie";
import type { Movie as MovieType } from "@/types";
import HomeClient from "./HomeClient";

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

  return <HomeClient movies={movies} userId={userId} />;
}

/*
 * This server component handles:
 * - Authentication state retrieval
 * - Database connection
 * - Fetching all movies from the database
 * - Data transformation for client consumption
 * - Error handling for database operations
 * - Rendering the client-side home component
 */
