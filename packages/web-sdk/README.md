![GitHub CI](https://github.com/magiclabs-ai/mb-web-sdk/actions/workflows/ci.yml/badge.svg) [![npm version](https://img.shields.io/npm/v/@magiclabs.ai/mb-web-sdk.svg)](https://www.npmjs.com/package/@magiclabs.ai/mb-web-sdk)

# mb-web-sdk

TypeScript package to interact with the MagicBook API.

> :warning:
> This is currently a **mock** SDK. It only makes network calls if the `mock` property on `MagicBookAPI` is not set or is set to `false`. Otherwise, it returns canned responses and fake data. It is intended for testing purposes and does not reflect the design quality of the upcoming operational SDK.

## Installation

```bash
npm install @magiclabs.ai/mb-web-sdk
```

## Usage

Create a MagicBook API instance

```ts
const api = new MagicBookAPI({
  apiKey: string,
  mock?: boolean // Default to false
});
```

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

the events you will receive will have two props

```json
{
  "eventName": "surfaces.autofill"
  "request": {...}
  "result": {...}
}
```

### Photos

#### Analyze


To analyze an array of photos, call the `photos.analyze` function. Once ready, an event will be sent to the listener you created earlier.

```ts
await api.photos.analyse(
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
> :warning:
> Only available in mock mode.

To create a surface with autofill, call the `surfaces.autofill` function. Once ready, an event will be sent to the listener you created earlier.

```ts
await api.surfaces.autofill({
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
> :warning:
> Only available in mock mode.

To create a surface with shuffle, call the `surfaces.shuffle` function. Once ready, an event will be sent to the listener you created earlier.

```ts
await api.surfaces.shuffle({
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
> :warning:
> Only available in mock mode.

To create a surface with autoAdapt, call the `surfaces.autoAdapt` function. Once ready, an event will be sent to the listener you created earlier.

```ts
await api.surfaces.autoAdapt({
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
> :warning:
> Only available in mock mode.

To create a surface with suggest, call the `surfaces.suggest` function. Once ready, an event will be sent to the listener you created earlier.

```ts
await api.surfaces.suggest({
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
> :warning:
> Only available in mock mode.

To create a project with autofill, call the `projects.autofill` function. Once ready, a project event will be sent, followed by surface events, to the listener you created earlier.

```ts
await api.projects.autofill({
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
> :warning:
> Only available in mock mode.

To create a project with restyle, call the `projects.restyle` function. Once ready, a project event will be sent, followed by surface events, to the listener you created earlier.

```ts
await api.projects.restyle({
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
> :warning:
> Only available in mock mode.

To resize a project, call the `projects.resize` function. Once ready, a project event will be sent, followed by surface events, to the listener you created earlier.

```ts
await api.projects.resize({
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
> :warning:
> Only available in mock mode.

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
