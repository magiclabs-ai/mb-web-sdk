import { MagicBookAPI, type MBEvent, type AnalyzedPhoto, type Project, type Surface } from "@magiclabs.ai/mb-web-sdk";
import { useEffect, useState } from "react";
import niceAndRome from "../../../../core/data/image-sets/00-nice-and-rome-client.json";

function App() {
  const [photos, setPhotos] = useState<Array<AnalyzedPhoto>>([]);
  const hasPhotos = photos.length > 0;
  const [surfaces, setSurfaces] = useState<Array<Array<Surface>>>([]);
  const hasSurface = surfaces.length > 0;
  const [areConnectionsOpen, setAreConnectionsOpen] = useState(false);
  const [mb, setMbApi] = useState<MagicBookAPI>();
  const [project, setProject] = useState<Project>({
    designMode: "automatic",
    occasion: "birthday",
    style: "DG_36907",
    imageDensityLevel: "high",
    embellishmentLevel: "high",
    bookFormat: {
      targetPageRange: [20, 40],
      page: {
        width: 1920,
        height: 1080,
      },
      cover: {
        width: 1920,
        height: 1080,
      },
    },
    images: photos,
    surfaces: surfaces,
  });

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
        apiHost: "api.dev.magiclabs-aurora.io",
        apiKey: import.meta.env.VITE_MB_API_KEY,
        useIntAsPhotoId: true,
      }),
    );
    return () => {
      removeMagicBookEventListener();
    };
  }, []);

  function handleEvent(event: CustomEvent<MBEvent<unknown>>) {
    console.log("MagicBook", event.detail.eventName, event.detail.request, event.detail.result);
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
    if (event.detail.eventName === "project.edited") {
      setSurfaces((prev) => [...prev, event.detail.result as Array<Surface>]);
    }
  }

  useEffect(() => {
    if (photos.length === niceAndRome["00-nice-and-rome"].length) {
      console.log(`All ${photos.length} photos are analyzed`);
    }
  }, [photos]);

  async function analyzePhotos() {
    await mb?.photos.analyze(
      niceAndRome["00-nice-and-rome"].map((image, idx) => ({
        id: idx,
        width: image.width,
        height: image.height,
        orientation: image.rotation,
        url: image.url,
      })),
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
    await mb?.surfaces.autoAdapt({
      ...project,
      surfaces: surfaces[0],
    });
  }

  async function suggestSurface() {
    await mb?.surfaces.suggest({
      ...project,
      surfaces: surfaces[0],
    });
  }

  async function shuffleSurface() {
    await mb?.surfaces.shuffle({
      ...project,
      surfaces: surfaces[0],
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
          <button type="button" onClick={createProjectWithAutofill} disabled={!hasPhotos}>
            Create Project with Autofill
          </button>
          <button type="button" onClick={restyleProject} disabled={!(hasPhotos && hasSurface)}>
            Restyle Project
          </button>
          <button type="button" onClick={resizeProject} disabled={!(hasPhotos && hasSurface)}>
            Resize Project
          </button>
        </div>
        <div className="flex flex-col gap-4 items-start p-4">
          <h2 className="pb-1 w-full text-lg font-semibold border-b">Surfaces</h2>
          <button type="button" onClick={autoAdaptSurface} disabled={!(hasPhotos && hasSurface)}>
            Auto Adapt Surface
          </button>
          <button type="button" onClick={suggestSurface} disabled={!(hasPhotos && hasSurface)}>
            Suggest Surface
          </button>
          <button type="button" onClick={shuffleSurface} disabled={!(hasPhotos && hasSurface)}>
            Shuffle Surface
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
