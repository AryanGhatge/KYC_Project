import { z } from "zod";

// Define the schema for personal information
const personalInformationSchema = z.object({
  namePrefix: z.enum(["Mrs.", "Mr."]),
  firstName: z.string().nonempty("First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().nonempty("Last name is required"),
  //   maidenPrefix: z.enum(["Mrs.", "Mr."]),
  //   maidenFirstName: z.string(),
  //   maidenMiddleName: z.string().optional(),
  //   maidenLastName: z.string(),
  fatherPrefix: z.enum(["Mrs.", "Mr."]),
  fatherFirstName: z.string().nonempty("Father's first name is required"),
  fatherMiddleName: z.string().optional(),
  fatherLastName: z.string().nonempty("Father's last name is required"),
  motherPrefix: z.enum(["Mrs.", "Mr."]),
  motherFirstName: z.string().nonempty("Mother's first name is required"),
  motherMiddleName: z.string().optional(),
  motherLastName: z.string().nonempty("Mother's last name is required"),
  dateOfBirth: z
    .string()
    .refine((value) => !isNaN(Date.parse(value)), {
      message: "Invalid date format",
    })
    .transform((value) => new Date(value)),
  gender: z.enum(["Male", "Female", "Others"]),
  //   pancardNumber: z.number(),
  maritalStatus: z.enum(["Married", "Unmarried", "Others"]),
  citizenShip: z.string().nonempty("Citizenship is required"),
  residentialStatus: z.enum([
    "Individual",
    "Non Resident Indian",
    "Foreign National",
    "Person of Indian Origin",
  ]),
});

export { personalInformationSchema };
