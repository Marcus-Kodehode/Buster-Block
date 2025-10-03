/*
 * File: components/ReviewList.tsx
 * Location: Component for displaying, sorting and editing reviews (+ helpful)
 */

"use client";

import { useMemo, useState } from "react";
import type { Review } from "@/types";
import { Star, User, Calendar, Pencil, Check, X, Heart } from "lucide-react";
import DeleteButton from "./DeleteButton";
import { useRouter } from "next/navigation";
import { useT, useI18n } from "@/components/I18nProvider";

type SortKey = "newest" | "best" | "worst" | "mostHelpful" | "controversial";

type ReviewWithExtras = Review & {
  helpfulBy?: string[];
  helpfulCount?: number;
};

interface ReviewListProps {
  reviews: Review[];
  currentUserId?: string;
  movieId: string;
}

const DATE_LOCALES: Record<string, string> = {
  en: "en-US",
  no: "nb-NO",
  "es-MX": "es-MX",
  sw: "sw",
  tr: "tr",
  "zh-TW": "zh-TW",
};

export default function ReviewList({
  reviews,
  currentUserId,
  movieId,
}: ReviewListProps) {
  const router = useRouter();
  const t = useT();
  const { locale } = useI18n();

  const [sortBy, setSortBy] = useState<SortKey>("newest");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [editRating, setEditRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [saving, setSaving] = useState(false);
  const [helpfulLoading, setHelpfulLoading] = useState<string | null>(null);

  const avgRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  }, [reviews]);

  const sorted: ReviewWithExtras[] = useMemo(() => {
    const base: ReviewWithExtras[] = reviews.map((r) => ({
      ...r,
      helpfulBy: Array.isArray((r as Partial<ReviewWithExtras>).helpfulBy)
        ? (r as ReviewWithExtras).helpfulBy
        : [],
      helpfulCount:
        typeof (r as Partial<ReviewWithExtras>).helpfulCount === "number"
          ? (r as ReviewWithExtras).helpfulCount
          : 0,
    }));

    switch (sortBy) {
      case "newest":
        return [...base].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "best":
        return [...base].sort((a, b) => b.rating - a.rating);
      case "worst":
        return [...base].sort((a, b) => a.rating - b.rating);
      case "mostHelpful":
        return [...base].sort(
          (a, b) => (b.helpfulCount ?? 0) - (a.helpfulCount ?? 0)
        );
      case "controversial":
        return [...base].sort(
          (a, b) =>
            Math.abs(b.rating - avgRating) - Math.abs(a.rating - avgRating)
        );
      default:
        return base;
    }
  }, [reviews, sortBy, avgRating]);

  function startEdit(r: Review) {
    setEditingId(r._id);
    setEditText(r.reviewText);
    setEditRating(r.rating);
  }

  async function saveEdit(id: string) {
    try {
      setSaving(true);
      const res = await fetch(`/api/movies/${movieId}/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewText: editText, rating: editRating }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed");
      setEditingId(null);
      router.refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  async function toggleHelpful(id: string) {
    try {
      setHelpfulLoading(id);
      const res = await fetch(`/api/movies/${movieId}/reviews/${id}/helpful`, {
        method: "POST",
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed");
      router.refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setHelpfulLoading(null);
    }
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-16 border border-gray-800 rounded-xl bg-gray-900/30">
        <Star className="w-12 h-12 text-gray-700 mx-auto mb-4" />
        <p className="text-gray-400 text-lg">{t("reviews.noReviews")}</p>
      </div>
    );
  }

  const localeCode = DATE_LOCALES[locale] ?? "en-US";

  return (
    <div className="space-y-4">
      {/* Sort controls */}
      <div className="flex items-center gap-3">
        <label className="text-sm text-gray-400">{t("reviews.sortBy")}</label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortKey)}
          className="px-3 py-2 rounded-lg bg-gray-900/50 border border-gray-800 text-sm"
        >
          <option value="newest">{t("reviews.sortNewest")}</option>
          <option value="best">{t("reviews.sortBest")}</option>
          <option value="worst">{t("reviews.sortWorst")}</option>
          <option value="mostHelpful">{t("reviews.sortHelpful")}</option>
          <option value="controversial">
            {t("reviews.sortControversial")}
          </option>
        </select>
      </div>

      {sorted.map((review) => {
        const isOwner = currentUserId === review.userId;
        const likedByUser = (review.helpfulBy ?? []).includes(
          currentUserId ?? ""
        );

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
                    {new Date(review.createdAt).toLocaleDateString(localeCode, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {/* Rating stars */}
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

            {/* Edit mode */}
            {editingId === review._id ? (
              <div className="space-y-3">
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setEditRating(n)}
                      onMouseEnter={() => setHoverRating(n)}
                      onMouseLeave={() => setHoverRating(0)}
                    >
                      <Star
                        className={`w-7 h-7 ${
                          n <= (hoverRating || editRating)
                            ? "fill-yellow-500 text-yellow-500"
                            : "text-gray-700"
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <textarea
                  rows={5}
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-800 rounded-xl focus:ring-2 focus:ring-[#6c47ff] focus:border-transparent"
                />

                <div className="flex gap-2">
                  <button
                    onClick={() => saveEdit(review._id)}
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#6c47ff] text-white disabled:opacity-50"
                  >
                    <Check className="w-4 h-4" />
                    {t("common.save")}
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-700"
                  >
                    <X className="w-4 h-4" />
                    {t("common.cancel")}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap mb-4">
                  {review.reviewText}
                </p>

                <div className="pt-4 border-t border-gray-800 flex items-center justify-between gap-3">
                  <button
                    onClick={() => toggleHelpful(review._id)}
                    disabled={helpfulLoading === review._id}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${
                      likedByUser
                        ? "border-pink-500/50 bg-pink-500/10 text-pink-300"
                        : "border-gray-700 hover:bg-gray-800"
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        likedByUser ? "fill-pink-500 text-pink-500" : ""
                      }`}
                    />
                    {(review.helpfulCount ?? 0).toString()}
                  </button>

                  <div className="flex items-center gap-2">
                    {isOwner && (
                      <button
                        onClick={() => startEdit(review)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-700 hover:bg-gray-800"
                      >
                        <Pencil className="w-4 h-4" />
                        {t("common.edit")}
                      </button>
                    )}
                    {isOwner && (
                      <DeleteButton
                        itemId={review._id}
                        itemType="review"
                        movieId={movieId}
                      />
                    )}
                  </div>
                </div>
              </>
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
