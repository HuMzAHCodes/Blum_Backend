import { z } from "zod";
export declare const createCategorySchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        image: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        description?: string | undefined;
        image?: string | null | undefined;
    }, {
        name: string;
        description?: string | undefined;
        image?: string | null | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        name: string;
        description?: string | undefined;
        image?: string | null | undefined;
    };
}, {
    body: {
        name: string;
        description?: string | undefined;
        image?: string | null | undefined;
    };
}>;
export declare const updateCategorySchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        image: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    }, "strip", z.ZodTypeAny, {
        name?: string | undefined;
        description?: string | undefined;
        image?: string | null | undefined;
    }, {
        name?: string | undefined;
        description?: string | undefined;
        image?: string | null | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        name?: string | undefined;
        description?: string | undefined;
        image?: string | null | undefined;
    };
}, {
    body: {
        name?: string | undefined;
        description?: string | undefined;
        image?: string | null | undefined;
    };
}>;
//# sourceMappingURL=category.schema.d.ts.map