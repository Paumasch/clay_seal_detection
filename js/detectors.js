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

// grab from config (best to move this as part of model metadata, later. works for now)
const classNames = CONFIG.MODEL_CLASSES;


//MARK: convert
/*
* convert capturedCanvas into format compatible with detection
* potentially perform some pre-processing
*/
function convertCanvas() { 
  return console.log("heyo");
}


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


//MARK: ai-slop
/*
* quick YOLOv8 ONNX experiment (ai-slop)
* 
* yeah... no
* 
* doesn't include NMS
*
* NOT production code yet.
* Assumes:
* - model input: [1, 3, 640, 640]
* - model output: [1, 6, 8400]
* - output format: [x, y, width, height, class0, class1]
*/

const yoloDetector = {

  session: null,
  initPromise: null,

  async init() {
    if (this.initPromise) {
      return this.initPromise;
    }

    if (typeof ort === "undefined") {
      throw new Error("ONNX Runtime Web is not loaded.");
    }

    console.log("[yolo] Loading models/best.onnx...");

    this.initPromise = ort.InferenceSession.create("models/best.onnx")
      .then((session) => {
        this.session = session;
        console.log("[yolo] Model loaded.", {
          inputNames: session.inputNames,
          outputNames: session.outputNames
        });
        return session;
      })
      .catch((error) => {
        this.initPromise = null;
        console.error("[yolo] Model loading failed:", error);
        throw error;
      });

    return this.initPromise;
  },


  async detect(capturedCanvas) {

    if (!this.session) {
      await this.init();
    }

    console.log("[yolo] Running detection.", {
      width: capturedCanvas.width,
      height: capturedCanvas.height
    });

    const input = new Float32Array(1 * 3 * 640 * 640);
  
    /*changed with help of mistral */
    if(!this.tempCanvas) {
      this.tempCanvas = document.createElement("canvas");
      this.tempCanvas.width = 640;
      this.tempCanvas.height = 640;
    }

    const tempCanvas = this.tempCanvas;

    const ctx = tempCanvas.getContext("2d");
    ctx.drawImage(capturedCanvas, 0, 0, 640, 640);

    const imageData = ctx.getImageData(0, 0, 640, 640);

    /*
    * Convert browser RGBA pixels into YOLO's
    * RGB / CHW / float32 format.
    */
    /* changed with help of mistral */
    for (let index = 0; index < 640 * 640; index++) {

        const pixel = index * 4;

        input[index] = imageData.data[pixel] / 255;
        input[640 * 640 + index] = imageData.data[pixel + 1] / 255;
        input[2 * 640 * 640 + index] = imageData.data[pixel + 2] / 255;
      }

    const tensor = new ort.Tensor(
      "float32",
      input,
      [1, 3, 640, 640]
    );

    const results = await this.session.run({
      [this.session.inputNames[0]]: tensor
    });

    const outputTensor = results[this.session.outputNames[0]];

    console.log("[yolo] Inference complete.", {
      outputNames: Object.keys(results),
      outputDimensions: outputTensor.dims,
      outputLength: outputTensor.data.length
    });

    const output = outputTensor.data;

    const detections = [];

    /*changed with help of mistral */
    const numClasses = 2;
    const dims = outputTensor.dims;
    const channelsMajor =dims[1] === 4 + numClasses; //[1, 6, 8400]
    if (!channelsMajor && dims[dims.length - 1] !== 4 + numClasses) {
      throw new Error(
        "Unexpected output layout: " + JSON.stringify(dims) +
        " - expected [1, " + (4 + numClasses) + ", N] or [1, N, " + (4 + numClasses) + "]"
      );
    }

    const numCandidates = channelsMajor ? dims[2] : dims[1]; // derive, dont hardcode 8400

    // -- Helper that reads output correctly for either layout
    const readCell = (row, i) => 
      channelsMajor ? output[row * numCandidates + i]
      : output[i * (4 + numClasses) + row];

    const confidenceThreshold = 0.4;

    for (let i = 0; i < numCandidates; i++) {

      const x = readCell(0, i);
      const y = readCell(1, i);
      const width = readCell(2, i);
      const height = readCell(3, i);

      const class0 = readCell(4, i);
      const class1 = readCell(5, i);

      let classId;
      let confidence;

      if (class0 > class1) {
        classId = 0;
        confidence = class0;
      } else {
        classId = 1;
        confidence = class1;
      }

      if (confidence < confidenceThreshold) {
        continue;
      }

      /*
      * YOLO gives centre coordinates.
      * Convert to top-left coordinates.
      */

      // ── CHANGE #8: scale coordinates back to the ORIGINAL canvas.

      const x1 = (x -width / 2) / 640 * capturedCanvas.width;
      const y1 = (y - height / 2) / 640 * capturedCanvas.height;
      const x2 = (x + width / 2) / 640 * capturedCanvas.width;
      const y2 = (y + height / 2) / 640 * capturedCanvas.height;

      detections.push([x1, y1, x2, y2, classId, confidence]);
    }

    // ── CHANGE #9: Non-Maximum Suppression — the critical missing piece.
    //    Without it you get many overlapping boxes per object.

    // probably best not to hardcode the threshold here?
    const fromNMS= this.applyNMS(detections, 0.5); // 0.5 = IoU overlap threshold
    
    // applyNMS returns arrays, but the standard detector template returns detection objects
    // so we have to map them to the proper structure
    // AGAIN performs the coordinate conversion -> this really needs to be moved to a function or methdo
    return {
      detections: fromNMS.map(([x1, y1, x2, y2, classId, confidence]) => ({
        class: classNames[classId] ?? `class ${classId}`,
        confidence,
        x: x1 / capturedCanvas.width,
        y: y1 / capturedCanvas.height,
        width: (x2 - x1) / capturedCanvas.width,
        height: (y2 - y1) / capturedCanvas.height
      }))
    };
  },

  /**
   * 
   * @returns arrays shaped like [x1, y1, x2, y2, classId, confidence]
   */
  applyNMS(boxes, iouThreshold) {
    boxes.sort((a, b) => b[5] - a[5]); // sort by confidence descending
    const result = [];
    while (boxes.length > 0) {
      const best = boxes[0];
      result.push(best);
      boxes = boxes.filter(box => this.iou(best, box) < iouThreshold);
    }
    return result;

  },

  iou(box1, box2) {
    const x1 = Math.max(box1[0], box2[0]);
    const y1 = Math.max(box1[1], box2[1]);
    const x2 = Math.min(box1[2], box2[2]);
    const y2 = Math.min(box1[3], box2[3]);
    const intersection = Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
    if (intersection === 0) return 0;
    const area1 = (box1[2] - box1[0]) * (box1[3] - box1[1]);
    const area2 = (box2[2] - box2[0]) * (box2[3] - box2[1]);
    return intersection / (area1 + area2 - intersection);
  }
};

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
  yolo: yoloDetector
  //yololocal: toBeAdded,   
  //yoloort: toBeAddded,    // optimised https://onnxruntime.ai/docs/performance/model-optimizations/ort-format-models.html
  //yolohosted: toBeAdddded // maybe
};

const detector = detectors[CONFIG.ACTIVE_DETECTOR] || (() => {
  console.error(
    `Unknown CONFIG.ACTIVE_DETECTOR "${CONFIG.ACTIVE_DETECTOR}" in config.js — falling back to fakeDetector.`
  );
  return fakeDetector; // fallback
})();