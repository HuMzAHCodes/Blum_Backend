import { z } from "zod";
import { OrderStatus } from "@prisma/client";

// Schema for validating order status changes
export const updateOrderStatusSchema = z.object({
  body: z.object({
    status: z.nativeEnum(OrderStatus, {
      errorMap: () => ({ message: "Invalid order status value" }),
    }),
  }),
});
