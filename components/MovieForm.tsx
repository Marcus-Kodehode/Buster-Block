// components/MovieForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreateMovieInput } from "@/lib/validations/movieSchema";
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
import { useT } from "@/components/I18nProvider"; // 👈

export default function MovieForm() {
  const t = useT(); // 👈
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<CreateMovieInput>({
    title: "",
    director: "",
    releaseYear: new Date().getFullYear(),
    genre: "",
    description: "",
    runtime: undefined,
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
        throw new Error(data.error || t("movieForm.errorGeneric")); // 👈 fallback i18n
      }

      router.push(`/movies/${data.data._id}`);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("movieForm.errorGeneric")
      );
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

      <div className="space-y-2">
        <label
          htmlFor="title"
          className="flex items-center gap-2 text-sm font-semibold text-gray-300"
        >
          <Film className="w-4 h-4 text-[#6c47ff]" />
          {t("movieForm.titleLabel")} *
        </label>
        <input
          type="text"
          id="title"
          required
          maxLength={200}
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-3 bg-gray-900/50 border border-gray-800 rounded-xl focus:ring-2 focus:ring-[#6c47ff] focus:border-transparent placeholder:text-gray-600 hover:border-gray-700"
          placeholder={t("movieForm.titlePlaceholder")}
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="director"
          className="flex items-center gap-2 text-sm font-semibold text-gray-300"
        >
          <User className="w-4 h-4 text-[#6c47ff]" />
          {t("movieForm.directorLabel")} *
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
          placeholder={t("movieForm.directorPlaceholder")}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label
            htmlFor="releaseYear"
            className="flex items-center gap-2 text-sm font-semibold text-gray-300"
          >
            <Calendar className="w-4 h-4 text-[#6c47ff]" />
            {t("movieForm.yearLabel")} *
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
            {t("movieForm.runtimeLabel")}
          </label>
          <input
            type="number"
            id="runtime"
            min={1}
            max={1000}
            value={formData.runtime || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                runtime: e.target.value ? parseInt(e.target.value) : undefined,
              })
            }
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-800 rounded-xl focus:ring-2 focus:ring-[#6c47ff] focus:border-transparent placeholder:text-gray-600 hover:border-gray-700"
            placeholder={t("movieForm.runtimePlaceholder")}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="genre"
          className="flex items-center gap-2 text-sm font-semibold text-gray-300"
        >
          <Tag className="w-4 h-4 text-[#6c47ff]" />
          {t("movieForm.genreLabel")} *
        </label>
        <input
          type="text"
          id="genre"
          required
          maxLength={50}
          value={formData.genre}
          onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
          className="w-full px-4 py-3 bg-gray-900/50 border border-gray-800 rounded-xl focus:ring-2 focus:ring-[#6c47ff] focus:border-transparent placeholder:text-gray-600 hover:border-gray-700"
          placeholder={t("movieForm.genrePlaceholder")}
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="description"
          className="flex items-center gap-2 text-sm font-semibold text-gray-300"
        >
          <FileText className="w-4 h-4 text-[#6c47ff]" />
          {t("movieForm.descriptionLabel")}
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
          placeholder={t("movieForm.descriptionPlaceholder")}
        />
        <p className="text-xs text-gray-500 text-right">
          {formData.description?.length || 0}/500 {t("movieForm.characters")}
        </p>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 relative group bg-[#6c47ff] text-white rounded-xl px-8 py-4 font-semibold hover:bg-[#5639cc] transition-all duration-300 shadow-lg shadow-[#6c47ff]/25 hover:shadow-[#6c47ff]/40 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 disabled:hover:translate-y-0"
        >
          <span className="flex items-center justify-center gap-2">
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {t("movieForm.submitting")}
              </>
            ) : (
              <>
                <Film className="w-5 h-5" />
                {t("movieForm.submit")}
              </>
            )}
          </span>
        </button>

        <button
          type="button"
          onClick={() => router.back()}
          disabled={loading}
          className="px-8 py-4 border border-gray-800 rounded-xl font-semibold hover:bg-gray-900/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 disabled:hover:translate-y-0"
        >
          {t("common.cancel")}
        </button>
      </div>
    </form>
  );
}

/*
 * This component provides a form for creating new movie entries.
 * Features:
 * - Input validation and error handling
 * - Loading states during submission
 * - Character count for description field
 * - Client-side validation before submission
 * - Responsive form layout with animated feedback
 * - User feedback for form submission status
 * - Navigation handling (back button)
 */
