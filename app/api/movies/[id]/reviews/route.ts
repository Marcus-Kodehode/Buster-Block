import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import Movie from "@/lib/models/Movie";
import Review from "@/lib/models/Review";
import { createReviewSchema } from "@/lib/validations/reviewSchema";
import { z } from "zod";
import mongoose from "mongoose";

// GET /api/movies/:id/reviews - Hent alle reviews for en film
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

    const movie = await Movie.findById(id);
    if (!movie) {
      return NextResponse.json(
        {
          success: false,
          error: "Movie not found",
        },
        { status: 404 }
      );
    }

    const reviews = await Review.find({ movieId: id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch reviews",
      },
      { status: 500 }
    );
  }
}

// POST /api/movies/:id/reviews - Legg til en review (krever innlogging)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized - You must be logged in to post a review",
        },
        { status: 401 }
      );
    }

    const user = await currentUser();
    const reviewAuthor =
      user?.firstName && user?.lastName
        ? `${user.firstName} ${user.lastName}`
        : user?.username || "Anonymous";

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

    const movie = await Movie.findById(id);
    if (!movie) {
      return NextResponse.json(
        {
          success: false,
          error: "Movie not found",
        },
        { status: 404 }
      );
    }

    const body = await req.json();
    const validatedData = createReviewSchema.parse(body);

    const review = await Review.create({
      movieId: id,
      userId,
      reviewAuthor,
      ...validatedData,
    });

    return NextResponse.json(
      {
        success: true,
        data: review,
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

    if (error instanceof Error && "code" in error && error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          error: "You have already reviewed this movie",
        },
        { status: 409 }
      );
    }

    console.error("Error creating review:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create review",
      },
      { status: 500 }
    );
  }
}
