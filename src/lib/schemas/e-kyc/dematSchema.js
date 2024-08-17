import { z } from "zod";

const DepositoryEnum = z.enum([
  "NSDL", // National Securities Depository Limited
  "CDSL", // Central Depository Services Limited
  "Others", // Any other depositories
]);

const dematSchema = z.object({
  depository: DepositoryEnum,
  dpID: z.string().length(16, "DP ID must be exactly 16 characters long"),
  clientID: z
    .string()
    .length(16, "Client ID must be exactly 16 characters long"),
  primary: z.boolean(),
  clientMasterCopy: z
    .instanceof(File)
    .or(z.string().nullable())
    .refine((file) => {
      if (file instanceof File) {
        return file.size <= 5 * 1024 * 1024;
      }
      return true;
    }, "File size must be less than 5 MB"),
});

const dematArraySchema = z.array(dematSchema).refine((arr) => {
  const primaryCount = arr.filter((detail) => detail.primary).length;
  return primaryCount === 1;
}, "Exactly one demat account must be marked as primary");

export default dematArraySchema;
