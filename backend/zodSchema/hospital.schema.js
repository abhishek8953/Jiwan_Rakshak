// validators/hospitalValidator.js
import { z } from 'zod';

export const hospitalSchema = z.object({
  name: z.string({ required_error: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  address: z.string({ required_error: "Address is required" }),
  phone: z.number({ invalid_type_error: "Phone must be a number" }),
  established: z.coerce.date({ invalid_type_error: "Invalid date" }),
  totalBeds: z.number().int({ message: "Total beds must be an integer" }),
  availableBeds: z.number().int({ message: "Available beds must be an integer" }),
  rating: z.number().min(0).max(5, { message: "Rating must be between 0 and 5" })
});
