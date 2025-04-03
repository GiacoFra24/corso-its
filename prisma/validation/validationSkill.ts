import { z } from "zod";

export const skillSchema = z.object({
  name: z.string().min(1).max(20),
  key: z.string().refine((value:string) => /^[a-z0-9_]+$/.test(value), {message: "Invalid attribute name",}),
  value: z.number().int().optional(),
  idAttribute: z.string().uuid(),
});
