import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import Movie from "@/lib/models/Movie";
import { createMovieSchema } from "@/lib/validations/movieSchema";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// GET /api/movies - Hent alle filmer
export async function GET() {
  try {
    await connectDB();

    const movies = await Movie.find({}).sort({ createdAt: -1 }).lean();

    return NextResponse.json({
      success: true,
      data: movies,
    });
  } catch (error) {
    console.error("Error fetching movies:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch movies",
      },
      { status: 500 }
    );
  }
}

// POST /api/movies - Legg til ny film (krever innlogging)
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized - You must be logged in to add a movie",
        },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validatedData = createMovieSchema.parse(body);

    await connectDB();

    const movie = await Movie.create({
      ...validatedData,
      createdBy: userId,
    });

    return NextResponse.json(
      {
        success: true,
        data: movie,
      },
      { status: 201 }
    );
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

    console.error("Error creating movie:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create movie",
      },
      { status: 500 }
    );
  }
}
