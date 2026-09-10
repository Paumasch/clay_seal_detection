translatePage();

const status = document.getElementById("status");
const snapshotButton = document.getElementById("snapshotButton");
const resetButton = document.getElementById("resetButton");
const detectionPlaceholder = document.getElementById("detectionPlaceholder");

// placeholder interface for integrating various actual detector functions
const detector = {
  async detect(image) {
    console.log("Placeholder detector received:", image);
    return {
      detections: []
    };
  }
};

snapshotButton.addEventListener("click", async () => {
  // placeholder
  status.textContent = "Snapshot placeholder activated.";
  detectionPlaceholder.textContent = "Toy detection will be implemented next.";
});

resetButton.addEventListener("click", () => {
  status.textContent = "Ready.";
  detectionPlaceholder.textContent =
    STRINGS[currentLanguage].detectionPlaceholder;
});
