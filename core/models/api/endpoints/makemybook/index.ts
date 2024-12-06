import type { MagicBookAPI } from "../..";
import { handleAsyncFunction } from "@/core/utils/toolbox";
import type { z } from "zod";
import { makeMyBookSchema } from "@/core/models/mmb";


export type MMBDesignRequestBody = z.infer<typeof makeMyBookSchema>;

export class makeMyBookEndpoints {
    constructor(private readonly magicBookAPI: MagicBookAPI) { }

    design(body: MMBDesignRequestBody) {
        return handleAsyncFunction(async () => {
            return {};
        });
    }
}
