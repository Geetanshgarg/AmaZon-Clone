import { z } from "zod";

export const getProductsSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    search: z.string().optional(),
    categoryId: z.string().optional(),
    sortBy: z.string().optional(),
    minPrice: z.string().optional(),
    maxPrice: z.string().optional(),
  }),
});

export const getProductByIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, { message: "Invalid product ID format" }),
  }),
});
