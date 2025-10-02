"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, MessageSquare, AlertCircle, Loader2, X } from "lucide-react";

interface ReviewFormProps {
  movieId: string;
}

export default function ReviewForm({ movieId }: ReviewFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const [formData, setFormData] = useState({
    reviewText: "",
    rating: 5,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/movies/${movieId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to post review");
      }

      setFormData({ reviewText: "", rating: 5 });
      setShowForm(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="w-full group bg-[#6c47ff] text-white rounded-xl px-8 py-4 font-semibold hover:bg-[#5639cc] transition-all duration-300 shadow-lg shadow-[#6c47ff]/25 hover:shadow-[#6c47ff]/40 mb-6 hover:-translate-y-0.5"
      >
        <span className="flex items-center justify-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Skriv en anmeldelse
        </span>
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-6 space-y-6"
    >
      {error && (
        <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/50 rounded-xl p-4 text-red-400 animate-in fade-in slide-in-from-top-2 duration-300">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
          <Star className="w-4 h-4 text-[#6c47ff]" />
          Din vurdering *
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setFormData({ ...formData, rating: star })}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="group transition-transform hover:scale-110"
            >
              <Star
                className={`w-10 h-10 transition-all ${
                  star <= (hoverRating || formData.rating)
                    ? "fill-yellow-500 text-yellow-500"
                    : "text-gray-700 hover:text-gray-600"
                }`}
              />
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-500">
          {formData.rating === 5 && "Fantastisk!"}
          {formData.rating === 4 && "Veldig bra"}
          {formData.rating === 3 && "Grei"}
          {formData.rating === 2 && "Svak"}
          {formData.rating === 1 && "Dårlig"}
        </p>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="reviewText"
          className="flex items-center gap-2 text-sm font-semibold text-gray-300"
        >
          <MessageSquare className="w-4 h-4 text-[#6c47ff]" />
          Din anmeldelse *
        </label>
        <textarea
          id="reviewText"
          required
          minLength={10}
          maxLength={2000}
          rows={6}
          value={formData.reviewText}
          onChange={(e) =>
            setFormData({ ...formData, reviewText: e.target.value })
          }
          className="w-full px-4 py-3 bg-gray-900/50 border border-gray-800 rounded-xl focus:ring-2 focus:ring-[#6c47ff] focus:border-transparent transition-all placeholder:text-gray-600 hover:border-gray-700 resize-none"
          placeholder="Del dine tanker om filmen..."
        />
        <p className="text-xs text-gray-500 text-right">
          {formData.reviewText.length}/2000 tegn
        </p>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-[#6c47ff] text-white rounded-xl px-8 py-4 font-semibold hover:bg-[#5639cc] transition-all duration-300 shadow-lg shadow-[#6c47ff]/25 hover:shadow-[#6c47ff]/40 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 disabled:hover:translate-y-0"
        >
          <span className="flex items-center justify-center gap-2">
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Publiserer...
              </>
            ) : (
              <>
                <MessageSquare className="w-5 h-5" />
                Publiser anmeldelse
              </>
            )}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setShowForm(false)}
          disabled={loading}
          className="px-8 py-4 border border-gray-800 rounded-xl font-semibold hover:bg-gray-900/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 disabled:hover:translate-y-0"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
}
