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
    welcomeParagraph: "This webpage was developed as a simple demonstration of an object detection model. The model used to train the object detector is called YOLOv8n, developed by Ultralytics. The Aria-funded DronePort Project is using a similar model to detect and count the Kangia Ringed Seal population in the Ilulissat Icefjord. When you click the Start button, you will reach the actual detection page.",
    explainParagraph: "Simply press the big button in the centre to start the model, then point the camera at a target and see what happens! If it detects a potential seal, a green square will appear around it.",
    detailsHeading: "Click here for additional information / help",
    detailsBoxes: "The little number next to the green square tells you how confident the model is that this really is a seal (the higher the more confident).",
    detailsIntro: "If it doesn't work, try the following:",
    detailsBlackScreen: 'Nothing but a black screen? Hit the "Back" button or reload the page. (It\'s important to allow "camera access". Don\'t worry, everything stays on your phone!)',
    detailsSlowDetection: 'It sometimes shows something but it\'s really slow? Try to hold the camera as steady as you can. If that doesn\'t help (the model is doing its best, but this is really hard!), try the "Snapshot" button on the right. To take another one, simply press the same button to get back to the live view and try again!',
    detailsNeedHelp: "If it just doesn't want to work, it's okay to ask for help :)",
    detectionPlaceholder: "Placeholder. To be removed, maybe.",
    nothingDetected: "Nothing detected.",
    detectionFailed: "Detection failed. Check the console.",
    cameraAccessFailed: "Camera access failed. Check permissions and reload.",
    liveDetectionRunning: "Live detection running",
    modelLoading: "Loading model...",
    modelLoaded: "Model loaded successfully",
    modelErrorPrefix: "Error: ",
    modelLabels: {
      seal_adult: "seal adult",
      seal_pup: "seal pup"
    }
  },
  da: {
    welcomeTitle: "Sæl fundet",
    appTitle: "Sæl fundet",
    pageTitle: "Du bliver varmere!",
    languageSelection: "Vælg et sprog:",
    startButton: "Start",
    backButton: "Tilbage",
    cameraControls: "Kamerakontroller",
    startLiveDetection: "Start detektion",
    stopLiveDetection: "Stop detektion",
    snapshotButton: "Tag et snapshot",
    resetButton: "Nulstil",
    statusHeading: "Status",
    statusReady: "[to_be_translated] Ready.",
    welcomeParagraph: "Denne webapplikation blev udviklet som en simpel demonstration af en objektgenkendelsesmodel. Modellen, der blev brugt til at træne objektdetektoren, hedder YOLOv8n og er udviklet af Ultralytics. Aria-finansierede DronePort-projekt bruger en lignende model til at opdage og tælle bestanden af Kangia Ringsæler i Ilulissat Isfjord. Når du klikker på “Start”-knappen, bliver du sendt til den faktiske detektionsside.",
    explainParagraph: "Tryk bare på den store knap i midten for at starte modellen, og peg derefter kameraet mod et mål og se, hvad der sker! Hvis den opdager en potentiel sæl, vil der dukke en grøn firkant op omkring den.",
    detailsHeading: "Tryk her for yderligere information / hjælp",
    detailsBoxes: "Det lille tal ved siden af fortæller, hvor sikker modellen er på, at det virkelig er en sæl (jo højere, desto mere sikker)).",
    detailsIntro: "Hvis det ikke virker, prøv følgende:",
    detailsBlackScreen: 'Bare en sort skærm? Tryk på "Tilbage"-knappen eller genindlæs siden. (Det er vigtigt at tillade "kameraadgang". Bare rolig, alt bliver på din telefon!)',
    detailsSlowDetection: 'Den viser nogle gange noget, men det er virkelig langsomt? Prøv at holde kameraet så stille som muligt. Hvis det ikke hjælper (modellen gør sit bedste, men det her er virkelig svært!), prøv knappen "Snapshot" til højre. For at tage et nyt billede, tryk bare på den samme knap for at komme tilbage til live-visningen og prøv igen!',
    detailsNeedHelp: "Hvis det bare ikke vil virke, er det helt okay at bede om hjælp :)",
    detectionPlaceholder: "Placeholder. To be removed, maybe.",
    nothingDetected: "Ikke fundet noget",
    detectionFailed: "[to_be_translated] Detection failed. Check the console.",
    cameraAccessFailed: "[to_be_translated] Camera access failed. Check permissions and reload.",
    liveDetectionRunning: "[to_be_translated] Live detection running",
    modelLoading: "[to_be_translated] Loading model...",
    modelLoaded: "[to_be_translated] Model loaded successfully",
    modelErrorPrefix: "[to_be_translated] Error: ",
    modelLabels: {
      seal_adult: "[to_be_translated] seal adult",
      seal_pup: "[to_be_translated] seal pup"
    }
  },
  kl: {
    welcomeTitle: "Puisi nassaarivoq",
    appTitle: "Puisi nassaarivoq",
    pageTitle: "Kissarnerulerputit!",
    languageSelection: "[to_be_translated] Choose a language:",
    startButton: "Aallartigit",
    backButton: "[to_be_translated] Back",
    cameraControls: "[to_be_translated] Camera controls",
    startLiveDetection: "Ujaarlerneq aallartiguk",
    stopLiveDetection: "Ujaarlerneq unitsiguk",
    snapshotButton: "Snapshot-imik tigusigit",
    resetButton: "[to_be_translated] Reset",
    statusHeading: "[to_be_translated] Status",
    statusReady: "[to_be_translated] Ready.",
    welcomeParagraph: "Una nittartagaq pilersinneqarpoq silassorissuseq atorlugu ilisarsisinnaaneq qanoq pisarnersoq takutinniarlugu. Taanna silassorissuseq atorlugu ilisarsisinnaaneq YOLOv8n-imik ateqarpoq, Ultralytics-imiillu pilersitaalluni. Aria-mit aningaasaliivigineqartoq projekt DronePort assingusoq silassorissutsimik atuinikkut Ilulissat Kangiani natsinik kisitsisoqarumaarpoq. “Start” toorukku nittartakkamut atugassamut ingerlatinneqassaatit.",
    explainParagraph: "Toortagaq angisooq qeqqaniitoq tooruk aallartinniarlutit assiliissutaalu arlaanut tikkuarlugu, susoqassanersorlu takuuk! Puisiisinnaasumik nassaaruni kipparissumik qorsummik nuisoqarumaarpoq (sanianiittoq kisitsiseq silassorissutsip takusani puisaasorineranik missingersuutaavoq (kisitsiseq qaffasinneruppat nalorninnginnerusimavoq)).",
    detailsHeading: "Paasissutissanik amerlanernik perusukkuit una tooruk:",
    detailsBoxes: "[to_be_translated] The little number next to the green square tells you how confident the model is that this really is a seal (the higher the more confident).",
    detailsIntro: "Iluatsinngippat uku misilerakkit:",
    detailsBlackScreen: 'Igalaasaq qernertuinnaava? “Uterit” tooruk nittartagarlu nuiseqqillugu. (Assiliivia ikumanissaa akuerisariaqarpat. Ernumassutissaqanngilaq, assiutitit mobilinniiginnassapput)',
    detailsSlowDetection: 'Ilaanni nuisoqartarpoq, kisiat arriitsuaraavoq? Assiliivia nikisinnaveersaarlugu misiliguk. Taanna iluaqutaangippat (silassorissuseq misiliiniartaraluarpoq, kisiat erloqilaarsinnaasarpoq!), "Snapshot" talerpimmiitoq misilillugu tooruk. Assimik nutaamik tigusiniaruit, toortagaq taanna tooqqiinassuat, ”live”-imik assiliivik ingerlateqqinniarukku, misileeqqigillu!',
    detailsNeedHelp: "Iluatsikkumaavinngippat, ajunngilaq ikioqquguit :)",
    detectionPlaceholder: "Placeholder. To be removed, maybe.",
    nothingDetected: "[to_be_translated] Nothing detected.",
    detectionFailed: "[to_be_translated] Detection failed. Check the console.",
    cameraAccessFailed: "[to_be_translated] Camera access failed. Check permissions and reload.",
    liveDetectionRunning: "[to_be_translated] Live detection running",
    modelLoading: "[to_be_translated] Loading model...",
    modelLoaded: "[to_be_translated] Model loaded successfully",
    modelErrorPrefix: "[to_be_translated] Error: ",
    modelLabels: {
      seal_adult: "[to_be_translated] seal adult",
      seal_pup: "[to_be_translated] seal pup"
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
