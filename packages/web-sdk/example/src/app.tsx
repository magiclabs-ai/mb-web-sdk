import {
  MagicBookAPI,
  type WSMessage,
  type AnalyzedPhoto,
  type Project,
  type Surface,
  type SurfaceShuffleBody,
  photoAnalyzeBodySchema,
} from "@magiclabs.ai/mb-web-sdk";
import { useEffect, useState } from "react";
import niceAndRome from "../../../../core/data/image-sets/00-nice-and-rome-client.json";
// import images from "../../../../core/data/image-sets/images.json";
// import images from "../../../../core/data/image-sets/small-image-set.json";

function App() {
  const [photos, setPhotos] = useState<Array<AnalyzedPhoto>>([]);
  const hasPhotos = photos.length > 0;
  const [surfaces, setSurfaces] = useState<Array<Surface>>([]);
  const hasSurface = surfaces.length > 0;
  const [areConnectionsOpen, setAreConnectionsOpen] = useState(false);
  const [mb, setMbApi] = useState<MagicBookAPI>();
  const [project, setProject] = useState<Project>({
    designMode: "automatic",
    occasion: "birthday",
    style: "DG_39651",
    imageFilteringLevel: "best",
    imageDensityLevel: "high",
    embellishmentLevel: "lots",
    bookFormat: {
      targetPageRange: [20, 111],
      page: {
        width: 2385,
        height: 2385,
      },
      bleed: {
        top: 0.1,
        right: 0.1,
        bottom: 0.1,
        left: 0.1,
      },
      cover: {
        width: 2505,
        height: 2910,
      },
      coverWrap: {
        top: 0.85,
        right: 0.85,
        bottom: 0.85,
        left: 0.85,
      },
    },
    images: photos,
    surfaces: surfaces,
  });
  const [surfaceEndpointProps, setSurfaceEndpointProps] = useState<SurfaceShuffleBody | null>();

  useEffect(() => {
    const { surfaces, ...projectProps } = project;
    setSurfaceEndpointProps({
      ...projectProps,
      surfaces: surfaces.slice(0, 2),
    } as SurfaceShuffleBody);
  }, [project]);

  useEffect(() => {
    setProject((oldProject: Project) => ({
      ...oldProject,
      images: [...photos],
      surfaces,
    }));
  }, [surfaces, photos]);

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
        apiHost: "api.dev.magiclabs-aurora.io",
        debugMode: true,
        // mock: true,
      }),
    );
    return () => {
      removeMagicBookEventListener();
    };
  }, []);

  function handleEvent(event: CustomEvent<WSMessage<unknown>>) {
    console.log("MagicBook", event.detail.eventName, event.detail.request, event.detail.result, event.detail.eventType);
    if (
      event.detail.eventName === "ws" &&
      (event.detail.result as { areConnectionsOpen: boolean }).areConnectionsOpen
    ) {
      setAreConnectionsOpen(true);
    }
    if (event.detail.eventName === "photo.analyzed") {
      const photo = event.detail.result as AnalyzedPhoto;
      console.log("Photo Analyzed", photo);
      setPhotos((prevPhotos) => [...prevPhotos, photo]);
    }
    if (event.detail.eventName === "surface.designed") {
      console.log("Surface Designed", event.detail.result);
      setSurfaces((prev) => [...prev, ...(event.detail.result as Array<Surface>)]);
    }
  }

  useEffect(() => {
    if (photos.length === niceAndRome["00-nice-and-rome"].length) {
      console.log(`All ${photos.length} photos are analyzed`);
    }
  }, [photos]);

  async function analyzePhotos() {
    await mb?.photos.analyze(
      photoAnalyzeBodySchema.parse(
        niceAndRome["00-nice-and-rome"].map((image, idx) => ({
          id: `idx-${idx}`,
          // width: image.width,
          // height: image.height,
          orientation: image.rotation,
          // url: image.url,
          encryptId: "image.encryptId",
          ...image,
        })),
      ),
    );
  }

  async function autofillOptions() {
    const res = await mb?.projects.autofillOptions(10);
    console.log("Autofill Options", res);
  }

  async function createProjectWithAutofill() {
    if (!project) {
      return;
    }
    await mb?.projects.autofill(project);
  }

  async function restyleProject() {
    if (!project) {
      return;
    }
    await mb?.projects.restyle(project);
  }

  async function resizeProject() {
    if (!project) {
      return;
    }
    await mb?.projects.resize(project);
  }

  async function autoAdaptSurface() {
    if (!surfaceEndpointProps) {
      return;
    }
    await mb?.surfaces.autoAdapt(surfaceEndpointProps);
  }

  async function suggestSurface() {
    if (!surfaceEndpointProps) {
      return;
    }
    await mb?.surfaces.suggest(surfaceEndpointProps);
  }

  async function shuffleSurface() {
    if (!surfaceEndpointProps) {
      return;
    }
    await mb?.surfaces.shuffle(surfaceEndpointProps);
  }

  async function getImageDensities() {
    const res = await mb?.imageDensities("CommerceProduct_867459", 50, "all");
    console.log("Image Densities", res);
  }

  return (
    <>
      <div className="p-4">
        <h1 className="text-lg font-semibold">MagicBook Web SDK Example</h1>
        <div className="text-sm">
          <span>WS Connections Open: </span>
          <span>{areConnectionsOpen ? "✅" : "🔴"}</span>
        </div>
        <div className="flex gap-2">
          <label htmlFor="start-from-left">startFromLeftSide</label>
          <input
            type="checkbox"
            id="start-from-left"
            onChange={(e) =>
              setProject({
                ...project,
                bookFormat: {
                  ...project.bookFormat,
                  startFromLeftSide: e.target.checked,
                },
              })
            }
          />
        </div>
      </div>
      <div className="flex gap-10">
        <div className="flex flex-col gap-4 items-start p-4">
          <h2 className="pb-1 w-full text-lg font-semibold border-b">WS</h2>
          <button
            type="button"
            onClick={async () => {
              const res = await mb?.reconnectWS();
              console.log("Reconnect WS", res);
            }}
          >
            Reconnect WS
          </button>
        </div>
        <div className="flex flex-col gap-4 items-start p-4">
          <h2 className="pb-1 w-full text-lg font-semibold border-b">MMB</h2>
          <button type="button" onClick={getImageDensities}>
            Get Image Densities
          </button>
        </div>
        <div className="flex flex-col gap-4 items-start p-4">
          <h2 className="pb-1 w-full text-lg font-semibold border-b">Photos</h2>
          <button type="button" onClick={analyzePhotos}>
            Analyse Photos
          </button>
        </div>
        <div className="flex flex-col gap-4 items-start p-4">
          <h2 className="pb-1 w-full text-lg font-semibold border-b">Projects</h2>
          <button type="button" onClick={autofillOptions}>
            Get Autofill Options
          </button>
          <button type="button" onClick={createProjectWithAutofill}>
            Create Project with Autofill
          </button>
          <button type="button" onClick={restyleProject}>
            Restyle Project
          </button>
          <button type="button" onClick={resizeProject}>
            Resize Project
          </button>
        </div>
        <div className="flex flex-col gap-4 items-start p-4">
          <h2 className="pb-1 w-full text-lg font-semibold border-b">Surfaces</h2>
          <button type="button" onClick={autoAdaptSurface}>
            Auto Adapt Surface
          </button>
          <button type="button" onClick={suggestSurface}>
            Suggest Surface
          </button>
          <button type="button" onClick={shuffleSurface}>
            Shuffle Surface
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
