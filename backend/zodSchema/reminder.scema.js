import { z } from "zod";

export const medicineReminderSchema = z.object({
  name: z.string(),
  dosage: z.string(),
  frequency: z.string(),
  startDate: z.string().datetime(),
  times: z.array(z.string()),
  repeat: z.enum(["ONCE", "DAILY", "WEEKLY"]),
  userId: z.string().uuid(),
});

export const updateMedicineReminderSchema = medicineReminderSchema.partial();
