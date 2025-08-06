import { z } from "zod/v4";

export const styleSchema = z.object({
  id: z.string(),
  name: z.string(),
  fonts: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      family: z.string().optional(),
    }),
  ),
});

export type Style = z.infer<typeof styleSchema>;

export const listStylesSchema = z.object({
  nextCursor: z.string().optional(),
  items: z.array(styleSchema),
});

export type ListStylesResponse = z.infer<typeof listStylesSchema>;
