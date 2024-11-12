import { z } from "zod";

export const metadataSchema = z.object({
  name: z.string(),
  value: z.string(),
  metadataType: z.string(),
});

// Infer type from schema
export type Metadata = z.infer<typeof metadataSchema>;
