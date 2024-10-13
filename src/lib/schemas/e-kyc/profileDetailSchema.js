import { z } from "zod";

export const profileDetailSchema = z.object({
  gender: z.enum(["Male", "Female", "Others"]),
  placeOfBirth: z.string().min(1, "Place of birth is required"),
  occupation: z.string().min(1, "Occupation is required"),
  annualIncome: z.string().min(1, "Annual income is required"),
  citizenship: z.boolean(),
  informationConfirmation: z.boolean(),
});
