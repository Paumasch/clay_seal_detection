// All user-visible strings live here.
// - to add translations, copy and paste the English block and replace strings with translated text
// - to add additional text elements, simply create a new variable, give it a descriptive name, add the text, 
//   and call the variable wherever you want it (include in html, manipulate via js, etc.)

// maybe rename it to "texts" or "textelements" or something like that, instead of "strings"?
// might also be more convenient and maintainable to arrange the texts by element, rather than language-first

// ai-sloppified :/
// had to just get it done


//MARK: texts
const STRINGS = {
  en: {
    welcomeTitle: "Seal Counter",
    appTitle: "Seal Counter",
    pageTitle: "You are getting warmer!",
    languageSelection: "Choose a language:",
    startButton: "Start",
    backButton: "Back",
    cameraControls: "Camera controls",
    startLiveDetection: "Start live detection",
    stopLiveDetection: "Stop live detection",
    snapshotButton: "Take snapshot",
    resetButton: "Reset",
    statusHeading: "Status",
    statusReady: "Ready.",
    detectionHeading: "Click here for additional information",
    detectionPlaceholder: "Detection result will appear here.",
    nothingDetected: "Nothing detected.",
    detectionFailed: "Detection failed. Check the console.",
    cameraAccessFailed: "Camera access failed. Check permissions and reload.",
    liveDetectionRunning: "Live detection running",
    welcomeParagraph: "This webpage was developed as a simple demonstration of an object detection model. The model used to train the object detector is called YOLOv8n, developed by Ultralytics. The Aria-funded DronePort Project is using a similar model to detect and count the Kangia Ringed Seal population in the Ilulissat Icefjord. When you click the Start button, you will reach the actual detection page.",
    explainParagraph: "Point the camera at the object you want to detect. The model will try to detect it and display the result on the screen.",
    modelLoading: "Loading model...",
    modelLoaded: "Model loaded successfully",
    modelErrorPrefix: "Error: ",
    modelLabels: {
      seal_adult: "seal adult",
      seal_pup: "seal pup"
    }
  },
  da: {
    welcomeTitle: "Translation WIP",
    appTitle: "Translation WIP",
    pageTitle: "Translation WIP",
    languageSelection: "Translation WIP",
    startButton: "Translation WIP",
    backButton: "Translation WIP",
    cameraControls: "Translation WIP",
    startLiveDetection: "Translation WIP",
    stopLiveDetection: "Translation WIP",
    snapshotButton: "Translation WIP",
    resetButton: "Translation WIP",
    statusHeading: "Translation WIP",
    statusReady: "Translation WIP",
    detectionHeading: "Translation WIP",
    detectionPlaceholder: "Translation WIP",
    nothingDetected: "Translation WIP",
    detectionFailed: "Translation WIP",
    cameraAccessFailed: "Translation WIP",
    liveDetectionRunning: "Translation WIP",
    welcomeParagraph: "Translation WIP",
    explainParagraph: "Translation WIP",
    modelLoading: "Translation WIP",
    modelLoaded: "Translation WIP",
    modelErrorPrefix: "Translation WIP",
    modelLabels: {
      seal_adult: "Translation WIP",
      seal_pup: "Translation WIP"
    }
  },
  kl: {
    welcomeTitle: "Translation WIP",
    appTitle: "Translation WIP",
    pageTitle: "Translation WIP",
    languageSelection: "Translation WIP",
    startButton: "Translation WIP",
    backButton: "Translation WIP",
    cameraControls: "Translation WIP",
    startLiveDetection: "Translation WIP",
    stopLiveDetection: "Translation WIP",
    snapshotButton: "Translation WIP",
    resetButton: "Translation WIP",
    statusHeading: "Translation WIP",
    statusReady: "Translation WIP",
    detectionHeading: "Translation WIP",
    detectionPlaceholder: "Translation WIP",
    nothingDetected: "Translation WIP",
    detectionFailed: "Translation WIP",
    cameraAccessFailed: "Translation WIP",
    liveDetectionRunning: "Translation WIP",
    welcomeParagraph: "Translation WIP",
    explainParagraph: "Translation WIP",
    modelLoading: "Translation WIP",
    modelLoaded: "Translation WIP",
    modelErrorPrefix: "Translation WIP",
    modelLabels: {
      seal_adult: "Translation WIP",
      seal_pup: "Translation WIP"
    }
  }
};

//MARK: default language
const DEFAULT_LANGUAGE = "en";

const LANGUAGE_NAMES = {
  en: "English",
  da: "Dansk",
  kl: "Kalaallisut"
};

const LANGUAGE_FLAGS = {
  en: "assets/flagpack--gb-ukm.svg",
  da: "assets/flagpack--dk.svg",
  kl: "assets/flagpack--gl.svg"
};


// ========================================================================================================
//MARK: functions

let currentLanguage = getSavedLanguage(); // from local storage 

function getSavedLanguage() {
  try {
    const savedLanguage = localStorage.getItem("seal-counter-language");
    return savedLanguage in STRINGS ? savedLanguage : DEFAULT_LANGUAGE;
  } catch (error) {
    console.warn("Could not read the saved language:", error);
    return DEFAULT_LANGUAGE;
  }
}

function getText(key) {
  return STRINGS[currentLanguage][key] || STRINGS[DEFAULT_LANGUAGE][key] || key;
}

function translateModelLabel(className) {
  const modelLabels = STRINGS[currentLanguage].modelLabels || STRINGS[DEFAULT_LANGUAGE].modelLabels || {};
  return modelLabels[className] || className;
}

function translatePage() {
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    if (key) {
      element.textContent = getText(key);
    }
  });

  document.documentElement.lang = currentLanguage;
  updateLanguageSelector();
}

function setLanguage(language) {
  if (!(language in STRINGS)) {
    return;
  }

  currentLanguage = language;
  try {
    localStorage.setItem("seal-counter-language", language);
  } catch (error) {
    console.warn("Could not save the selected language:", error);
  }

  translatePage();
  document.dispatchEvent(new CustomEvent("languagechange"));
}

function updateLanguageSelector() {
  const button = document.getElementById("languageSelection");
  const flag = document.getElementById("currentFlag");
  const label = document.getElementById("currentLanguageLabel");
  if (button) {
    button.setAttribute("aria-label", getText("languageSelection"));
  }
  if (flag) {
    flag.src = LANGUAGE_FLAGS[currentLanguage];
  }
  if (label) {
    label.textContent = LANGUAGE_NAMES[currentLanguage];
  }
}

function closeLanguageMenu() {
  const button = document.getElementById("languageSelection");
  const menu = document.getElementById("langMenu");
  if (button && menu) {
    menu.hidden = true;
    button.setAttribute("aria-expanded", "false");
  }
}

function initializeLanguageSelector() {
  const button = document.getElementById("languageSelection");
  const menu = document.getElementById("langMenu");
  if (!button || !menu) {
    return;
  }

  button.addEventListener("click", () => {
    const isOpen = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!isOpen));
    menu.hidden = isOpen;
  });

  menu.addEventListener("click", (event) => {
    const option = event.target.closest("[data-language]");
    if (!option) {
      return;
    }
    setLanguage(option.dataset.language);
    closeLanguageMenu();
  });

  menu.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      event.target.click();
    }
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".language_selection_dropdown")) {
      closeLanguageMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeLanguageMenu();
    }
  });

  translatePage();
}

initializeLanguageSelector();
