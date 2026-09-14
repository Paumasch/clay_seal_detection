// config.js
// Central place for app-wide settings and feature switches.

// note: 'DEV_MODE: true/false' has to remain in 'sw.js' 

const CONFIG = {

  APP_VERSION: "0.5.1",   // if `DEV_MODE: true` acts as toggle to update     

  ACTIVE_DETECTOR: "bright",  // selects which detector to use from detectors.js (options at the very bottom)

  LIVEDETECTION_INTERVAL_MS: 100  // time between detections in live/continuous mode (in miliseconds)

};