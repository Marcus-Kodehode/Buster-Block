import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import Movie from "@/lib/models/Movie";
import Review from "@/lib/models/Review";
import type { Movie as MovieType } from "@/types";
import type { ReviewStats, OverallStats } from "@/types";
import HomeClient from "./HomeClient";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { userId } = await auth();

  let movies: MovieType[] = [];
  let perMovie: ReviewStats[] = [];
  let overall: OverallStats = {
    totalMovies: 0,
    totalReviews: 0,
    avgRating: null,
  };

  try {
    await connectDB();

    const rawMovies = await Movie.find({}).sort({ createdAt: -1 });
    movies = rawMovies.map((m) => ({
      _id: m._id.toString(),
      title: m.title,
      director: m.director,
      releaseYear: m.releaseYear,
      genre: m.genre,
      description: m.description,
      runtime: m.runtime,
      createdBy: m.createdBy,
      createdAt: m.createdAt.toISOString(),
      updatedAt: m.updatedAt.toISOString(),
    }));

    // pr. film
    const perMovieAgg = await Review.aggregate([
      {
        $group: {
          _id: "$movieId",
          reviewCount: { $count: {} },
          avgRating: { $avg: "$rating" },
        },
      },
    ]);

    perMovie = perMovieAgg.map((r) => ({
      movieId: r._id.toString(),
      reviewCount: r.reviewCount,
      avgRating:
        typeof r.avgRating === "number" ? Number(r.avgRating.toFixed(2)) : null,
    }));

    // totaler
    const overallAgg = await Review.aggregate([
      {
        $group: {
          _id: null,
          totalReviews: { $count: {} },
          avgRating: { $avg: "$rating" },
        },
      },
      { $project: { _id: 0, totalReviews: 1, avgRating: 1 } },
    ]);

    overall = {
      totalMovies: movies.length,
      totalReviews: overallAgg[0]?.totalReviews ?? 0,
      avgRating:
        overallAgg[0]?.avgRating != null
          ? Number(overallAgg[0].avgRating.toFixed(2))
          : null,
    };
  } catch (e) {
    console.error("Error fetching movies/stats:", e);
  }

  return (
    <HomeClient
      movies={movies}
      userId={userId}
      perMovie={perMovie}
      overall={overall}
    />
  );
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
