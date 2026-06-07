import { z } from "zod";
export declare const createOrderSchema: z.ZodObject<{
    body: z.ZodEffects<z.ZodObject<{
        addressId: z.ZodOptional<z.ZodString>;
        address: z.ZodOptional<z.ZodObject<{
            label: z.ZodDefault<z.ZodOptional<z.ZodString>>;
            street: z.ZodString;
            city: z.ZodString;
            state: z.ZodString;
            zip: z.ZodString;
            country: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            label: string;
            street: string;
            city: string;
            state: string;
            zip: string;
            country: string;
        }, {
            street: string;
            city: string;
            state: string;
            zip: string;
            country: string;
            label?: string | undefined;
        }>>;
        paymentMethod: z.ZodString;
        notes: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        paymentMethod: string;
        address?: {
            label: string;
            street: string;
            city: string;
            state: string;
            zip: string;
            country: string;
        } | undefined;
        notes?: string | undefined;
        addressId?: string | undefined;
    }, {
        paymentMethod: string;
        address?: {
            street: string;
            city: string;
            state: string;
            zip: string;
            country: string;
            label?: string | undefined;
        } | undefined;
        notes?: string | undefined;
        addressId?: string | undefined;
    }>, {
        paymentMethod: string;
        address?: {
            label: string;
            street: string;
            city: string;
            state: string;
            zip: string;
            country: string;
        } | undefined;
        notes?: string | undefined;
        addressId?: string | undefined;
    }, {
        paymentMethod: string;
        address?: {
            street: string;
            city: string;
            state: string;
            zip: string;
            country: string;
            label?: string | undefined;
        } | undefined;
        notes?: string | undefined;
        addressId?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        paymentMethod: string;
        address?: {
            label: string;
            street: string;
            city: string;
            state: string;
            zip: string;
            country: string;
        } | undefined;
        notes?: string | undefined;
        addressId?: string | undefined;
    };
}, {
    body: {
        paymentMethod: string;
        address?: {
            street: string;
            city: string;
            state: string;
            zip: string;
            country: string;
            label?: string | undefined;
        } | undefined;
        notes?: string | undefined;
        addressId?: string | undefined;
    };
}>;
//# sourceMappingURL=order.schema.d.ts.map