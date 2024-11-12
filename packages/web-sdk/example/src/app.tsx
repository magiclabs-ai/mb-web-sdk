import { MagicBookAPI, type MBEvent, type AnalyzedPhoto } from "@magiclabs.ai/mb-web-sdk";
import { useEffect, useState } from "react";
import niceAndRome from "../../../../core/data/image-sets/00-nice-and-rome-client.json";

function App() {
  const [photos, setPhotos] = useState<Array<AnalyzedPhoto>>([]);
  const mb = new MagicBookAPI({
    apiKey: "TEST",
  });

  useEffect(() => {
    function addMagicBookEventListener() {
      window.addEventListener("MagicBook", handleDesignRequestUpdated as EventListener);
    }

    function removeMagicBookEventListener() {
      window.removeEventListener("MagicBook", handleDesignRequestUpdated as EventListener);
    }
    addMagicBookEventListener();
    return () => {
      removeMagicBookEventListener();
    };
  }, []);

  function handleDesignRequestUpdated(event: CustomEvent<MBEvent<unknown>>) {
    console.log("MagicBook", event.detail.eventName, event.detail.request, event.detail.result);
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
          width: 8.5,
          height: 11,
        },
        cover: {
          width: 8.5,
          height: 11,
        },
      },
      images: photos,
    });
  }

  return (
    <div className="flex gap-10">
      <div className="flex flex-col items-start gap-4 p-4">
        <h2 className="w-full pb-1 text-lg font-semibold border-b">Photos</h2>
        <button type="button" onClick={analyzePhotos}>
          2. Analyse Photos
        </button>
      </div>
      <div className="flex flex-col items-start gap-4 p-4">
        <h2 className="w-full pb-1 text-lg font-semibold border-b">Project</h2>
        <button type="button" onClick={createProjectWithAutofill} disabled>
          1. Create Project with Autofill
        </button>
      </div>
    </div>
  );
}

export default App;
