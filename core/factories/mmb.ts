import { faker } from "@faker-js/faker";
import type {
    Customer,
    Order,
    PhotoMetadata,
    PhotoStrip,
    ReportingData,
    MakeMyBookSchema
} from "@/core/models/mmb";

export function customerFactory(): Customer {
    return {
        email: faker.internet.email(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        userId: faker.string.uuid(),
        refreshToken: faker.datatype.boolean() ? faker.string.uuid() : null,
        accessToken: faker.datatype.boolean() ? faker.string.uuid() : null,
        context: faker.word.sample(),
    };
}

export function orderFactory(): Order {
    return {
        creationTime: faker.date.recent().toISOString(),
        curate: faker.datatype.boolean(),
        photoStripCount: faker.number.int({ min: 1, max: 10 }),
        priority: faker.helpers.arrayElement(["low", "medium", "high"]),
        promoCode: faker.string.alphanumeric(10),
        size: faker.helpers.arrayElement(["small", "medium", "large"]),
        specialInstructions: faker.lorem.sentence(),
        subTitle: faker.lorem.words(3),
        title: faker.lorem.words(2),
        phoneNumber: faker.phone.number(),
        initialDevice: faker.helpers.arrayElement(["mobile", "desktop", "tablet"]),
        spreadDensity: faker.helpers.arrayElement(["low", "medium", "high"]),
        coverStyle: faker.lorem.word(),
        focusOption: faker.lorem.word(),
        hasSixColorPrinting: faker.datatype.boolean(),
        productType: faker.lorem.word(),
        coverSpecId: faker.string.uuid(),
        curateDensity: faker.number.float({ min: 0, max: 1, fractionDigits: 2 }),
        stickerDensity: faker.number.float({ min: 0, max: 1, fractionDigits: 2 }),
        occasion: faker.helpers.arrayElement(["birthday", "wedding", "holiday"]),
        photoStripSort: faker.lorem.word(),
        styleId: faker.number.int({ min: 1, max: 100 }),
        style: faker.number.int({ min: 1, max: 10 }),
        styleName: faker.lorem.word(),
        binding: faker.helpers.arrayElement(["hardcover", "softcover"]),
    };
}

export function photoMetadataFactory(): PhotoMetadata {
    return {
        id: faker.string.uuid(),
        title: faker.lorem.words(2),
        width: faker.number.int({ min: 500, max: 5000 }),
        source: faker.internet.url(),
        height: faker.number.int({ min: 500, max: 5000 }),
        data: faker.lorem.paragraph(),
        uploadTime: faker.date.recent().toISOString(),
        rotation: faker.number.int({ min: 0, max: 360 }),
        effect: faker.lorem.word(),
        llx: faker.number.float({ min: 0, max: 1, fractionDigits: 2 }),
        lly: faker.number.float({ min: 0, max: 1, fractionDigits: 2 }),
        urx: faker.number.float({ min: 0, max: 1, fractionDigits: 2 }),
        ury: faker.number.float({ min: 0, max: 1, fractionDigits: 2 }),
    };
}

export function photoStripFactory(): PhotoStrip {
    return {
        photoRefId: faker.number.int({ min: 1, max: 1000 }),
        encryptId: faker.string.uuid(),
        url: faker.internet.url(),
        urlWithEdits: faker.internet.url(),
        photoMetadata: photoMetadataFactory(),
    };
}

export function reportingDataFactory(): ReportingData {
    return {
        properties: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => ({
            key: faker.lorem.word(),
            value: faker.datatype.boolean() ? faker.lorem.word() : null,
        })),
    };
}

export function makeMyBookFactory(): MakeMyBookSchema {
    return {
        customer: customerFactory(),
        order: orderFactory(),
        photoStrip: Array.from({ length: faker.number.int({ min: 1, max: 10 }) }, photoStripFactory),
        reportingData: reportingDataFactory(),
    };
}
