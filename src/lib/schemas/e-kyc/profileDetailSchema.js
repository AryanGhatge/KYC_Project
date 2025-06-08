import { z } from "zod";

export const profileDetailSchema = z.object({
  gender: z.enum(["Male", "Female", "Others"]),
  placeOfBirth: z.string()
    .min(2, "Place of birth must be at least 2 characters")
    .max(100, "Place of birth cannot exceed 100 characters"),
  occupation: z.string().min(1, "Occupation is required"),
  annualIncome: z.string().min(1, "Annual income is required"),
  citizenship: z.boolean(),
  informationConfirmation: z.boolean(),
});
