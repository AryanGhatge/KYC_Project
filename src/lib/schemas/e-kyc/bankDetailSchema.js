import { z } from "zod";

export const bankDetailSchema = z.object({
  bankName: z.string().min(1, "Bank name is required"),
  accountType: z.enum(["Savings", "Current"]),
  bankAccountNumber: z.string().min(1, "Bank account number is required"),
  ifscCode: z.string().min(1, "IFSC code is required"),
  primary: z.boolean(),
  uploadCancelledCheque: z.any().nullable(),
});
