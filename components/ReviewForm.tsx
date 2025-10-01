"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ReviewFormProps {
  movieId: string;
}

export default function ReviewForm({ movieId }: ReviewFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

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
        className="w-full bg-[#6c47ff] text-white rounded-lg px-6 py-3 font-medium hover:bg-[#5639cc] transition mb-6"
      >
        Skriv en anmeldelse
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 mb-6 space-y-4"
    >
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-800 dark:text-red-200 text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="rating" className="block text-sm font-medium mb-2">
          Rating (1-5) *
        </label>
        <select
          id="rating"
          required
          value={formData.rating}
          onChange={(e) =>
            setFormData({ ...formData, rating: parseInt(e.target.value) })
          }
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[#6c47ff] focus:border-transparent bg-white dark:bg-gray-800"
        >
          <option value={5}>⭐⭐⭐⭐⭐ (5)</option>
          <option value={4}>⭐⭐⭐⭐ (4)</option>
          <option value={3}>⭐⭐⭐ (3)</option>
          <option value={2}>⭐⭐ (2)</option>
          <option value={1}>⭐ (1)</option>
        </select>
      </div>

      <div>
        <label htmlFor="reviewText" className="block text-sm font-medium mb-2">
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
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[#6c47ff] focus:border-transparent bg-white dark:bg-gray-800 resize-none"
          placeholder="Hva syntes du om filmen? (minimum 10 tegn)"
        />
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {formData.reviewText.length}/2000 tegn
        </p>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-[#6c47ff] text-white rounded-lg px-6 py-3 font-medium hover:bg-[#5639cc] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Publiserer..." : "Publiser anmeldelse"}
        </button>

        <button
          type="button"
          onClick={() => setShowForm(false)}
          className="px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition"
        >
          Avbryt
        </button>
      </div>
    </form>
  );
}
