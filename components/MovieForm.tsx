"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreateMovieInput } from "@/lib/validations/movieSchema";

export default function MovieForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<CreateMovieInput>({
    title: "",
    director: "",
    releaseYear: new Date().getFullYear(),
    genre: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to create movie");
      }

      router.push(`/movies/${data.data._id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-800 dark:text-red-200">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-2">
          Tittel *
        </label>
        <input
          type="text"
          id="title"
          required
          maxLength={200}
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[#6c47ff] focus:border-transparent bg-white dark:bg-gray-900"
          placeholder="F.eks. Inception"
        />
      </div>

      <div>
        <label htmlFor="director" className="block text-sm font-medium mb-2">
          Regissør *
        </label>
        <input
          type="text"
          id="director"
          required
          maxLength={100}
          value={formData.director}
          onChange={(e) =>
            setFormData({ ...formData, director: e.target.value })
          }
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[#6c47ff] focus:border-transparent bg-white dark:bg-gray-900"
          placeholder="F.eks. Christopher Nolan"
        />
      </div>

      <div>
        <label htmlFor="releaseYear" className="block text-sm font-medium mb-2">
          Utgivelsesår *
        </label>
        <input
          type="number"
          id="releaseYear"
          required
          min={1888}
          max={new Date().getFullYear() + 5}
          value={formData.releaseYear}
          onChange={(e) =>
            setFormData({ ...formData, releaseYear: parseInt(e.target.value) })
          }
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[#6c47ff] focus:border-transparent bg-white dark:bg-gray-900"
        />
      </div>

      <div>
        <label htmlFor="genre" className="block text-sm font-medium mb-2">
          Sjanger *
        </label>
        <input
          type="text"
          id="genre"
          required
          maxLength={50}
          value={formData.genre}
          onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[#6c47ff] focus:border-transparent bg-white dark:bg-gray-900"
          placeholder="F.eks. Sci-Fi, Action, Drama"
        />
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-[#6c47ff] text-white rounded-lg px-6 py-3 font-medium hover:bg-[#5639cc] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Legger til..." : "Legg til film"}
        </button>

        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition"
        >
          Avbryt
        </button>
      </div>
    </form>
  );
}
