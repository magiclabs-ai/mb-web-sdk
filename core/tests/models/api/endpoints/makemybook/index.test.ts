import { describe, expect, test } from "vitest";
import { MagicBookAPI } from "@/core/models/api";
import { vi } from "vitest";
import { beforeEach } from "vitest";
import { projectFactory } from "@/core/factories/project";
import { makeMyBookFactory } from "@/core/factories/mmb";

describe("Project", () => {
    const api = new MagicBookAPI({
        apiKey: "fake key",
        mock: true,
    });

    beforeEach(() => {
        vi.useFakeTimers({ shouldAdvanceTime: true });
    });

    test("makeMyBook", async () => {
        const projectWithoutSurfaces = makeMyBookFactory();

        const res = await api.makemybook.design(projectWithoutSurfaces);
        expect(res).toStrictEqual({});
    });
});
