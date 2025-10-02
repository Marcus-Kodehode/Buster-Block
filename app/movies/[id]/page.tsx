import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import ReviewList from "@/components/ReviewList";
import ReviewForm from "@/components/ReviewForm";
import connectDB from "@/lib/mongodb";
import Movie from "@/lib/models/Movie";
import Review from "@/lib/models/Review";
import type { Movie as MovieType, Review as ReviewType } from "@/types";
import { Clock, Calendar, User, Tag, ArrowLeft } from "lucide-react";

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
      description: rawMovie.description,
      runtime: rawMovie.runtime,
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
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-[#6c47ff] hover:text-[#5639cc] transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Tilbake til alle filmer
      </Link>

      <div className="border border-gray-800 rounded-2xl p-8 bg-gradient-to-b from-gray-900/50 to-gray-900/20">
        <div className="flex items-start justify-between mb-6">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent">
            {movie.title}
          </h1>
          <span className="flex items-center gap-2 text-2xl text-gray-400 font-semibold">
            <Calendar className="w-6 h-6" />
            {movie.releaseYear}
          </span>
        </div>

        <div className="flex items-center gap-2 text-lg text-gray-400 mb-6">
          <User className="w-5 h-5 text-[#6c47ff]" />
          <span>
            Regissert av{" "}
            <span className="font-semibold text-gray-300">
              {movie.director}
            </span>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800/50 text-gray-300 border border-gray-700/50">
            <Tag className="w-4 h-4 text-[#6c47ff]" />
            {movie.genre}
          </span>

          {movie.runtime && (
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800/50 text-gray-300 border border-gray-700/50">
              <Clock className="w-4 h-4 text-[#6c47ff]" />
              {movie.runtime} min
            </span>
          )}
        </div>

        {movie.description && (
          <div className="mt-6 pt-6 border-t border-gray-800">
            <p className="text-gray-300 text-lg leading-relaxed">
              {movie.description}
            </p>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-3xl font-bold mb-6">
          Anmeldelser ({reviews.length})
        </h2>

        {userId ? (
          <ReviewForm movieId={id} />
        ) : (
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 text-center mb-6">
            <p className="text-gray-400 text-lg">
              <Link
                href="/sign-in"
                className="text-[#6c47ff] hover:text-[#5639cc] font-semibold transition-colors"
              >
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
