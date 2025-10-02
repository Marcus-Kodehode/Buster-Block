/*
 * File: types/index.ts
 * Location: Global TypeScript type definitions
 */

export type Movie = {
  _id: string;
  title: string;
  director: string;
  releaseYear: number;
  genre: string;
  description?: string; // NY
  runtime?: number; // NY
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type Review = {
  _id: string;
  movieId: string;
  userId: string;
  reviewAuthor: string;
  reviewText: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
};

export type ApiResponse<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: string;
    };

/*
 * This file defines the core type definitions used throughout the application:
 * - Movie type with all its properties
 * - Review type for user reviews
 * - Generic API response type for consistent error handling
 * - Timestamps and relationships between entities
 */
