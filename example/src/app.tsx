import { MagicBookAPI, type MBEvent, type AnalyzedPhoto, type Surface } from "@magiclabs.ai/mb-web-sdk";
import { SurfaceRenderer } from "@magiclabs.ai/mb-surface-renderer";
import { useEffect, useState } from "react";
import niceAndRome from "../../core/data/image-sets/00-nice-and-rome-client.json";

function App() {
  const test = niceAndRome["00-nice-and-rome"].map((image) => ({
    id: image.handle,
    width: image.width,
    height: image.height,
    orientation: image.rotation,
    url: image.url,
  }));
  const [photos, setPhotos] = useState<Array<AnalyzedPhoto>>([]);
  const [surfaces, setSurfaces] = useState<Array<Surface>>([]);
  const [areConnectionsOpen, setAreConnectionsOpen] = useState(false);
  const [mb, setMbApi] = useState<MagicBookAPI>();

  useEffect(() => {
    function addMagicBookEventListener() {
      window.addEventListener("MagicBook", handleEvent as EventListener);
    }

    function removeMagicBookEventListener() {
      window.removeEventListener("MagicBook", handleEvent as EventListener);
    }
    addMagicBookEventListener();

    setMbApi(
      new MagicBookAPI({
        apiKey: import.meta.env.VITE_MB_API_KEY,
        // mock: true,
      }),
    );
    return () => {
      removeMagicBookEventListener();
    };
  }, []);

  function handleEvent(event: CustomEvent<MBEvent<unknown>>) {
    console.log("MagicBook", event.detail.eventName, event.detail.request, event.detail.result);
    if (event.detail.eventName === "ws" && (event.detail.result as Record<string, string>).areConnectionsOpen) {
      setAreConnectionsOpen(true);
    }
    if (event.detail.eventName === "photo.analyze") {
      const photo = event.detail.result as AnalyzedPhoto;
      setPhotos((prevPhotos) => [...prevPhotos, photo]);
    }
    if (event.detail.eventName === "project.autofilled") {
      const surface = event.detail.result as Array<Surface>;
      setSurfaces((prevSurfaces) => [...prevSurfaces, surface[0]]);
    }
  }

  useEffect(() => {
    if (photos.length === niceAndRome["00-nice-and-rome"].length) {
      console.log(`All ${photos.length} photos are analyzed`);
    }
  }, [photos]);

  async function analyzePhotos() {
    await mb?.photos.analyze(test);
  }

  async function createProjectWithAutofill() {
    await mb?.projects.autofill({
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
      images: photos,
    });
  }

  return (
    <div className="flex h-screen gap-4 p-4 font-mono">
      <div className="flex flex-col flex-1 overflow-hidden border">
        <div className="w-full h-20 p-4 bg-white border-b ">
          <h1 className="text-lg font-semibold">MagicBook Web SDK Example</h1>
          <div className="text-sm">
            <span>WS Connections Open: </span>
            <span>{areConnectionsOpen ? "✅" : "❌"}</span>
          </div>
        </div>

        <div className="flex flex-1 gap-10 p-4 overflow-y-auto">
          <div>
            <h2 className="w-full pb-1 text-lg font-semibold">Photos</h2>
            <div className="flex flex-col items-start gap-4">
              <button type="button" onClick={analyzePhotos} disabled={!areConnectionsOpen}>
                1. Analyse Photos
              </button>
            </div>
          </div>
          <div>
            <h2 className="w-full pb-1 text-lg font-semibold">Project</h2>
            <div className="flex flex-col items-start gap-4">
              <button
                type="button"
                disabled={!areConnectionsOpen && photos.length === 0}
                onClick={createProjectWithAutofill}
              >
                2. Create Project with Autofill
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col flex-1 overflow-hidden border">
        <div className="w-full h-20 p-4 bg-white border-b ">
          <h1 className="text-lg font-semibold">Surfaces</h1>
          <div className="text-sm">
            Using <code>@magiclabs.ai/mb-surface-renderer</code>
          </div>
        </div>
        <div className="flex flex-col items-center flex-1 gap-10 p-4 overflow-y-auto">
          {surfaces.length > 1 ? (
            surfaces
              .sort((a, b) => {
                return a.surfaceNumber - b.surfaceNumber;
              })
              .map((surface) => {
                surface.surfaceData.layeredItems = surface.surfaceData.layeredItem;
                return (
                  <div className="border w-fit" key={surface.surfaceNumber}>
                    <SurfaceRenderer surface={surface} photos={test} height={350} />
                    <div className="flex justify-between p-2 text-sm border-t">
                      <span className="font-semibold ">{surface.surfaceNumber}</span>
                      <span>{surface.surfaceMetadata[0].value}</span>
                    </div>
                  </div>
                );
              })
          ) : (
            <div className="p-4">No surface to display</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
