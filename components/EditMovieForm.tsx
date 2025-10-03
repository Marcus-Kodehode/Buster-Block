/*
 * File: components/EditMovieForm.tsx
 * Location: Client-side form component for editing existing movies
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UpdateMovieInput } from "@/lib/validations/movieSchema";
import {
  Film,
  Calendar,
  User,
  Tag,
  AlertCircle,
  Loader2,
  FileText,
  Clock,
} from "lucide-react";
import type { Movie } from "@/types";
import { useT } from "@/components/I18nProvider";

// ---- Supported genres (must match your CSS tokens) -------------------------
const GENRES = [
  "Action",
  "Animation",
  "Comedy",
  "Documentary",
  "Drama",
  "Fantasy",
  "Horror",
  "Romance",
  "Sci-Fi",
  "Thriller",
] as const;

type Genre = (typeof GENRES)[number];
const isGenre = (v: string): v is Genre =>
  (GENRES as readonly string[]).includes(v);

// ----------------------------------------------------------------------------

interface EditMovieFormProps {
  movie: Movie;
}

export default function EditMovieForm({ movie }: EditMovieFormProps) {
  const t = useT();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Ensure we always start with a valid genre (locked dropdown)
  const safeGenre: Genre = isGenre(movie.genre) ? movie.genre : GENRES[0];

  const [formData, setFormData] = useState<UpdateMovieInput>({
    title: movie.title,
    director: movie.director,
    releaseYear: movie.releaseYear,
    genre: safeGenre,
    description: movie.description || "",
    runtime: movie.runtime,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/movies/${movie._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!data.success)
        throw new Error(data.error || t("editForm.errorGeneric"));

      router.push(`/movies/${movie._id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("editForm.errorGeneric"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/50 rounded-xl p-4 text-red-400">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Title */}
      <div className="space-y-2">
        <label
          htmlFor="title"
          className="flex items-center gap-2 text-sm font-semibold text-gray-300"
        >
          <Film className="w-4 h-4 text-[#6c47ff]" />
          {t("editForm.titleLabel")} *
        </label>
        <input
          type="text"
          id="title"
          required
          maxLength={200}
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-3 bg-gray-900/50 border border-gray-800 rounded-xl focus:ring-2 focus:ring-[#6c47ff] focus:border-transparent placeholder:text-gray-600 hover:border-gray-700"
          placeholder={t("editForm.titlePlaceholder")}
        />
      </div>

      {/* Director */}
      <div className="space-y-2">
        <label
          htmlFor="director"
          className="flex items-center gap-2 text-sm font-semibold text-gray-300"
        >
          <User className="w-4 h-4 text-[#6c47ff]" />
          {t("editForm.directorLabel")} *
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
          className="w-full px-4 py-3 bg-gray-900/50 border border-gray-800 rounded-xl focus:ring-2 focus:ring-[#6c47ff] focus:border-transparent placeholder:text-gray-600 hover:border-gray-700"
          placeholder={t("editForm.directorPlaceholder")}
        />
      </div>

      {/* Year + Runtime */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label
            htmlFor="releaseYear"
            className="flex items-center gap-2 text-sm font-semibold text-gray-300"
          >
            <Calendar className="w-4 h-4 text-[#6c47ff]" />
            {t("editForm.yearLabel")} *
          </label>
          <input
            type="number"
            id="releaseYear"
            required
            min={1888}
            max={new Date().getFullYear() + 5}
            value={formData.releaseYear}
            onChange={(e) =>
              setFormData({
                ...formData,
                releaseYear: parseInt(e.target.value),
              })
            }
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-800 rounded-xl focus:ring-2 focus:ring-[#6c47ff] focus:border-transparent placeholder:text-gray-600 hover:border-gray-700"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="runtime"
            className="flex items-center gap-2 text-sm font-semibold text-gray-300"
          >
            <Clock className="w-4 h-4 text-[#6c47ff]" />
            {t("editForm.runtimeLabel")}
          </label>
          <input
            type="number"
            id="runtime"
            min={1}
            max={1000}
            value={formData.runtime ?? ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                runtime: e.target.value ? parseInt(e.target.value) : undefined,
              })
            }
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-800 rounded-xl focus:ring-2 focus:ring-[#6c47ff] focus:border-transparent placeholder:text-gray-600 hover:border-gray-700"
            placeholder={t("editForm.runtimePlaceholder")}
          />
        </div>
      </div>

      {/* Genre (LOCKED dropdown) */}
      <div className="space-y-2">
        <label
          htmlFor="genre"
          className="flex items-center gap-2 text-sm font-semibold text-gray-300"
        >
          <Tag className="w-4 h-4 text-[#6c47ff]" />
          {t("editForm.genreLabel")} *
        </label>

        <div className="relative">
          <select
            id="genre"
            required
            // fallback til første støttede sjanger om lagret verdi ikke finnes i listen
            value={
              GENRES.includes(formData.genre as Genre)
                ? formData.genre
                : GENRES[0]
            }
            onChange={(e) =>
              setFormData({ ...formData, genre: e.target.value as Genre })
            }
            className="w-full appearance-none pr-10 px-4 py-3 bg-[#0a0a0a] border border-gray-800 rounded-xl focus:ring-2 focus:ring-[#6c47ff] focus:border-transparent transition-all text-gray-300 cursor-pointer hover:border-gray-700"
          >
            {GENRES.map((g) => (
              <option key={g} value={g} className="bg-[#0a0a0a] text-gray-300">
                {g}
              </option>
            ))}
          </select>

          {/* vår egen chevron (hindrer «dobbel pil») */}
          <svg
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label
          htmlFor="description"
          className="flex items-center gap-2 text-sm font-semibold text-gray-300"
        >
          <FileText className="w-4 h-4 text-[#6c47ff]" />
          {t("editForm.descriptionLabel")}
        </label>
        <textarea
          id="description"
          maxLength={500}
          rows={4}
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="w-full px-4 py-3 bg-gray-900/50 border border-gray-800 rounded-xl focus:ring-2 focus:ring-[#6c47ff] focus:border-transparent placeholder:text-gray-600 hover:border-gray-700 resize-none"
          placeholder={t("editForm.descriptionPlaceholder")}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 relative group bg-[#6c47ff] text-white rounded-xl px-8 py-4 font-semibold hover:bg-[#5639cc] transition-all duration-300 shadow-lg shadow-[#6c47ff]/25 hover:shadow-[#6c47ff]/40 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="flex items-center justify-center gap-2">
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {t("editForm.submitting")}
              </>
            ) : (
              <>
                <Film className="w-5 h-5" />
                {t("editForm.submit")}
              </>
            )}
          </span>
        </button>

        <button
          type="button"
          onClick={() => router.back()}
          disabled={loading}
          className="px-8 py-4 border border-gray-800 rounded-xl font-semibold hover:bg-gray-900/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t("common.cancel")}
        </button>
      </div>
    </form>
  );
}

/*
 * This component provides a form for editing existing movie entries.
 * Features:
 * - Pre-filled form with existing movie data
 * - Real-time validation and error handling
 * - Loading states during submission
 * - Character count for description
 * - Client-side validation before submission
 * - Responsive form layout with animated feedback
 * - Navigation handling (back button)
 */
