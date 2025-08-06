import { type Style, listStylesSchema, styleSchema, type ListStylesResponse } from "@/core/models/style";
import type { MagicBookAPI } from "../..";
import { listStylesFactory, styleFactory } from "@/core/factories/style";

export class StyleEndpoints {
  constructor(private readonly magicBookAPI: MagicBookAPI) {}

  async list(qs = "?state=active") {
    const path = `library/styles${qs}`;
    const request = this.magicBookAPI.dispatcher.add(path);

    try {
      const res = await this.magicBookAPI.fetcher.call<ListStylesResponse>({
        path,
        factory: async () => listStylesFactory(),
      });
      request.addEvent("fetch", path);
      return listStylesSchema.parse(res);
    } catch (error) {
      request.addEvent("fetch", path);
      throw error;
    }
  }

  async retrieve(styleId: string) {
    const path = `library/styles/${styleId}`;
    const request = this.magicBookAPI.dispatcher.add(path);

    try {
      const res = await this.magicBookAPI.fetcher.call<Style>({
        path,
        factory: async () => styleFactory(),
      });
      request.addEvent("fetch", path);
      return styleSchema.parse(res);
    } catch (error) {
      request.addEvent("fetch", path);
      throw error;
    }
  }
}
