import { z } from "zod";


export const customerSchema = z.object({
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    userId: z.string(),
    refreshToken: z.string().nullable(),
    accessToken: z.string().nullable(),
    context: z.string(),
});

export const orderSchema = z.object({
    creationTime: z.string(),
    curate: z.boolean(),
    photoStripCount: z.number(),
    priority: z.string(),
    promoCode: z.string(),
    size: z.string(),
    specialInstructions: z.string(),
    subTitle: z.string(),
    title: z.string(),
    phoneNumber: z.string(),
    initialDevice: z.string(),
    spreadDensity: z.string(),
    coverStyle: z.string(),
    focusOption: z.string(),
    hasSixColorPrinting: z.boolean(),
    productType: z.string(),
    coverSpecId: z.string(),
    curateDensity: z.number(),
    stickerDensity: z.number(),
    occasion: z.string(),
    photoStripSort: z.string(),
    styleId: z.number(),
    style: z.number(),
    styleName: z.string(),
    binding: z.string(),
});

export const photoMetadataSchema = z.object({
    id: z.string(),
    title: z.string(),
    width: z.number(),
    source: z.string(),
    height: z.number(),
    data: z.string(),
    uploadTime: z.string(),
    rotation: z.number(),
    effect: z.string(),
    llx: z.number(),
    lly: z.number(),
    urx: z.number(),
    ury: z.number(),
});

export const photoStripSchema = z.object({
    photoRefId: z.number(),
    encryptId: z.string(),
    url: z.string().url(),
    urlWithEdits: z.string().url(),
    photoMetadata: photoMetadataSchema,
});

export const reportingDataSchema = z.object({
    properties: z.array(z.object({
        key: z.string(),
        value: z.string().nullable(),
    })),
});

export const makeMyBookSchema = z.object({
    customer: customerSchema,
    order: orderSchema,
    photoStrip: z.array(photoStripSchema),
    reportingData: reportingDataSchema,
});

export type Customer = z.infer<typeof customerSchema>;
export type Order = z.infer<typeof orderSchema>;
export type PhotoMetadata = z.infer<typeof photoMetadataSchema>;
export type PhotoStrip = z.infer<typeof photoStripSchema>;
export type ReportingData = z.infer<typeof reportingDataSchema>;
export type MakeMyBookSchema = z.infer<typeof makeMyBookSchema>;
