/*
 * File: app/api/movies/[id]/reviews/[reviewId]/route.ts
 * Location: API route handler for individual review operations
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import Review from "@/lib/models/Review";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; reviewId: string }> }
) {
  const { userId } = await auth();
  const { reviewId } = await params;

  if (!userId) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    await connectDB();
    const review = await Review.findById(reviewId);

    if (!review) {
      return NextResponse.json(
        { success: false, error: "Review not found" },
        { status: 404 }
      );
    }

    // Sjekk eierskap
    if (review.userId !== userId) {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden: You can only delete your own reviews",
        },
        { status: 403 }
      );
    }

    await Review.findByIdAndDelete(reviewId);

    return NextResponse.json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete review" },
      { status: 500 }
    );
  }
}

/*
 * This API route handles individual review operations:
 * - DELETE: Remove a specific review
 * Features:
 * - Authentication verification
 * - Owner-only access control
 * - Review existence validation
 * - Clean error handling
 * - Proper status codes (200, 401, 403, 404, 500)
 */
