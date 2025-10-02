"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";

interface DeleteButtonProps {
  itemId: string;
  itemType: "movie" | "review";
  movieId?: string; // Trengs for reviews
  onSuccess?: () => void;
}

export default function DeleteButton({
  itemId,
  itemType,
  movieId,
  onSuccess,
}: DeleteButtonProps) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setLoading(true);
    setError("");

    try {
      const url =
        itemType === "movie"
          ? `/api/movies/${itemId}`
          : `/api/movies/${movieId}/reviews/${itemId}`;

      const res = await fetch(url, { method: "DELETE" });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to delete");
      }

      if (itemType === "movie") {
        router.push("/");
      } else {
        onSuccess?.();
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!showConfirm) {
    return (
      <button
        onClick={() => setShowConfirm(true)}
        className="inline-flex items-center gap-2 px-4 py-2 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/10 transition-all"
      >
        <Trash2 className="w-4 h-4" />
        Slett
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-md w-full space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-red-500/10">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Bekreft sletting</h3>
            <p className="text-gray-400">
              Er du sikker på at du vil slette dette{" "}
              {itemType === "movie" ? "filmen" : "anmeldelsen"}?
              {itemType === "movie" &&
                " Alle tilhørende anmeldelser vil også bli slettet."}
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 bg-red-500 text-white rounded-lg px-6 py-3 font-semibold hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Sletter...
              </>
            ) : (
              <>
                <Trash2 className="w-5 h-5" />
                Ja, slett
              </>
            )}
          </button>

          <button
            onClick={() => setShowConfirm(false)}
            disabled={loading}
            className="px-6 py-3 border border-gray-800 rounded-lg font-semibold hover:bg-gray-900/50 transition-all disabled:opacity-50"
          >
            Avbryt
          </button>
        </div>
      </div>
    </div>
  );
}
