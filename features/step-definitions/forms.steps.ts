import { Given, When, Then } from '@cucumber/cucumber'
import { expect } from 'expect-webdriverio'
import FormsPage from '../pageobjects/Forms.page'
import AlertPage from '../pageobjects/Alert.page'

When('the user types {string} into the text field', async function (text: string) {
    await FormsPage.typeText(text)
})

Then('the form should display {string} as the typed result', async function (text: string) {
    await expect(FormsPage.inputTextResult).toHaveText(text)
})

Given('the switch label reads {string}', async function (text: string) {
    await expect(FormsPage.switchText).toHaveText(text)
})

When('the user toggles the switch', async function () {
    await FormsPage.toggleTheSwitch()
})

When('the user taps the {string} button', async function (buttonName: 'Active' | 'Inactive') {
    const button = buttonName === 'Active' ? FormsPage.activeButton : FormsPage.inactiveButton
    await button.click()
})

Then('an alert {string} appear', async function (expectation: 'should' | 'should not') {
    // The native UIAlertController's own container also exposes "This button is"
    // as its accessibility name alongside the title's actual StaticText leaf -
    // "accessible == 1" is needed to pick the real leaf, not the container.
    const alertTitle = driver.isIOS
        ? await $('-ios predicate string:name == "This button is" AND accessible == 1')
        : await $('~This button is')

    if (expectation === 'should') {
        await alertTitle.waitForDisplayed({ timeout: 5000 })
        await expect(alertTitle).toBeDisplayed()
        await AlertPage.dismiss('OK')
    } else {
        // Negative assertion: the Inactive button is disabled and has no onPress
        // handler at all, so give it a moment and confirm nothing ever showed up.
        await browser.pause(2000)
        await expect(alertTitle).not.toBeDisplayed()
    }
})
