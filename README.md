# Capitec WDIO Appium Suite

WebdriverIO + Appium Cucumber/TypeScript automation against the [WebdriverIO
native demo app](https://github.com/webdriverio/native-demo-app), with shared
step definitions across Android and iOS. Test results are published through
Allure with Capitec's own branding applied.

## Prerequisites

- **Node.js** (tested on v22) and npm
- **Xcode** with an iOS Simulator, for `test:ios` — works on any Mac with
  Xcode, no device-specific signing needed
- **Android SDK** with an emulator running (`emulator-5554` by default), for
  `test:android`
- **Appium**, started separately before running any test:
  ```
  npm install -g appium
  appium
  ```
  (`wdio.conf.ts` connects to an Appium server already running on
  `127.0.0.1:4723` rather than spawning its own)
- The app-under-test binaries in `apps/` — gitignored since they're large and
  downloadable separately from the [native-demo-app](https://github.com/webdriverio/native-demo-app)
  releases:
  - `apps/android.apk`
  - `apps/ios_unzipped/wdiodemoapp.app`
  - `apps/ios_device/wdiodemoapp.app` (only needed for `test:ios:device`, built
    and signed for your own device/team)

## Install

```
npm install
```

## Running tests

```
npm run test:ios           # iOS Simulator (default: iPhone 16e, iOS 26.2)
npm run test:android       # Android emulator
npm run test:ios:device    # Real iOS device (needs IOS_DEVICE_UDID, signing env vars — see wdio.conf.ts)
npm test                   # alias for test:ios
```

Platform and device can be overridden with environment variables, e.g.:

```
IOS_DEVICE="iPhone 15" IOS_VERSION="17.0" npm run test:ios
```

Each run clears old Allure results/screenshots first.

### Rerun on failure

If any scenario in a `.feature` file fails, that whole file is automatically
re-run once more, after a 2-second delay, within the same `npm run test:*`
invocation — no extra command needed. Configured in `wdio.conf.ts`:

```ts
specFileRetries: 1,
specFileRetriesDelay: 2,
```

This retries at the **spec-file level**, not the individual scenario — if one
scenario in a multi-scenario feature file fails, the whole file (all its
scenarios) runs again, not just the failed one. It's the WebdriverIO
equivalent of the old Java suite's separate `rerun.txt`-driven rerun pass,
folded into one run instead of a second pass.

Every run's full terminal output (start to finish) is also saved to a
timestamped file under `reports/logs/`, e.g. `reports/logs/test-ios-20261104-062400.log`,
via `scripts/run-with-log.sh` — useful for looking back at a run after the
terminal's scrolled away.

## Project structure

```
features/
  *.feature                  Cucumber scenarios (login, signup, forms, swipe, button states)
  pageobjects/                Page Object layer
    *.page.ts
    utils/                    Shared helpers (gestures, typing, random credentials, platform-specific lookups)
  step-definitions/
    *.steps.ts                Step implementations, shared across Android and iOS
    hooks.ts                  Per-scenario/per-step logging + screenshot-on-failure
scripts/
  allure-branding/styles.css  Capitec theme CSS for the Allure report
  apply-allure-branding.cjs   Patches the theme into node_modules/allure-commandline
  inspect.cjs, inspect2.cjs   Throwaway helpers for dumping the app's page source while writing selectors
wdio.conf.ts                  WebdriverIO config: capabilities per platform, Cucumber + Allure wiring
```

## Reports

```
npm run report:generate   # build reports/allure-report from reports/allure-results
npm run report:open       # serve it locally
npm run report            # both of the above
```

### Allure report branding

`scripts/apply-allure-branding.cjs` runs automatically on `npm install`
(`postinstall`) and again before every `report:generate`, since
`node_modules` is gitignored and rebuilt from scratch. It:

- enables Allure's bundled `custom-logo-plugin`
- copies `scripts/allure-branding/styles.css` into it, which re-themes
  Allure's semantic color tokens (links, primary buttons, active nav/sort
  state) to Capitec blue/navy and swaps the sidebar logo — pass/fail/warning
  colors are left untouched on purpose
- the report title ("Capitec Mobile Automation Results") is set separately,
  via the `--name` flag on the `allure generate` call in `package.json`

To change the colors or logo, edit `scripts/allure-branding/styles.css`
directly, then run `npm run report:generate` again.

## IDE

**Recommended (free): VS Code.** This repo ships `.vscode/settings.json` and
`.vscode/extensions.json` already configured for it — open the project and
VS Code will prompt you to install the one required extension:

- [`Cucumber (Gherkin) Full Support`](https://marketplace.visualstudio.com/items?itemName=alexkrechik.cucumberautocomplete)
  (`alexkrechik.cucumberautocomplete`) — gives Cmd/Ctrl-click navigation from
  a `.feature` step straight to its implementation in
  `features/step-definitions/*.steps.ts`, plus autocomplete. The glue path
  is already pointed at this project's layout in `.vscode/settings.json`, so
  no extra setup is needed once it's installed.

**Paid alternatives: WebStorm or IntelliJ IDEA Ultimate** — bundle the same
capability (via the Cucumber.js plugin) plus built-in Gradle tooling for the
`source/android` project. **IntelliJ IDEA Community Edition cannot do this at
all** — JavaScript/TypeScript/Node.js support (and therefore Cucumber.js) is
an Ultimate/WebStorm-only feature, not something the Marketplace can add to
Community. If `Help → About` says "Community Edition" and you don't have an
Ultimate license, use VS Code instead rather than hunting for a workaround.
