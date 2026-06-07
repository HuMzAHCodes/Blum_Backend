import { z } from "zod";

// Schema for validating new review creation
export const createReviewSchema = z.object({
  body: z.object({
    rating: z.number().int().min(1, "Rating must be between 1 and 5").max(5, "Rating must be between 1 and 5"),
    title: z.string().max(100, "Title must be under 100 characters").optional(),
    body: z.string().min(1, "Review body is required"),
    productId: z.string().min(1, "Product ID is required"),
  }),
});

// Schema for validating review updates
export const updateReviewSchema = z.object({
  body: z.object({
    rating: z.number().int().min(1, "Rating must be between 1 and 5").max(5, "Rating must be between 1 and 5").optional(),
    title: z.string().max(100, "Title must be under 100 characters").optional(),
    body: z.string().min(1, "Review body cannot be empty").optional(),
  }),
});
