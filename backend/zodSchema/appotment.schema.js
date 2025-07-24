import { z } from "zod";

export const createAppointmentSchema = z.object({
  date: z
    .string({ required_error: "Date is required" })
    .refine((d) => !isNaN(Date.parse(d)), "Invalid date format"),
  mode: z.enum(["VIDEO", "CHAT", "INPLACE"], {
    required_error: "Mode is required",
    invalid_type_error: "Invalid mode value",
  }),
  status: z
    .enum(["SCHEDULED", "COMPLETED", "CANCELLED"], {
      invalid_type_error: "Invalid status value",
    })
    .optional(),
  userId: z.string({ required_error: "userId is required" }).uuid("Invalid user ID"),
  doctorId: z.string({ required_error: "doctorId is required" }).uuid("Invalid doctor ID"),
});

export const updateAppointmentSchema = createAppointmentSchema.partial();
export const appointmentIdParamSchema = z.object({
  id: z.string({ required_error: "Appointment ID is required" }).uuid("Invalid appointment ID"),
});
