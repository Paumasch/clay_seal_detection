# seals
Simple webpage interface for ~~object~~ seal detection

try to roughly follow [semantic versioning guidelines](https://semver.org/) 

# v0.1.0

Minimal two-page prototype.

## current scope

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

## one particularity to explain (and potentially deal with later)

Even though we define a central and authoritative place for our text strings, there's still duplicates in the html files.  
No one likes that. Introduces potential synchronisation issues.
I'll have to ponder this, but it might be helpful/necessary to keep them as fallbacks for when js might fail to load, or to not mess with search engines or accessibility tools.

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

## immediate follow-up todo's

-[x] actually get it running independently on the phone
set up github pages smitzkar.github.io/seals/index.html 
added service worker (sw.js, register-sw.js) and manifest.json to handle offline, app-like behaviour 
// IMPORTANT: changes in CACHE_NAME trigger local updates (doesn't manually check if file content changed)
//            -> if changing anything on server, don't forget to update the version (in sw.js)

## Version

v0.1.0
