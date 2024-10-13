import { z } from "zod";

const DepositoryEnum = z.enum([
  "NSDL", // National Securities Depository Limited
  "CDSL", // Central Depository Services Limited
  "Others", // Any other depositories
]);

export const dematSchema = z.object({
  depository: DepositoryEnum,
  dpID: z.string().length(16, "DP ID must be exactly 16 characters long"),
  clientID: z
    .string()
    .length(16, "Client ID must be exactly 16 characters long"),
  primary: z.boolean(),
  clientMasterCopy: z.any().nullable(),
});
