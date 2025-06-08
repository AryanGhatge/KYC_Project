// In src/lib/schemas/e-kyc/panDetailsSchema.js
import { z } from "zod";

export const panDetailsSchema = z.object({
  panNumber: z
    .string()
    .trim()
    .min(10, "PAN Number must be at least 10 characters long")
    .max(10, "PAN Number must be at most 10 characters long")
    .regex(
      /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
      "Invalid PAN format. Must be in format ABCDE1234F"
    ),
  mobileNumber: z
    .string()
    .trim()
    .min(10, "Mobile number must be 10 digits")
    .max(10, "Mobile number must be 10 digits")
    .regex(/^[6-9]\d{9}$/, "Mobile number must start with 6-9"),
  dateOfBirth: z.string({
    required_error: "Date of birth is required",
  }).refine((date) => {
    if (!date) return false;
    const dob = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    const month = today.getMonth() - dob.getMonth();
    return age > 18 || (age === 18 && month >= 0);
  }, "You must be at least 18 years old"),
  emailId: z.string().email("Invalid email address"),
  whoAreU: z.enum([
    "Individual",
    "Non Resident Indian",
    "Foreign National",
    "Person of Indian Origin",
  ]),
});