![GitHub CI](https://github.com/magiclabs-ai/mb-client/actions/workflows/ci.yml/badge.svg) [![npm version](https://img.shields.io/npm/v/@magiclabs.ai/magicbook-client.svg)](https://www.npmjs.com/package/@magiclabs.ai/magicbook-client)

# mb-web-sdk

TypeScript package to interact with the MagicBook API.

## Installation

```bash
npm install @magiclabs.ai/web-sdk
```

## Usage

Create a MagicBook API instance with your API key.

```ts
const api = new MagicBookAPI({
  apiKey: 'api-key'
  mock: true | false //default to true
})`
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

### Surface

#### Autofill

To create a surface with autofill, call the `surface.autofill` function. Once ready, an event will be sent to the listener you created earlier.

```ts
await api.surface.autofill(props);
```

#### Shuffle

To create a surface with shuffle, call the `surface.shuffle` function. Once ready, an event will be sent to the listener you created earlier.

```ts
await api.surface.shuffle(props);
```

#### AutoAdapt

To create a surface with autoAdapt, call the `surface.autoAdapt` function. Once ready, an event will be sent to the listener you created earlier.

```ts
await api.surface.autoAdapt(props);
```

#### Suggest

To create a surface with suggest, call the `surface.suggest` function. Once ready, an event will be sent to the listener you created earlier.

```ts
await api.surface.suggest(props);
```

### Project

#### Autofill

To create a project with autofill, call the `project.autofill` function. Once ready, an event will be sent to the listener you created earlier.

```ts
await api.project.autofill(props);
```

#### Restyle

To create a project with restyle, call the `project.restyle` function. Once ready, an event will be sent to the listener you created earlier.

```ts
await api.project.restyle(props);
```

### Photo

#### Resize

To create a project with resize, call the `project.photo.resize` function. Once ready, an event will be sent to the listener you created earlier.

```ts
await api.project.photo.resize(props);
```

### Autofill Options

To retrieve autofill options by `imageCount`, call the `autofillOptions` function. This API will send the response directly.

```ts
await api.autofillOptions();
```

---

## Usage as script

For example using express convert to static route

```js
app.use(
  "/scripts/mb-web-sdk",
  express.static(__dirname + "/node_modules/@magiclabs.ai/web-sdk")
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
    const api = new MagicLabs.MagicBookAPI({
      apiKey: "api-key"
    })
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
