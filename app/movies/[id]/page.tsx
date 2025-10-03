/*
 * File: app/movies/[id]/page.tsx
 * Location: Server-side page component for displaying individual movie details
 */

import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import ReviewList from "@/components/ReviewList";
import ReviewForm from "@/components/ReviewForm";
import DeleteButton from "@/components/DeleteButton";
import connectDB from "@/lib/mongodb";
import Movie from "@/lib/models/Movie";
import Review from "@/lib/models/Review";
import type { Movie as MovieType, Review as ReviewType } from "@/types";
import Breadcrumbs from "@/components/Breadcrumbs";
import {
  Clock,
  Calendar,
  User,
  Tag,
  ArrowLeft,
  Sparkles,
  Edit,
} from "lucide-react";

import { cookies } from "next/headers";
import {
  normalizeLocale,
  defaultLocale,
  loadMessages,
  createTranslator,
  type Locale,
} from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function MoviePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();
  const { id } = await params;

  // i18n (server)
  const cookieStore = await cookies();
  const raw = cookieStore.get("lang")?.value;
  const locale: Locale = normalizeLocale(raw) ?? defaultLocale;
  const messages = await loadMessages(locale);
  const t = createTranslator(messages);

  let movie: MovieType | null = null;
  let reviews: ReviewType[] = [];

  try {
    await connectDB();
    const rawMovie = await Movie.findById(id);
    if (!rawMovie) notFound();

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

      helpfulBy: Array.isArray(review.helpfulBy) ? review.helpfulBy : [],
      helpfulCount:
        typeof review.helpfulCount === "number"
          ? review.helpfulCount
          : Array.isArray(review.helpfulBy)
          ? review.helpfulBy.length
          : 0,
    }));
  } catch (error) {
    console.error("Error fetching movie data:", error);
    notFound();
  }

  const isOwner = userId === movie!.createdBy;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Breadcrumbs
        items={[
          { href: "/", label: t("nav.home") }, // legg til "nav.home" = "Home" i i18n
          { href: "/", label: t("home.title") }, // "Movie Reviews" / "Filmanmeldelser"
          { label: movie!.title },
        ]}
      />

      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-gradient-to-r from-[#6c47ff] to-[#06b6d4] bg-clip-text text-transparent hover:from-[#06b6d4] hover:to-[#ec4899] transition-all group font-semibold"
      >
        <ArrowLeft className="w-4 h-4 text-[#6c47ff] group-hover:-translate-x-1 transition-transform" />
        {t("movie.backToAll")}
      </Link>

      <div className="relative border border-gray-800 rounded-2xl p-8 bg-gradient-to-br from-gray-900/80 via-gray-900/50 to-gray-900/30 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#6c47ff]/5 via-transparent to-[#06b6d4]/5" />
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#6c47ff] via-[#06b6d4] to-[#ec4899]" />

        <div className="relative">
          <div className="flex items-start justify-between mb-6">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-[#06b6d4] to-[#ec4899] bg-clip-text text-transparent">
              {movie!.title}
            </h1>
            <span className="flex items-center gap-2 text-2xl font-semibold bg-gradient-to-r from-[#ec4899] to-[#f59e0b] bg-clip-text text-transparent">
              <Calendar className="w-6 h-6 text-[#ec4899]" />
              {movie!.releaseYear}
            </span>
          </div>

          <div className="flex items-center gap-2 text-lg text-gray-400 mb-6">
            <User className="w-5 h-5 text-[#06b6d4]" />
            <span>
              {t("movie.directedBy")}{" "}
              <span className="font-semibold bg-gradient-to-r from-gray-300 to-[#06b6d4] bg-clip-text text-transparent">
                {movie!.director}
              </span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#6c47ff]/20 to-[#6c47ff]/10 text-gray-300 border border-[#6c47ff]/50">
              <Tag className="w-4 h-4 text-[#6c47ff]" />
              {movie!.genre}
            </span>

            {movie!.runtime && (
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#ec4899]/20 to-[#f59e0b]/10 text-gray-300 border border-[#ec4899]/50">
                <Clock className="w-4 h-4 text-[#ec4899]" />
                {movie!.runtime} {t("movie.minutes")}
              </span>
            )}
          </div>

          {movie!.description && (
            <div className="mt-6 pt-6 border-t border-gray-800/50">
              <p className="text-gray-300 text-lg leading-relaxed">
                {movie!.description}
              </p>
            </div>
          )}

          {isOwner && (
            <div className="mt-6 pt-6 border-t border-gray-800/50 flex gap-3">
              <Link
                href={`/movies/${id}/edit`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#6c47ff]/20 border border-[#6c47ff]/50 text-[#6c47ff] rounded-lg hover:bg-[#6c47ff]/30 transition-all"
              >
                <Edit className="w-4 h-4" />
                {t("movie.edit")}
              </Link>
              <DeleteButton itemId={id} itemType="movie" />
            </div>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-[#06b6d4] bg-clip-text text-transparent mb-6 flex items-center gap-2">
          <Sparkles className="w-7 h-7 text-[#06b6d4]" />
          {t("reviews.titleWithCount", { count: reviews.length })}
        </h2>

        {userId ? (
          <ReviewForm movieId={id} />
        ) : (
          <div className="bg-gradient-to-br from-gray-900/50 via-[#6c47ff]/5 to-gray-900/50 border border-gray-800 rounded-xl p-8 text-center mb-6">
            <p className="text-gray-400 text-lg">
              <Link
                href="/sign-in"
                className="bg-gradient-to-r from-[#6c47ff] to-[#06b6d4] bg-clip-text text-transparent font-semibold hover:from-[#06b6d4] hover:to-[#ec4899] transition-all"
              >
                {t("nav.signIn")}
              </Link>{" "}
              {t("reviews.loginToReview")}
            </p>
          </div>
        )}

        <ReviewList
          reviews={reviews}
          currentUserId={userId || undefined}
          movieId={id}
        />
      </div>
    </div>
  );
}

/*
 * This server component handles:
 * - Fetching detailed movie information by ID
 * - Loading associated reviews
 * - Authentication state verification
 * - Owner-specific actions (edit/delete)
 * - Review submission interface
 * - Data transformation and formatting
 * - Not found state handling
 * - Error handling for database operations
 */
