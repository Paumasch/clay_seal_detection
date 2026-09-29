// config.js
// Central place for app-wide settings and feature switches.

// note: 'DEV_MODE: true/false' has to remain in 'sw.js' 

const CONFIG = {

  APP_VERSION: "0.5.1",   // if `DEV_MODE: true` acts as toggle to update     

  ACTIVE_DETECTOR: "yolo",  // selects which detector to use from detectors.js (options at the very bottom)

  //MODEL_CLASSES: ["Seal adult", "Seal pup"], // might as well put them here (they will be used for the actual model)
  // @Paumasch it's not THAT simple ;)
  MODEL_CLASSES: ["person", "backpack", "bottle", "cup", "chair", "couch", "potted plant", "dining table", "laptop", "mouse", "keyboard", "cell phone"],

  LIVEDETECTION_INTERVAL_MS: 100  // time between detections in live/continuous mode (in miliseconds)

};