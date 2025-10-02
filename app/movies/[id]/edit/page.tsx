/*
 * File: app/movies/[id]/edit/page.tsx
 * Location: Server-side page component for editing existing movies
 */

import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Movie from "@/lib/models/Movie";
import EditMovieForm from "@/components/EditMovieForm";
import type { Movie as MovieType } from "@/types";

import { cookies } from "next/headers";
import {
  normalizeLocale,
  defaultLocale,
  loadMessages,
  createTranslator,
  type Locale,
} from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function EditMoviePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();
  const { id } = await params;

  if (!userId) redirect("/sign-in");

  // i18n (server)
  const cookieStore = await cookies();
  const raw = cookieStore.get("lang")?.value;
  const locale: Locale = normalizeLocale(raw) ?? defaultLocale;
  const messages = await loadMessages(locale);
  const t = createTranslator(messages);

  let movie: MovieType | null = null;

  try {
    await connectDB();
    const rawMovie = await Movie.findById(id);
    if (!rawMovie) notFound();

    if (rawMovie.createdBy !== userId) redirect("/");

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
  } catch (error) {
    console.error("Error fetching movie:", error);
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-[#06b6d4] to-[#ec4899] bg-clip-text text-transparent mb-2">
          {t("movieForm.editTitle")}
        </h1>
        <p className="text-gray-400 text-lg">
          {t("movieForm.editSubtitle", { title: movie!.title })}
        </p>
      </div>

      <EditMovieForm movie={movie!} />
    </div>
  );
}

/*
 * This server component handles:
 * - Authentication and authorization checks
 * - Fetching movie data for editing
 * - Owner verification (only owners can edit)
 * - Data transformation for the edit form
 * - Error handling and not found states
 * - Integration with EditMovieForm component
 */
