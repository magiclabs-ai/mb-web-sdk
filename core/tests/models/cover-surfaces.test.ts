import { describe, expect, test } from "vitest";
import { MagicBookAPI } from "@/core/models/api";
import { autofillSurfaceSchema, surfaceSchema } from "@/core/models/surface";
import { projectAutofillBodySchema } from "@/core/models/project";
import { projectFactory } from "@/core/factories/project";
import { coverSurfaces, emptyPhotoWell, frontCoverSurface, textLayers } from "@/core/tests/fixtures/cover-surfaces";

const api = new MagicBookAPI({ apiKey: "fake key", mock: true });

function parseWithLayer(layer: unknown) {
  return surfaceSchema.safeParse({
    ...frontCoverSurface,
    surfaceData: { ...frontCoverSurface.surfaceData, layeredItems: [layer] },
  });
}

/**
 * Before this work `surfaceSchema` modelled photo layers only, so an authored cover design could not be
 * sent: an empty well failed on its absent `assetId`/`journalCore`, and text layers failed on the
 * `w/h/x/y/rot` geometry a text `userData` does not carry.
 */
describe("authored cover surfaces", () => {
  test("a whole authored cover parses, empty well and authored text included", () => {
    const result = surfaceSchema.safeParse(frontCoverSurface);

    expect(result.success).toBe(true);
    expect(result.data?.surfaceData.layeredItems).toHaveLength(9);

    const copy = result.data?.surfaceData.layeredItems
      .filter((item) => item.type === "text")
      .map((item) => (item.content as { userData: { fullText?: string } }).userData.fullText);
    expect(copy).toStrictEqual(["The Best", "Mom", "we love you"]);
  });

  test("an empty photo well parses and keeps its zeroed userData", () => {
    const result = parseWithLayer(emptyPhotoWell);

    expect(result.success).toBe(true);
    expect(result.data?.surfaceData.layeredItems[0].content.userData).toStrictEqual({
      w: 0,
      h: 0,
      x: 0,
      y: 0,
      rot: 0,
    });
  });

  // PremiumUserText is the other text content type the API defines; because contentType discriminates
  // the content union, missing it made a premium layer fail against the photo shape instead.
  test("both UserText and PremiumUserText layers parse", () => {
    const [textLayer] = textLayers;

    for (const contentType of ["UserText", "PremiumUserText"]) {
      const layer = { ...textLayer, content: { ...textLayer.content, contentType } };
      expect(parseWithLayer(layer).success).toBe(true);
    }
  });

  test("a photo well without geometry is still rejected", () => {
    const brokenWell = {
      type: "photo",
      content: { contentType: "UserPhoto", userData: { assetId: "abc" } },
      container: { w: 1, h: 1, x: 0, y: 0, rot: 0 },
      layerMetadata: [],
    };

    expect(parseWithLayer(brokenWell).success).toBe(false);
  });
});

describe("surfaces on the autofill request body", () => {
  test("surfaces are optional, and carry the request-only fields when present", () => {
    const { surfaces: _ignored, ...body } = projectFactory({ noSurfaces: true });

    const without = projectAutofillBodySchema.safeParse(body);
    expect(without.success).toBe(true);
    expect(without.data).not.toHaveProperty("surfaces");

    const withCovers = projectAutofillBodySchema.safeParse({ ...body, surfaces: coverSurfaces });
    expect(withCovers.success).toBe(true);
    expect(withCovers.data?.surfaces?.map((surface) => surface.surfaceNumber)).toStrictEqual([-2, -4]);
    expect(withCovers.data?.surfaces?.[0].surfaceType).toBe("front");
  });

  // The API must not echo surfaceType/layoutId back, so the response shape does not model them.
  test("surfaceSchema does not carry the request-only fields", () => {
    const parsed = surfaceSchema.parse(frontCoverSurface);

    expect(parsed).not.toHaveProperty("surfaceType");
    expect(parsed).not.toHaveProperty("layoutId");
    expect(autofillSurfaceSchema.parse(frontCoverSurface).layoutId).toBe("DA_4177725");
  });

  test("keys are converted to the snake_case the API expects", () => {
    const [front] = JSON.parse(api.bodyParse({ surfaces: coverSurfaces })).surfaces;
    const well = front.surface_data.layered_items.find((item: { type: string }) => item.type === "photo");
    const text = front.surface_data.layered_items.find((item: { type: string }) => item.type === "text");

    expect(front.surface_type).toBe("front");
    expect(front.layout_id).toBe("DA_4177725");
    expect(front.surface_data.page_details.dpi).toBe(300);
    expect(well.content.user_data).toStrictEqual({ w: 0, h: 0, x: 0, y: 0, rot: 0 });
    expect(text.content.text_class).toBe("headline");
    expect(text.content.user_data.lines_of_text[0].user_line_feed).toBe(false);
  });

  test("a body without surfaces is unchanged by this feature", () => {
    const project = projectFactory();
    const { surfaces: _ignored, ...body } = project;

    expect(JSON.parse(api.bodyParse(body))).not.toHaveProperty("surfaces");
    // The pre-existing populated-well shape must still validate.
    expect(surfaceSchema.safeParse(project.surfaces[0]).success).toBe(true);
  });
});
