import { MagicBookAPI, type MBEvent, type AnalyzedPhoto, type Project } from "@magiclabs.ai/mb-web-sdk";
import { useEffect, useState } from "react";
import niceAndRome from "../../../../core/data/image-sets/00-nice-and-rome-client.json";

function App() {
  const [photos, setPhotos] = useState<Array<AnalyzedPhoto>>([]);
  const [areConnectionsOpen, setAreConnectionsOpen] = useState(false);
  const [mb, setMbApi] = useState<MagicBookAPI>();
  const [project, setProject] = useState<Project>();

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
        mock: true,
      }),
    );
    return () => {
      removeMagicBookEventListener();
    };
  }, []);

  function handleEvent(event: CustomEvent<MBEvent<unknown>>) {
    console.log("MagicBook", event.detail.eventName, event.detail.request, event.detail.result);
    if (event.detail.eventName === "ws" && event.detail.result.areConnectionsOpen) {
      setAreConnectionsOpen(true);
    }
    if (event.detail.eventName === "photo.analyze") {
      const photo = event.detail.result as AnalyzedPhoto;
      setPhotos((prevPhotos) => [...prevPhotos, photo]);
    }
  }

  useEffect(() => {
    if (photos.length === niceAndRome["00-nice-and-rome"].length) {
      console.log(`All ${photos.length} photos are analyzed`);
    }
  }, [photos]);

  async function analyzePhotos() {
    await mb.photos.analyze(
      niceAndRome["00-nice-and-rome"].map((image) => ({
        id: image.handle,
        width: image.width,
        height: image.height,
        orientation: image.rotation,
        url: image.url,
      })),
    );
  }

  async function createProjectWithAutofill() {
    await mb.projects.autofill({
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

    setProject({
      id: "project-id",
      metadata: [],
      photos,
      surfaces: [],
    });
  }

  async function restyleProject() {
    if (!project) {
      return;
    }
    await mb.projects.restyle({
      id: project.id,
      metadata: project.metadata,
      photos: project.photos,
      surfaces: project.surfaces,
    });
  }

  async function resizeProject() {
    if (!project) {
      return;
    }
    await mb.projects.resize({
      id: project.id,
      metadata: project.metadata,
      photos: project.photos,
      surfaces: project.surfaces,
    });
  }

  async function autofillSurface() {
    await mb.surfaces.autofill({
      metadata: [],
      photos,
    });
  }

  async function autoAdaptSurface() {
    await mb.surfaces.autoAdapt({
      photos,
      surface: {
        surfaceMetadata: [],
        version: "4.0",
        surfaceNumber: 1,
        surfaceData: {
          pageDetails: {
            width: 100,
            height: 100,
          },
          layeredItems: [],
        },
      },
    });
  }

  async function suggestSurface() {
    await mb.surfaces.suggest({
      photos,
      surface: {
        surfaceMetadata: [],
        version: "4.0",
        surfaceNumber: 1,
        surfaceData: {
          pageDetails: {
            width: 100,
            height: 100,
          },
          layeredItems: [],
        },
      },
    });
  }

  async function shuffleSurface() {
    await mb.surfaces.shuffle({
      photos,
      surface: {
        surfaceMetadata: [],
        version: "4.0",
        surfaceNumber: 1,
        surfaceData: {
          pageDetails: {
            width: 100,
            height: 100,
          },
          layeredItems: [],
        },
      },
    });
  }

  return (
    <>
      <div className="p-4">
        <h1 className="text-lg font-semibold">MagicBook Web SDK Example</h1>
        <div className="text-sm">
          <span>WS Connections Open: </span>
          <span>{areConnectionsOpen ? "✅" : "🔴"}</span>
        </div>
      </div>
      <div className="flex gap-10">
        <div className="flex flex-col items-start gap-4 p-4">
          <h2 className="w-full pb-1 text-lg font-semibold border-b">Photos</h2>
          <button type="button" onClick={analyzePhotos}>
            Analyse Photos
          </button>
        </div>
        <div className="flex flex-col items-start gap-4 p-4">
          <h2 className="w-full pb-1 text-lg font-semibold border-b">Project</h2>
          <button type="button" onClick={createProjectWithAutofill}>
            Create Project with Autofill
          </button>
          <button type="button" className="text-left" onClick={restyleProject}>
            Restyle Project
          </button>
          <button type="button" className="text-left" onClick={resizeProject}>
            Resize Project
          </button>
        </div>
        <div className="flex flex-col items-start gap-4 p-4">
          <h2 className="w-full pb-1 text-lg font-semibold border-b">Project</h2>
          <button type="button" className="text-left" onClick={autofillSurface}>
            Autofill Surface
          </button>
          <button type="button" className="text-left" onClick={autoAdaptSurface}>
            Auto Adapt Surface
          </button>
          <button type="button" className="text-left" onClick={suggestSurface}>
            Suggest Surface
          </button>
          <button type="button" className="text-left" onClick={shuffleSurface}>
            Shuffle Surface
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
