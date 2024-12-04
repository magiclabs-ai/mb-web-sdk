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
    if (event.detail.eventName === "photo.analyze") {
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
      images: [...photos],
    });
  }

  async function createProjectWithMakeMyBook() {
    console.log("mb:", mb);
    console.log("mb.projects:", mb?.projects.autofill);
    console.log("mb?.projects.makeMyBook:", mb?.projects);
    await mb?.projects.makeMyBook({
      customer: {
        email: "customer@example.com",
        firstName: "John",
        lastName: "Doe",
        userId: "user123",
        refreshToken: null,
        accessToken: null,
        context: "web",
      },
      order: {
        creationTime: new Date().toISOString(),
        curate: true,
        photoStripCount: 10,
        priority: "high",
        promoCode: "PROMO2023",
        size: "large",
        specialInstructions: "Handle with care",
        subTitle: "Vacation Memories",
        title: "My Vacation",
        phoneNumber: "123-456-7890",
        initialDevice: "iPhone",
        spreadDensity: "dense",
        coverStyle: "hardcover",
        focusOption: "auto",
        hasSixColorPrinting: true,
        productType: "photoBook",
        coverSpecId: "cover123",
        curateDensity: 5,
        stickerDensity: 3,
        occasion: "vacation",
        photoStripSort: "chronological",
        styleId: 1,
        style: 1,
        styleName: "Modern",
        binding: "perfect",
      },
      photoStrip: photos.map((photo, idx) => ({
        photoRefId: idx,
        encryptId: `enc${idx}`,
        url: photo.url,
        urlWithEdits: `${photo.url}?edit=true`,
        photoMetadata: {
          id: `photo${idx}`,
          title: `Photo ${idx}`,
          width: photo.width,
          source: "camera",
          height: photo.height,
          data: "base64data",
          uploadTime: new Date().toISOString(),
          rotation: photo.orientation,
          effect: "none",
          llx: 0,
          lly: 0,
          urx: photo.width,
          ury: photo.height,
        },
      })),
      reportingData: {
        properties: [
          { key: "projectId", value: "project123" },
          { key: "userId", value: "user123" },
        ],
      },
    });
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
        <div className="flex flex-col items-start gap-4 p-4">
          <h2 className="w-full pb-1 text-lg font-semibold border-b">Photos</h2>
          <button type="button" onClick={analyzePhotos}>
            Analyse Photos
          </button>
        </div>
        <div className="flex flex-col items-start gap-4 p-4">
          <h2 className="w-full pb-1 text-lg font-semibold border-b">Projects</h2>
          <button type="button" onClick={createProjectWithAutofill} disabled={!hasPhotos}>
            Create Project with Autofill
          </button>
          <button type="button" onClick={createProjectWithMakeMyBook}>
            Create Project with Make My Book
          </button>
          <button type="button" onClick={restyleProject} disabled={!(hasPhotos && hasSurface)}>
            Restyle Project
          </button>
          <button type="button" onClick={resizeProject} disabled={!(hasPhotos && hasSurface)}>
            Resize Project
          </button>
        </div>
        <div className="flex flex-col items-start gap-4 p-4">
          <h2 className="w-full pb-1 text-lg font-semibold border-b">Surfaces</h2>
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
