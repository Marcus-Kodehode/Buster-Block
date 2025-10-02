import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import ReviewList from "@/components/ReviewList";
import ReviewForm from "@/components/ReviewForm";
import connectDB from "@/lib/mongodb";
import Movie from "@/lib/models/Movie";
import Review from "@/lib/models/Review";
import type { Movie as MovieType, Review as ReviewType } from "@/types";

export const dynamic = "force-dynamic";

export default async function MoviePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();
  const { id } = await params;

  let movie: MovieType | null = null;
  let reviews: ReviewType[] = [];

  try {
    await connectDB();
    const rawMovie = await Movie.findById(id);

    if (!rawMovie) {
      notFound();
    }

    movie = {
      _id: rawMovie._id.toString(),
      title: rawMovie.title,
      director: rawMovie.director,
      releaseYear: rawMovie.releaseYear,
      genre: rawMovie.genre,
      createdBy: rawMovie.createdBy,
      createdAt: rawMovie.createdAt.toISOString(),
      updatedAt: rawMovie.updatedAt.toISOString(),
    };

    const rawReviews = await Review.find({ movieId: id }).sort({
      createdAt: -1,
    });

    reviews = rawReviews.map((review) => ({
      _id: review._id.toString(),
      movieId: review.movieId.toString(),
      userId: review.userId,
      reviewAuthor: review.reviewAuthor,
      reviewText: review.reviewText,
      rating: review.rating,
      createdAt: review.createdAt.toISOString(),
      updatedAt: review.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching movie data:", error);
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Link href="/" className="text-[#6c47ff] hover:underline inline-block">
        ← Tilbake til alle filmer
      </Link>

      <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-8">
        <div className="flex items-start justify-between mb-4">
          <h1 className="text-4xl font-bold">{movie.title}</h1>
          <span className="text-2xl text-gray-500 dark:text-gray-400">
            {movie.releaseYear}
          </span>
        </div>

        <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
          Regissert av <span className="font-medium">{movie.director}</span>
        </p>

        <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
          {movie.genre}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">
          Anmeldelser ({reviews.length})
        </h2>

        {userId ? (
          <ReviewForm movieId={id} />
        ) : (
          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 text-center mb-6">
            <p className="text-gray-600 dark:text-gray-400">
              <Link href="/sign-in" className="text-[#6c47ff] hover:underline">
                Logg inn
              </Link>{" "}
              for å legge til en anmeldelse
            </p>
          </div>
        )}

        <ReviewList reviews={reviews} currentUserId={userId || undefined} />
      </div>
    </div>
  );
}
