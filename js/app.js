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

const statusElement = document.getElementById("statusMsg");
const snapshotButton = document.getElementById("snapshotButton");
const snapshotLabel = document.getElementById("snapshotLabel");
const liveDetectionButton = document.getElementById("liveDetectionButton");
const liveDetectionIndicator = document.getElementById("liveDetectionIndicator");
const detectionPlaceholder = document.getElementById("detectionPlaceholder");
const modelStatus = document.getElementById("modelStatus");
const video = document.getElementById("cameraVideo");
const canvas = document.getElementById("snapshotCanvas");
const detectionBox = document.getElementById("detectionBox");

// detector moved to its own file detectors.js

let liveDetection = false;
let detectionRequestId = 0;
let modelStatusTimeoutId = null;
const liveDetectionInterval = CONFIG.LIVEDETECTION_INTERVAL_MS;
liveDetectionIndicator.setAttribute("aria-label", STRINGS[currentLanguage].liveDetectionRunning);

function showModelStatus(message, autoHide = false) {
  if (!modelStatus) {
    return;
  }

  if (modelStatusTimeoutId) {
    clearTimeout(modelStatusTimeoutId);
    modelStatusTimeoutId = null;
  }

  modelStatus.textContent = message;
  modelStatus.hidden = false;

  if (autoHide) {
    modelStatusTimeoutId = window.setTimeout(() => {
      modelStatus.hidden = true;
    }, 1000);
  }
}

function hideModelStatus() {
  if (modelStatus) {
    modelStatus.hidden = true;
  }
  if (modelStatusTimeoutId) {
    clearTimeout(modelStatusTimeoutId);
    modelStatusTimeoutId = null;
  }
}

async function initializeModelStatus() {
  if (typeof detector.init !== "function") {
    hideModelStatus();
    return;
  }

  showModelStatus(getText("modelLoading"));

  try {
    await detector.init();
    showModelStatus(getText("modelLoaded"), true);
  } catch (error) {
    const errorMessage = error && error.message ? error.message : String(error);
    showModelStatus(`${getText("modelErrorPrefix")}${errorMessage}`, false);
  }
}

function updateRuntimeText() {
  const liveDetectionLabel = liveDetection
    ? getText("stopLiveDetection")
    : getText("startLiveDetection");
  const liveDetectionIcon = document.getElementById("liveDetectionIcon");

  liveDetectionButton.setAttribute("aria-label", liveDetectionLabel);
  liveDetectionIndicator.setAttribute("aria-label", getText("liveDetectionRunning"));

  if (liveDetectionIcon) {
    liveDetectionIcon.src = liveDetection ? "assets/icon-pause.svg" : "assets/icon-play.svg";
    liveDetectionIcon.alt = liveDetectionLabel;
  }

  if (snapshotLabel) {
    snapshotLabel.textContent = canvas.hidden ? "Snapshot" : "Reset";
  }

  snapshotButton.setAttribute(
    "aria-label",
    canvas.hidden ? getText("snapshotButton") : getText("resetButton")
  );
}

document.addEventListener("languagechange", updateRuntimeText);


//MARK: camera

async function startCamera() {
  try {
    // request a portrait-oriented capture
    // can't guarantee it, but still
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: "environment" },
        // width: { ideal: 720 },
        // height: { ideal: 960 },
        aspectRatio: { ideal: 3 / 4 }
      }
    });

    video.srcObject = stream;
    video.style.objectFit = "cover";
  } catch (error) {
    console.error("Camera access failed:", error);
    statusElement.textContent = getText("cameraAccessFailed");
  }
}


//MARK: viewport states

function showLiveView() {
  video.hidden = false;
  canvas.hidden = true;
  detectionBox.hidden = true;
  liveDetectionIndicator.hidden = true;

  snapshotButton.hidden = false;
  liveDetectionButton.hidden = false;
  updateRuntimeText();
}

function showSnapshotView() {
  video.hidden = true;
  canvas.hidden = false;
  liveDetectionIndicator.hidden = true;

  snapshotButton.hidden = false;
  liveDetectionButton.hidden = false;
  updateRuntimeText();
}

function showLiveDetectionView() {
  video.hidden = false;
  canvas.hidden = true;
  liveDetectionIndicator.hidden = false;

  snapshotButton.hidden = false;
  liveDetectionButton.hidden = false;
  updateRuntimeText();
}


//MARK: detection

/**
* draws output
*/
function drawDetection(detections) {
  if (detections.length === 0) {
    detectionBox.hidden = true;
    detectionPlaceholder.textContent = getText("nothingDetected");

    return;
  }

  const det = detections[0]; // for now only display the first detection
  const label = translateModelLabel(det.class);

  detectionBox.style.left = `${det.x * 100}%`;
  detectionBox.style.top = `${det.y * 100}%`;
  detectionBox.style.width = `${det.width * 100}%`;
  detectionBox.style.height = `${det.height * 100}%`;
  detectionBox.hidden = false;

  detectionBox.textContent =
  `${label} ${(det.confidence).toFixed(2)}`;

  // can get removed
  detectionPlaceholder.textContent =
    `${label} (${Math.round(det.confidence * 100)}%)`;
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
        statusElement.textContent = getText("detectionFailed");
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
* - if already viewing a snapshot, return to live camera view
* - run detector for the current captured frame
*/
snapshotButton.addEventListener("click", async () => {
  if (canvas.hidden === false) {
    if (liveDetection) {
      stopLiveDetection();
    }
    showLiveView();
    statusElement.textContent = STRINGS[currentLanguage].statusReady;
    detectionPlaceholder.textContent = STRINGS[currentLanguage].detectionPlaceholder;
    updateRuntimeText();
    return;
  }

  if (liveDetection) {
    stopLiveDetection();
  }

  const capturedFrame = captureFrame();
  detectionRequestId++;
  showSnapshotView();
  statusElement.textContent = STRINGS[currentLanguage].statusReady;
  updateRuntimeText();

  await new Promise((resolve) => {
    requestAnimationFrame(() => setTimeout(resolve, 0));
  });

  try {
    await detectCurrentFrame(capturedFrame, detectionRequestId);
  } catch (error) {
    console.error("[snapshot] Detection failed:", error);
    statusElement.textContent = getText("detectionFailed");
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


//MARK: execute functions

showLiveView();
updateRuntimeText();
initializeModelStatus();
startCamera();
