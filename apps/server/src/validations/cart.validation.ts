import { z } from "zod";

export const addToCartSchema = z.object({
  body: z.object({
    productId: z.string().min(1),
    quantity: z.number().int().min(1).default(1),
  }),
});

export const updateCartItemSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    quantity: z.number().int().min(0),
  }),
});

export const deleteCartItemSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});
