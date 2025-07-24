import { z } from 'zod';

export const doctorSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  age: z.number().int().min(18).max(100),
  mobileNo: z.string().min(10).max(15),
  address: z.string().min(5),
  photo: z.string().url().optional(),
  rating: z.number().int().min(0).max(5),
  active: z.boolean(),
  languages: z.array(z.string()),
  fee: z.number().int().nonnegative(),
});

export const doctorUpdateSchema = doctorSchema.partial();
