import { z } from 'zod';

export const healthRecordSchema = z.object({
  name: z.string().min(1), // or use z.coerce.date() if input is string date
  type: z.enum(['PRESCRIPTION', 'LAB', 'IMAGING', 'VACCINATION']),
  userId: z.string().uuid(),
});

export const healthRecordUpdateSchema = healthRecordSchema.partial();
