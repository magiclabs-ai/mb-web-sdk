![GitHub CI](https://github.com/magiclabs-ai/mb-web-sdk/actions/workflows/ci.yml/badge.svg) [![npm version](https://img.shields.io/npm/v/@magiclabs.ai/mb-web-sdk.svg)](https://www.npmjs.com/package/@magiclabs.ai/mb-web-sdk)

# mb-web-sdk

TypeScript package to interact with the MagicBook API.

## Installation

```bash
npm install @magiclabs.ai/mb-web-sdk
```

## Usage

Create a MagicBook API instance

```ts
const api = new MagicBookAPI();
```

First, set up a callback to handle the asynchronous responses from the request you will make.

```ts
window.addEventListener(
  "MagicBook",
  async((designRequestEvent: DesignRequestEvent) => {
    console.log(designRequestEvent.detail);
  }) as EventListener
);
```

the events you will receive will have two props

```json
{
  "eventName": "surface.autofill"
  "payload": {...}
}
```

### Photo

#### Analyze

To analyze an array of photos, call the `photo.analyze` function. Once ready, an event will be sent to the listener you created earlier.

```ts
await api.photo.analyse(
  photos.map((photo) => ({
    id: photo.handle,
    width: photo.width,
    height: photo.height,
    orientation: photo.rotation,
    url: photo.url,
  }))
);
```

### Surface

#### Autofill

To create a surface with autofill, call the `surface.autofill` function. Once ready, an event will be sent to the listener you created earlier.

```ts
await api.surface.autofill({
  photos: [...],
  surface: {
    id: "surfaceId",
    number: 1,
    data: {
      pageDetails: {
        width: 100,
        height: 100,
      },
      layeredItems: [],
    },
  },
});
```

#### Shuffle

To create a surface with shuffle, call the `surface.shuffle` function. Once ready, an event will be sent to the listener you created earlier.

```ts
await api.surface.shuffle({
  photos: [...],
  surface: {
    id: "surfaceId",
    number: 1,
    data: {
      pageDetails: {
        width: 100,
        height: 100,
      },
      layeredItems: [],
    },
  },
});
```

#### AutoAdapt

To create a surface with autoAdapt, call the `surface.autoAdapt` function. Once ready, an event will be sent to the listener you created earlier.

```ts
await api.surface.autoAdapt({
  photos: [...],
  surface: {
    id: "surfaceId",
    number: 1,
    data: {
      pageDetails: {
        width: 100,
        height: 100,
      },
      layeredItems: [],
    },
  },
});
```

#### Suggest

To create a surface with suggest, call the `surface.suggest` function. Once ready, an event will be sent to the listener you created earlier.

```ts
await api.surface.suggest({
  photos: [...],
  surface: {
    id: "surfaceId",
    number: 1,
    data: {
      pageDetails: {
        width: 100,
        height: 100,
      },
      layeredItems: [],
    },
  },
});
```

### Project

#### Autofill

To create a project with autofill, call the `project.autofill` function. Once ready, a project event will be sent, followed by surface events, to the listener you created earlier.

```ts
await api.project.autofill({
  photos: [...],
  metadata: [
    {
      name: "designName",
      value: "Travel Memories",
    },
  ],
});
```

#### Restyle

To create a project with restyle, call the `project.restyle` function. Once ready, a project event will be sent, followed by surface events, to the listener you created earlier.

```ts
await api.project.restyle({
  photos: [...],
  metadata: [
    {
      name: "designName",
      value: "Travel Memories",
    },
  ],
});
```

#### Resize

To resize a project, call the `project.resize` function. Once ready, a project event will be sent, followed by surface events, to the listener you created earlier.

```ts
await api.project.resize({
  photos: [...],
  metadata: [
    {
      name: "designName",
      value: "Travel Memories",
    },
  ],
});
```

### Autofill Options

To retrieve autofill options by `imageCount`, call the `autofillOptions` function. This API will send the response directly.

```ts
await api.autofillOptions.retrieve(100);
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
    const api = new MagicLabs.MagicBookAPI()
    ...
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
