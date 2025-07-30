import { z } from "zod";

export const emergencySchema = z.object({
  name: z.string().min(1),
  mobileNo: z.string().min(10).max(15),
  relation: z.string(),
  userId: z.string().uuid(),
});
