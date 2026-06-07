import { z } from "zod";

// Schema for validating new order creation payloads
export const createOrderSchema = z.object({
  body: z.object({
    addressId: z.string().optional(),
    address: z.object({
      label: z.string().optional().default("Home"),
      street: z.string().min(1, "Street is required"),
      city: z.string().min(1, "City is required"),
      state: z.string().min(1, "State is required"),
      zip: z.string().min(1, "Zip code is required"),
      country: z.string().min(1, "Country is required"),
    }).optional(),
    paymentMethod: z.string().min(1, "Payment method is required"),
    notes: z.string().optional(),
  }).refine((data) => data.addressId || data.address, {
    message: "Either addressId or a new address object must be provided",
    path: ["addressId"],
  }),
});
