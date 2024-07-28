import { z } from "zod";

// Define the schema for contact details
const contactSchema = z.object({
  telephoneOffice: z.string().optional(),
  telephoneRes: z.string().optional(),
  phoneCountryCode: z
    .string()
    .min(1, "Country code is required")
    .max(3, "Country code must be up to 3 characters long"),
  phoneNumber: z
    .string()
    .min(8, "Phone number must be at least 8 digits long")
    .max(15, "Phone number can be up to 15 digits long"),
  emailId: z.string().email("Invalid email address").optional(),
  alternativePhoneNumber: z.string().optional(),
  alternativeEmail: z.string().optional(),
});

export { contactSchema };
