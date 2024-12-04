![GitHub CI](https://github.com/magiclabs-ai/mb-web-sdk/actions/workflows/ci.yml/badge.svg) [![npm version](https://img.shields.io/npm/v/@magiclabs.ai/mb-web-sdk.svg)](https://www.npmjs.com/package/@magiclabs.ai/mb-web-sdk)

# mb-web-sdk

TypeScript package to interact with the MagicBook API.

## Installation

```bash
npm install @magiclabs.ai/mb-web-sdk
```

## Usage

First, set up a callback to handle the asynchronous responses from the request you will make.

```ts
window.addEventListener(
  "MagicBook",
  ((event: CustomEvent<MBEvent<unknown>>) => {
    // Handle the event
    console.log(event.detail);
  }) as EventListener
);
```

the events you will receive will have three props

```json
{
  "eventName": "surfaces.autofill"
  "request": {...}
  "result": {...}
}
```

Create a MagicBook API instance

```ts
const api = new MagicBookAPI({
  apiKey: string,
  mock?: boolean, // Default to false
  useIntAsPhotoId?: boolean // Default to false
});
```

Once you receive event `ws` with result
```json
{
  "areConnectionsOpen": true
}
```
you are ready to go!

### Photos

#### Analyze
To analyze an array of photos, call the `photos.analyze` function. Once ready, an event will be sent to the listener you created earlier.

```ts
await api.photos.analyze(
  photos.map((photo) => ({
    id: photo.handle, // string | number if useIntAsPhotoId is set to `true`
    width: photo.width, // number
    height: photo.height, // number
    orientation: photo.orientation, // number
    url: photo.url, // string
  }))
);
```

### Projects

#### Autofill
To create a project with autofill, call the `projects.autofill` function. Once ready, a project event will be sent, followed by surface events, to the listener you created earlier.

```ts
await api.projects.autofill({
  designMode: "automatic",
  occasion: "birthday",
  style: "modern",
  imageDensityLevel: "high",
  embellishmentLevel: "high",
  bookFormat: {
    targetPageRange: [20, 40],
    page: {
      width: 8,
      height: 11,
    },
    cover: {
      width: 8,
      height: 11,
    },
  },
  images: [...],
});
```

#### MakeMyBook
To create a project with Make My Book, call the `projects.makemybook` function. If successful the API will only return a 201 status code. The designed project will be ready much later after a human designer creates the book.

```ts
{
  "customer": {
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "userId": "b1d2c3a4-f5g6-789h-ijkl-1234567890mn",
    "refreshToken": null,
    "accessToken": "o9p8q7r6-s5t4-uvw3-xyz2-1234567890ab",
    "context": "birthday"
  },
  "order": {
    "creationTime": "2024-12-01T12:34:56.789Z",
    "curate": true,
    "photoStripCount": 5,
    "priority": "medium",
    "promoCode": "ABC123XYZ",
    "size": "medium",
    "specialInstructions": "Add extra embellishments.",
    "subTitle": "My Holiday Album",
    "title": "Holiday Memories",
    "phoneNumber": "123-456-7890",
    "initialDevice": "mobile",
    "spreadDensity": "medium",
    "coverStyle": "modern",
    "focusOption": "landscape",
    "hasSixColorPrinting": false,
    "productType": "photo book",
    "coverSpecId": "1234-5678-9012-3456",
    "curateDensity": 0.75,
    "stickerDensity": 0.5,
    "occasion": "holiday",
    "photoStripSort": "date",
    "styleId": 7,
    "style": 3,
    "styleName": "Minimalist",
    "binding": "hardcover"
  },
  "photoStrip": [
    {
      "photoRefId": 123,
      "encryptId": "a1b2c3d4e5f6",
      "url": "https://example.com/photo1.jpg",
      "urlWithEdits": "https://example.com/photo1-edited.jpg",
      "photoMetadata": {
        "id": "d4e5f6g7h8i9",
        "title": "Vacation Beach",
        "width": 1920,
        "source": "https://example.com/photo1-source.jpg",
        "height": 1080,
        "data": "Base64EncodedDataHere",
        "uploadTime": "2024-11-30T08:45:00.000Z",
        "rotation": 90,
        "effect": "sepia",
        "llx": 0.1,
        "lly": 0.2,
        "urx": 0.8,
        "ury": 0.9
      }
    }
  ],
  "reportingData": {
    "properties": [
      {
        "key": "album_created",
        "value": "2024-12-01"
      },
      {
        "key": "theme",
        "value": "holiday"
      }
    ]
  }
}
```

#### Restyle

To create a project with restyle, call the `projects.restyle` function. Once ready, a project event will be sent, followed by surface events, to the listener you created earlier.

```ts
await api.projects.restyle({
  designMode: "automatic",
  occasion: "birthday",
  style: "modern",
  imageDensityLevel: "high",
  embellishmentLevel: "high",
  bookFormat: {
    targetPageRange: [20, 40],
    page: {
      width: 8,
      height: 11,
    },
    cover: {
      width: 8,
      height: 11,
    },
  },
  images: [...],
  surfaces: [[surface1], [surface2], ...]
});
```

#### Resize

To resize a project, call the `projects.resize` function. Once ready, a project event will be sent, followed by surface events, to the listener you created earlier.

```ts
await api.projects.resize({
  designMode: "automatic",
  occasion: "birthday",
  style: "modern",
  imageDensityLevel: "high",
  embellishmentLevel: "high",
  bookFormat: {
    targetPageRange: [20, 40],
    page: {
      width: 8,
      height: 11,
    },
    cover: {
      width: 8,
      height: 11,
    },
  },
  images: [...],
  surfaces: [[surface1], [surface2], ...]
});
```

### Surfaces

#### Shuffle

To create a surface with shuffle, call the `surfaces.shuffle` function. Once ready, an event will be sent to the listener you created earlier.

```ts
await api.surfaces.shuffle({
  designMode: "automatic",
  occasion: "birthday",
  style: "modern",
  imageDensityLevel: "high",
  embellishmentLevel: "high",
  bookFormat: {
    targetPageRange: [20, 40],
    page: {
      width: 8,
      height: 11,
    },
    cover: {
      width: 8,
      height: 11,
    },
  },
  images: [...],
  surfaces: [surface1, ...]
});
```

#### AutoAdapt

To create a surface with autoAdapt, call the `surfaces.autoAdapt` function. Once ready, an event will be sent to the listener you created earlier.

```ts
await api.surfaces.autoAdapt({
  designMode: "automatic",
  occasion: "birthday",
  style: "modern",
  imageDensityLevel: "high",
  embellishmentLevel: "high",
  bookFormat: {
    targetPageRange: [20, 40],
    page: {
      width: 8,
      height: 11,
    },
    cover: {
      width: 8,
      height: 11,
    },
  },
  images: [...],
  surfaces: [surface1, ...]
});
```

#### Suggest

To create a surface with suggest, call the `surfaces.suggest` function. Once ready, an event will be sent to the listener you created earlier.

```ts
await api.surfaces.suggest({
  designMode: "automatic",
  occasion: "birthday",
  style: "modern",
  imageDensityLevel: "high",
  embellishmentLevel: "high",
  bookFormat: {
    targetPageRange: [20, 40],
    page: {
      width: 8,
      height: 11,
    },
    cover: {
      width: 8,
      height: 11,
    },
  },
  images: [...],
  surfaces: [surface1, ...]
});
```

---

## Usage as script

For example using express convert to static route

```js
app.use(
  "/scripts/mb-web-sdk",
  express.static(__dirname + "/node_modules/@magiclabs.ai/mb-web-sdk")
);
```

```html
<!DOCTYPE html>
<html>
  <head>
    <script
      type="text/javascript"
      src="/scripts/mb-web-sdk/index.iife.js"
    ></script>
  </head>
  <script type="text/javascript">
    const api = new MagicLabs.MagicBookAPI({...})
    
    window.addEventListener("MagicBook", async (event) => {
      if (event.detail.eventName === 'ws' && event.detail.result.areConnectionsOpen) {
        await makeBookRequest();
      }
    });

    async function makeBookRequest() {
      const test = await api.photos.analyze([
        {
          id: "1234",
          orientation: 0,
          width: 100,
          height: 100,
          url: "https://...",
        },
      ]);
    }
  </script>
</html>
```

## Example

To see the MagicBook client in action, run the following commands (make sure you created a `.env` file before building):

```bash
npm run build
cd example
npm i
npm run dev
```
