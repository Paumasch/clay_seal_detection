# seals
Simple webpage interface for ~~object~~ seal detection

try to roughly follow [semantic versioning guidelines](https://semver.org/) 


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

When shipping a new version, remember to bump `CACHE_NAME` in `sw.js` to
match — otherwise installed/offline copies of the app won't pick up changes.

## one particularity to explain (and potentially deal with later)

Even though we define a central and authoritative place for our text strings, there's still duplicates in the html files.  
No one likes that. Introduces potential synchronisation issues.
I'll have to ponder this, but it might be helpful/necessary to keep them as fallbacks for when js might fail to load, or to not mess with search engines or accessibility tools.

## Changelog

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

v0.2.1