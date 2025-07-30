// validators/hospitalValidator.js
import { z } from 'zod';

export const hospitalSchema = z.object({
  id: z.string().uuid().optional(), // Usually auto-generated
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  address: z.string().min(1, "Address is required"),
  photo: z.string().url("Photo must be a valid URL").optional(),
  phone: z.string().min(1, "Phone number seems invalid"), // Assuming 10-digit phone numbers
  rating: z.number().int().min(0).max(5), // Assuming rating is from 0 to 5
  email: z.string().email("Invalid email address"),
  establishedDate: z.coerce.date(), // Accepts string, number, or Date object
});
