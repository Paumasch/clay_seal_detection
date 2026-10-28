/* main logic flow */

// before going live:
// ensure that there aren't any hardcoded user-facing messages/texts here 
// -> that everything is covered by localisation


/* the basic liveDetection loop (async, self-scheduling, equivalent to synchronous while(loop)) 

  loop = false

  button pressed:
      loop = !loop
      if loop:
          runDetectionLoop()

  runDetectionLoop: 
      if loop:
          take snapshot
          detect
          draw
          wait a bit
          runDetectionLoop again
          
*/

translatePage(); // from strings.js, applies localisation

const appTitle = document.getElementById("appTitle");
// added by Paula (Mistral ;) )
languageSelection.addEventListener("click", function () {
  const menu = document.getElementById("langMenu");
  menu.hidden = !menu.hidden;
  languageSelection.setAttribute("aria-expanded", String(!menu.hidden));
});
const statusElement = document.getElementById("statusMsg");
const snapshotButton = document.getElementById("snapshotButton");
const liveDetectionButton = document.getElementById("liveDetectionButton");
const liveDetectionIndicator = document.getElementById("liveDetectionIndicator");
const resetButton = document.getElementById("resetButton");
const detectionPlaceholder = document.getElementById("detectionPlaceholder");
const video = document.getElementById("cameraVideo");
const canvas = document.getElementById("snapshotCanvas");
const detectionBox = document.getElementById("detectionBox");
const Welcomeparagraph = document.getElementById("Welcomeparagraph");

// detector moved to its own file detectors.js

let liveDetection = false;
let detectionRequestId = 0;
const liveDetectionInterval = CONFIG.LIVEDETECTION_INTERVAL_MS;
liveDetectionIndicator.setAttribute("aria-label", STRINGS[currentLanguage].liveDetectionRunning);


//MARK: camera

async function startCamera() {
  try {
    // politely request 480x640 resolution from camera
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: "environment" },
        width: { ideal: 480 },
        height: { ideal: 640 }
      }
    });
    video.srcObject = stream;
  } catch (error) {
    console.error("Camera access failed:", error);
    statusElement.textContent = STRINGS[currentLanguage].cameraAccessFailed; 
  }
}


//MARK: viewport states

function showLiveView() {
  video.hidden = false;
  canvas.hidden = true;
  detectionBox.hidden = true;
  liveDetectionIndicator.hidden = true;

  snapshotButton.hidden = false;
  resetButton.hidden = true;

  liveDetectionButton.hidden = false;
  //liveDetectionButton.textContent = "Start live detection";
}

function showSnapshotView() {
  video.hidden = true;
  canvas.hidden = false;
  liveDetectionIndicator.hidden = true;

  snapshotButton.hidden = true;
  resetButton.hidden = false;

  liveDetectionButton.hidden = false;
  //liveDetectionButton.textContent = "Start live detection";
}

function showLiveDetectionView() {
  video.hidden = false;
  canvas.hidden = true;
  liveDetectionIndicator.hidden = false;

  snapshotButton.hidden = false;
  resetButton.hidden = true;

  liveDetectionButton.hidden = false;
  //liveDetectionButton.textContent = "Stop live detection";
}


//MARK: detection

/**
* draws output
*/
function drawDetection(detections) {
  if (detections.length === 0) {
    detectionBox.hidden = true;
    detectionPlaceholder.textContent = "Nothing detected.";

    return;
  }

  const det = detections[0]; // for now only display the first detection

  detectionBox.style.left = `${det.x * 100}%`;
  detectionBox.style.top = `${det.y * 100}%`;
  detectionBox.style.width = `${det.width * 100}%`;
  detectionBox.style.height = `${det.height * 100}%`;
  detectionBox.hidden = false;

  detectionBox.textContent =
  `${det.class} ${(det.confidence).toFixed(2)}`;

  // can get removed
  detectionPlaceholder.textContent =
    `${det.class} (${Math.round(det.confidence * 100)}%)`;
}

/**
 * take snapshot of current frame 
 */
function captureFrame() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  // even cruder debugging, as console.debug apparently doesn't show up via remote debugging
  console.log("[currentFrame] canvas: " + canvas.width + ":" + canvas.height);

  // creates snapshot
  canvas.getContext("2d").drawImage(
    video,
    0,
    0,
    canvas.width,
    canvas.height
  );

  // crude debugging
  console.debug("[capture]", {
    videoWidth: video.videoWidth,
    videoHeight: video.videoHeight,
    canvasWidth: canvas.width,
    canvasHeight: canvas.height,
    orientation: video.videoWidth >= video.videoHeight
      ? "landscape"
      : "portrait"
  });

  return canvas;
}

/**
* capture and analyse one frame
*/
async function detectCurrentFrame(canvas, requestId = detectionRequestId) {
  // runs snapshot through detector
  const result = await detector.detect(canvas);

  // crude debugging
  console.log("[currentFrame] Frame processed:", {detections: result.detections.length});

  // draws bounding box(es) / updates overlay
  if (requestId === detectionRequestId) {
    drawDetection(result.detections);
  }

  return result;
}


/**
* continuous detection loop - just keeps taking, analysing, displaying snapshots on timer
*/
// async function runLiveDetection() {
//   while (liveDetection) {
//     await detectCurrentFrame();

//     await new Promise((resolve) =>
//       setTimeout(resolve, liveDetectionInterval)
//     );
//   }
// }
async function runLiveDetection() {
  console.log("[live] Detection loop started.");

  while (liveDetection) {
    const requestId = detectionRequestId;

    try {
      await detectCurrentFrame(captureFrame(), requestId);
    } catch (error) {
      console.error("[live] Detection failed:", error);
      if (liveDetection && requestId === detectionRequestId) {
        statusElement.textContent = "Detection failed. Check the console.";
        liveDetection = false;
        showLiveView();
      }
      break;
    }
    await new Promise((resolve) => setTimeout(resolve, liveDetectionInterval));
  }

  console.log("[live] Detection loop stopped.");
}


//MARK: modes

function startLiveDetection() {
  liveDetection = true;
  detectionRequestId++;

  showLiveDetectionView();
  statusElement.textContent = STRINGS[currentLanguage].statusReady;

  // why prefix with 'void'? 
  // it discards runLiveDetection's first promise -> activates the async loop, without actually executing the first run
  void runLiveDetection(); 
}

function stopLiveDetection() {
  liveDetection = false;
  detectionRequestId++;

  // cleanup
  detectionPlaceholder.textContent = "";
  detectionBox.hidden = true; // already handled by showLiveView

  showLiveView();
  statusElement.textContent = STRINGS[currentLanguage].statusReady;
}


//MARK: buttons

/**
* snapshotButton:
* - stop live detection if necessary
* - take snapshot
* - switch to snapshot view
* - run detector
* - draw bounding box
*/
snapshotButton.addEventListener("click", async () => {

  if (liveDetection) {
    stopLiveDetection();
  }

  const capturedFrame = captureFrame();
  detectionRequestId++;
  showSnapshotView();
  statusElement.textContent = STRINGS[currentLanguage].statusReady;

  // requestAnimationFrame runs before painting. Yield to a later task so the
  // browser can paint the captured frame before detection blocks the main
  // thread with image preparation and inference.
  await new Promise((resolve) => {
    requestAnimationFrame(() => setTimeout(resolve, 0));
  });

  try {
    await detectCurrentFrame(capturedFrame, detectionRequestId);
  } catch (error) {
    console.error("[snapshot] Detection failed:", error);
    statusElement.textContent = "Detection failed. Check the console.";
  }
});


/*
* liveDetectionButton:
* - start continuous detection from either live or snapshot view
* - stop continuous detection when already running
*/
liveDetectionButton.addEventListener("click", () => {
  if (liveDetection) {
    stopLiveDetection();
  } else {
    startLiveDetection();
  }
});


/*
* resetButton:
* - return to live camera view
*/
resetButton.addEventListener("click", () => {

  if (liveDetection) {
    stopLiveDetection();
  }

  showLiveView();

  statusElement.textContent = STRINGS[currentLanguage].statusReady;
  detectionPlaceholder.textContent =
    STRINGS[currentLanguage].detectionPlaceholder;
});


//MARK: execute functions

showLiveView();
startCamera();
