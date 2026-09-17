/* detector implementations and routing
* 
* NOTES: 
* - claude-generated for quick test -> to be redone by hand
* - samples every 4th pixel to reduce workload (to be fiddled with / automatically adjusted in real implementation)
* 
* each implementation is an object exposing a `detect(capturedCanvas)` method, returning:
*   { detections: [ { class, confidence, x, y, width, height }, ... ] }
* x/y/width/height are normalized (0–1), relative to the captured image.
*
* app.js only ever calls `detector.detect(...)` — it doesn't know or care which implementation is behind it. 
* change selection in config.js (CONFIG.ACTIVE_DETECTOR)
* needs config.js loaded first (for CONFIG), and must itself load before app.js.
*/

const STEP = 2; // only every n-th pixel checked

//MARK: fakeDetector
/*
* randomly "finds" a seal at a fixed position/size
* useful for testing UI states (found/not-found) and verifying the
* coordinate math independent of any actual image content
* */
const fakeDetector = {
  async detect(capturedCanvas) {
    // simulate some inference delay (when actual model gets involved)
    await new Promise((resolve) => setTimeout(resolve, 500));

    // randomly find or not find a thing
    const found = Math.random() > 0.3;
    if (!found) {
      return { detections: [] };
    }

    return {
      detections: [ // fake data
        {
          class: "seal",
          confidence: 0.87,
          x: 0.30,      // normalized (0–1) top-left, relative to image width
          y: 0.35,
          width: 0.25,
          height: 0.20
        }
      ]
    };
  }
};

//MARK: reindeerDetector
/*
* detects reindeers by looking for their natural colour
*/
const reindeerDetector = {
  async detect(capturedCanvas) {
    const ctx = capturedCanvas.getContext("2d");
    const width = capturedCanvas.width;
    const height = capturedCanvas.height;
    const { data } = ctx.getImageData(0, 0, width, height);

    // sample every Nth pixel instead of every single one, for performance
    // on large snapshots (e.g. full-res phone camera captures)
    const step = STEP;

    let minX = width, minY = height, maxX = 0, maxY = 0;
    let matchCount = 0;

    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const i = (y * width + x) * 4;
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        //const isBlueish = b > 120 && (b - g) > 40 && (b - r) > 40;
        const isBlueish = b > 120 && b > (g+20) && (b+g)/4 > r;

        if (isBlueish) {
          matchCount++;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    // simulate some inference delay (when actual model gets involved)
    await new Promise((resolve) => setTimeout(resolve, 300));

    // require a minimum number of sampled matches, so a single stray
    // reddish/bright pixel doesn't produce a "detection"
    const minMatches = 15;
    if (matchCount < minMatches) {
      return { detections: [] };
    }

    const boxWidth = maxX - minX;
    const boxHeight = maxY - minY;

    // rough stand-in "confidence": denser matches within the box area
    // read as more confident, capped so it never claims certainty
    const sampledBoxArea = (boxWidth / step + 1) * (boxHeight / step + 1);
    const confidence = Math.min(0.5 + matchCount / sampledBoxArea, 0.99);

    return {
      detections: [
        {
          class: "reindeer",
          confidence,
          x: minX / width,      // normalized (0–1) top-left, relative to image width
          y: minY / height,
          width: boxWidth / width,
          height: boxHeight / height
        }
      ]
    };
  }
};

//MARK: brightDetector
/*
* a copy of colour based one, but looking for bright spots
*/
const brightDetector = {
  async detect(capturedCanvas) {
    const ctx = capturedCanvas.getContext("2d");
    const width = capturedCanvas.width;
    const height = capturedCanvas.height;
    const { data } = ctx.getImageData(0, 0, width, height);

    // sample every Nth pixel instead of every single one, for performance
    // on large snapshots (e.g. full-res phone camera captures)
    const step = STEP;

    let minX = width, minY = height, maxX = 0, maxY = 0;
    let matchCount = 0;

    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const i = (y * width + x) * 4;
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const isBright = r > 220 && g > 220 && b > 220;

        if (isBright) {
          matchCount++;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    // simulate some inference delay (when actual model gets involved)
    await new Promise((resolve) => setTimeout(resolve, 300));

    // require a minimum number of sampled matches, so a single stray
    // reddish/bright pixel doesn't produce a "detection"
    const minMatches = 15;
    if (matchCount < minMatches) {
      return { detections: [] };
    }

    const boxWidth = maxX - minX;
    const boxHeight = maxY - minY;

    // rough stand-in "confidence": denser matches within the box area
    // read as more confident, capped so it never claims certainty
    const sampledBoxArea = (boxWidth / step + 1) * (boxHeight / step + 1);
    const confidence = Math.min(0.5 + matchCount / sampledBoxArea, 0.99);

    return {
      detections: [
        {
          class: "bright object",
          confidence,
          x: minX / width,      // normalized (0–1) top-left, relative to image width
          y: minY / height,
          width: boxWidth / width,
          height: boxHeight / height
        }
      ]
    };
  }
};


//MARK: to add later
// yoloDetector  — local inference via onnx runtime, once model details are shared
// remoteDetector — sends the snapshot to an external api and awaits a result



//MARK: detector routing
/*
* maps CONFIG.ACTIVE_DETECTOR ("fake" | "red" | later: "onnx" | "remote")
* to the actual implementation used by app.js.
* falls back to fakeDetector (with a console warning) on an unrecognised
* value, rather than leaving `detector` undefined and crashing on first use
* */
const detectors = {
  //toy examples
  fake: fakeDetector,
  reindeer: reindeerDetector, // inside joke: looks for blueish blobs
  bright: brightDetector,
  // the real deal
  yololocal: toBeAdded,   
  yoloort: toBeAddded,    // optimised https://onnxruntime.ai/docs/performance/model-optimizations/ort-format-models.html
  yolohosted: toBeAdddded // maybe
};

const detector = detectors[CONFIG.ACTIVE_DETECTOR] || (() => {
  console.error(
    `Unknown CONFIG.ACTIVE_DETECTOR "${CONFIG.ACTIVE_DETECTOR}" in config.js — falling back to fakeDetector.`
  );
  return fakeDetector;
})();