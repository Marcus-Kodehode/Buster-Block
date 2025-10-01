import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import Movie from "@/lib/models/Movie";
import { updateMovieSchema } from "@/lib/validations/movieSchema";
import { z } from "zod";
import mongoose from "mongoose";

// GET /api/movies/:id - Hent én film
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid movie ID format",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const movie = await Movie.findById(id).lean();

    if (!movie) {
      return NextResponse.json(
        {
          success: false,
          error: "Movie not found",
        },
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
      {
        success: false,
        error: "Failed to fetch movie",
      },
      { status: 500 }
    );
  }
}

// PUT /api/movies/:id - Oppdater en film (krever innlogging + eierskap)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized - You must be logged in to update a movie",
        },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid movie ID format",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const existingMovie = await Movie.findById(id);

    if (!existingMovie) {
      return NextResponse.json(
        {
          success: false,
          error: "Movie not found",
        },
        { status: 404 }
      );
    }

    if (existingMovie.createdBy !== userId) {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden - You can only edit movies you created",
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validatedData = updateMovieSchema.parse(body);

    const updatedMovie = await Movie.findByIdAndUpdate(id, validatedData, {
      new: true,
      runValidators: true,
    }).lean();

    return NextResponse.json({
      success: true,
      data: updatedMovie,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: error.issues[0].message,
        },
        { status: 400 }
      );
    }

    console.error("Error updating movie:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update movie",
      },
      { status: 500 }
    );
  }
}
