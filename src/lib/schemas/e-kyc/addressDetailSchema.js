import { z } from "zod";

export const addressDetailSchema = z.object({
  permanentAddress: z.string().min(1, "Address is required"),
  landmark: z.string().optional(),
  permanentCity: z.string().min(1, "City is required"),
  permanentDistrict: z.string().min(1, "District is required"),
  permanentPincode: z.string().min(1, "Pincode is required"),
  permanentState: z.string().min(1, "State is required"),
  permanentCountry: z.string().min(1, "Country is required"),
});
