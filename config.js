// config.js
// Central place for app-wide settings and feature switches.

// note: 'DEV_MODE: true/false' has to remain in 'sw.js' 

const CONFIG = {

  APP_VERSION: "0.3.0",   // if `DEV_MODE: true` acts as toggle to update     

  ACTIVE_DETECTOR: "toy"  // "toy" | "remote" | "onnx" — selects which detector implementation app.js wires up

};