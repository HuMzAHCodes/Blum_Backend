import { z } from "zod";
export declare const createReviewSchema: z.ZodObject<{
    body: z.ZodObject<{
        rating: z.ZodNumber;
        title: z.ZodOptional<z.ZodString>;
        body: z.ZodString;
        productId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        rating: number;
        body: string;
        productId: string;
        title?: string | undefined;
    }, {
        rating: number;
        body: string;
        productId: string;
        title?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        rating: number;
        body: string;
        productId: string;
        title?: string | undefined;
    };
}, {
    body: {
        rating: number;
        body: string;
        productId: string;
        title?: string | undefined;
    };
}>;
export declare const updateReviewSchema: z.ZodObject<{
    body: z.ZodObject<{
        rating: z.ZodOptional<z.ZodNumber>;
        title: z.ZodOptional<z.ZodString>;
        body: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        rating?: number | undefined;
        title?: string | undefined;
        body?: string | undefined;
    }, {
        rating?: number | undefined;
        title?: string | undefined;
        body?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        rating?: number | undefined;
        title?: string | undefined;
        body?: string | undefined;
    };
}, {
    body: {
        rating?: number | undefined;
        title?: string | undefined;
        body?: string | undefined;
    };
}>;
//# sourceMappingURL=review.schema.d.ts.map