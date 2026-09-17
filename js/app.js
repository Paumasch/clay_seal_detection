/* main logic flow */

// before going live:
// ensure that there aren't any hardcoded user-facing messages/texts here 
// -> that everything is covered by localisation


translatePage(); // from strings.js, applies localisation

const appTitle = document.getElementById("appTitle");
const statusElement = document.getElementById("statusMsg");
const snapshotButton = document.getElementById("snapshotButton");
const liveDetectionButton = document.getElementById("liveDetectionButton");
const resetButton = document.getElementById("resetButton");
const detectionPlaceholder = document.getElementById("detectionPlaceholder");
const video = document.getElementById("cameraVideo");
const canvas = document.getElementById("snapshotCanvas");
const detectionBox = document.getElementById("detectionBox");

// detector moved to its own file detectors.js

let liveDetection = false;
const liveDetectionInterval = CONFIG.LIVEDETECTION_INTERVAL_MS;


//MARK: camera

async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" }
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

  snapshotButton.hidden = false;
  resetButton.hidden = true;

  liveDetectionButton.hidden = false;
  liveDetectionButton.textContent = "Start live detection";
}

function showSnapshotView() {
  video.hidden = true;
  canvas.hidden = false;

  snapshotButton.hidden = true;
  resetButton.hidden = false;

  liveDetectionButton.hidden = false;
  liveDetectionButton.textContent = "Start live detection";
}

function showLiveDetectionView() {
  video.hidden = false;
  canvas.hidden = true;

  snapshotButton.hidden = false;
  resetButton.hidden = true;

  liveDetectionButton.hidden = false;
  liveDetectionButton.textContent = "Stop live detection";
}


//MARK: detection

/*
* draws output
*/
function drawDetection(detections) {
  if (detections.length === 0) {
    detectionBox.hidden = true;
    detectionPlaceholder.textContent = "Nothing detected.";

    // joke (to be removed)
    appTitle.textContent = "Now you don't"; 
    return;
  }

  // joke continues (to be removed)
  appTitle.textContent = "Now you seal me";

  const det = detections[0]; // for now only display the first detection

  detectionBox.style.left = `${det.x * 100}%`;
  detectionBox.style.top = `${det.y * 100}%`;
  detectionBox.style.width = `${det.width * 100}%`;
  detectionBox.style.height = `${det.height * 100}%`;
  detectionBox.hidden = false;

  detectionPlaceholder.textContent =
    `${det.class} (${Math.round(det.confidence * 100)}%)`;
}


/*
* capture and analyse one frame
*/
async function detectCurrentFrame() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  // creates snapshot
  canvas.getContext("2d").drawImage(
    video,
    0,
    0,
    canvas.width,
    canvas.height
  );

  // runs snapshot through detector
  const result = await detector.detect(canvas);

  // temporary fix
  // there's currently no hard cancellation, so the last one can get drawn after supposedly stopped
  if (!liveDetection){
    return result;
  }

  // draws bounding box(es) / updates overlay
  drawDetection(result.detections);

  return result;
}


/*
* continuous detection loop - just keeps taking, analysing, displaying snapshots on timer
*/
async function runLiveDetection() {
  while (liveDetection) {
    await detectCurrentFrame();

    await new Promise((resolve) =>
      setTimeout(resolve, liveDetectionInterval)
    );
  }
}


//MARK: modes

function startLiveDetection() {
  liveDetection = true;

  showLiveDetectionView();
  statusElement.textContent = STRINGS[currentLanguage].statusReady;

  runLiveDetection();
}

function stopLiveDetection() {
  liveDetection = false;

  // cleanup
  detectionPlaceholder.textContent = "";
  detectionBox.hidden = true; // already handled by showLiveView

  showLiveView();
  statusElement.textContent = STRINGS[currentLanguage].statusReady;
}


//MARK: buttons

/*
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

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  canvas.getContext("2d").drawImage(
    video,
    0,
    0,
    canvas.width,
    canvas.height
  );

  showSnapshotView();

  statusElement.textContent = "Analysing...";
  detectionPlaceholder.textContent = "";

  const result = await detector.detect(canvas);

  statusElement.textContent = STRINGS[currentLanguage].statusReady;
  drawDetection(result.detections);
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
