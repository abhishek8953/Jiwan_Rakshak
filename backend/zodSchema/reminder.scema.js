import { z } from 'zod';

export const reminderSchema = z.object({
  name: z.string().min(1),
  dosage: z.string(),
  frequency: z.string(),
  startDate: z.string().datetime(),
  times: z.array(z.string()),
  repeat: z.enum(['ONCE', 'DAILY', 'WEEKLY']),
  userId: z.string(),
});
