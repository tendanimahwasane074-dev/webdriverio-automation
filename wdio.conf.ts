import path from 'node:path'

// Which target to drive: PLATFORM=android | ios | ios-device (defaults to ios simulator,
// since that runs on any Mac with Xcode and needs no device-specific code signing).
const PLATFORM = process.env.PLATFORM || 'ios'

// Connects to an Appium server that's already running locally (started separately,
// e.g. `appium`) rather than having wdio spawn and manage its own.
const APPIUM_HOST = process.env.APPIUM_HOST || '127.0.0.1'
const APPIUM_PORT = Number(process.env.APPIUM_PORT || 4723)

function resolveCapabilities(): WebdriverIO.Capabilities {
    switch (PLATFORM) {
        case 'android':
            return {
                platformName: 'Android',
                'appium:automationName': 'UiAutomator2',
                'appium:deviceName': process.env.ANDROID_DEVICE || 'emulator-5554',
                'appium:app': path.join(__dirname, 'apps/android.apk'),
                'appium:appPackage': 'com.wdiodemoapp',
                'appium:appActivity': '.MainActivity',
                'appium:noReset': true,
                'appium:newCommandTimeout': 240,
            }

        case 'ios-device':
            // Real device: needs the app built and signed for this specific device/team
            // first (see README "Running on a real iOS device"). Not portable to another
            // evaluator's machine/device without rebuilding and re-signing for it.
            return {
                platformName: 'iOS',
                'appium:automationName': 'XCUITest',
                'appium:udid': process.env.IOS_DEVICE_UDID,
                'appium:app': process.env.IOS_DEVICE_APP_PATH
                    || path.join(__dirname, 'apps/ios_device/wdiodemoapp.app'),
                'appium:xcodeOrgId': process.env.IOS_XCODE_ORG_ID,
                'appium:xcodeSigningId': process.env.IOS_XCODE_SIGNING_ID || 'Apple Development',
                'appium:updatedWDABundleId': process.env.IOS_WDA_BUNDLE_ID || 'org.wdiodemoapp.WebDriverAgentRunner',
                'appium:showXcodeLog': process.env.IOS_SHOW_XCODE_LOG === 'true',
                'appium:noReset': true,
                'appium:newCommandTimeout': 240,
            }

        case 'ios':
        default:
            return {
                platformName: 'iOS',
                'appium:automationName': 'XCUITest',
                'appium:deviceName': process.env.IOS_DEVICE || 'iPhone 16e',
                'appium:platformVersion': process.env.IOS_VERSION || '26.2',
                'appium:udid': process.env.IOS_UDID,
                'appium:app': path.join(__dirname, 'apps/ios_unzipped/wdiodemoapp.app'),
                'appium:noReset': true,
                'appium:newCommandTimeout': 240,
            }
    }
}

// Not annotated as Options.Testrunner: @wdio/types' capabilities shape and this
// TypeScript version disagree on a detail that doesn't affect anything at runtime
// (wdio reads this object directly, untyped) - inference below still gives full
// autocomplete on every field.
export const config = {
    runner: 'local',
    hostname: APPIUM_HOST,
    port: APPIUM_PORT,
    path: '/',

    specs: ['./features/**/*.feature'],
    exclude: [],

    maxInstances: 1,

    capabilities: [resolveCapabilities()],

    logLevel: 'info',
    bail: 0,
    waitforTimeout: 10000,
    connectionRetryTimeout: 300000,
    connectionRetryCount: 1,

    // WebdriverIO's equivalent of the Java suite's separate RerunFailedTests runner
    // (@target/rerun.txt): instead of a second pass over a rerun file, a failed
    // .feature file gets one automatic retry within the same run.
    specFileRetries: 1,
    specFileRetriesDelay: 2,

    framework: 'cucumber',
    reporters: [
        'spec',
        ['allure', {
            outputDir: 'reports/allure-results',
            disableWebdriverStepsReporting: false,
            disableWebdriverScreenshotsReporting: false,
        }],
    ],

    cucumberOpts: {
        require: ['./features/step-definitions/**/*.ts'],
        backtrace: false,
        dryRun: false,
        failFast: false,
        snippets: true,
        source: true,
        strict: false,
        tagExpression: '',
        timeout: 60000,
        ignoreUndefinedDefinitions: false,
    },

    // Per-step logging + screenshot-on-failure lives in features/step-definitions/hooks.ts
    // (Cucumber.js Before/AfterStep/After), mirroring the Java suite's Hooks/ExtentHooks.java
    // rather than wdio's own service-level afterStep hook here.
}
