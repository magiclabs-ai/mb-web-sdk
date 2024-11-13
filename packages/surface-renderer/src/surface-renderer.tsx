import { Stage, Layer, Rect } from "react-konva";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function convertToPixels(surface: Record<string, any>, scale = 100) {
  surface.surfaceData.pageDetails.width *= scale;
  surface.surfaceData.pageDetails.height *= scale;

  const { pageDetails, layeredItem } = surface.surfaceData;
  const { width, height } = pageDetails;

  const convert = (value: number, dimension: number) => value * dimension;

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const convertedLayeredItems = layeredItem.map((item: any) => ({
    ...item,
    container: {
      ...item.container,
      w: convert(item.container.w, width),
      h: convert(item.container.h, height),
      x: convert(item.container.x, width),
      y: convert(item.container.y, height),
    },
    content: {
      ...item.content,
      userData: {
        ...item.content.userData,
        w: convert(item.content.userData.w, width),
        h: convert(item.content.userData.h, height),
        x: convert(item.content.userData.x, width),
        y: convert(item.content.userData.y, height),
      },
    },
  }));

  // Return a new surface object with updated layered items
  return {
    ...surface,
    surfaceData: {
      ...surface.surfaceData,
      layeredItem: convertedLayeredItems,
    },
  };
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function SurfaceRenderer({ surface }: { surface: any }) {
  const convertedSurface = convertToPixels(surface);
  const width = convertedSurface.surfaceData.pageDetails.width;
  const height = convertedSurface.surfaceData.pageDetails.height;

  return (
    <Stage width={width} height={height}>
      <Layer>
        <Rect width={width} height={height} fill="white" strokeWidth={1} stroke="#ff0000" />
        {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
        {convertedSurface.surfaceData.layeredItem.map((item: any) => (
          <Rect
            key={item.content.userData.assetId}
            x={item.container.x}
            y={item.container.y}
            width={item.container.w}
            height={item.container.h}
            fill="red"
          />
        ))}
      </Layer>
    </Stage>
  );
}
