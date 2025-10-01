import { z } from "zod";

export const createReviewSchema = z.object({
  reviewText: z
    .string()
    .min(10, "Review must be at least 10 characters")
    .max(2000, "Review cannot be more than 2000 characters")
    .trim(),
  rating: z
    .number()
    .int("Rating must be an integer")
    .min(1, "Rating must be between 1 and 5")
    .max(5, "Rating must be between 1 and 5"),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
