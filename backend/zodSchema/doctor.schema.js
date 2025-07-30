import { z } from "zod";

export const specialitySchema = z.object({
  name: z
    .string({ required_error: "Speciality name is required" })
    .min(2, "Speciality name must be at least 2 characters long"),

  description: z
    .string({ required_error: "Speciality description is required" })
    .min(5, "Description must be at least 5 characters long"),

  experience: z
    .number({ required_error: "Experience is required" })
    .min(0, "Experience cannot be negative"),

  certificate: z
    .string({ required_error: "Certificate is required" })
    .min(1, "Certificate field cannot be empty")
});

export const doctorSchema = z.object({
  name: z
    .string({ required_error: "Doctor name is required" })
    .min(2, "Name must be at least 2 characters long"),

  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email address"),

  age: z
    .number({ required_error: "Age is required" })
    .int("Age must be an integer")
    .min(18, "Doctor must be at least 18 years old"),

  mobileNo: z
    .string({ required_error: "Mobile number is required" })
    .min(10, "Mobile number must be at least 10 digits"),

  address: z
    .string({ required_error: "Address is required" })
    .min(5, "Address must be at least 5 characters long"),

  photo: z.string().nullable().optional(),

  rating: z
    .number({ required_error: "Rating is required" })
    .min(0, "Rating cannot be less than 0")
    .max(5, "Rating cannot be more than 5"),

  active: z
    .boolean({ required_error: "Active status is required" }),

  languages: z
    .array(z.string().min(1, "Language cannot be empty"))
    .nonempty("At least one language is required"),

  fee: z
    .number({ required_error: "Fee is required" })
    .min(0, "Fee must be a positive number"),

  specialities: z
    .array(specialitySchema)
    .nonempty("At least one speciality is required")
});
