// All user-visible strings live here.
// - to add translations, copy and paste the English block and replace strings with translated text
// - to add additional text elements, simply create a new variable, give it a descriptive name, add the text, 
//   and call the variable wherever you want it (include in html, manipulate via js, etc.)

// maybe rename it to "texts" or "textelements" or something like that, instead of "strings"?
// might also be more convenient and maintainable to arrange the texts by element, rather than language-first

const STRINGS = {
  en: {
    welcomeTitle: "Seal Counter",
    languageSelection: "Choose a language:",
    startButton: "Start",
    //appTitle: "Looking for seals?",
    backButton: "Back",
    cameraHeading: "Camera",
    cameraPlaceholder: "Camera preview will appear here.",
    cameraAccessFailed: "Camera access failed. Check permissions and reload.", // rename to errorCameraAccessFailed?
    snapshotButton: "Take snapshot",
    liveDetectionRunning: "Live detection running",
    statusHeading: "Status",
    statusReady: "Ready.",
    detectionHeading: "Detection",
    detectionPlaceholder: "Detection result will appear here.",
    resetButton: "Reset",
    languagePlaceholder: "The translators don't appreciate being rushed."
  },

  da: {
    welcomeTitle: "Sæl Tæller",
    languageSelection: "Vælg et sprog:",
    startButton: "Starte",
    //appTitle: "Looking for seals?",
    backButton: "Tilbage",
    cameraHeading: "Kamera",
    cameraPlaceholder: "Kameraforhåndsvisning vil vises her.",
    cameraAccessFailed: "Kameraadgang mislykkedes. Tjek tilladelser og genindlæs.", // rename to errorCameraAccessFailed?
    snapshotButton: "Tag billede",
    liveDetectionRunning: "Live detektion kører",
    statusHeading: "Status",
    statusReady: "Ready.",
    detectionHeading: "Detektion",
    detectionPlaceholder: "Detektionsresultatet vil vises her.",
    resetButton: "Nulstil",
    languagePlaceholder:"The translators don't appreciate being rushed."
  },

  kl: {
    welcomeTitle: "Seal Counter",
    languageButton: "Language",
    startButton: "Start",
    appTitle: "Looking for seals?",
    backButton: "Back",
    cameraHeading: "Camera",
    cameraPlaceholder: "Camera preview will appear here.",
    cameraAccessFailed: "Camera access failed. Check permissions and reload.", // rename to errorCameraAccessFailed?
    snapshotButton: "Take snapshot",
    liveDetectionRunning: "Live detection running",
    statusHeading: "Status",
    statusReady: "Ready.",
    detectionHeading: "Detection",
    detectionPlaceholder: "Detection result will appear here.",
    resetButton: "Reset",
    languagePlaceholder:"The translators don't appreciate being rushed."
  },
};

const currentLanguage = "en"; // default

/*
* - goes over all html elements in 'document' (window.document .. everything currently loaded)
* - if it encounters anything containing the 'data-i18n' attribute (signifies that this contains
*   text to be translated) it checks if it's a valid key and translation exists, 
*   then replaces any text inside the html element with the translated string
*/
function translatePage() {
  const strings = STRINGS[currentLanguage];

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    // somewhat clunky fix to deal with potential 'undefined' key (really just to pacify vscode)
    // checks if key exists and if translation is provided in 'currentLangauge'
    if (key && (key in strings)) {
      element.textContent = strings[key];
    }
  });

  document.documentElement.lang = currentLanguage; // sets <html lang="da"> or en, kl, etc.
}
