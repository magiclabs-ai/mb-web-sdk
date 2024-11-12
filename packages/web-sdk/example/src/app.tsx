import { MagicBookAPI, type MBEvent, type AnalyzedPhoto, type Project } from "@magiclabs.ai/mb-web-sdk";
import { useEffect, useState } from "react";
import niceAndRome from "../../../../core/data/image-sets/00-nice-and-rome-client.json";

function App() {
  const [photos, setPhotos] = useState<Array<AnalyzedPhoto>>([]);
  const [project, setProject] = useState<Project>();
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
    if (event.detail.eventName === "photos.analyze") {
      const photo = event.detail.result as AnalyzedPhoto;
      setPhotos((prevPhotos) => [...prevPhotos, photo]);
    }
    if (event.detail.eventName === "projects.autofill") {
      const project = event.detail.result as Project;
      setProject(project);
    }
  }

  useEffect(() => {
    if (photos.length === niceAndRome["00-nice-and-rome"].length) {
      console.log(`All ${photos.length} photos are analyzed`);
    }
  }, [photos]);

  async function getAutofillOptions() {
    console.log("mb.autofillOptions.retrieve ->", await mb.autofillOptions.retrieve());
  }

  async function analyzeImages() {
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
      photos,
      metadata: [
        {
          name: "projectName",
          value: "My Project",
        },
      ],
    });
  }

  async function restyleProject() {
    if (!project) {
      return;
    }
    await mb.projects.restyle({
      id: projects.id,
      metadata: projects.metadata,
      photos: projects.photos,
      surfaces: projects.surfaces,
    });
  }

  async function resizeProject() {
    if (!project) {
      return;
    }
    await mb.projects.resize({
      id: projects.id,
      metadata: projects.metadata,
      photos: projects.photos,
      surfaces: projects.surfaces,
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
        id: "surfaceId",
        number: 1,
        data: {
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
        id: "surfaceId",
        number: 1,
        data: {
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
        id: "surfaceId",
        number: 1,
        data: {
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
    <div className="flex gap-10">
      <div className="flex flex-col items-start gap-4 p-4">
        <h2 className="w-full pb-1 text-lg font-semibold border-b">Autofill Options</h2>
        <button type="button" onClick={getAutofillOptions}>
          1. Get Autofill Options
        </button>
      </div>
      <div className="flex flex-col items-start gap-4 p-4">
        <h2 className="w-full pb-1 text-lg font-semibold border-b">Images</h2>
        <button type="button" onClick={analyzeImages}>
          2. Analyse Images
        </button>
      </div>
      <div className="flex flex-col items-start gap-4 p-4">
        <h2 className="w-full pb-1 text-lg font-semibold border-b">Project</h2>
        <button type="button" onClick={createProjectWithAutofill}>
          1. Create Project with Autofill
        </button>
        <button type="button" onClick={restyleProject}>
          2. Restyle Project
        </button>
        <button type="button" onClick={resizeProject}>
          3. Resize Project
        </button>
      </div>
      <div className="flex flex-col items-start gap-4 p-4">
        <h2 className="w-full pb-1 text-lg font-semibold border-b">Surface</h2>
        <button type="button" onClick={autofillSurface}>
          1. Autofill Surface
        </button>
        <button type="button" onClick={autoAdaptSurface}>
          2. Auto Adapt Surface
        </button>
        <button type="button" onClick={suggestSurface}>
          3. Suggest Surface
        </button>
        <button type="button" onClick={shuffleSurface}>
          4. Shuffle Surface
        </button>
      </div>
    </div>
  );
}

export default App;
