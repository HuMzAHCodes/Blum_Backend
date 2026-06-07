import { z } from "zod";

// Schema for creating a new category
export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1, "Category name is required"),
    description: z.string().optional(),
    image: z.string().url("Image must be a valid URL").optional().nullable(),
  }),
});

// Schema for updating an existing category
export const updateCategorySchema = z.object({
  body: createCategorySchema.shape.body.partial(),
});
