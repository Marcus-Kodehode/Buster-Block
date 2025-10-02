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

interface EditMovieFormProps {
  movie: Movie;
}

export default function EditMovieForm({ movie }: EditMovieFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<UpdateMovieInput>({
    title: movie.title,
    director: movie.director,
    releaseYear: movie.releaseYear,
    genre: movie.genre,
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

      if (!data.success) {
        throw new Error(data.error || "Failed to update movie");
      }

      router.push(`/movies/${movie._id}`);
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
        <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/50 rounded-xl p-4 text-red-400 animate-in fade-in slide-in-from-top-2 duration-300">
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
          Tittel *
        </label>
        <input
          type="text"
          id="title"
          required
          maxLength={200}
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-3 bg-gray-900/50 border border-gray-800 rounded-xl focus:ring-2 focus:ring-[#6c47ff] focus:border-transparent transition-all placeholder:text-gray-600 hover:border-gray-700"
          placeholder="F.eks. Inception"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="director"
          className="flex items-center gap-2 text-sm font-semibold text-gray-300"
        >
          <User className="w-4 h-4 text-[#6c47ff]" />
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
          className="w-full px-4 py-3 bg-gray-900/50 border border-gray-800 rounded-xl focus:ring-2 focus:ring-[#6c47ff] focus:border-transparent transition-all placeholder:text-gray-600 hover:border-gray-700"
          placeholder="F.eks. Christopher Nolan"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label
            htmlFor="releaseYear"
            className="flex items-center gap-2 text-sm font-semibold text-gray-300"
          >
            <Calendar className="w-4 h-4 text-[#6c47ff]" />
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
              setFormData({
                ...formData,
                releaseYear: parseInt(e.target.value),
              })
            }
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-800 rounded-xl focus:ring-2 focus:ring-[#6c47ff] focus:border-transparent transition-all placeholder:text-gray-600 hover:border-gray-700"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="runtime"
            className="flex items-center gap-2 text-sm font-semibold text-gray-300"
          >
            <Clock className="w-4 h-4 text-[#6c47ff]" />
            Lengde (minutter)
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
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-800 rounded-xl focus:ring-2 focus:ring-[#6c47ff] focus:border-transparent transition-all placeholder:text-gray-600 hover:border-gray-700"
            placeholder="F.eks. 148"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="genre"
          className="flex items-center gap-2 text-sm font-semibold text-gray-300"
        >
          <Tag className="w-4 h-4 text-[#6c47ff]" />
          Sjanger *
        </label>
        <input
          type="text"
          id="genre"
          required
          maxLength={50}
          value={formData.genre}
          onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
          className="w-full px-4 py-3 bg-gray-900/50 border border-gray-800 rounded-xl focus:ring-2 focus:ring-[#6c47ff] focus:border-transparent transition-all placeholder:text-gray-600 hover:border-gray-700"
          placeholder="F.eks. Sci-Fi, Action, Drama"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="description"
          className="flex items-center gap-2 text-sm font-semibold text-gray-300"
        >
          <FileText className="w-4 h-4 text-[#6c47ff]" />
          Beskrivelse
        </label>
        <textarea
          id="description"
          maxLength={500}
          rows={4}
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="w-full px-4 py-3 bg-gray-900/50 border border-gray-800 rounded-xl focus:ring-2 focus:ring-[#6c47ff] focus:border-transparent transition-all placeholder:text-gray-600 hover:border-gray-700 resize-none"
          placeholder="Skriv et kort sammendrag av filmen..."
        />
        <p className="text-xs text-gray-500 text-right">
          {formData.description?.length || 0}/500
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
                Lagrer...
              </>
            ) : (
              <>
                <Film className="w-5 h-5" />
                Lagre endringer
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
          Avbryt
        </button>
      </div>
    </form>
  );
}
