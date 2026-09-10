// All user-visible strings live here.
// - to add translations, copy and paste the English block and replace strings with translated text
// - to add additional text elements, simply create a new variable, give it a descriptive name, add the text, 
//   and call the variable wherever you want it (include in html, manipulate via js, etc.)

// maybe rename it to "texts" or "textelements" or something like that, instead of "strings"?

const STRINGS = {
  en: {
    welcomeTitle: "Seal Counter",
    languageButton: "Language",
    startButton: "Start",
    appTitle: "Seal Counter",
    backButton: "Back",
    cameraHeading: "Camera",
    cameraPlaceholder: "Camera preview will appear here.",
    snapshotButton: "Take snapshot",
    statusHeading: "Status",
    statusReady: "Ready.",
    detectionHeading: "Detection",
    detectionPlaceholder: "Detection result will appear here.",
    resetButton: "Reset",
    languagePlaceholder: "The translators don't appreciate being rushed."
  },

  da: {
    // Danish.
  },

  kl: {
    // Kalaallisut/Greenlandish.
  }
};

const currentLanguage = "en";

function translatePage() {
  const strings = STRINGS[currentLanguage];

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    if (strings[key]) {
      element.textContent = strings[key];
    }
  });

  document.documentElement.lang = currentLanguage;
}
