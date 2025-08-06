// src/validators/lab.schema.ts
import { z } from "zod";

export const createLabSchema = z.object({
  name: z.string(),
  fee: z.number(),
  address: z.string(),
  type: z.string(),
  date: z.string().datetime(),
});

export const updateLabSchema = createLabSchema.partial();
