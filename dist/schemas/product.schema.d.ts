import { z } from "zod";
export declare const getProductsQuerySchema: z.ZodObject<{
    query: z.ZodObject<{
        page: z.ZodEffects<z.ZodOptional<z.ZodString>, number, string | undefined>;
        limit: z.ZodEffects<z.ZodOptional<z.ZodString>, number, string | undefined>;
        category: z.ZodOptional<z.ZodString>;
        search: z.ZodOptional<z.ZodString>;
        minPrice: z.ZodEffects<z.ZodOptional<z.ZodString>, number | undefined, string | undefined>;
        maxPrice: z.ZodEffects<z.ZodOptional<z.ZodString>, number | undefined, string | undefined>;
        sortBy: z.ZodDefault<z.ZodOptional<z.ZodEnum<["price", "createdAt", "name"]>>>;
        sortOrder: z.ZodDefault<z.ZodOptional<z.ZodEnum<["asc", "desc"]>>>;
    }, "strip", z.ZodTypeAny, {
        limit: number;
        page: number;
        sortBy: "name" | "createdAt" | "price";
        sortOrder: "asc" | "desc";
        search?: string | undefined;
        category?: string | undefined;
        minPrice?: number | undefined;
        maxPrice?: number | undefined;
    }, {
        limit?: string | undefined;
        search?: string | undefined;
        category?: string | undefined;
        page?: string | undefined;
        sortBy?: "name" | "createdAt" | "price" | undefined;
        sortOrder?: "asc" | "desc" | undefined;
        minPrice?: string | undefined;
        maxPrice?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        limit: number;
        page: number;
        sortBy: "name" | "createdAt" | "price";
        sortOrder: "asc" | "desc";
        search?: string | undefined;
        category?: string | undefined;
        minPrice?: number | undefined;
        maxPrice?: number | undefined;
    };
}, {
    query: {
        limit?: string | undefined;
        search?: string | undefined;
        category?: string | undefined;
        page?: string | undefined;
        sortBy?: "name" | "createdAt" | "price" | undefined;
        sortOrder?: "asc" | "desc" | undefined;
        minPrice?: string | undefined;
        maxPrice?: string | undefined;
    };
}>;
export declare const createProductSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        description: z.ZodString;
        price: z.ZodNumber;
        salePrice: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        stock: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        images: z.ZodArray<z.ZodString, "many">;
        tags: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
        categoryId: z.ZodString;
        isActive: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        price: number;
        description: string;
        stock: number;
        images: string[];
        tags: string[];
        isActive: boolean;
        categoryId: string;
        salePrice?: number | null | undefined;
    }, {
        name: string;
        price: number;
        description: string;
        images: string[];
        categoryId: string;
        salePrice?: number | null | undefined;
        stock?: number | undefined;
        tags?: string[] | undefined;
        isActive?: boolean | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        name: string;
        price: number;
        description: string;
        stock: number;
        images: string[];
        tags: string[];
        isActive: boolean;
        categoryId: string;
        salePrice?: number | null | undefined;
    };
}, {
    body: {
        name: string;
        price: number;
        description: string;
        images: string[];
        categoryId: string;
        salePrice?: number | null | undefined;
        stock?: number | undefined;
        tags?: string[] | undefined;
        isActive?: boolean | undefined;
    };
}>;
export declare const updateProductSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        price: z.ZodOptional<z.ZodNumber>;
        salePrice: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodNumber>>>;
        stock: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodNumber>>>;
        images: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        tags: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>>;
        categoryId: z.ZodOptional<z.ZodString>;
        isActive: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodBoolean>>>;
    }, "strip", z.ZodTypeAny, {
        name?: string | undefined;
        price?: number | undefined;
        description?: string | undefined;
        salePrice?: number | null | undefined;
        stock?: number | undefined;
        images?: string[] | undefined;
        tags?: string[] | undefined;
        isActive?: boolean | undefined;
        categoryId?: string | undefined;
    }, {
        name?: string | undefined;
        price?: number | undefined;
        description?: string | undefined;
        salePrice?: number | null | undefined;
        stock?: number | undefined;
        images?: string[] | undefined;
        tags?: string[] | undefined;
        isActive?: boolean | undefined;
        categoryId?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        name?: string | undefined;
        price?: number | undefined;
        description?: string | undefined;
        salePrice?: number | null | undefined;
        stock?: number | undefined;
        images?: string[] | undefined;
        tags?: string[] | undefined;
        isActive?: boolean | undefined;
        categoryId?: string | undefined;
    };
}, {
    body: {
        name?: string | undefined;
        price?: number | undefined;
        description?: string | undefined;
        salePrice?: number | null | undefined;
        stock?: number | undefined;
        images?: string[] | undefined;
        tags?: string[] | undefined;
        isActive?: boolean | undefined;
        categoryId?: string | undefined;
    };
}>;
//# sourceMappingURL=product.schema.d.ts.map