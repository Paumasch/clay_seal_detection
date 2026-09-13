# seals
Simple webpage interface for ~~object~~ seal detection


## try it live

The current version is deployed via GitHub Pages: `https://smitzkar.github.io/seals/`

## run locally

Because this is intended to become a browser application, serve the directory through a local HTTP server rather than opening the HTML files directly.

in root of directory/repo, run: `python -m http.server 8000`

to open on computer browser, visit `http://localhost:8000/`

to test on phone:
- ensure that phone and computer are on same network
- find computer's ip address (something like `192.168.30.1`): 
    - linux: 
        - run `ifconfig`
        - look for `inet` 
    - windows: 
        - run `ipconfig` 
        - look for `Wireless Lan adapter` and the corresponding IPv4 Address 
- open browser and visit `http://<your.computer's.ip.address>`


## update checklist

When shipping a new version, remember to bump version number in `config.js` to match; otherwise installed/offline copies of the app won't pick up changes.
Try to roughly follow [semantic versioning guidelines](https://semver.org/).

When pushing the finished or a proper test version, make sure to flip `DEV_MODE`false in `sw.js`.

When adding or removing files, remember to add/remove them in `sw.js`. No wildcards allowed, unfortunately. EVERY file but `sw.js` itself needs to be added! (to ensure offline/cached access)

## general notes 

### todo: add cache cleanup

Browsers already handle this on their own, but it's good etiquette to clean up after ourselves, when messing with cache/persistent storage.

### one particularity to explain (and potentially deal with later)

Even though we define a central and authoritative place for our text strings, there's still duplicates in the html files.  
No one likes that. Introduces potential synchronisation issues.
I'll have to ponder this, but it might be helpful/necessary to keep them as fallbacks for when js might fail to load, or to not mess with search engines or accessibility tools.

### while working with github pages

all links should be relative:  
```html
<link rel="icon" href="/assets/favicon-32x32.png">  // wrong (will show 404 in network requests)
<link rel="icon" href="assets/favicon-32x32.png">   // correct (no leading slash in path)
```

### for accessibility - ARIA

remember to add descriptions for everything (including dynamically changing elements!)  
For example:
```html
<!-- camera input stream -->
<video id="webcam" autoplay playsinline aria-label="Live camera feed for object detection"></video>

<!-- invisible, text-only region that screen readers announce when text changes -->
<div id="accessible-detection-announcer" class="sr-only" aria-live="polite">
  <!-- update this text via JavaScript whenever a new object is confidently detected -->
  Detecting: No objects found.
</div>

<!-- for bounding boxes on canvas. maybe even automatically describe the general location from coordinates? "A single bounding box, located in the upper left corner, covering roughly 20% of the snapshot" -->
 <canvas id="detection-overlay" role="img" aria-label="Visual bounding boxes overlaying detected objects"></canvas>
```

use screen reader only css for text updates relevant to screen readers only: 
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
```



### robots.txt / llm.txt  

not really important, but why not include it to cover our bases



## Changelog


### v0.2.5
- Created central `config.js` file
- Attempted to add `DEV_MODE` toggle for faster iteration (sidestepping the caching logic), but it doesn't seem to work quite yet.
- Fixed favicons 404s
- TIME TO MOVE ON TO CAMERA


### v0.2.4
- Spending too much time on issues with favicon. Works on localhost, gets 404 via pages.
- Not worth spending time on, right now.

### v0.2.1
- Fixed a stale-cache bug where service-worker installation could pull already-cached (outdated) asset bytes from the browser's ordinary HTTP cache instead of the network; install now forces a network reload for every cached file.

### v0.2.0
- Added `manifest.json` and a service worker (`sw.js`), making the app installable ("Add to Home Screen") and fully offline-capable after first visit — confirmed working via GitHub Pages on both Android (Firefox) and desktop.
- Deployed via GitHub Pages for easy sharing / cross-device testing.


### v0.1.0

Minimal two-page prototype.

#### current scope

Placeholders! Placeholders, everywhere!

- separate welcome and application pages
- placeholder visual guide
- placeholder language selector interaction
- English string table with Danish and Kalaallisut placeholders
- application UI states/elements
- placeholder detector interface
- no camera access yet
- no real detection yet
- minimal CSS

# Version

v0.2.5