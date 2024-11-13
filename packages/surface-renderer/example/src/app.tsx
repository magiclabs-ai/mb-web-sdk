import { SurfaceRenderer } from "@magiclabs.ai/mb-surface-renderer";

function App() {
  const surface = {
    surfaceNumber: 1,
    surfaceData: {
      pageDetails: {
        width: 8,
        height: 11,
      },
      layeredItem: [
        {
          container: {
            w: 0.9770833333333333,
            h: 0.4833333333333333,
            x: 0.011458333333333333,
            y: 0.008333333333333333,
            rot: 0,
          },
          content: {
            userData: {
              assetId: "IMG_7017.jpg",
              x: 0.011458333333333333,
              y: 0.008333333333333333,
              w: 0.9770833333333333,
              h: 0.4833333333333333,
              rot: 0,
            },
            contentType: "UserPhoto",
          },
          type: "photo",
        },
        {
          container: {
            w: 0.5187499999999999,
            h: 0.4833333333333334,
            x: 0.011458333333333333,
            y: 0.5083333333333333,
            rot: 0,
          },
          content: {
            userData: {
              assetId: "Rome - 27.jpg",
              x: 0.011458333333333333,
              y: 0.5083333333333333,
              w: 0.5187499999999999,
              h: 0.4833333333333334,
              rot: 0,
            },
            contentType: "UserPhoto",
          },
          type: "photo",
        },
      ],
    },
    surfaceMetadata: [
      {
        name: "categoryName",
        metadataType: "Category",
        value: "inside",
      },
    ],
    version: "4.0",
  };

  return (
    <>
      <h1>Hello World</h1>
      <SurfaceRenderer surface={surface} />
    </>
  );
}

export default App;
