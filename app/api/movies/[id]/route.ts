import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import Movie from "@/lib/models/Movie";
import Review from "@/lib/models/Review";
import { updateMovieSchema } from "@/lib/validations/movieSchema";
import { ZodError } from "zod";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await connectDB();
    const movie = await Movie.findById(id);

    if (!movie) {
      return NextResponse.json(
        { success: false, error: "Movie not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: movie,
    });
  } catch (error) {
    console.error("Error fetching movie:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch movie" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  const { id } = await params;

  if (!userId) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const validatedData = updateMovieSchema.parse(body);

    await connectDB();
    const movie = await Movie.findById(id);

    if (!movie) {
      return NextResponse.json(
        { success: false, error: "Movie not found" },
        { status: 404 }
      );
    }

    // Sjekk eierskap
    if (movie.createdBy !== userId) {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden: You can only edit your own movies",
        },
        { status: 403 }
      );
    }

    const updatedMovie = await Movie.findByIdAndUpdate(
      id,
      { $set: validatedData },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      data: updatedMovie,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error("Error updating movie:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update movie" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  const { id } = await params;

  if (!userId) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    await connectDB();
    const movie = await Movie.findById(id);

    if (!movie) {
      return NextResponse.json(
        { success: false, error: "Movie not found" },
        { status: 404 }
      );
    }

    // Sjekk eierskap
    if (movie.createdBy !== userId) {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden: You can only delete your own movies",
        },
        { status: 403 }
      );
    }

    // Slett alle reviews for denne filmen først
    await Review.deleteMany({ movieId: id });

    // Slett filmen
    await Movie.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Movie and associated reviews deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting movie:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete movie" },
      { status: 500 }
    );
  }
}
