// All user-visible strings live here.
// - to add translations, copy and paste the English block and replace strings with translated text
// - to add additional text elements, simply create a new variable, give it a descriptive name, add the text, 
//   and call the variable wherever you want it (include in html, manipulate via js, etc.)

// maybe rename it to "texts" or "textelements" or something like that, instead of "strings"?
// might also be more convenient and maintainable to arrange the texts by element, rather than language-first

const STRINGS = {
  en: {
    welcomeTitle: "Seal Counter",
    languageButton: "Language",
    startButton: "Start",
    appTitle: "Now you seal me",
    backButton: "Back",
    cameraHeading: "Camera",
    cameraPlaceholder: "Camera preview will appear here.",
    cameraAccessFailed: "Camera access failed. Check permissions and reload.", // rename to errorCameraAccessFailed?
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
