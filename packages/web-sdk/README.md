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
  mock?: boolean // Default to false
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
