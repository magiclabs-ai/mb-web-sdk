import type { MagicBookAPI } from "../..";
import { faker } from "@faker-js/faker";
import { z } from "zod";

const densitySchema = z.object({
  minImageCount: z.number(),
  avgImageCount: z.number(),
  maxImageCount: z.number(),
  minPageCount: z.number(),
  maxPageCount: z.number(),
});

const densitiesSchema = z.object({
  low: densitySchema,
  medium: densitySchema,
  high: densitySchema,
});

type DesignOptionsResponse = {
  densities: z.infer<typeof densitiesSchema>;
};

export class mmb {
  constructor(private readonly magicBookAPI: MagicBookAPI) {}

  async designOptions(sku: string, imageCount: number, imageFilteringLevel: string) {
    const path = `mmb/v1/designoptions/sku/${sku}/imagecount/${imageCount}/imagefilteringlevel/${imageFilteringLevel}/`;
    const dispatcher = this.magicBookAPI.dispatcher.add(path);
    const res = await this.magicBookAPI.fetcher.call<DesignOptionsResponse>({
      path,
      options: {
        method: "GET",
      },
      factory: async () => {
        return {
          densities: {
            low: {
              minImageCount: 1,
              avgImageCount: 2,
              maxImageCount: 3,
              minPageCount: 4,
              maxPageCount: 5,
            },
            medium: {
              minImageCount: 1,
              avgImageCount: 2,
              maxImageCount: 3,
              minPageCount: 4,
              maxPageCount: 5,
            },
            high: {
              minImageCount: 1,
              avgImageCount: 2,
              maxImageCount: 3,
              minPageCount: 4,
              maxPageCount: 5,
            },
          },
        } as DesignOptionsResponse;
      },
    });

    dispatcher.id = faker.string.uuid();
    dispatcher.addEvent("fetch", path);

    return densitiesSchema.parse(res.densities);
  }
}
