// proofOfIdentitySchema.ts
import { z } from "zod";

export const proofOfIdentitySchema = z.object({
  userPhoto: z.string().nonempty("Photo is required"),
  passportNumber: z.string().min(1, "Passport number is required"),
  passportExpiry: z.coerce
    .date()
    .refine(
      (date) => date > new Date(),
      "Passport expiry must be a future date"
    ),
  voterIdCard: z.string().min(1, "Voter ID card number is required"),
  drivingLicense: z.string().min(1, "Driving license number is required"),
  drivingLicenseExpiry: z.coerce
    .date()
    .refine(
      (date) => date > new Date(),
      "Driving license expiry must be a future date"
    ),
  nregaJobCard: z.string().optional(),
  nationalPopRegLetter: z.string().optional(),
  proofOfPossAadhaar: z.string().min(1, "Proof of Aadhaar is required"),
  KYCAuthecation: z.string().min(1, "KYC authentication is required"),
  offlineVerificationAadhar: z
    .string()
    .min(1, "Offline verification Aadhaar is required"),
});
