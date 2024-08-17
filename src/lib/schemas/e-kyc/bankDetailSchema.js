import { z } from "zod";

const bankDetailSchema = z.object({
  bankName: z.string().nonempty("Bank Name is required"),
  accountType: z.enum(["Savings", "Current"]),
  bankAccountNumber: z
    .string()
    .min(8, "Bank Account Number must be at least 8 characters")
    .max(12, "Bank Account Number must be at most 12 characters")
    .nonempty("Bank Account Number is required"),
  ifscCode: z.string().nonempty("IFSC Code is required"),
  primary: z.boolean(),
});

const bankDetailsArraySchema = z.array(bankDetailSchema).refine((arr) => {
  const primaryCount = arr.filter((detail) => detail.primary).length;
  return primaryCount === 1;
}, "Exactly one bank account must be marked as primary");

export default bankDetailsArraySchema;
