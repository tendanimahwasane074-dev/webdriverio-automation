import { Given, When, Then } from '@cucumber/cucumber'
import { expect } from 'expect-webdriverio'
import BottomNavPage from '../pageobjects/BottomNav.page'
import AlertPage from '../pageobjects/Alert.page'

// With noReset: true, Appium never actually relaunches the app for a new
// session - it just reattaches to whatever state a previous run left it in
// (a different tab, a focused field with the keyboard up hiding the tab bar,
// or even a stray system sheet like iOS's "Use Strong Password?" leaving
// behind an accessibility-modal barrier that makes the rest of the screen
// pixel-visible but *accessibility*-invisible). Reactively undoing each kind
// of leftover is a losing game, so force a real restart instead.
// A real-device build is re-signed under your own bundle ID (see device.env),
// so it can differ from the stock simulator build's.
const IOS_BUNDLE_ID = process.env.IOS_BUNDLE_ID || 'org.wdiodemoapp'
const ANDROID_APP_PACKAGE = 'com.wdiodemoapp'

Given('the demo app is launched', async function () {
    const appId = driver.isIOS ? IOS_BUNDLE_ID : ANDROID_APP_PACKAGE

    try {
        await driver.terminateApp(appId)
    } catch {
        // Wasn't running - nothing to terminate.
    }
    await driver.activateApp(appId)

    await BottomNavPage.homeTab.waitForDisplayed({ timeout: 15000 })
    await BottomNavPage.homeTab.click()
})

When('the user opens the Login screen', async function () {
    await BottomNavPage.openLogin()
})

When('the user opens the Forms screen', async function () {
    await BottomNavPage.openForms()
})

When('the user opens the Swipe screen', async function () {
    await BottomNavPage.openSwipe()
})

Then('the user dismisses the alert', async function () {
    await AlertPage.dismiss('OK')
})
