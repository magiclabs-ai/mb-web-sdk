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

The events you will receive will have three props

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
    url: photo.url,
  }))
);
```

### Project

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
      width: 8.5,
      height: 11,
    },
    cover: {
      width: 8.5,
      height: 11,
    },
  },
  images: [...],
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
