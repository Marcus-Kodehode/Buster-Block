import { z } from "zod";

export const createMovieSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title cannot be more than 200 characters")
    .trim(),
  director: z
    .string()
    .min(1, "Director is required")
    .max(100, "Director name cannot be more than 100 characters")
    .trim(),
  releaseYear: z
    .number()
    .int("Release year must be an integer")
    .min(1888, "Release year must be 1888 or later")
    .max(
      new Date().getFullYear() + 5,
      "Release year cannot be more than 5 years in the future"
    ),
  genre: z
    .string()
    .min(1, "Genre is required")
    .max(50, "Genre cannot be more than 50 characters")
    .trim(),
});

export const updateMovieSchema = createMovieSchema.partial();

export type CreateMovieInput = z.infer<typeof createMovieSchema>;
export type UpdateMovieInput = z.infer<typeof updateMovieSchema>;
