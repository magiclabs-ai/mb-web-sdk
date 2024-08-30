import {
  MagicBookAPI,
  type MBEvent,
  type AnalyzedPhoto,
  type Project,
} from "@magiclabs.ai/mb-web-sdk";
import { useEffect, useState } from "react";
import niceAndRome from "../../../../core/data/image-sets/00-nice-and-rome-client.json";

function App() {
  const [photos, setPhotos] = useState<Array<AnalyzedPhoto>>([]);
  const [project, setProject] = useState<Project>();
  const mb = new MagicBookAPI();

  useEffect(() => {
    function addMagicBookEventListener() {
      window.addEventListener(
        "MagicBook",
        handleDesignRequestUpdated as EventListener
      );
    }

    function removeMagicBookEventListener() {
      window.removeEventListener(
        "MagicBook",
        handleDesignRequestUpdated as EventListener
      );
    }
    addMagicBookEventListener();
    return () => {
      removeMagicBookEventListener();
    };
  }, []);

  function handleDesignRequestUpdated(event: CustomEvent<MBEvent<unknown>>) {
    console.log("MagicBook", event.detail.eventName, event.detail.payload);
    if (event.detail.eventName === "photo.analyze") {
      const photo = event.detail.payload as AnalyzedPhoto;
      setPhotos((prevPhotos) => [...prevPhotos, photo]);
    }
    if (event.detail.eventName === "project.autofill") {
      const project = event.detail.payload as Project;
      setProject(project);
    }
  }

  useEffect(() => {
    if (photos.length === niceAndRome["00-nice-and-rome"].length) {
      console.log(`All ${photos.length} photos are analyzed`);
    }
  }, [photos]);

  async function getAutofillOptions() {
    console.log(
      "mb.autofillOptions.retrieve ->",
      await mb.autofillOptions.retrieve()
    );
  }

  async function analyzeImages() {
    await mb.photo.analyze(
      niceAndRome["00-nice-and-rome"].map((image) => ({
        id: image.handle,
        width: image.width,
        height: image.height,
        orientation: image.rotation,
        url: image.url,
      }))
    );
  }

  async function createProjectWithAutofill() {
    await mb.project.autofill({
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
    await mb.project.restyle({
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
    await mb.project.resize({
      id: project.id,
      metadata: project.metadata,
      photos: project.photos,
      surfaces: project.surfaces,
    });
  }

  async function autofillSurface() {
    await mb.surface.autofill({
      metadata: [],
      photos,
    });
  }

  async function autoAdaptSurface() {
    await mb.surface.autoAdapt({
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
    await mb.surface.suggest({
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
    await mb.surface.shuffle({
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
    <div className="grid grid-cols-1 gap-4 p-4">
      <button type="button" className="text-left" onClick={getAutofillOptions}>
        Get Autofill Options
      </button>
      <button type="button" className="text-left" onClick={analyzeImages}>
        1. Analyse Images
      </button>
      <button
        type="button"
        className="text-left"
        onClick={createProjectWithAutofill}
      >
        2. Create Project with Autofill
      </button>
      <button type="button" className="text-left" onClick={restyleProject}>
        3. Restyle Project
      </button>
      <button type="button" className="text-left" onClick={resizeProject}>
        3. Resize Project
      </button>
      <div className="grid grid-cols-1 gap-4 p-4">
        <h2>Surface</h2>
        <button type="button" className="text-left" onClick={autofillSurface}>
          1. Autofill Surface
        </button>
        <button type="button" className="text-left" onClick={autoAdaptSurface}>
          2. Auto Adapt Surface
        </button>
        <button type="button" className="text-left" onClick={suggestSurface}>
          3. Suggest Surface
        </button>
        <button type="button" className="text-left" onClick={shuffleSurface}>
          4. Shuffle Surface
        </button>
      </div>
    </div>
  );
}

export default App;
