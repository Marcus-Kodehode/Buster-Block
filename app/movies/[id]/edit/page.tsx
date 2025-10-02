import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Movie from "@/lib/models/Movie";
import EditMovieForm from "@/components/EditMovieForm";
import type { Movie as MovieType } from "@/types";

export const dynamic = "force-dynamic";

export default async function EditMoviePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();
  const { id } = await params;

  if (!userId) {
    redirect("/sign-in");
  }

  let movie: MovieType | null = null;

  try {
    await connectDB();
    const rawMovie = await Movie.findById(id);

    if (!rawMovie) {
      notFound();
    }

    // Sjekk eierskap
    if (rawMovie.createdBy !== userId) {
      redirect("/");
    }

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
          Rediger film
        </h1>
        <p className="text-gray-400 text-lg">
          Oppdater informasjonen om {movie.title}
        </p>
      </div>

      <EditMovieForm movie={movie} />
    </div>
  );
}
