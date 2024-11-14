![GitHub CI](https://github.com/magiclabs-ai/mb-web-sdk/actions/workflows/ci.yml/badge.svg) [![npm version](https://img.shields.io/npm/v/@magiclabs.ai/mb-web-sdk.svg)](https://www.npmjs.com/package/@magiclabs.ai/mb-web-sdk)

# mb-surface-renderer

React package to render a project surface from aurora.

## Installation

```bash
npm install @magiclabs.ai/mb-surface-renderer
```

## Usage
To render a surface simply use the SurfaceRenderer component.

```tsx
<SurfaceRenderer surface={surface} photos={[...]} height={350} />
```

## Debug Mode
To render a surface in debug set debug prop to `true`.

```tsx
<SurfaceRenderer surface={surface} photos={[...]} debug height={350} />
```

## Example

To see the MagicBook client in action, run the following commands (make sure you created a `.env` file before building):

```bash
cd example
npm i
npm run dev
```
