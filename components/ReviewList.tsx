// components/ReviewList.tsx
"use client";

import { Star, User, Calendar } from "lucide-react";
import DeleteButton from "./DeleteButton";
import type { Review } from "@/types";
import { useI18n, useT } from "@/components/I18nProvider";
import type { Locale } from "@/lib/i18n";

interface ReviewListProps {
  reviews: Review[];
  currentUserId?: string;
  movieId: string;
}

const localeMap: Record<Locale, string> = {
  en: "en",
  no: "nb-NO", // "no" er ikke gyldig BCP-47 – bruk nb-NO
  "es-MX": "es-MX",
  sw: "sw", // sw eller sw-TZ
  tr: "tr-TR",
  "zh-TW": "zh-TW",
};

export default function ReviewList({
  reviews,
  currentUserId,
  movieId,
}: ReviewListProps) {
  const { locale } = useI18n();
  const t = useT();
  const dateLocale = localeMap[locale] ?? "en";

  if (reviews.length === 0) {
    return (
      <div className="text-center py-16 border border-gray-800 rounded-xl bg-gray-900/30">
        <Star className="w-12 h-12 text-gray-700 mx-auto mb-4" />
        <p className="text-gray-400 text-lg">{t("reviews.noReviews")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => {
        const isOwner = currentUserId === review.userId;

        return (
          <div
            key={review._id}
            className="group border border-gray-800 rounded-xl p-6 bg-gradient-to-b from-gray-900/50 to-gray-900/20 hover:border-gray-700 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="p-2 rounded-lg bg-gray-800/50">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="font-semibold text-gray-200">
                    {review.reviewAuthor}
                  </p>
                  <p className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(review.createdAt).toLocaleDateString(dateLocale, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < review.rating
                        ? "fill-yellow-500 text-yellow-500"
                        : "text-gray-700"
                    }`}
                  />
                ))}
              </div>
            </div>

            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap mb-4">
              {review.reviewText}
            </p>

            {isOwner && (
              <div className="pt-4 border-t border-gray-800 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-sm text-[#6c47ff] font-medium">
                  <Star className="w-4 h-4" />
                  {t("reviews.yourReviewLabel")}
                </span>
                <DeleteButton
                  itemId={review._id}
                  itemType="review"
                  movieId={movieId}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/*
 * This component renders a list of movie reviews with user interactions.
 * Features:
 * - Displays review ratings, text, and metadata
 * - Shows author and timestamp for each review
 * - Empty state handling with placeholder
 * - Owner-specific actions (delete functionality)
 * - Star rating visualization
 * - Responsive layout for review cards
 */
