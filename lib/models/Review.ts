/*
 * File: lib/models/Review.ts
 * Location: Database model definition for Review entity
 */

import mongoose, { Schema, model, models, Document } from "mongoose";

export interface IReview extends Document {
  movieId: mongoose.Types.ObjectId;
  userId: string;
  reviewAuthor: string;
  reviewText: string;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    movieId: {
      type: Schema.Types.ObjectId,
      ref: "Movie",
      required: [true, "Movie ID is required"],
    },
    userId: {
      type: String,
      required: [true, "User ID is required"],
    },
    reviewAuthor: {
      type: String,
      required: [true, "Review author name is required"],
      trim: true,
    },
    reviewText: {
      type: String,
      required: [true, "Review text is required"],
      trim: true,
      minlength: [10, "Review must be at least 10 characters"],
      maxlength: [2000, "Review cannot be more than 2000 characters"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be between 1 and 5"],
      max: [5, "Rating must be between 1 and 5"],
    },
  },
  {
    timestamps: true,
  }
);

ReviewSchema.index({ movieId: 1 });
ReviewSchema.index({ userId: 1 });
ReviewSchema.index({ rating: -1 });
ReviewSchema.index({ movieId: 1, userId: 1 }, { unique: true });

const Review = models.Review || model<IReview>("Review", ReviewSchema);

export default Review;

/*
 * This file defines the Mongoose schema and model for movie reviews in the database.
 * Features:
 * - Required fields: movieId, userId, reviewAuthor, reviewText, rating
 * - Rating validation (1-5 scale)
 * - Automatic timestamp fields: createdAt, updatedAt
 * - Database indexes for optimized queries
 * - Unique constraint on movieId+userId combination to prevent duplicate reviews
 */
