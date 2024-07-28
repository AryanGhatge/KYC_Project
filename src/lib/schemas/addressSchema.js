import { z } from "zod";

// Define the schema for personal information
const addressSchema = z.object({
  currentAddress: z.string().min(1, "Address is required"),
  //   landmark: z.string().optional(), // Make landmark optional if it's not required
  currentCity: z.string().min(1, "City is required"),
  currentDistrict: z.string().min(1, "District is required"),
  currentPincode: z.string().min(1, "Pincode is required"),
  currentState: z.string().min(1, "State is required"),
  currentCountry: z.string().min(1, "Country is required"),
  permanentAddress: z.string().min(1, "Address is required"),
  //   landmark: z.string().optional(), // Make landmark optional if it's not required
  permanentCity: z.string().min(1, "City is required"),
  permanentDistrict: z.string().min(1, "District is required"),
  permanentPincode: z.string().min(1, "Pincode is required"),
  permanentState: z.string().min(1, "State is required"),
  permanentCountry: z.string().min(1, "Country is required"),
});

export { addressSchema };
