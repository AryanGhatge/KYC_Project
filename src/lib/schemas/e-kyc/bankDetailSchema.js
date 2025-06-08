import { z } from "zod";

export const bankDetailSchema = z.object({
  bankName: z.string().min(1, "Bank name is required"),
  accountType: z.enum(["Saving", "Current"]),
  bankAccountNumber: z.string()
    .min(1, "Bank account number is required")
    .min(9, "Bank account number must be at least 9 digits")
    .max(18, "Bank account number cannot exceed 18 digits")
    .regex(/^[0-9]+$/, "Bank account number must contain only numbers"),
  ifscCode: z.string()
    .min(1, "IFSC code is required")
    .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code format. It should be 11 characters: first 4 letters, then 0, followed by 6 alphanumeric characters"),
  primary: z.boolean(),
  uploadCancelledCheque: z.any().nullable(),
});
