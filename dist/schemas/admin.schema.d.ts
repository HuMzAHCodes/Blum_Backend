import { z } from "zod";
export declare const updateOrderStatusSchema: z.ZodObject<{
    body: z.ZodObject<{
        status: z.ZodNativeEnum<{
            PENDING: "PENDING";
            CONFIRMED: "CONFIRMED";
            PROCESSING: "PROCESSING";
            SHIPPED: "SHIPPED";
            DELIVERED: "DELIVERED";
            CANCELLED: "CANCELLED";
            REFUNDED: "REFUNDED";
        }>;
    }, "strip", z.ZodTypeAny, {
        status: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED";
    }, {
        status: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED";
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        status: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED";
    };
}, {
    body: {
        status: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED";
    };
}>;
//# sourceMappingURL=admin.schema.d.ts.map