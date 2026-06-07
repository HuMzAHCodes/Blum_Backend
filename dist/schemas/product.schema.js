import { z } from "zod";
// Schema for listing and filtering products via query params
export const getProductsQuerySchema = z.object({
    query: z.object({
        page: z.string().optional().transform((val) => {
            const parsed = val ? parseInt(val, 10) : 1;
            return isNaN(parsed) || parsed < 1 ? 1 : parsed;
        }),
        limit: z.string().optional().transform((val) => {
            const parsed = val ? parseInt(val, 10) : 10;
            return isNaN(parsed) || parsed < 1 ? 10 : parsed;
        }),
        category: z.string().optional(),
        search: z.string().optional(),
        minPrice: z.string().optional().transform((val) => (val ? parseFloat(val) : undefined)),
        maxPrice: z.string().optional().transform((val) => (val ? parseFloat(val) : undefined)),
        sortBy: z.enum(["price", "createdAt", "name"]).optional().default("createdAt"),
        sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
    }),
});
// Schema for creating a new product
export const createProductSchema = z.object({
    body: z.object({
        name: z.string().min(1, "Product name is required"),
        description: z.string().min(1, "Product description is required"),
        price: z.number().min(0, "Price must be a positive number"),
        salePrice: z.number().min(0, "Sale price must be positive").nullable().optional(),
        stock: z.number().int().min(0, "Stock must be a non-negative integer").optional().default(0),
        images: z.array(z.string().url("Image must be a valid URL")).min(1, "At least one product image is required"),
        tags: z.array(z.string()).optional().default([]),
        categoryId: z.string().min(1, "Category ID is required"),
        isActive: z.boolean().optional().default(true),
    }),
});
// Schema for updating an existing product
export const updateProductSchema = z.object({
    body: createProductSchema.shape.body.partial(),
});
//# sourceMappingURL=product.schema.js.map