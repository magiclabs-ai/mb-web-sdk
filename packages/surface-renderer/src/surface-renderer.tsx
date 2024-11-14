import { Stage, Layer, Rect, Image as Img, Group } from "react-konva";
import useImage from "use-image";
import type { LayeredItem, Surface } from "@/core/models/surface";
import type { PhotoAnalyzeBody } from "@/core/models/photo";

function aspectRation(w: number, h: number): number {
  return w / h;
}

function convertToPixels(surface: Surface, targetHeight = 100) {
  const ar = aspectRation(surface.surfaceData.pageDetails.width, surface.surfaceData.pageDetails.height);
  surface.surfaceData.pageDetails.width = targetHeight * ar;
  surface.surfaceData.pageDetails.height = targetHeight;

  const { pageDetails, layeredItems } = surface.surfaceData;
  const { width, height } = pageDetails;

  const convert = (value: number, dimension: number) => value * dimension;

  const convertedLayeredItems = layeredItems.map((item) => ({
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

  return {
    ...surface,
    surfaceData: {
      ...surface.surfaceData,
      layeredItem: convertedLayeredItems,
    },
  };
}

function Image({
  x,
  y,
  width,
  height,
  url,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  url: string;
}) {
  const [image] = useImage(url);
  return <Img image={image} x={x} y={y} width={width} height={height} />;
}

export function SurfaceRenderer({
  surface,
  photos,
  debug,
  height,
}: { surface: Surface; photos: PhotoAnalyzeBody; debug?: boolean; height?: number }) {
  const convertedSurface = convertToPixels(surface, height);
  const pageWidth = convertedSurface.surfaceData.pageDetails.width;
  const pageHeight = convertedSurface.surfaceData.pageDetails.height;

  return (
    <Stage width={pageWidth} height={pageHeight}>
      <Layer>
        {debug ? <Rect width={pageWidth} height={pageHeight} strokeWidth={1} stroke="blue" StrokeWidth={2} /> : null}
        {convertedSurface.surfaceData.layeredItem.map(({ container, content }: LayeredItem) => (
          <Group
            key={content.userData.assetId}
            x={container.x}
            y={container.y}
            clipHeight={container.h}
            clipWidth={container.w}
          >
            <Image
              url={photos.find((photo) => photo.id === content.userData.assetId)?.url || ""}
              x={content.userData.x - container.x}
              y={content.userData.y - container.y}
              width={content.userData.w}
              height={content.userData.h}
            />
            {debug ? (
              <Rect width={container.w} height={container.h} stroke="red" strokeWidth={2} fill="transparent" />
            ) : null}
          </Group>
        ))}
      </Layer>
    </Stage>
  );
}
