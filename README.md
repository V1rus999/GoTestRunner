# GoTestRunner

Firefox plugin which will run Tests for you.

Installation:
* Go to about:debugging.
* Click Load Temporary Add-On.
* Select manifest.json.
* Go to your go pipeline.
* Click on your build and then go to jobs.
* Select the start button next to rerun.
* Keep the tab open (doesn't need to be in focus).

What it does:
* This plugin searches the jobs table for any failing or canceled jobs containing "Test". At a 30 second interval.
* It then re-runs these jobs automatically.

Caveats:
* There is no limit to runs so you manually have to disable the plugin on valid failures.
* The plugin has no UI (future development).

Future development:
* Create a UI to turn the plugin on or off.
* Limit runs.
* Notifications on failure. Perhaps with failure details?
* Chrome.

