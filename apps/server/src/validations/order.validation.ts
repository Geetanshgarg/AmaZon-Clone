import { z } from "zod";

export const getOrderByIdSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});
