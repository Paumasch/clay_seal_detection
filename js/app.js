/* main logic flow */

// before going live:
// ensure that there aren't any hardcoded user-facing messages/texts/strings here 
// -> that everything is covered by localisation


translatePage(); // from strings.js, applies localisation

const appTitle = document.getElementById("appTitle");

const statusElement = document.getElementById("statusMsg");
const snapshotButton = document.getElementById("snapshotButton");
const resetButton = document.getElementById("resetButton");
const detectionPlaceholder = document.getElementById("detectionPlaceholder");
const video = document.getElementById("cameraVideo");
const canvas = document.getElementById("snapshotCanvas");
const detectionBox = document.getElementById("detectionBox");

// detector moved to its own file detectors.js

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

function showLiveView() {
  video.hidden = false;
  canvas.hidden = true;
  detectionBox.hidden = true;
  snapshotButton.hidden = false;
  resetButton.hidden = true;
}

function showSnapshotView() {
  video.hidden = true;
  canvas.hidden = false;
  snapshotButton.hidden = true;
  resetButton.hidden = false;
}

function drawDetection(detections) {
  if (detections.length === 0) { // if no detection
    detectionBox.hidden = true;
    detectionPlaceholder.textContent = "Nothing detected."; //"No seal detected.";
    //MARK: joke
    appTitle.textContent = "Now you don't"; 
    return;
  }

  //MARK: joke continues
  appTitle.textContent = "Now you seal me";

  const det = detections[0]; // for now only display the first detection

  detectionBox.style.left = `${det.x * 100}%`;
  detectionBox.style.top = `${det.y * 100}%`;
  detectionBox.style.width = `${det.width * 100}%`;
  detectionBox.style.height = `${det.height * 100}%`;
  detectionBox.hidden = false;

  detectionPlaceholder.textContent = `${det.class} (${Math.round(det.confidence * 100)}%)`;
}

//MARK: assignments/calls

/*
* on snapshotButton click:
* - take snapshot and replace live view with snapshot 
*   (or should it maybe show it below live view, to allow easy follow-up/correction?)
* - update info elements
* - run (toy) detector
* - draw bounding box
*/
snapshotButton.addEventListener("click", async () => {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);

  showSnapshotView();
  statusElement.textContent = "Analysing...";
  detectionPlaceholder.textContent = "";

  const result = await detector.detect(canvas);

  statusElement.textContent = STRINGS[currentLanguage].statusReady;
  drawDetection(result.detections);
});

/*
* on resetButton click:
* ... reset everything ;)
*/
resetButton.addEventListener("click", () => {
  showLiveView();
  statusElement.textContent = STRINGS[currentLanguage].statusReady;
  detectionPlaceholder.textContent = STRINGS[currentLanguage].detectionPlaceholder;
});

startCamera();