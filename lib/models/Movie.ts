/*
 * File: lib/models/Movie.ts
 * Location: Database model definition for Movie entity
 */

import { Schema, model, models, Document } from "mongoose";

export interface IMovie extends Document {
  title: string;
  director: string;
  releaseYear: number;
  genre: string;
  description?: string; // NY
  runtime?: number; // NY
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const MovieSchema = new Schema<IMovie>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot be more than 200 characters"],
    },
    director: {
      type: String,
      required: [true, "Director is required"],
      trim: true,
      maxlength: [100, "Director name cannot be more than 100 characters"],
    },
    releaseYear: {
      type: Number,
      required: [true, "Release year is required"],
      min: [1888, "Release year must be 1888 or later"],
      max: [
        new Date().getFullYear() + 5,
        "Release year cannot be more than 5 years in the future",
      ],
    },
    genre: {
      type: String,
      required: [true, "Genre is required"],
      trim: true,
      maxlength: [50, "Genre cannot be more than 50 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    runtime: {
      type: Number,
      min: [1, "Runtime must be at least 1 minute"],
      max: [1000, "Runtime cannot exceed 1000 minutes"],
    },
    createdBy: {
      type: String,
      required: [true, "Creator user ID is required"],
    },
  },
  {
    timestamps: true,
  }
);

MovieSchema.index({ title: 1 });
MovieSchema.index({ genre: 1 });
MovieSchema.index({ releaseYear: -1 });

const Movie = models.Movie || model<IMovie>("Movie", MovieSchema);

export default Movie;

/*
 * This file defines the Mongoose schema and model for movies in the database.
 * Features:
 * - Required fields: title, director, releaseYear, genre, createdBy
 * - Optional fields: description, runtime
 * - Automatic timestamp fields: createdAt, updatedAt
 * - Input validation and field constraints
 * - Database indexes for optimized queries on title, genre, and releaseYear
 */
