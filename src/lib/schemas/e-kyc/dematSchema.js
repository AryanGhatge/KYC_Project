import { z } from "zod";

const DepositoryEnum = z.enum([
  "NSDL", // National Securities Depository Limited
  "CDSL", // Central Depository Services Limited
  "Others", // Any other depositories
]);

export const dematSchema = z.object({
  depository: DepositoryEnum.refine((val) => val !== undefined, {
    message: "Please select a depository",
  }),
  dpID: z.string()
    .min(1, "DP ID is required")
    .regex(/^IN\d{14}$/, "DP ID must start with 'IN' followed by 14 digits for NSDL")
    .or(z.string().regex(/^\d{16}$/, "DP ID must be 16 digits for CDSL")),
  clientID: z.string()
    .min(1, "Client ID is required")
    .regex(/^\d{16}$/, "Client ID must be exactly 16 digits"),
  primary: z.boolean(),
  clientMasterCopy: z.any().refine((val) => val !== null, {
    message: "Please upload Client Master Copy",
  }),
});
