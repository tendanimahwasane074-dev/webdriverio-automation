// Throwaway script: launches the demo app once and dumps the page source so we
// can find real accessibility ids for the sample feature's step definitions.
const { remote } = require('webdriverio');
const path = require('node:path');

(async () => {
    const browser = await remote({
        hostname: '127.0.0.1',
        port: 4723,
        path: '/',
        logLevel: 'warn',
        capabilities: {
            platformName: 'iOS',
            'appium:automationName': 'XCUITest',
            'appium:deviceName': 'iPhone 16e',
            'appium:platformVersion': '26.2',
            'appium:udid': 'F30DB06B-9796-4DC7-91E6-8C381D722579',
            'appium:app': path.join(__dirname, '../apps/ios_unzipped/wdiodemoapp.app'),
            'appium:noReset': true,
            'appium:newCommandTimeout': 120,
        },
    });

    await browser.pause(3000);
    const source = await browser.getPageSource();
    console.log(source);

    await browser.deleteSession();
})().catch((err) => {
    console.error(err);
    process.exit(1);
});
