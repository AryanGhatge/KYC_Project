import { z } from "zod";

const profileDetailSchema = z.object({
  gender: z.enum(["Male", "Female", "Others"]),
  placeOfBirth: z.string().nonempty("Place of Birth is required"),
  occupation: z.string().nonempty("Occupation is required"),
  annualIncome: z.string(),
  citizenship: z.boolean(),
  informationConfirmation: z.boolean(),
});

export default profileDetailSchema;
